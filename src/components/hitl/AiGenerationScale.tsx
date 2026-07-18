"use client";

import { cn } from "@/lib/utils";

export interface AiGenerationScaleProps {
  value: number;
  onChange?: (value: number) => void;
  labels?: readonly string[];
  showLabel?: boolean;
  className?: string;
}

const DEFAULT_LABELS = [
  "Human",
  "Mostly Human",
  "Collaborative",
  "Mostly AI",
  "AI",
] as const;

const SEGMENT_COLORS = [
  "bg-[color:var(--accent-emerald)]",
  "bg-[color:var(--accent-blue)]",
  "bg-[color:var(--accent-amber)]",
  "bg-[color:var(--accent-violet)]",
  "bg-[color:var(--accent-rose)]",
];

export function AiGenerationScale({
  value,
  onChange,
  labels = DEFAULT_LABELS,
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
              className={cn(
                "flex-1 rounded-md border py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide transition-all",
                isActive
                  ? `${SEGMENT_COLORS[i]} border-transparent text-black`
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
