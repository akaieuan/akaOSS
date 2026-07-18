"use client";

import { useState } from "react";
import { Check, X, Wrench, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToolCallSignals {
  confidence?: number;
  costUsd?: number;
  scope?: string[];
}

export interface ToolCallPreviewConfig {
  id?: string;
  toolName: string;
  rationale?: string;
  args: Record<string, unknown>;
  signals?: ToolCallSignals;
  approveLabel?: string;
  rejectLabel?: string;
}

interface ToolCallPreviewProps {
  config: ToolCallPreviewConfig;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ToolCallPreview({
  config,
  onApprove,
  onReject,
}: ToolCallPreviewProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "approved" | "rejected">("idle");

  if (state !== "idle") {
    return (
      <div
        className="my-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
        role="status"
        aria-live="polite"
      >
        {state === "approved" ? (
          <>
            <Check className="h-3.5 w-3.5 text-[color:var(--accent-emerald)]" aria-hidden="true" />
            <span className="font-mono text-foreground">{config.toolName}()</span>
            <span className="text-muted-foreground">· approved</span>
          </>
        ) : (
          <>
            <X className="h-3.5 w-3.5 text-[color:var(--accent-rose)]" aria-hidden="true" />
            <span className="font-mono text-foreground">{config.toolName}()</span>
            <span className="text-muted-foreground">· rejected</span>
          </>
        )}
      </div>
    );
  }

  const confPct =
    config.signals?.confidence === undefined
      ? null
      : Math.round(config.signals.confidence * 100);

  const argsId = `tool-call-${config.id ?? "default"}-args`;

  return (
    <div
      className="my-1.5 rounded-xl border border-border bg-card text-xs"
      role="group"
      aria-label={`Tool call preview: ${config.toolName}`}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Wrench
          className="h-3.5 w-3.5 shrink-0 text-[color:var(--accent-amber)]"
          aria-hidden="true"
        />
        <span className="font-mono font-medium text-foreground">
          {config.toolName}()
        </span>
        <span className="ml-auto rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          tool call
        </span>
      </div>

      {config.rationale && (
        <div className="border-b border-border px-3 py-2 italic leading-relaxed text-muted-foreground">
          {config.rationale}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={argsId}
        className="flex w-full items-center gap-1 px-3 py-1.5 text-left text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {open ? (
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        )}
        <span>Arguments</span>
        <span className="ml-1 font-mono text-[10px]">
          ({Object.keys(config.args).length})
        </span>
      </button>

      {open && (
        <pre
          id={argsId}
          className="overflow-x-auto border-t border-border bg-muted/30 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground"
        >
          {JSON.stringify(config.args, null, 2)}
        </pre>
      )}

      {config.signals &&
        (confPct !== null ||
          config.signals.costUsd !== undefined ||
          config.signals.scope?.length) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-2 text-muted-foreground">
            {confPct !== null && (
              <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">
                {confPct}% conf
              </span>
            )}
            {config.signals.costUsd !== undefined && (
              <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">
                ${config.signals.costUsd.toFixed(4)}
              </span>
            )}
            {config.signals.scope?.map((s) => (
              <span
                key={s}
                className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]"
              >
                {s}
              </span>
            ))}
          </div>
        )}

      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <button
          type="button"
          onClick={() => {
            setState("approved");
            onApprove?.();
          }}
          className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Check className="h-3 w-3" aria-hidden="true" />
          {config.approveLabel ?? "Run tool"}
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

export const DEMO_TOOL_CALL: ToolCallPreviewConfig = {
  id: "demo-tool-call",
  toolName: "send_email",
  rationale:
    "Drafted reply to the client thread; confirming high-stakes outbound before sending.",
  args: {
    to: "client@example.com",
    subject: "Re: Q3 deliverable timeline",
    body: "Thanks for flagging the schedule risk — I've replanned around the milestone you raised and will send a revised plan by Friday.",
    cc: ["pm@internal.com"],
  },
  signals: {
    confidence: 0.86,
    costUsd: 0.0012,
    scope: ["write:email", "send:external"],
  },
  approveLabel: "Send email",
  rejectLabel: "Hold",
};
