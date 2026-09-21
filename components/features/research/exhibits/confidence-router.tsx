"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Label,
  Mono,
  Note,
  Panel,
  Segmented,
  type Tone,
} from "@/components/features/research/inertial/ui";

/**
 * "A confidence can decide whether to ask. It cannot decide whether you may."
 *
 * The reader moves a confidence and picks an action. For an ordinary action
 * the outcome tracks the number: act, confirm, or hand to a person. Flip the
 * action to policy-gated and the number stops mattering entirely, which is the
 * exhibit's whole argument: the meter greys out while the reader is still
 * holding the slider.
 *
 * Generic on purpose. Any system that routes on a model's self-reported
 * certainty can mount this with its own actions and thresholds.
 */

export interface RoutedAction {
  readonly value: string;
  readonly label: string;
  /** Above this, the system acts without asking. */
  readonly actAbove: number;
  /** Act AT the threshold too. Off by default: a bar is cleared, not touched. */
  readonly inclusive?: boolean;
  /** What goes wrong if the system acts on a misread. */
  readonly worstCase: string;
}

type Outcome = "act" | "confirm" | "person" | "approval";

const OUTCOME: Record<Outcome, { title: string; tone: Tone }> = {
  act: { title: "Act without asking", tone: "ok" },
  confirm: { title: "Ask the person to confirm", tone: "warn" },
  person: { title: "Hand to a person", tone: "bad" },
  approval: { title: "Approval required", tone: "neutral" },
};

const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-foreground",
  ok: "text-[color:var(--accent-emerald)]",
  bad: "text-[color:var(--accent-rose)]",
  warn: "text-[color:var(--accent-amber)]",
  muted: "text-muted-foreground",
};

export function ConfidenceRouter({
  legend,
  actions,
  floor,
  initialConfidence = 0.72,
  policyLabel = "policy requires approval for this action",
  notes,
  footnote,
}: {
  legend: string;
  actions: readonly RoutedAction[];
  /** Below this, nothing is acted on, whatever the action. */
  floor: number;
  initialConfidence?: number;
  policyLabel?: string;
  /** One sentence per outcome, in the post's own voice. */
  notes: Record<Outcome, string>;
  footnote?: string;
}) {
  const [active, setActive] = useState<string>(actions[0]?.value ?? "");
  const [confidence, setConfidence] = useState(initialConfidence);
  const [mandated, setMandated] = useState(false);
  const sliderId = useId();
  const policyId = useId();

  const action = actions.find((a) => a.value === active) ?? actions[0];
  if (!action) return null;

  const outcome: Outcome = mandated
    ? "approval"
    : confidence < floor
      ? "person"
      : confidence > action.actAbove ||
          (action.inclusive === true && confidence >= action.actAbove)
        ? "act"
        : "confirm";

  const pct = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <Segmented
          legend={legend}
          value={active}
          options={actions.map((a) => ({ value: a.value, label: a.label }))}
          onChange={setActive}
        />

        <div
          className={cn(
            "mt-6 transition-opacity duration-300 motion-reduce:transition-none",
            mandated && "opacity-40",
          )}
        >
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={sliderId} className="label">
              Reported confidence
            </label>
            <Mono className="tabular-nums" tone={mandated ? "muted" : "neutral"}>
              {mandated ? "not consulted" : confidence.toFixed(2)}
            </Mono>
          </div>

          {/* Track with the two thresholds marked in place, so the reader sees
              the boundaries they are dragging across. */}
          <div className="relative mt-4 h-1.5 rounded-full bg-border">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-foreground/50 transition-[width] duration-150 ease-out motion-reduce:transition-none"
              style={{ width: pct(confidence) }}
            />
            {[
              { at: floor, name: "floor" },
              { at: action.actAbove, name: "act" },
            ].map((m) => (
              <span
                key={m.name}
                aria-hidden="true"
                className="absolute -top-1.5 h-4 w-px bg-muted-foreground/70 transition-[left] duration-300 ease-out motion-reduce:transition-none"
                style={{ left: pct(m.at) }}
              />
            ))}
          </div>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={confidence}
            disabled={mandated}
            onChange={(e) => setConfidence(Number(e.target.value))}
            aria-valuetext={`${confidence.toFixed(2)}, ${OUTCOME[outcome].title}`}
            className="mt-3 w-full accent-foreground disabled:cursor-not-allowed"
          />
          <div className="mt-1 flex justify-between">
            <Mono tone="muted">floor {floor.toFixed(2)}</Mono>
            <Mono tone="muted">
              acts {action.inclusive ? "from" : "above"} {action.actAbove.toFixed(2)}
            </Mono>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 border-t border-border/50 pt-4">
          <input
            id={policyId}
            type="checkbox"
            checked={mandated}
            onChange={(e) => setMandated(e.target.checked)}
            className="mt-0.5 accent-foreground"
          />
          <label
            htmlFor={policyId}
            className="text-[13px] leading-relaxed text-muted-foreground"
          >
            {policyLabel}
          </label>
        </div>
      </Panel>

      <Panel className="p-5" tone={OUTCOME[outcome].tone}>
        <Label>What the system does</Label>

        {/* All four outcomes are rendered and stacked in one cell, so the swap
            is a CSS cross-fade on server-rendered siblings, not a remount. */}
        <div className="mt-3 grid" aria-live="polite">
          {(Object.keys(OUTCOME) as Outcome[]).map((o) => {
            const on = o === outcome;
            return (
              <div
                key={o}
                aria-hidden={!on}
                className={cn(
                  "col-start-1 row-start-1 min-w-0",
                  "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                  on
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0",
                )}
              >
                <p
                  className={cn(
                    "font-mono text-2xl tracking-tight",
                    TONE_TEXT[OUTCOME[o].tone],
                  )}
                >
                  {OUTCOME[o].title}
                </p>
                <p className="mt-3 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
                  {notes[o]}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-4 border-t border-border/50 pt-3 font-mono text-[10.5px] leading-relaxed text-muted-foreground/80">
          worst case if misread · {action.worstCase}
        </p>
      </Panel>

      {footnote && <Note>{footnote}</Note>}
    </div>
  );
}
