"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  AI_GENERATION_ACCENTS,
  AI_GENERATION_LEVELS,
  AI_GENERATION_MAX,
  aiLevelDescription,
  aiLevelName,
  clampAiLevel,
} from "./ai-generation-levels";

export interface AiGenerationBadgeProps {
  value: number;
  /** Omit for a static badge. Supplied, the pill grows ‹ › steppers. */
  onChange?: (value: number) => void;
  labels?: readonly string[];
  /** Accessible name for the control or the readout. */
  ariaLabel?: string;
  className?: string;
}

const PILL =
  "inline-flex h-[22px] max-w-full items-center gap-1.5 rounded-full border border-border/60 px-2 align-middle";

/**
 * 16px glyph with a 24px hit area supplied by the ::before overlay.
 *
 * At the end of the scale the stepper goes inert but stays enabled and
 * focusable. `disabled` would be the obvious choice and it is the wrong one:
 * the browser blurs a control the moment it becomes disabled, so a keyboard
 * user who steps to `Human` or `AI` has focus dropped onto `<body>` and their
 * next Tab restarts at the top of the page. `aria-disabled` announces the same
 * state without moving focus.
 */
function Stepper({
  glyph,
  label,
  atBound,
  describedBy,
  onClick,
}: {
  glyph: string;
  label: string;
  atBound: boolean;
  describedBy: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={atBound ? undefined : onClick}
      aria-disabled={atBound || undefined}
      aria-label={label}
      // The value lives in the live region; pointing at it here means focusing
      // a stepper cold also announces the level, not just "More AI involvement".
      aria-describedby={describedBy}
      className={cn(
        "relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-mono text-[11px] leading-none",
        "text-muted-foreground transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        atBound ? "cursor-default opacity-30" : "hover:text-foreground",
        // Real 24×24 target on a 16px glyph, without inflating the pill.
        "before:absolute before:top-1/2 before:left-1/2 before:h-6 before:w-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
      )}
    >
      <span aria-hidden>{glyph}</span>
    </button>
  );
}

/**
 * The densest form: one pill with a five-dot micro-indicator and the level
 * name. For a table cell or a queue row where even `AiGenerationMeter` is too
 * much furniture.
 *
 * Read-only it is a single `role="img"` element. Given `onChange` it becomes a
 * labelled group with two steppers: natively focusable, Enter/Space operable,
 * inert (but still focused) at the ends, and a polite live region announcing
 * the new level and its position.
 */
export function AiGenerationBadge({
  value,
  onChange,
  labels = AI_GENERATION_LEVELS,
  ariaLabel = "AI generation level",
  className,
}: AiGenerationBadgeProps) {
  const interactive = typeof onChange === "function";
  const v = clampAiLevel(value);
  const accent = AI_GENERATION_ACCENTS[v];
  const valueId = useId();

  const dots = (
    <span aria-hidden className="flex shrink-0 items-center gap-[3px]">
      {AI_GENERATION_LEVELS.map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-[2.5px] w-[2.5px] rounded-full",
            i <= v ? accent : "bg-muted-foreground/35",
          )}
        />
      ))}
    </span>
  );

  if (!interactive) {
    return (
      <span
        role="img"
        aria-label={`${ariaLabel}: ${aiLevelDescription(v, labels)}`}
        className={cn(PILL, className)}
      >
        {dots}
        <span className="truncate font-mono text-[10px] leading-none text-foreground">
          {aiLevelName(v, labels)}
        </span>
      </span>
    );
  }

  return (
    <span role="group" aria-label={ariaLabel} className={cn(PILL, className)}>
      <Stepper
        glyph="‹"
        label="Less AI involvement"
        atBound={v === 0}
        describedBy={valueId}
        onClick={() => onChange?.(clampAiLevel(v - 1))}
      />
      {dots}
      <span
        aria-hidden
        className="truncate font-mono text-[10px] leading-none text-foreground"
      >
        {aiLevelName(v, labels)}
      </span>
      {/* The visible name is decorative. This is what AT announces on change,
          and what each stepper points at so focusing one reads the level too. */}
      <span id={valueId} className="sr-only" aria-live="polite">
        {aiLevelDescription(v, labels)}
      </span>
      <Stepper
        glyph="›"
        label="More AI involvement"
        atBound={v === AI_GENERATION_MAX}
        describedBy={valueId}
        onClick={() => onChange?.(clampAiLevel(v + 1))}
      />
    </span>
  );
}
