"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const ACCENT_SWATCHES = [
  { label: "Violet", color: "bg-[color:var(--accent-violet)]" },
  { label: "Amber", color: "bg-[color:var(--accent-amber)]" },
  { label: "Blue", color: "bg-[color:var(--accent-blue)]" },
  { label: "Emerald", color: "bg-[color:var(--accent-emerald)]" },
  { label: "Rose", color: "bg-[color:var(--accent-rose)]" },
];

type ApprovalState = "pending" | "approved" | "rejected";
const APPROVAL_STATES: ApprovalState[] = ["pending", "approved", "rejected"];

const APPROVAL_CLASS: Record<ApprovalState, string> = {
  pending: "bg-[color:var(--accent-amber)]/10 text-[color:var(--accent-amber)]",
  approved: "bg-[color:var(--accent-emerald)]/10 text-[color:var(--accent-emerald)]",
  rejected: "bg-[color:var(--accent-rose)]/10 text-[color:var(--accent-rose)]",
};

export function SharedPrimitives() {
  const [approvals, setApprovals] = useState<Record<string, ApprovalState>>({
    a: "pending",
    b: "pending",
    c: "pending",
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="label mb-2">Accent colors</p>
        <div className="flex flex-wrap gap-3">
          {ACCENT_SWATCHES.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={cn("h-3 w-3 rounded-full", s.color)} />
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="label mb-2">Approval badges</p>
        <div className="flex gap-2">
          {APPROVAL_STATES.map((s) => (
            <span
              key={s}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                APPROVAL_CLASS[s],
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="label mb-2">Approve / reject</p>
        <div className="space-y-1.5">
          {(["a", "b", "c"] as const).map((k) => (
            <div
              key={k}
              className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2"
            >
              <span className="text-xs text-foreground">Item {k.toUpperCase()}</span>
              {approvals[k] === "pending" ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={() =>
                      setApprovals((p) => ({ ...p, [k]: "approved" }))
                    }
                    className="rounded-md bg-[color:var(--accent-emerald)]/10 px-2 py-1 text-[10px] font-medium text-[color:var(--accent-emerald)] transition-colors hover:bg-[color:var(--accent-emerald)]/20"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      setApprovals((p) => ({ ...p, [k]: "rejected" }))
                    }
                    className="rounded-md bg-[color:var(--accent-rose)]/10 px-2 py-1 text-[10px] font-medium text-[color:var(--accent-rose)] transition-colors hover:bg-[color:var(--accent-rose)]/20"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={cn(
                    "text-xs font-medium capitalize",
                    approvals[k] === "approved"
                      ? "text-[color:var(--accent-emerald)]"
                      : "text-[color:var(--accent-rose)]",
                  )}
                >
                  {approvals[k]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
