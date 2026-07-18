"use client";

import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentStatus } from "./types";
import { STATUS_META } from "./subagent-meta";

const STATUSES: AgentStatus[] = [
  "idle",
  "running",
  "completed",
  "error",
  "skipped",
  "cancelled",
];

const EVIDENCE_NOTES = [
  "AR6 temperature overshoot",
  "Price corridor $50/tCO₂",
  "EU ETS reform outcomes",
];

export function WritingAgent({ liveData = false }: { liveData?: boolean }) {
  const [status, setStatus] = useState<AgentStatus>("idle");

  useEffect(() => {
    if (!liveData) return;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % STATUSES.length;
      setStatus(STATUSES[i]);
    }, 1500);
    return () => clearInterval(t);
  }, [liveData]);

  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-[color:var(--accent-blue)]" />
          <span className="text-sm font-medium text-foreground">
            Write Doc Agent
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Icon
            className={cn(
              "h-3.5 w-3.5",
              meta.color,
              status === "running" && "animate-spin",
            )}
          />
          <span className={cn("text-xs capitalize", meta.color)}>
            {meta.label}
          </span>
        </div>
      </div>

      <div className="space-y-1 rounded-lg bg-background/40 px-3 py-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Title</span>
          <span className="font-medium text-foreground">
            Climate Policy Analysis
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Target</span>
          <span className="font-medium text-foreground">Section 2</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Word range</span>
          <span className="font-medium text-foreground">400–600</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="label">Evidence notes</p>
        {EVIDENCE_NOTES.map((n) => (
          <div
            key={n}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent-blue)]" />
            {n}
          </div>
        ))}
      </div>

      {status === "completed" && (
        <button className="w-full rounded-lg border border-[color:var(--accent-blue)]/30 bg-[color:var(--accent-blue)]/10 py-2 text-xs font-medium text-[color:var(--accent-blue)] transition-opacity hover:opacity-80">
          View draft
        </button>
      )}

      {!liveData && (
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize transition-colors",
                status === s
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
