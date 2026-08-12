"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { ApproveRejectRow } from "@/components/hitl/ApproveRejectRow";
import type { ApprovalStatus } from "@/components/hitl/types";

import { CONTRAST_ITEM, fmtP, fmtSpan } from "./fixtures";
import { Field, Label, Mono, Panel, ScoreMeter } from "./ui";

const ITEM = CONTRAST_ITEM;
const [SPAN_START, SPAN_END] = ITEM.span;

/** The reviewed text with the flagged range marked in place, an annotation
 *  over the words, not a block of colour. */
function LocatedSpan() {
  return (
    <p className="text-sm leading-[1.9] text-foreground">
      {ITEM.text.slice(0, SPAN_START)}
      <mark
        className="rounded-sm border-b border-[color:var(--accent-amber)] bg-[color:var(--accent-amber)]/12 px-0.5 text-foreground [box-decoration-break:clone]"
        aria-label={`flagged span, characters ${SPAN_START} to ${SPAN_END}`}
      >
        {ITEM.text.slice(SPAN_START, SPAN_END)}
      </mark>
      {ITEM.text.slice(SPAN_END)}
    </p>
  );
}

/** Identical control on both sides, only the evidence differs. */
function Decision({
  state,
  onDecide,
}: {
  state: ApprovalStatus;
  onDecide: (s: ApprovalStatus) => void;
}) {
  return (
    <div className="mt-auto border-t border-border/50 pt-4">
      <Label className="mb-3">Decision</Label>
      <ApproveRejectRow
        state={state}
        accentClass="bg-[color:var(--accent-amber)]"
        onApprove={() => onDecide("approved")}
        onReject={() => onDecide("rejected")}
        onUndo={() => onDecide("pending")}
      />
    </div>
  );
}

export function VerificationContrast() {
  const [located, setLocated] = useState<ApprovalStatus>("pending");
  const [blind, setBlind] = useState<ApprovalStatus>("pending");

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <Label>Same item · same proposed action</Label>
          <Mono tone="muted">
            {ITEM.assetId} · remove_content · {ITEM.receivedAt}
          </Mono>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── Evidence located ── */}
        <Panel className="flex min-w-0 flex-col gap-5 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <Label className="text-[color:var(--accent-emerald)]">
              Evidence located
            </Label>
            <Mono tone="muted">span {fmtSpan(ITEM.span)}</Mono>
          </div>

          <div className="rounded-xl border border-border bg-background/50 px-4 py-3">
            <LocatedSpan />
          </div>

          <div className="space-y-1.5">
            <Field k="channel">{ITEM.signal.channel}</Field>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground/70">
                p
              </span>
              <ScoreMeter
                value={ITEM.signal.p}
                threshold={ITEM.signal.threshold}
                label={`${ITEM.signal.channel} probability, threshold ${fmtP(ITEM.signal.threshold)}`}
                tone="warn"
              />
              <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground/70">
                conf
              </span>
              <Mono tone="muted" className="tabular-nums">
                {fmtP(ITEM.signal.conf)}
              </Mono>
            </div>
            <Field k="emitted by">{ITEM.signal.skill}</Field>
          </div>

          <div className="border-t border-border/50 pt-4">
            <Label className="mb-3">Settled before you were asked</Label>
            <ul className="space-y-2">
              {ITEM.preChecks.map((c) => (
                <li key={c.label} className="flex items-start gap-2">
                  {c.ok ? (
                    <Check
                      className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--accent-emerald)]"
                      aria-hidden="true"
                    />
                  ) : (
                    <X
                      className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--accent-amber)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0 text-[13px] leading-relaxed text-muted-foreground">
                    {c.label}
                    <Mono tone="muted" className="ml-2 text-[10.5px]">
                      {c.detail}
                    </Mono>
                    <span className="sr-only">
                      {c.ok ? ", check passed" : ", check failed"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Decision state={located} onDecide={setLocated} />

          <p className="border-t border-border/50 pt-3 font-mono text-[10.5px] leading-relaxed text-muted-foreground/80">
            checkable · span resolves · quote matches asset · threshold cleared
            · confidence below floor
          </p>
        </Panel>

        {/* ── Verdict only ── */}
        <Panel className="flex min-w-0 flex-col gap-5 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <Label className="text-[color:var(--accent-rose)]">
              Verdict only
            </Label>
            <Mono tone="muted">span, </Mono>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-border bg-background/50 px-4 py-6">
            <span className="font-mono text-2xl tracking-tight text-[color:var(--accent-rose)]">
              {ITEM.verdict.label}
            </span>
            <span className="font-mono text-2xl tabular-nums tracking-tight text-foreground">
              {fmtP(ITEM.verdict.score)}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              confidence: {ITEM.verdict.band}
            </span>
          </div>

          <div className="space-y-1.5">
            <Field k="model">{ITEM.verdict.model}</Field>
            <Field k="channel">, </Field>
            <Field k="evidence">, </Field>
          </div>

          <div className="border-t border-border/50 pt-4">
            <Label className="mb-3">Settled before you were asked</Label>
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              nothing · the number is the entire basis for the decision
            </p>
          </div>

          <Decision state={blind} onDecide={setBlind} />

          <p className="border-t border-border/50 pt-3 font-mono text-[10.5px] leading-relaxed text-muted-foreground/80">
            checkable ·,
</p>
        </Panel>
      </div>
    </div>
  );
}
