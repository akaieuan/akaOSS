/**
 * Catalogue scaffolding. These frame and label the real primitives; they are
 * never used by the primitives themselves, and nothing here reimplements a
 * component. Every specimen imports the shipped component from
 * `@/components/hitl/*`, so the catalogue cannot drift from the registry.
 *
 * The library is one page: the hero, then five groups, then the specimens
 * inside each group, all scrolling past in the landing's voice. A light
 * title, small light sans for the prose, quiet 12.5px lines for everything
 * that is not content, and the glossy card for every well. No eyebrows, no
 * mono, no caps, no sidebar.
 *
 * No `"use client"` here: the frame renders on the server. Only the specimens
 * that need state or a `DEMO_*` fixture cross into the client bundle, see
 * `specimens.tsx`.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { groupBySlug } from "@/lib/library";

const quiet = "text-[12.5px] text-muted-foreground/60";
const prose = "text-[13.5px] font-light leading-relaxed text-muted-foreground/80";

/** The page's masthead, in the hero's voice. `children` is the jump row. */
export function LibraryHeader({
  title,
  lede,
  meta,
  children,
}: {
  title: string;
  lede: ReactNode;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <header className="pt-16 pb-12">
      <h1 className="text-[22px] font-light leading-snug tracking-tight text-foreground sm:text-[24px]">
        {title}
      </h1>
      <p className={cn("mt-3 max-w-2xl", prose)}>{lede}</p>
      {meta ? <p className={cn("mt-3", quiet)}>{meta}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}

/**
 * One group of the library: a head with the group's name, blurb and count,
 * then its specimen sections. `id` is the group slug, the anchor the jump row
 * and the old `/components/<group>` redirects land on.
 */
export function LibraryGroup({ slug, children }: { slug: string; children: ReactNode }) {
  const group = groupBySlug(slug);
  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-title`}
      className="scroll-mt-16 border-t border-border/50 pt-14 pb-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id={`${slug}-title`} className="text-[19px] font-medium leading-snug tracking-tight text-foreground">
          {group.title}
        </h2>
        <span className={cn("shrink-0", quiet)}>{group.specimens.length} specimens</span>
      </div>
      <p className={cn("mt-2 max-w-2xl", prose)}>{group.blurb}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * One specimen section: a quiet head, an optional description, and the live
 * component in glossy wells.
 *
 * `id` is a load-bearing anchor: `/components#<id>` links exist in the wild,
 * see `lib/library.ts`. `scroll-mt-16` clears the sticky nav when someone
 * lands on the anchor directly.
 */
export function DemoSection({
  id,
  title,
  description,
  meta,
  cols = 1,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  cols?: 1 | 2 | 3;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-16 border-t border-border/40 py-10 first:border-t-0 first:pt-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 id={`${id}-title`} className="text-[15px] font-medium tracking-tight text-foreground">
          {title}
        </h3>
        {meta ? <span className={cn("shrink-0", quiet)}>{meta}</span> : null}
      </div>

      {description ? <p className={cn("mt-2 max-w-2xl", prose)}>{description}</p> : null}

      <div
        className={cn(
          "mt-6 grid gap-4",
          cols === 2 && "md:grid-cols-2",
          cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** A single labelled glossy well holding one live component. */
export function Specimen({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("card-gloss flex min-w-0 flex-col gap-4 p-5", className)}>
      {/* `flex-wrap` is load-bearing at 320px. The hint is `shrink-0`, so on one
          line the label would absorb the entire width deficit, "Result #1"
          rendered as "R…" in a 230px well. Wrapping drops the hint onto its own
          line instead, and neither string loses a character. */}
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border/40 pb-3">
        <span className="min-w-0 truncate text-[12.5px] font-medium text-foreground/90">{label}</span>
        {hint ? (
          <span className={cn("min-w-0 max-w-full shrink-0 truncate", quiet)}>{hint}</span>
        ) : null}
      </figcaption>
      <div className="min-w-0">{children}</div>
    </figure>
  );
}
