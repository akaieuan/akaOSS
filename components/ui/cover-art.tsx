import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Generated cover art, for any page that has a slug.
 *
 * Art comes from the akaCOVART oil engine (`pnpm gen:covers` in that repo),
 * rendered headlessly and committed as a static JPEG under `public/covers/`,
 * so this ships no client JavaScript and no canvas. The seed is derived from
 * the slug, which means a page's cover is stable forever and regenerating the
 * set never reshuffles what readers have already seen.
 *
 * Decorative by default. The artwork carries no information the prose does
 * not already state, so the default alt is empty and screen readers skip it
 * rather than being read a description of a texture.
 */

export type CoverVariant = "banner" | "thumb" | "card";

const SHAPE: Record<CoverVariant, string> = {
  // Wide and shallow: sets a tone without pushing the argument below the fold.
  banner: "aspect-[5/2] rounded-2xl border border-border/70",
  thumb: "aspect-[16/9] rounded-xl border border-border/70",
  // The feed card: no edge. The feed separates by space, not by rules.
  card: "aspect-[16/10] rounded-xl",
};

const SIZES: Record<CoverVariant, string> = {
  banner: "(min-width: 1024px) 48rem, 100vw",
  thumb: "(min-width: 640px) 13rem, 100vw",
  card: "(min-width: 1024px) 23rem, (min-width: 640px) 50vw, 100vw",
};

export function CoverArt({
  slug,
  variant = "banner",
  alt = "",
  priority = false,
  className,
  imageClassName,
}: {
  slug: string;
  variant?: CoverVariant;
  /** Leave empty unless the image is carrying meaning of its own. */
  alt?: string;
  priority?: boolean;
  className?: string;
  /** For motion on the image itself; the frame clips it. */
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[color:var(--surface-2)]",
        SHAPE[variant],
        className,
      )}
    >
      <Image
        src={`/covers/${slug}.jpg`}
        alt={alt}
        fill
        sizes={SIZES[variant]}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
