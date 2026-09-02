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
  ANCHORED_WITH,
  CANONICAL_FORM,
  DEFAULT_TARGET_INDEX,
  FORGERIES,
  GENESIS,
  PRISTINE_ENTRIES,
  PRISTINE_LINKS,
  buildChain,
  hashEntry,
  idx,
  readsFor,
  verifyChain,
  type AuditEntry,
  type StoredLink,
} from "./fixtures";
import {
  Brief,
  Field,
  HashChip,
  Label,
  Mono,
  Note,
  Panel,
  ScrollBox,
  Segmented,
  Steps,
  btnGhost,
  btnPrimary,
  type Step,
} from "./ui";

type RowStatus = "verified" | "broken" | "unreachable";

const EVENT_ACCENT: Record<string, string> = {
  ingest: "text-[color:var(--accent-blue)]",
  signal: "text-[color:var(--accent-violet)]",
  routed: "text-[color:var(--accent-amber)]",
  decided: "text-[color:var(--accent-emerald)]",
};

const PRISTINE_PAYLOADS = PRISTINE_ENTRIES.map((e) => e.payload);

export function AuditChain() {
  /** Which entry the reader is rewriting. One at a time, so the break always
   *  has exactly one place it could have come from. */
  const [target, setTarget] = useState(DEFAULT_TARGET_INDEX);
  const [payloads, setPayloads] = useState<string[]>(PRISTINE_PAYLOADS);
  const [links, setLinks] = useState<StoredLink[]>(PRISTINE_LINKS);
  const [repairs, setRepairs] = useState(0);

  const entries: AuditEntry[] = useMemo(
    () =>
      PRISTINE_ENTRIES.map((e, i) =>
        payloads[i] === e.payload ? e : { ...e, payload: payloads[i] },
      ),
    [payloads],
  );

  const result = useMemo(() => verifyChain(entries, links), [entries, links]);

  const edited = payloads.some((p, i) => p !== PRISTINE_PAYLOADS[i]);
  const touched = edited || repairs > 0;
  const forgery = FORGERIES[target];

  function setPayload(i: number, value: string) {
    setPayloads((prev) => prev.map((p, j) => (j === i ? value : p)));
  }

  /** Switching target starts over: two simultaneous forgeries would make the
   *  break ambiguous, and the whole point is that it is not. */
  function chooseTarget(next: number) {
    setTarget(next);
    setPayloads(PRISTINE_PAYLOADS);
    setLinks(PRISTINE_LINKS);
    setRepairs(0);
  }

  /** Rewrite the broken entry's own hash so it commits to its new content:
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
    setRepairs((n) => n + 1);
  }

  /** Carry the repair all the way down, which is where the argument lands. */
  function repairRest() {
    const from = result.brokenAt;
    if (from === null) return;
    setLinks(buildChain(entries));
    setRepairs((n) => n + (entries.length - from));
  }

  function reset() {
    setPayloads(PRISTINE_PAYLOADS);
    setLinks(PRISTINE_LINKS);
    setRepairs(0);
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
      head: "every link now holds, and the log is still detectably forged",
      body: `the head no longer equals the head witnessed at ${ANCHORED_AT}`,
    };
  } else {
    verdict = {
      tone: "ok",
      head: `chain verified · ${result.verified}/${entries.length} links`,
      body: "head matches the externally anchored head",
    };
  }

  /** The reader's own trail, in the order they made it. */
  const trail = !touched
    ? "untouched · this is the log as it was written"
    : [
        edited ? `you rewrote #${idx(target)}` : "no entry rewritten",
        repairs > 0
          ? `${repairs} hash${repairs === 1 ? "" : "es"} recomputed`
          : null,
        result.brokenAt !== null
          ? `verification stops at #${idx(result.brokenAt)}`
          : "every link holds",
      ]
        .filter(Boolean)
        .join(" · ");

  const steps: Step[] = [
    {
      title: "Rewrite an entry, type into it, or take the forgery someone would actually write.",
      body: "Verification stops at the index you touched, and names it.",
      state: edited ? "done" : "now",
    },
    {
      title: "Recompute that entry's own hash so it commits to what it now says.",
      body: "The break does not go away. It moves to the next entry, which committed to the hash you just replaced.",
      state: repairs > 0 ? "done" : edited ? "now" : "todo",
    },
    {
      title: "Carry the repair to the end of the log.",
      body: "Every link holds again, and the head stops matching the value witnessed outside the log.",
      state:
        result.brokenAt === null && !result.matchesAnchor
          ? "done"
          : repairs > 0
            ? "now"
            : "todo",
    },
  ];

  const VerdictIcon = verdict.tone === "ok" ? ShieldCheck : ShieldAlert;
  const verdictTone =
    verdict.tone === "ok"
      ? "text-[color:var(--accent-emerald)] border-[color:var(--accent-emerald)]/40"
      : verdict.tone === "warn"
        ? "text-[color:var(--accent-amber)] border-[color:var(--accent-amber)]/40"
        : "text-[color:var(--accent-rose)] border-[color:var(--accent-rose)]/50";

  return (
    <div className="space-y-4">
      <Brief
        role="auditor · six weeks later"
        stakes={[
          {
            side: "If the log can be rewritten",
            tone: "bad",
            text: "Every other guarantee in the system is a claim about the past with nothing holding it up, including the approval this removal rests on.",
          },
          {
            side: "If it cannot",
            tone: "warn",
            text: "You know what was recorded and that nobody has touched it since. You still do not know that what was recorded was true.",
          },
        ]}
        close="Tamper-evidence is a narrow promise, and the narrowness is the point: it turns a claim about the past into an artifact somebody can check."
      >
        The comment came down, and its author has complained that no human ever
        looked at it. All you have is the log the system wrote at the time. You
        are not deciding whether the removal was right. You are deciding
        whether this is the record that was written, or a record written since.
      </Brief>

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

          <Note className="mt-3">{trail}</Note>

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
        <Note className="mt-2">
          the anchor is a copy of the head kept where this system cannot reach it
          · {ANCHORED_WITH}
        </Note>
      </Panel>

      {/* ── What to do, in order ── */}
      <Panel className="p-5">
        <Steps steps={steps} />
      </Panel>

      {/* ── Which entry to rewrite ── */}
      <Panel className="p-5">
        <Segmented
          legend="Entry to rewrite"
          name="audit-target"
          value={String(target)}
          options={PRISTINE_ENTRIES.map((e) => ({
            value: String(e.index),
            label: `#${idx(e.index)} ${e.event}`,
          }))}
          onChange={(v) => chooseTarget(Number(v))}
        />

        <p className="mt-3 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
          Every entry in a review log is worth something to somebody. What
          rewriting <span className="font-mono text-[12px] text-foreground">#{idx(target)}</span>{" "}
          would buy: {forgery.motive}
        </p>

        <Note className="mt-2">
          one forgery at a time · choosing a different entry restores the log
          first, so the break has exactly one place it could have come from
        </Note>
      </Panel>

      {/* ── The log ── */}
      <ol className="space-y-0">
        {entries.map((entry, i) => {
          const link = links[i];
          const status = statusOf(i);
          const isTarget = i === target;
          const linkHolds = i === 0 || link.prev === links[i - 1].hash;
          const gloss = readsFor(i, entry.payload);
          const changed = entry.payload !== PRISTINE_PAYLOADS[i];

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

                {isTarget ? (
                  <div className="mt-3">
                    <label
                      htmlFor={`audit-payload-${i}`}
                      className="label flex items-center gap-1.5"
                    >
                      <PenLine className="h-3 w-3" aria-hidden="true" />
                      payload · editable
                    </label>
                    <input
                      id={`audit-payload-${i}`}
                      type="text"
                      value={entry.payload}
                      spellCheck={false}
                      autoComplete="off"
                      onChange={(e) => setPayload(i, e.target.value)}
                      aria-describedby={`audit-payload-hint-${i}`}
                      className={cn(
                        "mt-2 w-full rounded-lg border bg-background/60 px-3 py-2 font-mono text-[11px] text-foreground outline-none",
                        "focus-visible:ring-2 focus-visible:ring-ring",
                        changed
                          ? "border-[color:var(--accent-rose)]/50"
                          : "border-border",
                      )}
                    />
                    <p
                      id={`audit-payload-hint-${i}`}
                      className="mt-1.5 font-mono text-[10px] text-muted-foreground/80"
                    >
                      {changed
                        ? `edited · was "${PRISTINE_PAYLOADS[i]}"`
                        : "unmodified, rewrite any character to forge the record"}
                    </p>

                    {forgery && entry.payload !== forgery.payload && (
                      <button
                        type="button"
                        onClick={() => setPayload(i, forgery.payload)}
                        className={cn(btnGhost, "mt-2.5")}
                      >
                        <PenLine className="h-3 w-3" aria-hidden="true" />
                        Use the forgery someone would actually write
                      </button>
                    )}
                  </div>
                ) : (
                  <ScrollBox className="mt-3" label={`Entry ${idx(i)} payload`}>
                    <p className="min-w-max font-mono text-[11px] text-foreground">
                      {entry.payload}
                    </p>
                  </ScrollBox>
                )}

                {/* The entry in words. A log that speaks only in key=value
                    pairs is auditable by whoever already knows the schema. */}
                <p className="mt-2 max-w-prose text-[12.5px] leading-relaxed text-muted-foreground">
                  <span className="text-muted-foreground/70">reads · </span>
                  {gloss ??
                    "rewritten by hand. The record now says whatever you typed into it."}
                </p>

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
              ? "Recompute hash. Nothing broken"
              : `Recompute hash for #${idx(result.brokenAt)}`}
          </button>

          <button
            type="button"
            onClick={repairRest}
            aria-disabled={result.brokenAt === null || repairs === 0}
            aria-describedby="repair-note"
            className={cn(
              btnGhost,
              (result.brokenAt === null || repairs === 0) && "opacity-50",
            )}
          >
            <Wrench className="h-3 w-3" aria-hidden="true" />
            {repairs === 0
              ? "Recompute the rest, do one by hand first"
              : `Recompute the remaining ${entries.length - (result.brokenAt ?? entries.length)}`}
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
            in your browser, on every keystroke, real SHA-256, not a stand-in
          </Field>
        </div>

        <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
          <Note tone="ok">
            proves · the recorded history has not been altered since it was
            written
          </Note>
          <Note>
            does not prove · that what was written was true at the time, that the
            reviewer read the evidence before deciding, or that the policy was
            reasonable. It turns a claim about the past into an artifact. It does
            not turn a judgment into a fact.
          </Note>
        </div>
      </Panel>
    </div>
  );
}
