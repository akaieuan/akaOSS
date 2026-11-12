/**
 * The akaOSS mark: a small pixel tile drawn from a seed string. The same seed
 * always gives the same tile, so the mark is a fact of the name rather than a
 * drawing someone has to keep in step.
 *
 * Pure and synchronous: FNV-1a hashes the seed, xorshift32 supplies the
 * sequence, and the hash picks one of four families (grid size, palette use,
 * whether the tile mirrors left to right). Nothing here touches the DOM, so
 * the server component and the favicon script both draw from it.
 */

/** A colour role, resolved to a real colour by whoever renders the tile. */
export type TileFill = "ground" | "ink" | 0 | 1 | 2 | 3 | 4;

export type TileCell = {
  x: number;
  y: number;
  fill: TileFill;
  alpha: number;
};

export type Tile = {
  /** Cells across and down. Cells are 1 by 1 in a `0 0 n n` view box. */
  n: number;
  ground: TileFill;
  cells: TileCell[];
};

const ACCENTS = 5;

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a ^= a << 13;
    a ^= a >>> 17;
    a ^= a << 5;
    return ((a >>> 0) % 100000) / 100000;
  };
}

export function pixelTile(text: string): Tile {
  const seed = hashSeed(text);
  const r = rng(seed);
  const family = seed % 4;
  const n = [10, 8, 12, 14][family];
  const a1 = (seed % ACCENTS) as TileFill;
  const a2 = ((seed >> 3) % ACCENTS) as TileFill;
  const mirror = family !== 3;

  let ground: TileFill = "ground";
  let pal: [TileFill, number][];
  if (family === 0) {
    pal = [["ink", 0.06], ["ink", 0.14], ["ink", 0.3], ["ink", 0.55], [a1, 1]];
  } else if (family === 1) {
    ground = a1;
    pal = [["ground", 0.12], ["ground", 0.3], ["ground", 0.55], ["ground", 0.85], ["ink", 1]];
  } else if (family === 2) {
    pal = [["ink", 0.05], [a2, 0.33], [a2, 1], [a1, 1], ["ink", 1]];
  } else {
    pal = [["ink", 0.04], ["ink", 0.1], ["ink", 0.2], [a1, 1], ["ink", 0.7]];
  }

  const density = 0.55 + r() * 0.35;
  const cols = mirror ? Math.ceil(n / 2) : n;
  const cells: TileCell[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = (x + 0.5) / cols;
      const dy = Math.abs((y + 0.5) / n - 0.5) * 2;
      const p = mirror ? density - dy * 0.4 - (1 - dx) * 0.3 : density - 0.1;
      const v = r();
      if (v > p) continue;
      const level = Math.min(3, Math.floor(v * 4.6));
      const hot = r() < (family === 2 ? 0.2 : 0.07) && level >= 2;
      const [fill, alpha] = pal[hot ? 4 : level];
      cells.push({ x, y, fill, alpha });
      if (mirror && n - 1 - x !== x) cells.push({ x: n - 1 - x, y, fill, alpha });
    }
  }
  return { n, ground, cells };
}

/** The seed of the site's own mark. The favicon is built from the same one. */
export const SITE_MARK_SEED = "akaOSS";
