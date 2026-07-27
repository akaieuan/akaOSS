"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Lock,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { ContextChips } from "@/components/hitl/ContextChips";
import { MiniTrace, type TraceStep } from "@/components/hitl/MiniTrace";

import {
  CONFIDENCE_SETTINGS,
  GATE_ACTION,
  GATE_CONTEXT,
  GATE_ITEM,
  GATE_OUTCOMES,
  GATE_ROUTING,
  GATE_SIGNALS,
  fmtP,
  fmtSpan,
  type ConfidenceMode,
  type GateDecision,
} from "./fixtures";
import {
  Brief,
  Field,
  Label,
  Mono,
  Note,
  Panel,
  ScoreMeter,
  ScrollBox,
  Segmented,
  Steps,
  btnBlocked,
  btnGhost,
  btnPrimary,
  type Step,
} from "./ui";

type Phase = "pending" | "approved" | "executed" | "denied" | "escalated";

const PHASE_TONE: Record<Phase, string> = {
  pending: "text-[color:var(--accent-amber)] border-[color:var(--accent-amber)]/40",
  approved:
    "text-[color:var(--accent-emerald)] border-[color:var(--accent-emerald)]/40",
  executed:
    "text-[color:var(--accent-emerald)] border-[color:var(--accent-emerald)]/40",
  denied: "text-[color:var(--accent-rose)] border-[color:var(--accent-rose)]/50",
  escalated:
    "text-[color:var(--accent-amber)] border-[color:var(--accent-amber)]/40",
};

/**
 * A frozen clock. The run's own events are literals so the server and the
 * client render identical markup; events the reader causes are stamped from
 * the moment the gate closed, so the log reads as one continuous record rather
 * than as fixture data with today's date bolted on the end.
 */
const T = {
  ingest: "14:01:52Z",
  signal: "14:01:58Z",
  routed: "14:02:01Z",
  held: "14:02:01Z",
};
const GATE_CLOSED_AT = 14 * 3600 + 2 * 60 + 1;

function stamp(n: number): string {
  const t = GATE_CLOSED_AT + 4 + n * 3;
  const p = (x: number) => String(x).padStart(2, "0");
  return `${p(Math.floor(t / 3600))}:${p(Math.floor((t % 3600) / 60))}:${p(t % 60)}Z`;
}

/** The four events the run wrote before any human touched it. */
function baseTrace(): TraceStep[] {
  const emitted = GATE_SIGNALS.filter((s) => s.emitted);
  const fired = GATE_SIGNALS.filter((s) => s.fired);
  const silent = GATE_SIGNALS.length - emitted.length;

  return [
    {
      type: "result",
      label: `ingest — ${GATE_ITEM.assetId} received`,
      detail: `${T.ingest} · surface=${GATE_ITEM.surface} · reports=${GATE_ITEM.reports}`,
    },
    {
      type: "result",
      label: `signal — ${fired.length} of ${emitted.length} emitted channels above threshold, ${silent} not emitted`,
      detail: `${T.signal} · ${fired
        .map((s) => `${s.channel} p=${fmtP(s.p)}`)
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
}

function StateRail({ phase }: { phase: Phase }) {
  const flow: Phase[] =
    phase === "denied"
      ? ["pending", "denied"]
      : phase === "escalated"
        ? ["pending", "escalated"]
        : ["pending", "approved", "executed"];
  const current = flow.indexOf(phase);

  return (
    <ScrollBox label="Gate state machine">
      <ol className="flex min-w-max items-center gap-1.5">
        {flow.map((state, i) => (
          <li key={state} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="flex items-center gap-1">
                {state === "executed" && (
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

/** One of the three ways out of the gate. Identical weight, on purpose. */
function DecisionButton({
  tone,
  icon: Icon,
  onClick,
  children,
}: {
  tone: "ok" | "bad" | "warn";
  icon: typeof Check;
  onClick: () => void;
  children: string;
}) {
  const toneClass =
    tone === "ok"
      ? "bg-[color:var(--accent-emerald)]/10 text-[color:var(--accent-emerald)] hover:bg-[color:var(--accent-emerald)]/20"
      : tone === "bad"
        ? "bg-[color:var(--accent-rose)]/10 text-[color:var(--accent-rose)] hover:bg-[color:var(--accent-rose)]/20"
        : "bg-[color:var(--accent-amber)]/10 text-[color:var(--accent-amber)] hover:bg-[color:var(--accent-amber)]/20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        toneClass,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {children}
    </button>
  );
}

export function MandatedGate() {
  const [phase, setPhase] = useState<Phase>("pending");
  const [events, setEvents] = useState<TraceStep[]>([]);
  const [refusals, setRefusals] = useState(0);
  const [confMode, setConfMode] = useState<ConfidenceMode>("emitted");

  const setting =
    CONFIDENCE_SETTINGS.find((s) => s.id === confMode) ?? CONFIDENCE_SETTINGS[1];

  const decided = phase !== "pending";
  const canExecute = phase === "approved";
  const isExecuted = phase === "executed";
  const trace = [...baseTrace(), ...events];

  function append(make: (n: number) => TraceStep) {
    setEvents((prev) => [...prev, make(prev.length)]);
  }

  /** The demonstration: pull the trigger before there is anything to authorise
   *  it, and watch the executor go looking for an event that is not there. */
  function attemptExecute() {
    if (isExecuted) return;

    if (canExecute) {
      setPhase("executed");
      append((n) => ({
        type: "result",
        label: `action.executed — ${GATE_ACTION.tool}(${GATE_ITEM.assetId})`,
        detail: `${stamp(n)} · executed after the approval event was found, and not one second before it`,
      }));
      return;
    }

    const attempt = refusals + 1;
    setRefusals(attempt);
    append((n) => ({
      type: "action",
      label: `action.refused — no gate.approved event for ${GATE_ITEM.assetId}`,
      detail: `${stamp(n)} · attempt ${attempt} · the refusal is itself appended; a blocked call leaves a mark rather than nothing`,
    }));
  }

  function decide(d: GateDecision) {
    const outcome = GATE_OUTCOMES[d];
    setPhase(d === "approved" ? "approved" : d);
    append((n) => ({
      type: "action",
      label: `${outcome.event} — ${outcome.actor}`,
      detail: `${stamp(n)} · ${outcome.plain}`,
    }));
    if (d === "denied") {
      append((n) => ({
        type: "result",
        label: `action.discarded — ${GATE_ACTION.tool} never executed`,
        detail: `${stamp(n)} · the constructed call is dropped; the content stays up and the signals remain on the record`,
      }));
    }
  }

  function reset() {
    setPhase("pending");
    setEvents([]);
    setRefusals(0);
  }

  const steps: Step[] = [
    {
      title: "Try the removal now, before you decide anything.",
      body: "The executor will tell you what it went looking for and did not find.",
      state: refusals > 0 ? "done" : "now",
    },
    {
      title: "Then decide: approve, deny, or send it up.",
      body: "Three different terminal states, and only one of them ends with content gone.",
      state: decided ? "done" : refusals > 0 ? "now" : "todo",
    },
    {
      title: "If you approved, run it again.",
      body: "The same button, the same call. The only thing that changed is that an event now exists naming it.",
      state: isExecuted ? "done" : canExecute ? "now" : "todo",
    },
  ];

  const outcome =
    phase === "approved" || phase === "executed"
      ? GATE_OUTCOMES.approved
      : phase === "denied"
        ? GATE_OUTCOMES.denied
        : phase === "escalated"
          ? GATE_OUTCOMES.escalated
          : null;

  const refusalLine =
    refusals > 0 && !canExecute && !isExecuted
      ? `refused · executor looked for a gate.approved event naming ${GATE_ACTION.tool}(${GATE_ITEM.assetId}) and found none · class consequential.irreversible · ${refusals} attempt${refusals === 1 ? "" : "s"} recorded`
      : null;

  return (
    <div className="space-y-4">
      <Brief
        role="reviewer 2 · trust & safety queue"
        stakes={[
          {
            side: "Leave it up",
            tone: "warn",
            text: "It stays under the post, addressed by name to the person it is aimed at, until someone else reaches it.",
          },
          {
            side: "Take it down",
            tone: "bad",
            text: "Someone's words are gone and its author is told why. Appeals against removals like this are rarely granted.",
          },
        ]}
        close="Neither direction is safe, which is exactly why a person is standing here — and why the machine is allowed to construct this call but not to run it."
      >
        Three people have reported the comment below. It is one of about ninety
        in your queue this hour, and the only question in front of you is
        whether it comes down.
      </Brief>

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
              {GATE_SIGNALS.map((s) => {
                const conf = setting.conf[s.channel] ?? s.conf;
                return (
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
                        {s.emitted ? fmtP(conf) : "—"}
                      </Mono>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Mono tone="muted">{fmtSpan(s.span)}</Mono>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Mono tone="muted">{s.skill}</Mono>
                    </td>
                  </tr>
                );
              })}
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

        {/* ── The confidence dial, which is not connected to anything ── */}
        <div className="mt-5 border-t border-border/50 pt-4">
          <Segmented
            legend="Counterfactual · how sure the skills came back"
            name="gate-confidence"
            value={confMode}
            options={CONFIDENCE_SETTINGS.map((s) => ({
              value: s.id,
              label: s.label,
            }))}
            onChange={setConfMode}
          />
          <p
            role="status"
            aria-live="polite"
            className="mt-3 max-w-prose text-[13px] leading-relaxed text-muted-foreground"
          >
            {setting.reads}{" "}
            <span className="text-foreground">
              Routing: {GATE_ROUTING} — unchanged.
            </span>
          </p>
          <Note className="mt-2">
            the dial moves conf only · every probability is what it was · R-07
            reads the class of the action, so no setting of this control removes
            the human
          </Note>
        </div>
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

        <Note className="mt-3">{GATE_ACTION.ruleText}</Note>

        <div className="mt-5 border-t border-border/50 pt-4">
          <Steps steps={steps} />
        </div>

        <div className="mt-5 border-t border-border/50 pt-4">
          <Label className="mb-3">State</Label>
          <StateRail phase={phase} />
        </div>

        {/* ── 1 · the executor ── */}
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
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

          {!decided && refusals === 0 && (
            <Mono tone="warn">← start here, before deciding</Mono>
          )}

          {(decided || refusals > 0) && (
            <button type="button" onClick={reset} className={btnGhost}>
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Reset gate
            </button>
          )}
        </div>

        {/* ── 2 · the human ── */}
        <div className="mt-4 border-t border-border/50 pt-4">
          <Label className="mb-3">Decision · reviewer 2</Label>
          {decided ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Mono
                tone={
                  phase === "denied"
                    ? "bad"
                    : phase === "escalated"
                      ? "warn"
                      : "ok"
                }
              >
                {phase === "escalated"
                  ? "escalated"
                  : phase === "denied"
                    ? "denied"
                    : "approved"}
              </Mono>
              <Mono tone="muted">recorded · human:reviewer-2</Mono>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <DecisionButton
                tone="ok"
                icon={Check}
                onClick={() => decide("approved")}
              >
                Approve removal
              </DecisionButton>
              <DecisionButton
                tone="bad"
                icon={X}
                onClick={() => decide("denied")}
              >
                Deny — leave it up
              </DecisionButton>
              <DecisionButton
                tone="warn"
                icon={ArrowUpRight}
                onClick={() => decide("escalated")}
              >
                Escalate — policy is unclear
              </DecisionButton>
            </div>
          )}
        </div>

        <Note id="gate-invariant" className="mt-4">
          invariant · no transition into{" "}
          <span className="text-foreground">executed</span> exists that does not
          pass through a recorded{" "}
          <span className="text-foreground">gate.approved</span> event
        </Note>

        {/* Everything the reader's last action caused, announced once. */}
        <div aria-live="polite" className="space-y-3">
          {refusalLine && (
            <p className="mt-3 rounded-lg border border-[color:var(--accent-rose)]/40 bg-[color:var(--accent-rose)]/5 px-3 py-2 font-mono text-[10.5px] leading-relaxed text-[color:var(--accent-rose)]">
              {refusalLine}
            </p>
          )}

          {outcome && (
            <div className="mt-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3">
              <p className="max-w-prose text-[13px] leading-relaxed text-foreground">
                {isExecuted
                  ? "The comment is gone. Its author has been told it came down for targeted harassment."
                  : outcome.plain}
              </p>
              <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
                {isExecuted
                  ? "What remains is the record: the signals, the rule that held the call, your name, and the seconds between the two."
                  : outcome.consequence}
              </p>
            </div>
          )}
        </div>
      </Panel>

      {/* ── The transitions, as they land in the log ── */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <Label>Append-only log</Label>
          <Mono tone="muted">{trace.length} events</Mono>
        </div>
        <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
          Every transition lands here, including the ones that failed. A refused
          execution is not a non-event — it is a record that something tried.
        </p>

        <div className="mt-4">
          <MiniTrace steps={trace} />
        </div>

        <div className="mt-4 space-y-1 border-t border-border/50 pt-4">
          <div role="status" aria-live="polite" className="min-w-0">
            <Field k="last">{trace[trace.length - 1].label}</Field>
          </div>
          <Field k="state">
            <span
              className={cn(
                phase === "denied"
                  ? "text-[color:var(--accent-rose)]"
                  : phase === "pending" || phase === "escalated"
                    ? "text-[color:var(--accent-amber)]"
                    : "text-[color:var(--accent-emerald)]",
              )}
            >
              {phase}
            </span>
          </Field>
          <Field k="refused attempts">{refusals}</Field>
        </div>
      </Panel>
    </div>
  );
}
