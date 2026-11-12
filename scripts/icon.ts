/**
 * Regenerates `app/icon.svg`, the favicon, from the same seed and engine that
 * draw the nav mark, and from the colour tokens in `app/globals.css`. A
 * favicon cannot read the page's CSS variables, so the two palettes are baked
 * in as hex and switched on the browser's own colour scheme.
 *
 *   pnpm icon:build   regenerate
 *   pnpm icon:check   regenerate and fail if the committed copy moved
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SITE_MARK_SEED, pixelTile, type TileFill } from "../lib/pixel-tile.js";

const ROOT = join(import.meta.dirname, "..");
const TOKENS = [
  "background",
  "foreground",
  "accent-amber",
  "accent-green",
  "accent-blue",
  "accent-violet",
  "accent-rose",
] as const;

function oklchToHex(l: number, c: number, hDeg: number): string {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return (
    "#" +
    lin
      .map((v) => {
        const g = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
        return Math.round(Math.min(1, Math.max(0, g)) * 255)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

/** Each token is declared twice in globals.css: light first, then dark. */
function palettes(css: string): Record<string, string>[] {
  const out: Record<string, string>[] = [{}, {}];
  for (const name of TOKENS) {
    const found = [
      ...css.matchAll(
        new RegExp(`^\\s*--${name}:\\s*oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)\\);`, "gm"),
      ),
    ];
    if (found.length !== 2) {
      throw new Error(`expected --${name} twice in globals.css, found ${found.length}`);
    }
    found.forEach((m, i) => {
      out[i][name] = oklchToHex(Number(m[1]), Number(m[2]), Number(m[3]));
    });
  }
  return out;
}

const cls = (fill: TileFill) =>
  fill === "ground" ? "g" : fill === "ink" ? "i" : `a${fill}`;

const rules = (p: Record<string, string>) =>
  [
    `.g{fill:${p.background}}`,
    `.i{fill:${p.foreground}}`,
    ...TOKENS.slice(2).map((t, i) => `.a${i}{fill:${p[t]}}`),
  ].join("");

const [light, dark] = palettes(readFileSync(join(ROOT, "app/globals.css"), "utf8"));
const tile = pixelTile(SITE_MARK_SEED);
const radius = Math.round(tile.n * 0.27 * 100) / 100;

const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile.n} ${tile.n}" shape-rendering="crispEdges">`,
  `<style>${rules(light)}@media (prefers-color-scheme: dark){${rules(dark)}}</style>`,
  `<clipPath id="r"><rect width="${tile.n}" height="${tile.n}" rx="${radius}"/></clipPath>`,
  `<g clip-path="url(#r)"><rect class="${cls(tile.ground)}" width="${tile.n}" height="${tile.n}"/>` +
    tile.cells
      .map(
        (c) =>
          `<rect class="${cls(c.fill)}" x="${c.x}" y="${c.y}" width="1" height="1"` +
          (c.alpha === 1 ? "" : ` fill-opacity="${c.alpha}"`) +
          "/>",
      )
      .join("") +
    "</g>",
  "</svg>",
  "",
].join("\n");

writeFileSync(join(ROOT, "app/icon.svg"), svg);
console.log(`✓ app/icon.svg: ${tile.n}×${tile.n}, ${tile.cells.length} cells, seed "${SITE_MARK_SEED}"`);
