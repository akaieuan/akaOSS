import { cn } from "@/lib/utils";
import {
  AI_GENERATION_ACCENTS,
  AI_GENERATION_LEVELS,
  aiLevelDescription,
  aiLevelName,
  clampAiLevel,
} from "./ai-generation-levels";

export interface AiGenerationMeterProps {
  value: number;
  labels?: readonly string[];
  /** Drop the level name and keep only the segments, for very tight cells. */
  compact?: boolean;
  /** Overrides the generated description, e.g. "Provenance: Collaborative, 3 of 5". */
  ariaLabel?: string;
  className?: string;
}

/**
 * At-a-glance provenance: five segments filled to the current level, plus the
 * level name. ~20px tall, one row.
 *
 * Deliberately read-only. Its job is to show provenance in a list row or a
 * header *without* inviting interaction, so it renders as a single element with
 * `role="img"` and no focusable children, a keyboard user tabbing through a
 * table of fifty rows should not collect fifty stops. When the value needs to
 * be editable, reach for `AiGenerationSlider` or `AiGenerationBadge`.
 *
 * No `"use client"`: it holds no state and no handlers, so it renders on the
 * server and works inside a client tree unchanged.
 */
export function AiGenerationMeter({
  value,
  labels = AI_GENERATION_LEVELS,
  compact = false,
  ariaLabel,
  className,
}: AiGenerationMeterProps) {
  const v = clampAiLevel(value);
  const accent = AI_GENERATION_ACCENTS[v];

  return (
    <span
      role="img"
      aria-label={ariaLabel ?? aiLevelDescription(v, labels)}
      className={cn(
        "inline-flex h-5 max-w-full items-center gap-2 align-middle",
        className,
      )}
    >
      <span className="flex shrink-0 items-center gap-1">
        {AI_GENERATION_LEVELS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-[3px] w-4 rounded-sm",
              i <= v ? accent : "bg-muted",
            )}
          />
        ))}
      </span>
      {compact ? null : (
        <span className="truncate font-mono text-[11px] leading-none text-foreground">
          {aiLevelName(v, labels)}
        </span>
      )}
    </span>
  );
}
