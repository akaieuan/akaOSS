"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalStatus } from "./types";

export interface ApproveRejectRowProps {
  state: ApprovalStatus;
  onApprove?: () => void;
  onReject?: () => void;
  onUndo?: () => void;
  accentClass?: string;
  className?: string;
}

export function ApproveRejectRow({
  state,
  onApprove,
  onReject,
  onUndo,
  accentClass,
  className,
}: ApproveRejectRowProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="group"
      aria-label="Approve or reject decision"
    >
      {accentClass && (
        <div
          className={cn("w-1 self-stretch shrink-0 rounded-full", accentClass)}
          aria-hidden="true"
        />
      )}
      <div className="flex-1">
        {state === "pending" ? (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onApprove}
              className="flex items-center gap-1 rounded-md bg-[color:var(--accent-emerald)]/10 px-2.5 py-1.5 text-xs font-medium text-[color:var(--accent-emerald)] transition-colors hover:bg-[color:var(--accent-emerald)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Check className="h-3 w-3" aria-hidden="true" /> Approve
            </button>
            <button
              type="button"
              onClick={onReject}
              className="flex items-center gap-1 rounded-md bg-[color:var(--accent-rose)]/10 px-2.5 py-1.5 text-xs font-medium text-[color:var(--accent-rose)] transition-colors hover:bg-[color:var(--accent-rose)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3 w-3" aria-hidden="true" /> Reject
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2" role="status" aria-live="polite">
            <span
              className={cn(
                "text-xs font-medium capitalize",
                state === "approved"
                  ? "text-[color:var(--accent-emerald)]"
                  : "text-[color:var(--accent-rose)]",
              )}
            >
              {state}
            </span>
            {onUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                undo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
