/**
 * Catalogue scaffolding. These frame and label the real primitives; they are
 * never used by the primitives themselves, and nothing here reimplements a
 * component. Every specimen on every sub-page imports the shipped component
 * from `@/components/hitl/*`, so the catalogue cannot drift from the registry.
 *
 * The voice is the landing's: a light 22px title, small light sans for the
 * prose, quiet 12.5px lines for everything that is not content, and the
 * glossy card for every well. No eyebrows, no mono, no caps.
 *
 * No `"use client"` here: the frame renders on the server on every page, and
 * the two pieces a client leaf reuses (`Specimen`, and the `Link`s) work in
 * either environment. Only the specimens that need state or a `DEMO_*` fixture
 * cross into the client bundle, see `specimens.tsx`.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const quiet = "text-[12.5px] text-muted-foreground/60";
const quietLink = "transition-colors hover:text-foreground";

/** Toolkits · HITL Kit · Components · <group>, in plain sans. */
export function LibraryBreadcrumb({ group }: { group?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-2", quiet)}>
      <Link href="/projects" className={quietLink}>
        Toolkits
      </Link>
      <span aria-hidden>·</span>
      <Link href="/projects/hitl-kit" className={quietLink}>
        HITL Kit
      </Link>
      <span aria-hidden>·</span>
      {group ? (
        <>
          <Link href="/components" className={quietLink}>
            Components
          </Link>
          <span aria-hidden>·</span>
          <span className="text-foreground/80">{group}</span>
        </>
      ) : (
        <span className="text-foreground/80">Components</span>
      )}
    </nav>
  );
}

/** The masthead every library page opens with, in the hero's voice. */
export function LibraryHeader({
  group,
  title,
  lede,
  meta,
}: {
  group?: string;
  title: string;
  lede: ReactNode;
  meta?: string;
}) {
  return (
    <header className="pt-2 pb-12">
      <LibraryBreadcrumb group={group} />
      <h1 className="mt-6 text-[22px] font-light leading-snug tracking-tight text-foreground sm:text-[24px]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[13.5px] font-light leading-relaxed text-muted-foreground/80">
        {lede}
      </p>
      {meta ? <p className={cn("mt-3", quiet)}>{meta}</p> : null}
    </header>
  );
}

/**
 * One specimen section: a quiet head, an optional description, and the live
 * component in glossy wells.
 *
 * `id` is the legacy anchor, see `lib/library.ts`. `scroll-mt-20` clears the
 * sticky nav when someone lands on the anchor directly.
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
      className="scroll-mt-20 border-t border-border/50 py-10 first:border-t-0 first:pt-0"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id={`${id}-title`} className="text-[15px] font-medium tracking-tight text-foreground">
          {title}
        </h2>
        {meta ? <span className={cn("shrink-0", quiet)}>{meta}</span> : null}
      </div>

      {description ? (
        <p className="mt-2 max-w-2xl text-[13.5px] font-light leading-relaxed text-muted-foreground/80">
          {description}
        </p>
      ) : null}

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

/** Prev/next between sub-pages, so the catalogue reads as one sequence. */
export function LibraryPager({
  prev,
  next,
}: {
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  const link = cn("group flex min-w-0 items-center gap-1.5", quiet, quietLink);
  return (
    <nav
      aria-label="Library sections"
      className="mt-4 flex items-center justify-between gap-4 border-t border-border/50 pt-8"
    >
      {prev ? (
        <Link href={prev.href} className={link}>
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <Link href="/components" className={link}>
          <span aria-hidden>←</span> Library overview
        </Link>
      )}
      {next ? (
        <Link href={next.href} className={link}>
          <span className="truncate">{next.title}</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
