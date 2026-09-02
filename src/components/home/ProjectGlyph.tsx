import type { ProjectSlug } from "@/lib/projects";

/**
 * The project marks as pixel art, with the colour drawn into the glyph.
 *
 * PixelHead's badges are a disc of foreground pixels with the glyph knocked
 * out; the knockout is where the identity lives, and it is also where the
 * colour belongs. This renders the same discs as SVG cells and paints the
 * knockout per project: eyes, bars, a slash, a caret, a core. Pure SVG,
 * server-rendered, `currentColor` for the disc, so it is right in both
 * themes without a canvas.
 *
 * Every glyph sits on a 20-cell grid and keeps at least three cells of disc
 * between itself and the edge, so the marks read as one family: a small,
 * clear figure with room around it.
 */

const V = "var(--accent-violet)";
const G = "var(--accent-green)";
const A = "var(--accent-amber)";
const R = "var(--accent-rose)";
const B = "var(--accent-blue)";
const mix = (c: string, pct: number, withColor = "white") =>
  `color-mix(in oklab, ${c} ${pct}%, ${withColor})`;

const GRID = 20;

type Cell = { c: number; r: number; fill: string };
/** Cell-space test: column, row. */
type Hit = (c: number, r: number) => boolean;
/** Cell-space paint for a knocked-out cell; null keeps it dark. */
type Paint = (c: number, r: number) => string | null;

/** A disc of foreground cells with `hit` knocked out and painted by `paint`. */
function disc(hit: Hit, paint: Paint): Cell[] {
  const cells: Cell[] = [];
  const mid = (GRID - 1) / 2;
  const radius = GRID * 0.47;
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (Math.hypot(c - mid, r - mid) > radius) continue;
      if (hit(c, r)) {
        const fill = paint(c, r);
        if (fill) cells.push({ c, r, fill });
      } else {
        cells.push({ c, r, fill: "currentColor" });
      }
    }
  }
  return cells;
}

/** Cells covered by a set of rectangles `[c0, r0, c1, r1]`, inclusive. */
const rects = (list: [number, number, number, number][]): Hit => (c, r) =>
  list.some(([c0, r0, c1, r1]) => c >= c0 && c <= c1 && r >= r0 && r <= r1);

/** Cells set in a hand-authored mask, placed with its top-left at (ox, oy). */
const mask = (rows: string[], ox: number, oy: number): Hit => (c, r) =>
  rows[r - oy]?.[c - ox] === "#";

/* ── HITL Kit: the circleheads figure, with two violet dots for eyes ───── */

function inFigure(c: number, r: number) {
  const x = ((c + 0.5) / GRID) * 2 - 1;
  const y = ((r + 0.5) / GRID) * 2 - 1;
  if (Math.hypot(x, y + 0.42) < 0.37) return true;
  const tx = x / 0.58;
  const ty = (y - 0.55) / 0.28;
  return tx * tx + ty * ty < 1;
}
const eyes = rects([
  [8, 5, 8, 5],
  [11, 5, 11, 5],
]);

/* ── eval-kit: three bars, three greens, tallest in the middle ─────────── */

const BAR_L: [number, number, number, number] = [5, 9, 7, 13];
const BAR_M: [number, number, number, number] = [9, 6, 11, 13];
const BAR_R: [number, number, number, number] = [13, 11, 15, 13];
const bars = rects([BAR_L, BAR_M, BAR_R]);
const inRect = ([c0, r0, c1, r1]: [number, number, number, number], c: number, r: number) =>
  c >= c0 && c <= c1 && r >= r0 && r <= r1;

/* ── tag-kit: the code tag, orange through the middle ──────────────────── */

/* A two-cell slash so the middle carries the colour; brackets one cell. */
const CODETAG = [
  "...#......##.#..",
  "..#......##...#.",
  ".#......##.....#",
  "..#....##.....#.",
  "...#..##.....#..",
];
const codetag = mask(CODETAG, 2, 7);

/* ── Collapse: the prompt, fading as it collapses ──────────────────────── */

const PROMPT = [
  ".##.....",
  "..##....",
  "...##...",
  "..##....",
  ".##.....",
  ".....###",
];
const prompt = mask(PROMPT, 6, 7);

/* ── Hologram: an isometric cube with a blue core ──────────────────────── */

const CUBE = [
  "....#....",
  "..##.##..",
  "#.......#",
  "#.##.##.#",
  "#...#...#",
  "#...#...#",
  "#...#...#",
  "##..#..##",
  "..##.##..",
  "....#....",
];
const cube = mask(CUBE, 5, 5);
const core = rects([[9, 9, 10, 10]]);

const GLYPHS: Record<ProjectSlug, Cell[]> = {
  "hitl-kit": disc(inFigure, (c, r) => (eyes(c, r) ? V : null)),
  "eval-kit": disc(bars, (c, r) =>
    inRect(BAR_L, c, r) ? mix(G, 55, "black") : inRect(BAR_M, c, r) ? G : mix(G, 65),
  ),
  "tag-kit": disc(codetag, (c) => (c >= 8 && c <= 13 ? A : mix(A, 80, "transparent"))),
  collapse: disc(prompt, (_c, r) => (r >= 12 ? R : mix(R, 100 - (r - 7) * 12, "black"))),
  hologram: disc(
    (c, r) => cube(c, r) || core(c, r),
    (c, r) => (core(c, r) ? mix(B, 75) : null),
  ),
};

export function ProjectGlyph({
  slug,
  size,
  className,
}: {
  slug: ProjectSlug;
  size: number;
  className?: string;
}) {
  const cells = GLYPHS[slug];
  const gap = 0.14;
  const s = 1 - gap;
  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {cells.map(({ c, r, fill }) => (
        <rect key={`${r}-${c}`} x={c + gap / 2} y={r + gap / 2} width={s} height={s} rx={0.08} fill={fill} />
      ))}
    </svg>
  );
}
