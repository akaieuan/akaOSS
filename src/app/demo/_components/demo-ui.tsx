/**
 * Catalogue scaffolding for the brand demo. Deliberately the same visual
 * idiom as `app/components/_components/demo-ui.tsx`. The same well
 * (`rounded-2xl border border-border/40 bg-card/40`), the same figcaption
 * rule, the same section divider, so the product catalogue and the brand
 * catalogue read as one system rather than two sites.
 *
 * Nothing here is used by the site itself, and nothing here reimplements a
 * component: every specimen renders the shipped thing.
 *
 * No `"use client"`: this frame is server-rendered on every page. Only the
 * leaves that genuinely need the browser (`PixelHead`, `ThemeToggle`, the
 * nav's `usePathname`) cross the boundary.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The masthead every brand page opens with. */
export function DemoHeader({
  title,
  lede,
  meta,
}: {
  title: string;
  lede: ReactNode;
  meta?: string;
}) {
  return (
    <header className="pt-4 pb-14">
      <p className="label">Brand system · unlisted</p>
      <h1 className="mt-6 text-3xl font-light tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {lede}
      </p>
      {meta ? <p className="label mt-6">{meta}</p> : null}
    </header>
  );
}

/**
 * One specimen section: a title, an optional note on where the thing is
 * actually used, and the live specimens below.
 *
 * `scroll-mt-20` clears the sticky nav when someone lands on the anchor.
 */
export function DemoSection({
  id,
  title,
  description,
  meta,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 border-t border-border/60 py-12 first:border-t-0 first:pt-0"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2
          id={`${id}-title`}
          className="text-xl font-light tracking-tight text-foreground"
        >
          {title}
        </h2>
        {meta ? <span className="label shrink-0">{meta}</span> : null}
      </div>

      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      <div className="mt-7">{children}</div>
    </section>
  );
}

/**
 * Auto-filling tile grid. `auto-fill` with a 132px floor lands on two
 * columns inside a 327px viewport (375px less the page's `px-6`), which is
 * the narrowest layout this catalogue is measured at.
 */
export function TileGrid({
  min = 132,
  children,
}: {
  min?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A labelled well holding one live specimen, caption on top, exactly as
 * the product catalogue does it.
 *
 * `flex-wrap` on the figcaption is load-bearing at 375px: the hint is
 * `shrink-0`, so on one line the label would absorb the whole width deficit
 * and truncate to a single character. Wrapping drops the hint to its own
 * line and neither string loses anything.
 */
export function Specimen({
  label,
  hint,
  footnote,
  center = false,
  minH,
  children,
  className,
}: {
  label: string;
  hint?: string;
  /**
   * A wrapping line below the specimen, where the thing is actually used.
   * Separate from `hint` because `hint` truncates: at 375px a two-column
   * tile is ~150px wide and "nav · footer · favicon · hero" would become
   * an ellipsis.
   */
  footnote?: ReactNode;
  /** Centre the body, how the marks read best. */
  center?: boolean;
  /** Minimum body height in px, so a row of tiles keeps a common baseline. */
  minH?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-2xl border border-border/40 bg-card/40 p-5",
        className,
      )}
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border/40 pb-3">
        <span className="min-w-0 truncate font-mono text-[11px] text-foreground">
          {label}
        </span>
        {hint ? (
          <span className="min-w-0 max-w-full shrink-0 truncate font-mono text-[10px] text-muted-foreground/70">
            {hint}
          </span>
        ) : null}
      </figcaption>
      <div
        className={cn(
          "min-w-0",
          center && "flex flex-1 items-center justify-center",
        )}
        style={minH ? { minHeight: minH } : undefined}
      >
        {children}
      </div>
      {footnote ? (
        <p className="border-t border-border/40 pt-3 text-[11px] leading-relaxed text-muted-foreground">
          {footnote}
        </p>
      ) : null}
    </figure>
  );
}

/** An unlabelled well, for a single wide specimen that needs no caption. */
export function Well({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border border-border/40 bg-card/40 p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A quiet aside under a section: caveats, reduced-motion behaviour, etc. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 max-w-2xl border-l border-border/60 pl-4 text-[13px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

/** Inline machine data: prop names, token names, icon ids. */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[0.9em] text-foreground/90">{children}</code>
  );
}

/** Prev/next between sub-pages. */
export function DemoPager({
  prev,
  next,
}: {
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  return (
    <nav
      aria-label="Brand catalogue sections"
      className="mt-4 flex items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span
            aria-hidden
            className="transition-transform group-hover:-translate-x-0.5"
          >
            ←
          </span>
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="truncate">{next.title}</span>
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
