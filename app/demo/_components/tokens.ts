import fs from "node:fs/promises";
import path from "node:path";

/**
 * The token page reads `globals.css` itself rather than restating its values
 * in TypeScript. Same reasoning as the product catalogue importing the real
 * components: a palette page that keeps its own copy of the palette is a
 * palette page that will eventually be wrong, and wrong in the one way
 * nobody notices, quietly, in the documentation.
 *
 * This runs at build time (the page is statically prerendered), so the cost
 * is one file read per build and nothing at request time.
 */

export type TokenTable = Record<string, string>;

/**
 * Pull the `--*` declarations out of one top-level rule. Neither `:root` nor
 * `.dark` nests, so the first `}` after the selector closes the block.
 */
function parseBlock(css: string, selector: string): TokenTable {
  const open = css.indexOf(`${selector} {`);
  if (open === -1) return {};
  const close = css.indexOf("}", open);
  const body = css.slice(open, close === -1 ? undefined : close);
  const out: TokenTable = {};
  for (const m of body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    out[`--${m[1]}`] = m[2]!.trim();
  }
  return out;
}

export async function readTokenTables(): Promise<{
  light: TokenTable;
  dark: TokenTable;
}> {
  const file = path.join(process.cwd(), "app", "globals.css");
  const css = await fs.readFile(file, "utf-8");
  // Comments first: the token blocks are heavily annotated, and a `/* ... */`
  // can otherwise swallow or fake a declaration.
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return {
    light: parseBlock(stripped, ":root"),
    dark: parseBlock(stripped, ".dark"),
  };
}

/**
 * Contrast ratios against `--background`, computed offline from the authored
 * oklch values: oklch → linear sRGB → the WCAG 2.x relative-luminance
 * formula. Recomputed by hand whenever the palette moves; the conversion was
 * checked against a known reference (shadcn's `oklch(0.577 0.245 27.325)`
 * resolves to #e7000b, exactly).
 *
 * Stated rather than computed in the page because doing it live would mean
 * either shipping a colour-space library to the browser or duplicating one
 * on the server for six numbers that change about once a year.
 */
export const CONTRAST: {
  token: string;
  light: number;
  dark: number;
  lightHex: string;
  darkHex: string;
}[] = [
  { token: "--foreground", light: 17.03, dark: 16.44, lightHex: "#0d0d0c", darkHex: "#eaeae8" },
  { token: "--muted-foreground", light: 5.73, dark: 5.65, lightHex: "#5e5e5b", darkHex: "#898987" },
  { token: "--accent-blue", light: 4.38, dark: 6.8, lightHex: "#1d6bde", darkHex: "#5d98f4" },
  { token: "--accent-green", light: 5.04, dark: 8.04, lightHex: "#377249", darkHex: "#69b57f" },
  { token: "--accent-amber", light: 3.27, dark: 11.59, lightHex: "#b37903", darkHex: "#f0be67" },
  { token: "--accent-rose", light: 4.08, dark: 6.9, lightHex: "#c6495b", darkHex: "#ec7380" },
  { token: "--accent-violet", light: 5.15, dark: 8.61, lightHex: "#7152b5", darkHex: "#b3a0ec" },
];
