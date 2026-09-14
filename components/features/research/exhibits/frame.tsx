import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The wrapper every exhibit shares.
 *
 * An exhibit is a change of register: the reader stops reading an argument and
 * starts operating an instrument. That shift is announced once, consistently,
 * by an accent rail and a named header, so colour carries meaning (which
 * instrument am I looking at) rather than decoration.
 *
 * No state, no "use client". The frame is server-rendered around whatever it
 * wraps, interactive or not.
 */

export type ExhibitAccent = "amber" | "rose" | "emerald" | "violet" | "blue";

const RAIL: Record<ExhibitAccent, string> = {
  amber: "before:bg-[color:var(--accent-amber)]",
  rose: "before:bg-[color:var(--accent-rose)]",
  emerald: "before:bg-[color:var(--accent-emerald)]",
  violet: "before:bg-[color:var(--accent-violet)]",
  blue: "before:bg-[color:var(--accent-blue)]",
};

const DOT: Record<ExhibitAccent, string> = {
  amber: "bg-[color:var(--accent-amber)]",
  rose: "bg-[color:var(--accent-rose)]",
  emerald: "bg-[color:var(--accent-emerald)]",
  violet: "bg-[color:var(--accent-violet)]",
  blue: "bg-[color:var(--accent-blue)]",
};

const TEXT: Record<ExhibitAccent, string> = {
  amber: "text-[color:var(--accent-amber)]",
  rose: "text-[color:var(--accent-rose)]",
  emerald: "text-[color:var(--accent-emerald)]",
  violet: "text-[color:var(--accent-violet)]",
  blue: "text-[color:var(--accent-blue)]",
};

export function ExhibitFrame({
  title,
  accent,
  interactive = false,
  children,
}: {
  title: string;
  accent: ExhibitAccent;
  /** Tells the reader there is something to operate here. */
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn(
        "relative my-0 pl-5",
        // The rail is the exhibit's signature: one continuous accent edge, so a
        // reader scrolling past knows instantly where the instruments are.
        "before:absolute before:inset-y-0 before:left-0 before:w-px before:rounded-full before:content-['']",
        RAIL[accent],
      )}
    >
      <figcaption className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[accent])}
        />
        <span className={cn("label", TEXT[accent])}>{title}</span>
        {interactive && (
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground/70">
            interactive
          </span>
        )}
      </figcaption>

      {children}
    </figure>
  );
}
