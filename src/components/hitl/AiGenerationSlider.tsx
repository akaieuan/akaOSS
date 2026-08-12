"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  AI_GENERATION_ACCENTS,
  AI_GENERATION_LEVELS,
  AI_GENERATION_MAX,
  aiLevelName,
  clampAiLevel,
} from "./ai-generation-levels";

/**
 * Thumb is 18px with a 2px separation ring, so the run of stop positions is
 * inset by 11px at each end. That is what keeps the thumb inside the component
 * box at level 0 and level 4 instead of bleeding past it.
 */
const RAIL_INSET = 11;

export interface AiGenerationSliderProps {
  value: number;
  /** Omit for a read-only readout. */
  onChange?: (value: number) => void;
  labels?: readonly string[];
  /** Optional right-hand micro-copy in the header row. Mono, muted. */
  hint?: string;
  /** Accessible name for the slider. */
  ariaLabel?: string;
  className?: string;
}

/**
 * The compact drag scale: one header row and one track, ~58px tall, and it
 * holds together at 320px.
 *
 * The five level names never all render at once: the current level sits in the
 * header and the two endpoints sit under the track. Those two words carry the
 * axis, which is exactly what buys the compactness over the five-button
 * `AiGenerationScale`.
 *
 * Pointer drag snaps to the five stops; ← → (and ↑ ↓) step, Home/End jump.
 */
export function AiGenerationSlider({
  value,
  onChange,
  labels = AI_GENERATION_LEVELS,
  hint,
  ariaLabel = "AI generation level",
  className,
}: AiGenerationSliderProps) {
  const interactive = typeof onChange === "function";
  const v = clampAiLevel(value);
  const name = aiLevelName(v, labels);

  const railRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const commit = (next: number) => {
    const clamped = clampAiLevel(next);
    if (clamped !== v) onChange?.(clamped);
  };

  /** Map a pointer x onto the nearest stop, using the inset rail as the axis. */
  const fromClientX = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return v;
    return clampAiLevel(((clientX - rect.left) / rect.width) * AI_GENERATION_MAX);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    let next: number;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = v - 1;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = v + 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = AI_GENERATION_MAX;
        break;
      default:
        return;
    }
    e.preventDefault();
    commit(next);
  };

  return (
    <div className={cn("w-full select-none", className)}>
      {/* Header: the level name is the readout. No need to render all five. */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-[13px] leading-4 font-medium text-foreground">
          {name}
        </span>
        {hint ? (
          <span className="min-w-0 shrink truncate font-mono text-[10px] leading-4 text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </div>

      <div
        role="slider"
        tabIndex={interactive ? 0 : -1}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={AI_GENERATION_MAX}
        aria-valuenow={v}
        aria-valuetext={name}
        aria-readonly={interactive ? undefined : true}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          if (!interactive) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          e.currentTarget.focus();
          dragging.current = true;
          commit(fromClientX(e.clientX));
        }}
        onPointerMove={(e) => {
          if (!interactive || !dragging.current) return;
          commit(fromClientX(e.clientX));
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        className={cn(
          "group relative mt-1 h-[18px] w-full outline-none",
          interactive ? "cursor-pointer touch-none" : "cursor-default",
        )}
      >
        {/* Track */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted"
        />

        {/* Stops + thumb live on the inset rail so nothing overhangs the box. */}
        <span
          ref={railRef as React.RefObject<HTMLSpanElement>}
          aria-hidden
          className="absolute inset-y-0"
          style={{ left: RAIL_INSET, right: RAIL_INSET }}
        >
          {AI_GENERATION_LEVELS.map((_, i) => (
            <span
              key={i}
              style={{ left: `${(i / AI_GENERATION_MAX) * 100}%` }}
              className={cn(
                "absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-150",
                i <= v ? AI_GENERATION_ACCENTS[v] : "bg-muted-foreground/35",
              )}
            />
          ))}

          {/* No transition on `left`: the thumb must track the pointer exactly
              during a drag, and its position must never depend on an animation
              frame landing. The stop dots carry the only motion here. */}
          <span
            style={{ left: `${(v / AI_GENERATION_MAX) * 100}%` }}
            className={cn(
              "absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-[6px] bg-foreground ring-2 ring-background",
              "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring",
            )}
          />
        </span>
      </div>

      {/* The axis. aria-valuetext already carries the level, so this is decoration.
          `mt-2`, not `mt-1`: the thumb's focus ring paints 4px below the thumb
          (2px outline at a 2px offset), which is exactly the old 4px gap. The
          ring landed flush on the cap-height of "Human". 8px leaves it 4px of
          clearance at every level and every width. */}
      <div
        aria-hidden
        className="mt-2 flex items-baseline justify-between gap-2 font-mono text-[10px] leading-none text-muted-foreground"
      >
        <span>{labels[0]}</span>
        <span>{labels[AI_GENERATION_MAX]}</span>
      </div>
    </div>
  );
}
