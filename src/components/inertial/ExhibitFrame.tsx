/**
 * Page furniture for /inertial. Server components — the prose and the frame
 * stay on the server; only the exhibits themselves are client leaves.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Matches the research feed's chip. */
export function Pill({
  children,
  mono = false,
}: {
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-muted-foreground",
        mono ? "font-mono text-[11px]" : "text-xs",
      )}
    >
      {children}
    </span>
  );
}

/** Body copy at the research page's measure and rhythm. */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-[42rem] text-[15px] leading-[1.75] text-muted-foreground md:text-base",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** One exhibit: a numbered label, a heading, a sentence or two, the live thing. */
export function Exhibit({
  n,
  kind,
  id,
  title,
  children,
  framing,
}: {
  n: string;
  kind: string;
  id: string;
  title: string;
  framing: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="label">Exhibit {n}</span>
        <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground/60 uppercase">
          {kind}
        </span>
      </div>

      <h2
        id={`${id}-title`}
        className="mt-4 max-w-3xl text-2xl leading-[1.2] font-light tracking-tight text-foreground md:text-[28px]"
      >
        {title}
      </h2>

      <div className="mt-4 space-y-4">{framing}</div>

      <div className="mt-8">{children}</div>
    </section>
  );
}
