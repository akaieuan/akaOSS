"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export type BatchDecision = "approved" | "rejected" | null;

export interface BatchQueueProps {
  items: BatchItem[];
  onDecide?: (id: string, decision: "approved" | "rejected") => void;
  onComplete?: (decisions: Record<string, BatchDecision>) => void;
  className?: string;
}

export function BatchQueue({
  items,
  onDecide,
  onComplete,
  className,
}: BatchQueueProps) {
  const [decisions, setDecisions] = useState<Record<string, BatchDecision>>(
    Object.fromEntries(items.map((i) => [i.id, null])),
  );
  const [current, setCurrent] = useState(0);

  const decide = (id: string, d: "approved" | "rejected") => {
    const next = { ...decisions, [id]: d };
    setDecisions(next);
    onDecide?.(id, d);
    const newCurrent = Math.min(current + 1, items.length);
    setCurrent(newCurrent);
    if (Object.values(next).every((x) => x !== null)) {
      onComplete?.(next);
    }
  };

  const reset = () => {
    setDecisions(Object.fromEntries(items.map((i) => [i.id, null])));
    setCurrent(0);
  };

  const allDone = Object.values(decisions).every((d) => d !== null);
  const approvedCount = Object.values(decisions).filter(
    (d) => d === "approved",
  ).length;

  if (allDone) {
    return (
      <div className={cn("space-y-3 text-center", className)}>
        <Check className="mx-auto h-8 w-8 text-[color:var(--accent-emerald)]" />
        <div>
          <p className="text-sm font-semibold text-foreground">Batch complete</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {approvedCount} approved · {items.length - approvedCount} rejected
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "divide-y divide-border overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const d = decisions[item.id];
        const isActive = i === current;
        return (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-xs transition-colors",
              isActive && "bg-muted/50",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span
              className={cn(
                "flex-1 text-foreground",
                d === "rejected" && "text-muted-foreground line-through",
              )}
            >
              {item.label}
            </span>
            {d === "approved" && (
              <Check className="h-4 w-4 shrink-0 text-[color:var(--accent-emerald)]" />
            )}
            {d === "rejected" && (
              <X className="h-4 w-4 shrink-0 text-[color:var(--accent-rose)]" />
            )}
            {!d && isActive && (
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => decide(item.id, "approved")}
                  className="rounded-md bg-[color:var(--accent-emerald)]/10 px-2 py-1 text-[color:var(--accent-emerald)] transition-colors hover:bg-[color:var(--accent-emerald)]/20"
                >
                  ✓
                </button>
                <button
                  onClick={() => decide(item.id, "rejected")}
                  className="rounded-md bg-[color:var(--accent-rose)]/10 px-2 py-1 text-[color:var(--accent-rose)] transition-colors hover:bg-[color:var(--accent-rose)]/20"
                >
                  ✗
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
