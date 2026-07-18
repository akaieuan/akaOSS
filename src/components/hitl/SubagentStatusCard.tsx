"use client";

import { cn } from "@/lib/utils";
import type { AgentStatus } from "./types";
import { STATUS_META } from "./subagent-meta";

export interface SubagentStatusCardProps {
  status: AgentStatus;
  label: string;
  detail?: string;
  className?: string;
}

export function SubagentStatusCard({
  status,
  label,
  detail,
  className,
}: SubagentStatusCardProps) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5",
        className,
      )}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            meta.color,
            status === "running" && "animate-spin",
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {detail && (
          <p className="truncate text-[10px] text-muted-foreground">{detail}</p>
        )}
      </div>
      <span
        className={cn(
          "text-[10px] font-medium capitalize",
          meta.color,
        )}
      >
        {status}
      </span>
    </div>
  );
}
