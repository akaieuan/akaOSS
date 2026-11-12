import { pixelTile, type TileFill } from "@/lib/pixel-tile";
import { cn } from "@/lib/utils";

/**
 * The akaOSS mark as inline SVG. Server-rendered and static: no canvas, no
 * script, nothing to hydrate. Colours are the site's own tokens, so the tile
 * follows the theme without being told.
 */

const ACCENT_VARS = [
  "var(--accent-amber)",
  "var(--accent-green)",
  "var(--accent-blue)",
  "var(--accent-violet)",
  "var(--accent-rose)",
];

const paint = (fill: TileFill) =>
  fill === "ground"
    ? "var(--background)"
    : fill === "ink"
      ? "var(--foreground)"
      : ACCENT_VARS[fill];

export function PixelTile({
  seed,
  size,
  className,
}: {
  seed: string;
  /** CSS px, square. */
  size: number;
  className?: string;
}) {
  const tile = pixelTile(seed);
  return (
    <svg
      viewBox={`0 0 ${tile.n} ${tile.n}`}
      width={size}
      height={size}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={cn("shrink-0 rounded-[27%]", className)}
    >
      <rect width={tile.n} height={tile.n} fill={paint(tile.ground)} />
      {tile.cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x}
          y={c.y}
          width={1}
          height={1}
          fill={paint(c.fill)}
          fillOpacity={c.alpha === 1 ? undefined : c.alpha}
        />
      ))}
    </svg>
  );
}
