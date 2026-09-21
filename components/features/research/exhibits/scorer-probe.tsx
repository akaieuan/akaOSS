"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Label,
  Mono,
  Note,
  Panel,
  Segmented,
} from "@/components/features/research/inertial/ui";

/**
 * "The measure cannot see the thing it claims to measure."
 *
 * The reader changes how the work was done. The scorer's answer does not move.
 * That refusal to move is the entire exhibit, so the verdict panel is
 * deliberately static while everything above it swaps: the argument is carried
 * by what stays put, not by what animates.
 *
 * Generic on purpose. Any benchmark, rubric or gate that checks an artefact
 * rather than its provenance can mount this with its own routes.
 */

export interface ProbeRoute {
  readonly value: string;
  /** Control label: how the answer was arrived at. */
  readonly label: string;
  /** What the agent actually did. */
  readonly how: string;
  /** Whether the underlying work was really performed. */
  readonly earned: boolean;
  /** Optional aside, e.g. "this was 30 to 40 percent of targets". */
  readonly aside?: string;
}

export interface ProbeCheck {
  readonly label: string;
  /** Whether the scorer actually tests this. */
  readonly checked: boolean;
}

export function ScorerProbe({
  legend,
  routes,
  checks,
  verdict,
  verdictNote,
  footnote,
  subjectLabel = "What the agent did",
  earnedLabel = "work actually performed",
  verdictLabel = "What the scorer returns",
}: {
  legend: string;
  routes: readonly ProbeRoute[];
  checks: readonly ProbeCheck[];
  /** The single answer every route produces. */
  verdict: string;
  verdictNote: string;
  footnote?: string;
  /** Heading over the half that changes. */
  subjectLabel?: string;
  /** The yes/no property the check is blind to. */
  earnedLabel?: string;
  /** Heading over the half that does not change. */
  verdictLabel?: string;
}) {
  const [active, setActive] = useState<string>(routes[0]?.value ?? "");

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <Segmented
          legend={legend}
          value={active}
          options={routes.map((r) => ({ value: r.value, label: r.label }))}
          onChange={setActive}
        />

        {/* What the agent did. This half changes. */}
        <div className="mt-5 grid">
          {routes.map((r) => {
            const on = r.value === active;
            return (
              <div
                key={r.value}
                aria-hidden={!on}
                className={cn(
                  "col-start-1 row-start-1 min-w-0",
                  "transition-[opacity,transform] duration-300 ease-out",
                  "motion-reduce:transition-none",
                  on
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none translate-y-1 opacity-0",
                )}
              >
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <Label className="mb-2">{subjectLabel}</Label>
                  <p className="text-[13px] leading-relaxed text-foreground">
                    {r.how}
                  </p>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                    <Mono tone="muted">{earnedLabel}</Mono>
                    <Mono tone={r.earned ? "ok" : "bad"}>
                      {r.earned ? "yes" : "no"}
                    </Mono>
                  </div>
                  {r.aside && <Note className="mt-2">{r.aside}</Note>}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* The verdict. This half never changes, on purpose. */}
      <Panel className="p-5" tone="muted">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <Label>{verdictLabel}</Label>
          <Mono tone="muted">unchanged by the control above</Mono>
        </div>

        <p className="mt-3 font-mono text-3xl tracking-tight text-[color:var(--accent-emerald)]">
          {verdict}
        </p>

        <ul className="mt-5 space-y-2 border-t border-border/50 pt-4">
          {checks.map((c, i) => (
            <li key={`${c.label}-${i}`} className="flex items-start gap-2">
              {c.checked ? (
                <Check
                  className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--accent-emerald)]"
                  aria-hidden="true"
                />
              ) : (
                <X
                  className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--accent-rose)]"
                  aria-hidden="true"
                />
              )}
              <span className="min-w-0 text-[13px] leading-relaxed text-muted-foreground">
                {c.label}
                <span className="sr-only">
                  {c.checked ? ", checked" : ", never checked"}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 max-w-prose border-t border-border/50 pt-4 text-[13px] leading-relaxed text-muted-foreground">
          {verdictNote}
        </p>
      </Panel>

      {footnote && <Note>{footnote}</Note>}
    </div>
  );
}
