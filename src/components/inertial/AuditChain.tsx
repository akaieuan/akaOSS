"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  PenLine,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  ANCHORED_AT,
  ANCHORED_HEAD,
  CANONICAL_FORM,
  EDITABLE_INDEX,
  FORGED_PAYLOAD,
  GENESIS,
  PRISTINE_ENTRIES,
  PRISTINE_LINKS,
  TRUE_PAYLOAD,
  hashEntry,
  idx,
  verifyChain,
  type AuditEntry,
  type StoredLink,
} from "./fixtures";
import {
  Field,
  HashChip,
  Label,
  Mono,
  Panel,
  ScrollBox,
  btnGhost,
  btnPrimary,
} from "./ui";

type RowStatus = "verified" | "broken" | "unreachable";

const EVENT_ACCENT: Record<string, string> = {
  ingest: "text-[color:var(--accent-blue)]",
  signal: "text-[color:var(--accent-violet)]",
  routed: "text-[color:var(--accent-amber)]",
  decided: "text-[color:var(--accent-emerald)]",
};

export function AuditChain() {
  const [payload, setPayload] = useState(TRUE_PAYLOAD);
  const [links, setLinks] = useState<StoredLink[]>(PRISTINE_LINKS);

  const entries: AuditEntry[] = useMemo(
    () =>
      PRISTINE_ENTRIES.map((e) =>
        e.index === EDITABLE_INDEX ? { ...e, payload } : e,
      ),
    [payload],
  );

  const result = useMemo(() => verifyChain(entries, links), [entries, links]);

  const edited = payload !== TRUE_PAYLOAD;
  const repaired = links.some(
    (l, i) => l.hash !== PRISTINE_LINKS[i].hash || l.prev !== PRISTINE_LINKS[i].prev,
  );
  const touched = edited || repaired;

  /** Rewrite the broken entry's own hash so it commits to its new content —
   *  the "surely I can just fix this one" move. */
  function repair() {
    const i = result.brokenAt;
    if (i === null) return;
    setLinks((prev) => {
      const next = prev.map((l) => ({ ...l }));
      next[i].prev = i === 0 ? GENESIS : next[i - 1].hash;
      next[i].hash = hashEntry(entries[i], next[i].prev);
      return next;
    });
  }

  function reset() {
    setPayload(TRUE_PAYLOAD);
    setLinks(PRISTINE_LINKS);
  }

  function statusOf(i: number): RowStatus {
    if (result.brokenAt === null) return "verified";
    if (i < result.brokenAt) return "verified";
    if (i === result.brokenAt) return "broken";
    return "unreachable";
  }

  // ── The one line the reader is meant to watch ──
  let verdict: { tone: "ok" | "bad" | "warn"; head: string; body: string };
  if (result.brokenAt !== null) {
    verdict = {
      tone: "bad",
      head: `chain broken at #${idx(result.brokenAt)}`,
      body:
        result.reason === "content"
          ? "the recorded hash is not the hash of this entry's content"
          : `the recorded prevHash is not #${idx(result.brokenAt - 1)}.hash`,
    };
  } else if (!result.matchesAnchor) {
    verdict = {
      tone: "warn",
      head: "every link now holds — and the log is still detectably forged",
      body: `the head no longer equals the head witnessed at ${ANCHORED_AT}`,
    };
  } else {
    verdict = {
      tone: "ok",
      head: `chain verified · ${result.verified}/${entries.length} links`,
      body: "head matches the externally anchored head",
    };
  }

  const VerdictIcon = verdict.tone === "ok" ? ShieldCheck : ShieldAlert;
  const verdictTone =
    verdict.tone === "ok"
      ? "text-[color:var(--accent-emerald)] border-[color:var(--accent-emerald)]/40"
      : verdict.tone === "warn"
        ? "text-[color:var(--accent-amber)] border-[color:var(--accent-amber)]/40"
        : "text-[color:var(--accent-rose)] border-[color:var(--accent-rose)]/50";

  return (
    <div className="space-y-4">
      {/* ── Verification state ── */}
      <Panel className={cn("p-5", verdictTone)}>
        <div aria-live="polite">
          <div className="flex items-start gap-3">
            <VerdictIcon
              className={cn("mt-0.5 h-4 w-4 shrink-0", verdictTone)}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p
                className={cn(
                  "font-mono text-[12px] leading-relaxed",
                  verdictTone,
                )}
              >
                {verdict.head}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {verdict.body}
              </p>
            </div>
          </div>

          {result.brokenAt !== null && result.expected && (
            <div className="mt-4 space-y-1.5 border-t border-border/50 pt-4">
              <Field k="recorded">
                <HashChip
                  value={
                    result.reason === "content"
                      ? links[result.brokenAt].hash
                      : links[result.brokenAt].prev
                  }
                  tone="bad"
                />
              </Field>
              <Field k="expected">
                <HashChip value={result.expected} tone="ok" />
              </Field>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-4">
          <Field k="head">
            <HashChip
              value={result.head}
              tone={result.matchesAnchor ? "ok" : "bad"}
            />
          </Field>
          <Field k="anchor">
            <HashChip value={ANCHORED_HEAD} tone="muted" />
          </Field>
          <Mono tone={result.matchesAnchor ? "ok" : "bad"}>
            {result.matchesAnchor ? "head == anchor" : "head != anchor"}
          </Mono>
        </div>
      </Panel>

      {/* ── The log ── */}
      <ol className="space-y-0">
        {entries.map((entry, i) => {
          const link = links[i];
          const status = statusOf(i);
          const isEditable = i === EDITABLE_INDEX;
          const linkHolds = i === 0 || link.prev === links[i - 1].hash;

          return (
            <li key={entry.index}>
              {i > 0 && (
                <div className="flex h-6 items-center pl-6">
                  <span
                    className={cn(
                      "block h-full w-px",
                      status === "unreachable"
                        ? "bg-border/50"
                        : linkHolds
                          ? "bg-[color:var(--accent-emerald)]/50"
                          : "bg-[color:var(--accent-rose)]",
                    )}
                  />
                  <span className="ml-3 font-mono text-[10px] text-muted-foreground/70">
                    {linkHolds
                      ? `#${idx(i)}.prev == #${idx(i - 1)}.hash`
                      : `#${idx(i)}.prev != #${idx(i - 1)}.hash`}
                  </span>
                </div>
              )}

              <Panel
                className={cn(
                  "p-4",
                  status === "broken" &&
                    "border-[color:var(--accent-rose)]/60 bg-[color:var(--accent-rose)]/5",
                  status === "unreachable" && "opacity-60",
                )}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Mono tone="muted">#{idx(entry.index)}</Mono>
                  <Mono className={EVENT_ACCENT[entry.event]}>
                    {entry.event}
                  </Mono>
                  <Mono tone="muted" className="text-[10px]">
                    {entry.ts}
                  </Mono>
                  <span className="ml-auto shrink-0">
                    {status === "verified" && (
                      <Mono tone="ok" className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3" aria-hidden="true" />
                        verified
                      </Mono>
                    )}
                    {status === "broken" && (
                      <Mono tone="bad">
                        {result.reason === "content"
                          ? "content mismatch"
                          : "link mismatch"}
                      </Mono>
                    )}
                    {status === "unreachable" && (
                      <Mono tone="muted">unreachable</Mono>
                    )}
                  </span>
                </div>

                <div className="mt-1.5">
                  <Mono tone="muted" className="text-[10.5px]">
                    {entry.actor}
                  </Mono>
                </div>

                {isEditable ? (
                  <div className="mt-3">
                    <label
                      htmlFor="audit-payload"
                      className="label flex items-center gap-1.5"
                    >
                      <PenLine className="h-3 w-3" aria-hidden="true" />
                      payload · editable
                    </label>
                    <input
                      id="audit-payload"
                      type="text"
                      value={payload}
                      spellCheck={false}
                      autoComplete="off"
                      onChange={(e) => setPayload(e.target.value)}
                      aria-describedby="audit-payload-hint"
                      className={cn(
                        "mt-2 w-full rounded-lg border bg-background/60 px-3 py-2 font-mono text-[11px] text-foreground outline-none",
                        "focus-visible:ring-2 focus-visible:ring-ring",
                        edited
                          ? "border-[color:var(--accent-rose)]/50"
                          : "border-border",
                      )}
                    />
                    <p
                      id="audit-payload-hint"
                      className="mt-1.5 font-mono text-[10px] text-muted-foreground/80"
                    >
                      {edited
                        ? `edited · was "${TRUE_PAYLOAD}"`
                        : "unmodified — rewrite any character to forge the record"}
                    </p>
                  </div>
                ) : (
                  <ScrollBox className="mt-3" label={`Entry ${idx(i)} payload`}>
                    <p className="min-w-max font-mono text-[11px] text-foreground">
                      {entry.payload}
                    </p>
                  </ScrollBox>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <HashChip
                    prefix="prev"
                    value={link.prev}
                    tone={linkHolds ? "muted" : "bad"}
                  />
                  <ArrowRight
                    className="h-3 w-3 shrink-0 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                  <HashChip
                    prefix="hash"
                    value={link.hash}
                    tone={
                      status === "verified"
                        ? "ok"
                        : status === "broken"
                          ? "bad"
                          : "muted"
                    }
                  />
                </div>
              </Panel>
            </li>
          );
        })}
      </ol>

      {/* ── Controls ── */}
      <Panel className="p-5">
        <Label>Controls</Label>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPayload(FORGED_PAYLOAD)}
            disabled={payload === FORGED_PAYLOAD}
            className={cn(
              btnGhost,
              payload === FORGED_PAYLOAD && "opacity-50",
            )}
          >
            <PenLine className="h-3 w-3" aria-hidden="true" />
            Forge #{idx(EDITABLE_INDEX)}
          </button>

          <button
            type="button"
            onClick={repair}
            aria-disabled={result.brokenAt === null}
            aria-describedby="repair-note"
            className={cn(
              result.brokenAt === null ? btnGhost : btnPrimary,
              result.brokenAt === null && "opacity-50",
            )}
          >
            <Wrench className="h-3 w-3" aria-hidden="true" />
            {result.brokenAt === null
              ? "Recompute hash — nothing broken"
              : `Recompute hash for #${idx(result.brokenAt)}`}
          </button>

          <button
            type="button"
            onClick={reset}
            disabled={!touched}
            className={cn(btnGhost, !touched && "opacity-50")}
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset log
          </button>
        </div>

        <p
          id="repair-note"
          className="mt-4 max-w-prose text-[13px] leading-relaxed text-muted-foreground"
        >
          Recomputing makes the broken entry commit to its own new content. It
          fixes that index and breaks the next one, because the next entry
          already committed to the hash the forged entry used to have. Keep
          going and the break walks to the end of the log, where the head stops
          matching the value witnessed outside it.
        </p>

        <div className="mt-4 space-y-1 border-t border-border/50 pt-4">
          <Field k="digest">{CANONICAL_FORM}</Field>
          <Field k="anchored">{ANCHORED_AT}</Field>
          <Field k="computed">
            in your browser, on every keystroke — real SHA-256, not a stand-in
          </Field>
        </div>

        <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
          <p className="font-mono text-[10.5px] leading-relaxed text-[color:var(--accent-emerald)]">
            proves · the recorded history has not been altered since it was
            written
          </p>
          <p className="font-mono text-[10.5px] leading-relaxed text-muted-foreground">
            does not prove · that what was written was true at the time, that the
            reviewer read the evidence before deciding, or that the policy was
            reasonable. It turns a claim about the past into an artifact. It does
            not turn a judgment into a fact.
          </p>
        </div>
      </Panel>
    </div>
  );
}
