/**
 * Catalogue scaffolding. These frame and label the real primitives; they are
 * never used by the primitives themselves, and nothing here reimplements a
 * component. Every specimen on every sub-page imports the shipped component
 * from `@/components/hitl/*`, so the catalogue cannot drift from the registry.
 *
 * No `"use client"` here: the frame renders on the server on every page, and
 * the two pieces a client leaf reuses (`Specimen`, and the `Link`s) work in
 * either environment. Only the specimens that need state or a `DEMO_*` fixture
 * cross into the client bundle, see `live.tsx`.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Toolkits · HITL Kit · components · <group> */
export function LibraryBreadcrumb({ group }: { group?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 font-mono text-small text-muted-foreground"
    >
      <Link href="/projects" className="transition-colors hover:text-foreground">
        Toolkits
      </Link>
      <span className="text-muted-foreground/40">·</span>
      <Link
        href="/projects/hitl-kit"
        className="transition-colors hover:text-foreground"
      >
        HITL Kit
      </Link>
      <span className="text-muted-foreground/40">·</span>
      {group ? (
        <>
          <Link
            href="/components"
            className="transition-colors hover:text-foreground"
          >
            components
          </Link>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-foreground">{group}</span>
        </>
      ) : (
        <span className="text-foreground">components</span>
      )}
    </nav>
  );
}

/** The masthead every library page opens with. */
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
    <header className="pt-4 pb-14">
      <LibraryBreadcrumb group={group} />
      <h1 className="mt-6 text-title-1 font-light text-foreground">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lede text-muted-foreground">
        {lede}
      </p>
      {meta ? <p className="label mt-6">{meta}</p> : null}
    </header>
  );
}

/**
 * One specimen section: a title, an optional description, and the live
 * component in a bordered well.
 *
 * `id` is the legacy anchor, see `sections.ts`. `scroll-mt-20` clears the
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
      className="scroll-mt-20 border-t border-border/60 py-12 first:border-t-0 first:pt-0"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2
          id={`${id}-title`}
          className="text-title-2 font-light text-foreground"
        >
          {title}
        </h2>
        {meta ? <span className="label shrink-0">{meta}</span> : null}
      </div>

      {description ? (
        <p className="mt-3 max-w-2xl text-body text-muted-foreground">
          {description}
        </p>
      ) : null}

      <div
        className={cn(
          "mt-7 grid gap-4",
          cols === 2 && "md:grid-cols-2",
          cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** A single labelled well holding one live component. */
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
    <figure
      className={cn(
        "card flex min-w-0 flex-col gap-4 p-5",
        className,
      )}
    >
      {/* `flex-wrap` is load-bearing at 320px. The hint is `shrink-0`, so on one
          line the label would absorb the entire width deficit, "Result #1"
          rendered as "R…" in a 230px well. Wrapping drops the hint onto its own
          line instead, and neither string loses a character. */}
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border/40 pb-3">
        <span className="label min-w-0 truncate">{label}</span>
        {hint ? (
          <span className="min-w-0 max-w-full shrink-0 truncate font-mono text-meta text-muted-foreground">
            {hint}
          </span>
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
  return (
    <nav
      aria-label="Library sections"
      className="mt-4 flex items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <Link
          href="/components"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span> Library overview
        </Link>
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
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
