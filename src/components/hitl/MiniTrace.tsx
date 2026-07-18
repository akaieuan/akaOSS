"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type TraceStepType = "thought" | "action" | "result";

export interface TraceStep {
  type: TraceStepType;
  label: string;
  detail?: string;
}

export interface MiniTraceProps {
  steps: TraceStep[];
  className?: string;
}

const TRACE_COLORS: Record<
  TraceStepType,
  { dot: string; border: string; bg: string }
> = {
  thought: {
    dot: "bg-[color:var(--accent-violet)]",
    border: "border-[color:var(--accent-violet)]/30",
    bg: "bg-[color:var(--accent-violet)]/5",
  },
  action: {
    dot: "bg-[color:var(--accent-blue)]",
    border: "border-[color:var(--accent-blue)]/30",
    bg: "bg-[color:var(--accent-blue)]/5",
  },
  result: {
    dot: "bg-[color:var(--accent-emerald)]",
    border: "border-[color:var(--accent-emerald)]/30",
    bg: "bg-[color:var(--accent-emerald)]/5",
  },
};

export function MiniTrace({ steps, className }: MiniTraceProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setExpanded((p) => {
      const n = new Set(p);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <div className={cn("space-y-1.5", className)}>
      {steps.map((step, i) => {
        const c = TRACE_COLORS[step.type];
        return (
          <div
            key={i}
            className={cn("rounded-lg border px-3 py-2 text-xs", c.border, c.bg)}
          >
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-2 text-left"
              disabled={!step.detail}
            >
              <span className={cn("h-2 w-2 shrink-0 rounded-full", c.dot)} />
              <span className="flex-1 font-medium capitalize text-foreground">
                {step.type}: {step.label}
              </span>
              {step.detail &&
                (expanded.has(i) ? (
                  <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                ))}
            </button>
            {expanded.has(i) && step.detail && (
              <p className="mt-1 pl-4 text-[11px] text-muted-foreground">
                {step.detail}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const DEMO_TRACE_STEPS: TraceStep[] = [
  {
    type: "thought",
    label: "Determine search strategy",
    detail: "Analyzing query intent and relevant databases",
  },
  {
    type: "action",
    label: "Execute semantic search",
    detail: 'Query: "carbon pricing" returned 177 results',
  },
  {
    type: "result",
    label: "Ranked results ready",
    detail: "Top 5 results surfaced with relevance scores",
  },
];
