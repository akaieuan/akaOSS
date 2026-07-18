import {
  Cpu,
  Loader2,
  Check,
  AlertOctagon,
  SkipForward,
  Ban,
} from "lucide-react";
import type { AgentStatus } from "./types";

export const STATUS_META: Record<
  AgentStatus,
  { icon: React.ElementType; color: string; label: string }
> = {
  idle: { icon: Cpu, color: "text-muted-foreground", label: "Idle" },
  running: { icon: Loader2, color: "text-[color:var(--accent-blue)]", label: "Running" },
  completed: { icon: Check, color: "text-[color:var(--accent-emerald)]", label: "Completed" },
  error: { icon: AlertOctagon, color: "text-[color:var(--accent-rose)]", label: "Error" },
  skipped: { icon: SkipForward, color: "text-[color:var(--accent-amber)]", label: "Skipped" },
  cancelled: { icon: Ban, color: "text-muted-foreground", label: "Cancelled" },
};
