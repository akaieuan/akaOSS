"use client";

import { useState } from "react";
import { Check, X, FileDiff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiffHunk {
  before: string;
  after: string;
  startLine?: number;
}

export interface DiffResultConfig {
  id?: string;
  title: string;
  subtitle?: string;
  language?: string;
  hunks: DiffHunk[];
  acceptLabel?: string;
  rejectLabel?: string;
}

interface DiffResultProps {
  config: DiffResultConfig;
  onAccept?: () => void;
  onReject?: () => void;
}

export function DiffResult({ config, onAccept, onReject }: DiffResultProps) {
  const [state, setState] = useState<"idle" | "accepted" | "rejected">("idle");

  if (state !== "idle") {
    return (
      <div
        className="my-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
        role="status"
        aria-live="polite"
      >
        {state === "accepted" ? (
          <>
            <Check className="h-3.5 w-3.5 text-[color:var(--accent-emerald)]" aria-hidden="true" />
            <span className="font-medium text-foreground">
              {config.acceptLabel ?? "Apply edit"}
            </span>
            <span className="text-muted-foreground">· accepted</span>
          </>
        ) : (
          <>
            <X className="h-3.5 w-3.5 text-[color:var(--accent-rose)]" aria-hidden="true" />
            <span className="font-medium text-foreground">
              {config.rejectLabel ?? "Reject"}
            </span>
            <span className="text-muted-foreground">· rejected</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="my-1.5 rounded-xl border border-border bg-card text-xs"
      role="group"
      aria-label={`Proposed diff: ${config.title}`}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <FileDiff
          className="h-3.5 w-3.5 shrink-0 text-[color:var(--accent-blue)]"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-foreground">{config.title}</span>
          {config.subtitle && (
            <span className="ml-2 text-muted-foreground">{config.subtitle}</span>
          )}
        </div>
        {config.language && (
          <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {config.language}
          </span>
        )}
      </div>

      <div className="space-y-2 px-3 py-2">
        {config.hunks.map((hunk, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-border"
            aria-label={
              hunk.startLine !== undefined
                ? `Hunk at line ${hunk.startLine}`
                : `Hunk ${i + 1}`
            }
          >
            {hunk.startLine !== undefined && (
              <div className="bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                @ line {hunk.startLine}
              </div>
            )}
            <pre
              className="bg-[color:var(--accent-rose)]/8 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground"
              aria-label="Original text"
            >
              <span className="select-none text-[color:var(--accent-rose)]" aria-hidden="true">- </span>
              {hunk.before}
            </pre>
            <pre
              className="bg-[color:var(--accent-emerald)]/8 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground"
              aria-label="Proposed text"
            >
              <span className="select-none text-[color:var(--accent-emerald)]" aria-hidden="true">+ </span>
              {hunk.after}
            </pre>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <button
          type="button"
          onClick={() => {
            setState("accepted");
            onAccept?.();
          }}
          className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Check className="h-3 w-3" aria-hidden="true" />
          {config.acceptLabel ?? "Apply edit"}
        </button>
        <button
          type="button"
          onClick={() => {
            setState("rejected");
            onReject?.();
          }}
          className={cn(
            "ml-auto flex h-6 items-center gap-1 rounded-md px-2 text-muted-foreground",
            "transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <X className="h-3 w-3" aria-hidden="true" />
          {config.rejectLabel ?? "Reject"}
        </button>
      </div>
    </div>
  );
}

export const DEMO_DIFF: DiffResultConfig = {
  id: "demo-diff",
  title: "Tighten introduction paragraph",
  subtitle: "Removes hedging, names the thesis directly",
  language: "markdown",
  hunks: [
    {
      startLine: 1,
      before:
        "It seems like the central question of this paper might be how AI systems should be evaluated when they are deployed in collaborative settings.",
      after:
        "This paper argues that AI systems must be evaluated against collaborative performance, not autonomous task completion.",
    },
  ],
  acceptLabel: "Apply edit",
  rejectLabel: "Keep original",
};
