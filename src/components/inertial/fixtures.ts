/**
 * Local fixture data for the /inertial exhibits.
 *
 * Deliberately self-contained: nothing here imports from the inertial
 * application itself. The exhibits demonstrate the *pattern* — signals rather
 * than verdicts, a gated action, a hash-chained log — using this site's own
 * HITL Kit primitives and this file's data.
 *
 * Every timestamp is a frozen literal and every hash is derived, so the server
 * and the client render identical markup.
 */

import { sha256Hex } from "./sha256";

// ─── Shared vocabulary ───────────────────────────────────────────────────────

/** A sub-agent emits a signal, never a verdict: probability + confidence +
 *  a pointer to the evidence that produced it. */
export interface Signal {
  channel: string;
  /**
   * Whether the skill emitted anything at all. A skill with nothing to say
   * omits its channel rather than reporting a low number — absence means the
   * run produced no evidence on that dimension, which is a different claim
   * from evidence of innocence.
   */
  emitted: boolean;
  /** Calibrated probability the channel applies, 0–1. */
  p: number;
  /** How much the emitting skill trusts its own probability, 0–1. */
  conf: number;
  /** Emitting skill, pinned to a version. */
  skill: string;
  /** Typed evidence pointer — here, a half-open character range. */
  span: [number, number] | null;
  /** Whether the channel cleared its routing threshold. */
  fired: boolean;
  threshold: number;
  /**
   * The same finding in a sentence. The numbers are what the policy acts on,
   * but a reviewer decides faster when the claim is stated in the language of
   * the job rather than left as a channel id and a decimal.
   */
  reads: string;
}

/** Render a span the way the log prints it. */
export function fmtSpan(span: [number, number] | null): string {
  return span ? `${span[0]}..${span[1]}` : "—";
}

/** Probabilities are always shown to two decimals — never rounded away to a
 *  percentage, never replaced by a bare adjective. */
export function fmtP(n: number): string {
  return n.toFixed(2);
}

/** Two-digit index, the way the log prints it. */
export function idx(n: number): string {
  return String(n).padStart(2, "0");
}

// ─── Exhibit 1 · the mandated gate ──────────────────────────────────────────

const GATE_TEXT =
  "keep replying to me and I'll find out where you work and make sure everyone there sees this.";

export const GATE_ITEM = {
  assetId: "ast_9f2c41",
  surface: "comments",
  author: "usr_4471",
  reports: 3,
  receivedAt: "2026-07-24T14:01:52Z",
  text: GATE_TEXT,
} as const;

export const GATE_SIGNALS: Signal[] = [
  {
    channel: "harassment.targeted",
    emitted: true,
    p: 0.94,
    conf: 0.88,
    skill: "skill:safety-classifier@2.3.0",
    span: [0, GATE_TEXT.length],
    fired: true,
    threshold: 0.8,
    reads:
      "Aimed at one specific person rather than rude in general — the whole comment is addressed to them.",
  },
  {
    channel: "threat.implied",
    emitted: true,
    p: 0.71,
    conf: 0.62,
    skill: "skill:threat-heuristics@0.9.4",
    span: [29, 52],
    fired: true,
    threshold: 0.6,
    reads:
      "Treats \u201cfind out where you work\u201d as a threat to the person\u2019s job, not a figure of speech.",
  },
  {
    channel: "spam.bulk",
    emitted: true,
    p: 0.03,
    conf: 0.91,
    skill: "skill:spam-detector@1.7.2",
    span: null,
    fired: false,
    threshold: 0.5,
    reads:
      "Checked for bulk or repeated posting and found none. A real answer, just a negative one.",
  },
  {
    // Emitted nothing. Not the same as emitting a low number: the run produced
    // no evidence on this dimension, and the policy must not read that as a
    // clean bill of health.
    channel: "impersonation",
    emitted: false,
    p: 0,
    conf: 0,
    skill: "skill:identity-matcher@0.4.1",
    span: null,
    fired: false,
    threshold: 0.5,
    reads:
      "Never reached a conclusion. That is not the same as clearing the account \u2014 nobody has checked.",
  },
];

export const GATE_ACTION = {
  tool: "remove_content",
  args: {
    asset: GATE_ITEM.assetId,
    scope: "comment",
    reason: "harassment.targeted",
    notify_author: true,
  },
  /** What the tool call means, said the way a moderator would say it. */
  plain:
    "Delete this comment and tell its author it came down for targeted harassment.",
  rule: "R-07",
  ruleText:
    "Any action in class consequential.irreversible requires a recorded human approval before it executes. The agent's confidence is not an input.",
} as const;

/** Context attached to the run, rendered with the HITL Kit ContextChips. */
export const GATE_CONTEXT = [
  {
    id: "ctx-asset",
    label: `asset ${GATE_ITEM.assetId}`,
    color: "bg-[color:var(--accent-blue)]",
  },
  {
    id: "ctx-surface",
    label: `surface ${GATE_ITEM.surface}`,
    color: "bg-[color:var(--accent-violet)]",
  },
  {
    id: "ctx-reports",
    label: `${GATE_ITEM.reports} user reports`,
    color: "bg-[color:var(--accent-amber)]",
  },
  {
    id: "ctx-policy",
    label: "policy R-07 · mandated",
    color: "bg-[color:var(--accent-rose)]",
  },
];

// ─── Exhibit 2 · the audit chain ────────────────────────────────────────────

export type AuditEvent = "ingest" | "signal" | "routed" | "decided";

export interface AuditEntry {
  index: number;
  ts: string;
  event: AuditEvent;
  actor: string;
  payload: string;
}

/** prevHash of the genesis entry. */
export const GENESIS = "0".repeat(64);

/** Field separator for the canonical form: the ASCII unit separator, which
 *  cannot occur in any displayed field, so two different entries can never
 *  serialize to the same string. */
const SEP = "\u001f";

/** Human-readable rendering of the canonical form, for the exhibit caption. */
export const CANONICAL_FORM =
  "sha256( index ⎹ ts ⎹ event ⎹ actor ⎹ payload ⎹ prevHash )";

export function canonicalize(entry: AuditEntry, prevHash: string): string {
  return [
    String(entry.index),
    entry.ts,
    entry.event,
    entry.actor,
    entry.payload,
    prevHash,
  ].join(SEP);
}

export function hashEntry(entry: AuditEntry, prevHash: string): string {
  return sha256Hex(canonicalize(entry, prevHash));
}

/** The log as it was actually written, before anyone touched it. */
export const PRISTINE_ENTRIES: AuditEntry[] = [
  {
    index: 0,
    ts: "2026-07-24T14:01:52Z",
    event: "ingest",
    actor: "pipeline:ingest@1.4.2",
    payload: "asset=ast_9f2c41 surface=comments reports=3",
  },
  {
    index: 1,
    ts: "2026-07-24T14:01:54Z",
    event: "signal",
    actor: "skill:safety-classifier@2.3.0",
    payload: "channel=harassment.targeted p=0.94 conf=0.88 span=0..92",
  },
  {
    index: 2,
    ts: "2026-07-24T14:01:58Z",
    event: "signal",
    actor: "skill:threat-heuristics@0.9.4",
    payload: "channel=threat.implied p=0.71 conf=0.62 span=29..52",
  },
  {
    index: 3,
    ts: "2026-07-24T14:02:01Z",
    event: "routed",
    actor: "policy:review-router@4.1",
    payload: "rule=R-07 gate=mandated action=remove_content",
  },
  {
    index: 4,
    ts: "2026-07-24T14:02:06Z",
    event: "decided",
    actor: "human:reviewer-2",
    payload: "decision=approved action=remove_content latency_s=41",
  },
];

/** The entry the exhibit lets the reader rewrite — one in the middle. */
export const EDITABLE_INDEX = 2;

export const TRUE_PAYLOAD = PRISTINE_ENTRIES[EDITABLE_INDEX].payload;

/** A forgery someone would plausibly want: make the record say the second
 *  channel never cleared its threshold, so the escalation looks unwarranted. */
export const FORGED_PAYLOAD =
  "channel=threat.implied p=0.06 conf=0.62 span=29..52";

export interface StoredLink {
  /** The prevHash as it appears in the stored record. */
  prev: string;
  /** The hash as it appears in the stored record. */
  hash: string;
}

/** Recompute a whole chain from entries — what an honest writer produces. */
export function buildChain(entries: AuditEntry[]): StoredLink[] {
  const out: StoredLink[] = [];
  let prev = GENESIS;
  for (const entry of entries) {
    const hash = hashEntry(entry, prev);
    out.push({ prev, hash });
    prev = hash;
  }
  return out;
}

/** The stored links of the untampered log. */
export const PRISTINE_LINKS: StoredLink[] = buildChain(PRISTINE_ENTRIES);

/** The head hash as witnessed externally when the log was sealed. Repairing
 *  every entry restores internal consistency but cannot reproduce this value. */
export const ANCHORED_HEAD = PRISTINE_LINKS[PRISTINE_LINKS.length - 1].hash;
export const ANCHORED_AT = "2026-07-24T14:02:07Z";

export type BreakReason = "link" | "content";

export interface Verification {
  /** First index that fails verification, or null when the chain holds. */
  brokenAt: number | null;
  reason: BreakReason | null;
  /** What the record should have said at the broken index. */
  expected: string | null;
  /** How many entries verified before the walk stopped. */
  verified: number;
  /** Stored head hash. */
  head: string;
  /** Every link holds AND the head still matches the external anchor. */
  matchesAnchor: boolean;
}

/**
 * Walk the chain from genesis and stop at the first failure.
 *
 * Two things can fail, and the exhibit depends on telling them apart:
 *   link    — the stored prevHash is not the previous entry's hash
 *   content — the stored hash is not the hash of this entry's own content
 */
export function verifyChain(
  entries: AuditEntry[],
  links: StoredLink[],
): Verification {
  const head = links[links.length - 1].hash;
  for (let i = 0; i < entries.length; i++) {
    const expectedPrev = i === 0 ? GENESIS : links[i - 1].hash;
    if (links[i].prev !== expectedPrev) {
      return {
        brokenAt: i,
        reason: "link",
        expected: expectedPrev,
        verified: i,
        head,
        matchesAnchor: false,
      };
    }
    const recomputed = hashEntry(entries[i], links[i].prev);
    if (recomputed !== links[i].hash) {
      return {
        brokenAt: i,
        reason: "content",
        expected: recomputed,
        verified: i,
        head,
        matchesAnchor: false,
      };
    }
  }
  return {
    brokenAt: null,
    reason: null,
    expected: null,
    verified: entries.length,
    head,
    matchesAnchor: head === ANCHORED_HEAD,
  };
}

// ─── Exhibit 3 · verification before judgment ───────────────────────────────

const REVIEWED_TEXT =
  "congrats on the promotion — genuinely thrilled for you. next time you're in town I'm going to take you out and we are absolutely not splitting the bill.";

const FLAGGED_PHRASE = "I'm going to take you out";
const SPAN_START = REVIEWED_TEXT.indexOf(FLAGGED_PHRASE);
const CONTRAST_SPAN: [number, number] = [
  SPAN_START,
  SPAN_START + FLAGGED_PHRASE.length,
];

export const CONTRAST_ITEM = {
  assetId: "ast_2b70de",
  surface: "comments",
  author: "usr_8802",
  receivedAt: "2026-07-24T15:47:03Z",
  text: REVIEWED_TEXT,
  span: CONTRAST_SPAN,
  signal: {
    channel: "threat.implied",
    emitted: true,
    p: 0.91,
    conf: 0.44,
    skill: "skill:threat-heuristics@0.9.4",
    span: CONTRAST_SPAN,
    fired: true,
    threshold: 0.6,
  } as Signal,
  /** The machine-checkable half of the standard, settled before the human is
   *  asked, so the human's attention lands only on the judgment half. */
  preChecks: [
    {
      label: "span resolves in source",
      detail: `chars ${fmtSpan(CONTRAST_SPAN)}`,
      ok: true,
    },
    { label: "quoted text matches asset", detail: "byte-for-byte", ok: true },
    { label: "channel cleared threshold", detail: "0.91 ≥ 0.60", ok: true },
    {
      label: "confidence below review floor",
      detail: "0.44 < 0.70",
      ok: false,
    },
  ],
  /** What the verdict-only presentation offers the reviewer instead. */
  verdict: {
    label: "REMOVE",
    score: 0.91,
    band: "high",
    model: "moderation-ensemble-v4",
  },
} as const;
