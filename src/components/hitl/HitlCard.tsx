"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  AlertCircle,
  PenLine,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RightTab } from "./types";

export interface HitlCardConfig {
  id: string;
  kind: "search" | "review" | "write";
  title: string;
  subtitle: string;
  steps: { label: string; done: boolean }[];
  runLabel: string;
  openTab: RightTab;
  editPlaceholder?: string;
}

const KIND_META = {
  search: { icon: Search, color: "text-[color:var(--accent-violet)]" },
  review: { icon: AlertCircle, color: "text-[color:var(--accent-amber)]" },
  write: { icon: PenLine, color: "text-[color:var(--accent-blue)]" },
};

interface HitlCardProps {
  config: HitlCardConfig;
  onOpenTab?: (tab: RightTab) => void;
}

export function HitlCard({ config, onOpenTab }: HitlCardProps) {
  const [state, setState] = useState<
    "idle" | "expanded" | "confirmed" | "dismissed"
  >("idle");
  const [note, setNote] = useState("");

  const meta = KIND_META[config.kind];
  const Icon = meta.icon;

  if (state === "dismissed") {
    return (
      <div className="my-1.5 rounded-xl border border-dashed border-border px-3 py-1.5 text-xs italic text-muted-foreground">
        Dismissed — {config.title}
      </div>
    );
  }

  if (state === "confirmed") {
    return (
      <div className="my-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs">
        <Check className={cn("h-3.5 w-3.5", meta.color)} />
        <span className="font-medium text-foreground">{config.runLabel}</span>
        <span className="text-muted-foreground">· confirmed</span>
      </div>
    );
  }

  const panelId = `hitl-card-${config.id}-panel`;
  const isExpanded = state === "expanded";

  return (
    <div
      className="my-1.5 rounded-xl border border-border bg-card text-xs"
      role="group"
      aria-label={`Interrupt card: ${config.title}`}
    >
      <button
        type="button"
        onClick={() => setState((s) => (s === "expanded" ? "idle" : "expanded"))}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="flex w-full items-center gap-2 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", meta.color)} aria-hidden="true" />
        <div className="flex-1 min-w-0 text-left">
          <span className="font-medium text-foreground">{config.title}</span>
          <span className="ml-2 text-muted-foreground">{config.subtitle}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {isExpanded && (
        <div id={panelId} className="border-t border-border px-3 pb-3 pt-2">
          <div className="mb-3 space-y-1.5">
            {config.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px]",
                    step.done
                      ? "border-transparent bg-muted text-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {step.done ? <Check className="h-2.5 w-2.5" /> : i + 1}
                </div>
                <span
                  className={
                    step.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {config.editPlaceholder && (
            <textarea
              className="mb-3 w-full resize-none rounded-md border border-border bg-background px-2.5 py-2 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              rows={2}
              placeholder={config.editPlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setState("confirmed")}
              className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Check className="h-3 w-3" aria-hidden="true" />
              {config.runLabel}
            </button>

            {onOpenTab && (
              <button
                type="button"
                onClick={() => onOpenTab(config.openTab)}
                className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                Open
              </button>
            )}

            <button
              type="button"
              onClick={() => setState("dismissed")}
              aria-label={`Dismiss ${config.title}`}
              className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const DEMO_HITL_CARDS: HitlCardConfig[] = [
  {
    id: "h1",
    kind: "search",
    title: "177 results found",
    subtitle: '"climate adaptation strategies"',
    steps: [
      { label: "Search complete", done: true },
      { label: "Refine query", done: false },
      { label: "Update panel", done: false },
    ],
    runLabel: "Run refined search",
    openTab: "search",
    editPlaceholder: "Add query notes or constraints…",
  },
  {
    id: "h2",
    kind: "review",
    title: "Citation needs verification",
    subtitle: "Table 3 · IPCC 2023 p. 12",
    steps: [
      { label: "Flagged by agent", done: true },
      { label: "Add note", done: false },
      { label: "Resume writing", done: false },
    ],
    runLabel: "Confirm & continue",
    openTab: "human",
    editPlaceholder: "Add verification note…",
  },
  {
    id: "h3",
    kind: "write",
    title: "Section 2 updated",
    subtitle: "2 new citations added",
    steps: [
      { label: "Citation 1 inserted", done: true },
      { label: "Citation 2 inserted", done: true },
      { label: "Confirm to lock", done: false },
    ],
    runLabel: "Lock & continue",
    openTab: "write",
  },
];
