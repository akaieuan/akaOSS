"use client";

import { useState } from "react";
import { GripVertical, X, Check, ListChecks, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanStep {
  id: string;
  label: string;
  detail?: string;
  locked?: boolean;
}

export interface EditablePlanConfig {
  id?: string;
  title: string;
  subtitle?: string;
  steps: PlanStep[];
  submitLabel?: string;
}

interface EditablePlanProps {
  config: EditablePlanConfig;
  onSubmit?: (steps: PlanStep[]) => void;
  onCancel?: () => void;
}

export function EditablePlan({
  config,
  onSubmit,
  onCancel,
}: EditablePlanProps) {
  const [steps, setSteps] = useState<PlanStep[]>(config.steps);
  const [submitted, setSubmitted] = useState<"idle" | "ran" | "cancelled">("idle");

  if (submitted === "ran") {
    return (
      <div
        className="my-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
        role="status"
        aria-live="polite"
      >
        <Check
          className="h-3.5 w-3.5 text-[color:var(--accent-emerald)]"
          aria-hidden="true"
        />
        <span className="font-medium text-foreground">
          {config.submitLabel ?? "Run plan"}
        </span>
        <span className="text-muted-foreground">· {steps.length} steps</span>
      </div>
    );
  }
  if (submitted === "cancelled") {
    return (
      <div
        className="my-1.5 rounded-xl border border-dashed border-border px-3 py-1.5 text-xs italic text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        Plan cancelled
      </div>
    );
  }

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...steps];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target]!, next[idx]!];
    setSteps(next);
  };

  const remove = (idx: number) => {
    if (steps[idx]?.locked) return;
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const update = (idx: number, label: string) => {
    setSteps(steps.map((s, i) => (i === idx ? { ...s, label } : s)));
  };

  const addStep = () => {
    setSteps([
      ...steps,
      { id: `step-${Date.now()}`, label: "New step", locked: false },
    ]);
  };

  return (
    <div
      className="my-1.5 rounded-xl border border-border bg-card text-xs"
      role="group"
      aria-label={`Editable plan: ${config.title}`}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <ListChecks
          className="h-3.5 w-3.5 shrink-0 text-[color:var(--accent-blue)]"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-foreground">{config.title}</span>
          {config.subtitle && (
            <span className="ml-2 text-muted-foreground">{config.subtitle}</span>
          )}
        </div>
      </div>

      <ol className="space-y-1 px-2 py-2 list-none m-0" aria-label="Plan steps">
        {steps.map((step, i) => (
          <li
            key={step.id}
            className="group flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-1 hover:border-border"
          >
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label={`Move "${step.label}" up`}
              className="cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span
              className="font-mono text-[10px] text-muted-foreground"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <input
              value={step.label}
              onChange={(e) => update(i, e.target.value)}
              disabled={step.locked}
              aria-label={`Step ${i + 1}${step.locked ? " (locked)" : ""}`}
              className={cn(
                "flex-1 bg-transparent text-foreground outline-none focus:ring-1 focus:ring-ring rounded",
                step.locked && "text-muted-foreground",
              )}
            />
            {step.locked ? (
              <Lock
                className="h-3 w-3 text-muted-foreground"
                aria-label="Locked"
              />
            ) : (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove "${step.label}"`}
                className="text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:text-[color:var(--accent-rose)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
          Add step
        </button>
        <button
          type="button"
          onClick={() => {
            setSubmitted("ran");
            onSubmit?.(steps);
          }}
          className="ml-auto flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Check className="h-3 w-3" aria-hidden="true" />
          {config.submitLabel ?? "Run plan"}
        </button>
        <button
          type="button"
          onClick={() => {
            setSubmitted("cancelled");
            onCancel?.();
          }}
          aria-label="Cancel plan"
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export const DEMO_PLAN: EditablePlanConfig = {
  id: "demo-plan",
  title: "Draft research summary",
  subtitle: "Reorder, edit, or remove steps before the agent runs",
  steps: [
    { id: "scope", label: "Define scope and target audience", locked: true },
    { id: "search", label: "Search for primary sources" },
    { id: "synthesise", label: "Synthesise key claims with citations" },
    { id: "draft", label: "Draft 800-word summary" },
    { id: "review", label: "Self-review for hedging language" },
  ],
  submitLabel: "Run plan",
};
