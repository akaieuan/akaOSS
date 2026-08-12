"use client";

import { cn } from "@/lib/utils";
import {
  AI_GENERATION_ACCENTS,
  AI_GENERATION_LEVELS,
} from "./ai-generation-levels";

export interface AiGenerationScaleProps {
  value: number;
  onChange?: (value: number) => void;
  labels?: readonly string[];
  showLabel?: boolean;
  className?: string;
}

/**
 * The original five-button segmented scale. Kept as-is behaviourally: it is
 * the widest, most explicit form, for a settings panel or a form where every
 * option should be visible at once. The one non-visual change is `aria-pressed`
 * on each button, so the selected level reaches a screen reader instead of
 * living only in the accent fill.
 *
 * For tight layouts reach for one of the compact variants instead:
 * `AiGenerationSlider` (drag scale), `AiGenerationMeter` (read-only strip),
 * `AiGenerationBadge` (inline pill).
 */
export function AiGenerationScale({
  value,
  onChange,
  labels = AI_GENERATION_LEVELS,
  showLabel = true,
  className,
}: AiGenerationScaleProps) {
  const interactive = typeof onChange === "function";

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex gap-1">
        {labels.map((l, i) => {
          const isActive = value === i;
          return (
            <button
              key={i}
              onClick={() => interactive && onChange?.(i)}
              disabled={!interactive}
              // Without this the five buttons are indistinguishable to a screen
              // reader: the selected level is carried only by the accent fill,
              // and "Current: …" below is unassociated text.
              aria-pressed={isActive}
              className={cn(
                "flex-1 rounded-md border py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide transition-all",
                isActive
                  ? `${AI_GENERATION_ACCENTS[i]} border-transparent text-black`
                  : "border-border text-muted-foreground",
                interactive &&
                  !isActive &&
                  "hover:border-border-strong hover:text-foreground",
              )}
            >
              {l}
            </button>
          );
        })}
      </div>
      {showLabel && (
        <p className="text-center text-[10px] text-muted-foreground">
          Current: {labels[value]}
        </p>
      )}
    </div>
  );
}
