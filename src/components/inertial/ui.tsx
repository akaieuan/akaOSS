/**
 * Presentational atoms shared by the three /inertial exhibits.
 *
 * No "use client" — these are pure and get compiled into whichever graph
 * imports them, server or client. All machine data (hashes, scores, ids,
 * channels, spans) is mono; human voice is sans.
 */

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { truncateHash } from "./sha256";
import { fmtP } from "./fixtures";

export type Tone = "neutral" | "ok" | "bad" | "warn" | "muted";

const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-foreground",
  ok: "text-[color:var(--accent-emerald)]",
  bad: "text-[color:var(--accent-rose)]",
  warn: "text-[color:var(--accent-amber)]",
  muted: "text-muted-foreground",
};

const TONE_BORDER: Record<Tone, string> = {
  neutral: "border-border",
  ok: "border-[color:var(--accent-emerald)]/40",
  bad: "border-[color:var(--accent-rose)]/50",
  warn: "border-[color:var(--accent-amber)]/40",
  muted: "border-border/50",
};

const TONE_FILL: Record<Tone, string> = {
  neutral: "bg-foreground/40",
  ok: "bg-[color:var(--accent-emerald)]",
  bad: "bg-[color:var(--accent-rose)]",
  warn: "bg-[color:var(--accent-amber)]",
  muted: "bg-muted-foreground/40",
};

/** Section label inside an exhibit. */
export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("label", className)}>{children}</p>;
}

/** Machine data. Always mono, always selectable. */
export function Mono({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn("font-mono text-[11px]", TONE_TEXT[tone], className)}
    >
      {children}
    </span>
  );
}

/**
 * A truncated hash. The full 64-hex value stays reachable: `title` for pointer
 * users, a visually-hidden copy for screen readers, and the text itself is
 * selectable so it can be diffed by eye against the expected value.
 */
export function HashChip({
  value,
  prefix,
  tone = "muted",
  className,
}: {
  value: string;
  prefix?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      title={value}
      className={cn(
        "inline-flex max-w-full items-baseline gap-1 rounded-md border bg-background/50 px-1.5 py-0.5 font-mono text-[10.5px] leading-relaxed",
        TONE_BORDER[tone],
        className,
      )}
    >
      {prefix ? (
        <span className="shrink-0 text-muted-foreground/70">{prefix}</span>
      ) : null}
      <span className={cn("truncate", TONE_TEXT[tone])} aria-hidden="true">
        {truncateHash(value)}
      </span>
      <span className="sr-only">
        {prefix ? `${prefix} ` : ""}
        {value}
      </span>
    </span>
  );
}

/**
 * A probability, shown as a number and as a bar. The bar is decoration; the
 * number and the ARIA value are the data.
 */
export function ScoreMeter({
  value,
  threshold,
  label,
  tone = "neutral",
  className,
}: {
  value: number;
  threshold?: number;
  label: string;
  tone?: Tone;
  className?: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        role="meter"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={fmtP(value)}
        className="relative block h-1 w-16 shrink-0 overflow-hidden rounded-full bg-border"
      >
        <span
          className={cn("absolute inset-y-0 left-0 block", TONE_FILL[tone])}
          style={{ width: `${pct}%` }}
        />
        {threshold !== undefined && (
          <span
            className="absolute inset-y-0 block w-px bg-foreground/50"
            style={{ left: `${Math.round(threshold * 100)}%` }}
          />
        )}
      </span>
      <Mono tone={tone} className="tabular-nums">
        {fmtP(value)}
      </Mono>
    </span>
  );
}

/** A key/value line of machine data. */
export function Field({
  k,
  children,
  className,
}: {
  k: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground/70">
        {k}
      </span>
      <span className="min-w-0 font-mono text-[11px] text-foreground">
        {children}
      </span>
    </div>
  );
}

/** The site's card surface, used for every exhibit panel. */
export function Panel({
  children,
  className,
  tone,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card/40",
        tone ? TONE_BORDER[tone] : "border-border/40",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Wide machine data scrolls inside its own box; the page never does.
 *
 * `min-w-0` is load-bearing: without it the box's min-content contribution
 * (a `min-w-max` child, a `min-w-[34rem]` table) propagates up through any
 * grid or flex ancestor and widens the page instead of scrolling here.
 * `tabIndex` keeps the scroll region reachable from the keyboard.
 */
export function ScrollBox({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("-mx-1 min-w-0 overflow-x-auto px-1", className)}
      tabIndex={0}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
}

/** Primary control. */
export const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Secondary control. */
export const btnGhost =
  "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** A control that is present but refuses — the refusal is the demonstration,
 *  so it stays focusable and explains itself rather than going inert. */
export const btnBlocked =
  "inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";
