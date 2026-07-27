"use client";

import { useState } from "react";
import { Lock, ArrowRight, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { ApproveRejectRow } from "@/components/hitl/ApproveRejectRow";
import { ContextChips } from "@/components/hitl/ContextChips";
import { MiniTrace, type TraceStep } from "@/components/hitl/MiniTrace";

import {
  GATE_ACTION,
  GATE_CONTEXT,
  GATE_ITEM,
  GATE_SIGNALS,
  fmtP,
  fmtSpan,
} from "./fixtures";
import {
  Field,
  Label,
  Mono,
  Panel,
  ScoreMeter,
  ScrollBox,
  btnBlocked,
  btnGhost,
  btnPrimary,
} from "./ui";

type Phase = "pending" | "approved" | "executed" | "rejected";

const PHASE_TONE: Record<Phase, string> = {
  pending: "text-[color:var(--accent-amber)] border-[color:var(--accent-amber)]/40",
  approved:
    "text-[color:var(--accent-emerald)] border-[color:var(--accent-emerald)]/40",
  executed:
    "text-[color:var(--accent-emerald)] border-[color:var(--accent-emerald)]/40",
  rejected: "text-[color:var(--accent-rose)] border-[color:var(--accent-rose)]/50",
};

/** Frozen so the server and the client render the same markup. */
const T = {
  ingest: "14:01:52Z",
  signal: "14:01:58Z",
  routed: "14:02:01Z",
  held: "14:02:01Z",
  decided: "14:02:06Z",
  executed: "14:02:06Z",
};

function traceFor(phase: Phase): TraceStep[] {
  const emitted = GATE_SIGNALS.filter((s) => s.emitted);
  const fired = GATE_SIGNALS.filter((s) => s.fired);
  const silent = GATE_SIGNALS.length - emitted.length;
  const steps: TraceStep[] = [
    {
      type: "result",
      label: `ingest — ${GATE_ITEM.assetId} received`,
      detail: `${T.ingest} · surface=${GATE_ITEM.surface} · reports=${GATE_ITEM.reports}`,
    },
    {
      type: "result",
      label: `signal — ${fired.length} of ${emitted.length} emitted channels above threshold, ${silent} not emitted`,
      detail: `${T.signal} · ${fired
        .map((s) => `${s.channel} p=${fmtP(s.p)} conf=${fmtP(s.conf)}`)
        .join(" · ")} — probabilities and evidence pointers only, no channel returns a verdict`,
    },
    {
      type: "thought",
      label: `routed — rule ${GATE_ACTION.rule} classifies ${GATE_ACTION.tool} as consequential.irreversible`,
      detail: `${T.routed} · ${GATE_ACTION.ruleText}`,
    },
    {
      type: "action",
      label: "gate.pending — control returned to a human",
      detail: `${T.held} · the call is constructed but held; the executor refuses any tool in this class without a gate.approved event naming it`,
    },
  ];

  if (phase === "approved" || phase === "executed") {
    steps.push({
      type: "action",
      label: "gate.approved — human:reviewer-2",
      detail: `${T.decided} · approval event appended to the audit log; this event is what the executor checks for`,
    });
  }
  if (phase === "executed") {
    steps.push({
      type: "result",
      label: `action.executed — ${GATE_ACTION.tool}(${GATE_ITEM.assetId})`,
      detail: `${T.executed} · executed 0s after approval, and not one second before it`,
    });
  }
  if (phase === "rejected") {
    steps.push({
      type: "action",
      label: "gate.rejected — human:reviewer-2",
      detail: `${T.decided} · rejection event appended to the audit log`,
    });
    steps.push({
      type: "result",
      label: `action.discarded — ${GATE_ACTION.tool} never executed`,
      detail:
        "the constructed call is dropped; the content stays up and the signals remain on the record",
    });
  }
  return steps;
}

function StateRail({ phase }: { phase: Phase }) {
  const flow: Phase[] =
    phase === "rejected"
      ? ["pending", "rejected"]
      : ["pending", "approved", "executed"];
  const current = flow.indexOf(phase);

  return (
    <ScrollBox label="Gate state machine">
      <ol className="flex min-w-max items-center gap-1.5">
        {flow.map((state, i) => (
          <li key={state} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="flex items-center gap-1">
                {i === 1 && state !== "rejected" && (
                  <Lock
                    className="h-3 w-3 text-[color:var(--accent-amber)]"
                    aria-hidden="true"
                  />
                )}
                <ArrowRight
                  className="h-3 w-3 text-muted-foreground/60"
                  aria-hidden="true"
                />
              </span>
            )}
            <span
              aria-current={phase === state ? "step" : undefined}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10.5px]",
                i <= current
                  ? PHASE_TONE[state]
                  : "border-dashed border-border/60 text-muted-foreground/50",
              )}
            >
              {state}
            </span>
          </li>
        ))}
      </ol>
    </ScrollBox>
  );
}

export function MandatedGate() {
  const [phase, setPhase] = useState<Phase>("pending");
  const [refusal, setRefusal] = useState<string | null>(null);

  const canExecute = phase === "approved";
  const isExecuted = phase === "executed";

  function attemptExecute() {
    if (canExecute) {
      setPhase("executed");
      setRefusal(null);
      return;
    }
    if (isExecuted) return;
    setRefusal(
      `refused · executor found no gate.approved event for ${GATE_ITEM.assetId} — ${GATE_ACTION.tool} is in class consequential.irreversible`,
    );
  }

  function reset() {
    setPhase("pending");
    setRefusal(null);
  }

  return (
    <div className="space-y-4">
      {/* ── The item, as the reviewer receives it ── */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <Label>Item under review</Label>
          <Mono tone="muted">{GATE_ITEM.receivedAt}</Mono>
        </div>

        <blockquote className="mt-4 rounded-xl border-l-2 border-[color:var(--accent-amber)] bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground">
          {GATE_ITEM.text}
        </blockquote>

        <div className="mt-4">
          <ContextChips items={GATE_CONTEXT} />
        </div>
      </Panel>

      {/* ── The signals: probability, confidence, emitting skill, evidence ── */}
      <Panel className="p-5">
        <Label>Channels</Label>
        <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
          Each sub-agent returns a probability, its own confidence, and a typed
          pointer into the text. None of them returns a decision.
        </p>

        <ScrollBox className="mt-4" label="Channel signals">
          <table className="min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/60">
                {["channel", "p", "conf", "span", "emitted by"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="py-1.5 pr-4 font-mono text-[10px] font-normal tracking-[0.14em] text-muted-foreground/70 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GATE_SIGNALS.map((s) => (
                <tr
                  key={s.channel}
                  className={cn(
                    "border-b border-border/30 last:border-0",
                    !s.fired && "opacity-60",
                  )}
                >
                  <th
                    scope="row"
                    className="py-2.5 pr-4 font-mono text-[11px] font-normal whitespace-nowrap text-foreground"
                  >
                    {s.channel}
                    {s.emitted && !s.fired && (
                      <span className="ml-2 text-[10px] text-muted-foreground">
                        below threshold
                      </span>
                    )}
                    {!s.emitted && (
                      <span className="ml-2 text-[10px] text-[color:var(--accent-amber)]">
                        not emitted
                      </span>
                    )}
                    {/* The same finding in the language of the job. The numbers
                        are what the policy acts on; this is what the reviewer
                        actually reads. */}
                    <span className="mt-1 block max-w-[22rem] font-sans text-[12px] leading-relaxed whitespace-normal text-muted-foreground">
                      {s.reads}
                    </span>
                  </th>
                  <td className="py-2.5 pr-4">
                    {s.emitted ? (
                      <ScoreMeter
                        value={s.p}
                        threshold={s.threshold}
                        label={`${s.channel} probability, threshold ${fmtP(s.threshold)}`}
                        tone={s.fired ? "warn" : "muted"}
                      />
                    ) : (
                      <Mono tone="muted">—</Mono>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Mono tone="muted" className="tabular-nums">
                      {s.emitted ? fmtP(s.conf) : "—"}
                    </Mono>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Mono tone="muted">{fmtSpan(s.span)}</Mono>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Mono tone="muted">{s.skill}</Mono>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollBox>

        <p className="mt-4 max-w-prose border-t border-border/50 pt-4 text-[13px] leading-relaxed text-muted-foreground">
          A skill with nothing to say omits its channel rather than reporting a
          low number. An omitted channel and a confident{" "}
          <span className="font-mono text-[12px] text-foreground">0.03</span> are
          different claims: one says no evidence was produced on that dimension,
          the other says evidence was produced and it points the other way. A
          policy that cannot tell them apart converts crashes into clean bills of
          health.
        </p>
      </Panel>

      {/* ── The action behind the gate ── */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <Label>Action held at the gate</Label>
          <Mono tone="warn">rule {GATE_ACTION.rule} · mandated</Mono>
        </div>

        {/* What the call does, before what it looks like. A reviewer should be
            able to approve or refuse without reading JSON. */}
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-foreground">
          {GATE_ACTION.plain}
        </p>

        <ScrollBox className="mt-3" label="Proposed tool call">
          <pre className="min-w-max rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-[11px] leading-relaxed text-foreground">
            {`${GATE_ACTION.tool}(${JSON.stringify(GATE_ACTION.args, null, 2)})`}
          </pre>
        </ScrollBox>

        <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-muted-foreground/80">
          {GATE_ACTION.ruleText}
        </p>

        <div className="mt-5 border-t border-border/50 pt-4">
          <Label className="mb-3">State</Label>
          <StateRail phase={phase} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
          <ApproveRejectRow
            state={phase === "executed" ? "approved" : phase}
            accentClass="bg-[color:var(--accent-amber)]"
            onApprove={() => {
              setPhase("approved");
              setRefusal(null);
            }}
            onReject={() => {
              setPhase("rejected");
              setRefusal(null);
            }}
            onUndo={phase === "executed" ? undefined : reset}
          />

          <button
            type="button"
            onClick={attemptExecute}
            aria-disabled={!canExecute && !isExecuted}
            aria-describedby="gate-invariant"
            className={cn(
              canExecute ? btnPrimary : btnBlocked,
              isExecuted && "pointer-events-none opacity-70",
            )}
          >
            <Trash2 className="h-3 w-3" aria-hidden="true" />
            {isExecuted
              ? "Removal executed"
              : canExecute
                ? "Execute removal"
                : "Execute removal — blocked"}
          </button>

          {(phase !== "pending" || refusal) && (
            <button type="button" onClick={reset} className={btnGhost}>
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>

        <p
          id="gate-invariant"
          className="mt-3 font-mono text-[10.5px] leading-relaxed text-muted-foreground/80"
        >
          invariant · no transition into{" "}
          <span className="text-foreground">executed</span> exists that does not
          pass through a recorded{" "}
          <span className="text-foreground">gate.approved</span> event
        </p>

        <div aria-live="polite" className="min-h-0">
          {refusal && (
            <p className="mt-3 rounded-lg border border-[color:var(--accent-rose)]/40 bg-[color:var(--accent-rose)]/5 px-3 py-2 font-mono text-[10.5px] leading-relaxed text-[color:var(--accent-rose)]">
              {refusal}
            </p>
          )}
        </div>
      </Panel>

      {/* ── The transitions, as they land in the log ── */}
      <Panel className="p-5">
        <Label>Transitions</Label>
        <div className="mt-4" aria-live="polite">
          <MiniTrace steps={traceFor(phase)} />
        </div>
        <div className="mt-4 space-y-1 border-t border-border/50 pt-4">
          <Field k="events">{traceFor(phase).length}</Field>
          <Field k="state">
            <span
              className={cn(
                phase === "rejected"
                  ? "text-[color:var(--accent-rose)]"
                  : phase === "pending"
                    ? "text-[color:var(--accent-amber)]"
                    : "text-[color:var(--accent-emerald)]",
              )}
            >
              {phase}
            </span>
          </Field>
        </div>
      </Panel>
    </div>
  );
}
