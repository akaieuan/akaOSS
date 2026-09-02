/**
 * Local fixture data for the essay's exhibits.
 *
 * Deliberately self-contained: nothing here imports from the inertial
 * application itself. The exhibits demonstrate the *pattern*: signals rather
 * than verdicts, a gated action, a hash-chained log, using this site's own
 * HITL Kit primitives and this file's data.
 *
 * Every timestamp is a frozen literal and every hash is derived, so the server
 * and the client render identical markup.
 *
 * Every machine field that a reviewer would have to decode carries a `reads`
 * sentence beside it. The ids and decimals are what the policy acts on; the
 * sentence is what the person deciding actually reads.
 */

import { sha256Hex } from "./sha256";

// ─── Shared vocabulary ───────────────────────────────────────────────────────

/** A sub-agent emits a signal, never a verdict: probability + confidence +
 *  a pointer to the evidence that produced it. */
export interface Signal {
  channel: string;
  /**
   * Whether the skill emitted anything at all. A skill with nothing to say
   * omits its channel rather than reporting a low number. Absence means the
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
  /** Typed evidence pointer, here, a half-open character range. */
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
  return span ? `${span[0]}..${span[1]}` : ", ";
}

/** Probabilities are always shown to two decimals, never rounded away to a
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
      "Aimed at one specific person rather than rude in general. The whole comment is addressed to them.",
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
      "Treats “find out where you work” as a threat to the person’s job, not a figure of speech.",
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
      "Never reached a conclusion. That is not the same as clearing the account, nobody has checked.",
  },
];

/**
 * Counterfactual confidence settings.
 *
 * The reader can ask what the run would have looked like had the skills come
 * back more or less sure of themselves. It changes what a reviewer should make
 * of the signal; it changes nothing about whether one is required. R-07 keys on
 * what the action does, not on how sure the machine is, and the surest way to
 * show that is to let someone try to move it.
 */
export type ConfidenceMode = "unsure" | "emitted" | "certain";

export interface ConfidenceSetting {
  id: ConfidenceMode;
  label: string;
  /** Confidence per channel id. */
  conf: Record<string, number>;
  /** What this run would mean to the person deciding. */
  reads: string;
}

export const CONFIDENCE_SETTINGS: ConfidenceSetting[] = [
  {
    id: "unsure",
    label: "barely sure",
    conf: {
      "harassment.targeted": 0.34,
      "threat.implied": 0.21,
      "spam.bulk": 0.55,
    },
    reads:
      "Every channel is hedging. A reviewer should read the spans themselves and expect to disagree with at least one of them.",
  },
  {
    id: "emitted",
    label: "as emitted",
    conf: {
      "harassment.targeted": 0.88,
      "threat.implied": 0.62,
      "spam.bulk": 0.91,
    },
    reads: "What the skills actually returned on this run.",
  },
  {
    id: "certain",
    label: "near certain",
    conf: {
      "harassment.targeted": 0.99,
      "threat.implied": 0.98,
      "spam.bulk": 0.99,
    },
    reads:
      "The skills would stake their calibration on it. A reviewer can move faster, and is still the one who decides.",
  },
];

/** The routing outcome, which every confidence setting above shares. */
export const GATE_ROUTING = "rule R-07 · mandated · human approval required";

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

/** The three ways a reviewer can leave this gate, and what each one costs. */
export type GateDecision = "approved" | "denied" | "escalated";

export interface GateOutcome {
  event: string;
  actor: string;
  /** What the reviewer just did, in words. */
  plain: string;
  /** What is now true in the world, including what it cost. */
  consequence: string;
}

export const GATE_OUTCOMES: Record<GateDecision, GateOutcome> = {
  approved: {
    event: "gate.approved",
    actor: "human:reviewer-2",
    plain:
      "You have authorised the removal. Nothing has been removed yet, approval unlocks the executor, it does not run it.",
    consequence:
      "The executor will now find the event it was looking for. Run it and the comment is gone and its author is told why.",
  },
  denied: {
    event: "gate.denied",
    actor: "human:reviewer-2",
    plain: "You refused the removal. The constructed call is discarded.",
    consequence:
      "The comment stays on the post. The signals stay on the record, so whoever sees it next starts from what was found rather than from nothing. If the channels were right, the person it names can still read it in the meantime.",
  },
  escalated: {
    event: "gate.escalated",
    actor: "human:reviewer-2",
    plain:
      "You sent it up rather than guessing. The gate stays closed and nothing executes.",
    consequence:
      "Escalation is the cheap direction: it costs a queue position, not someone's speech. It is also the failure mode of a discretionary gate, a reviewer who escalates everything has moved the decision, not made it.",
  },
};

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
  /**
   * The payload in a sentence. A gloss for the reader, not a recorded field:
   * `canonicalize` below hashes only what the writer actually stored, so the
   * digest never depends on how the exhibit chooses to narrate it.
   */
  reads: string;
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
    reads:
      "The comment arrived from the comments surface with three user reports against it.",
  },
  {
    index: 1,
    ts: "2026-07-24T14:01:54Z",
    event: "signal",
    actor: "skill:safety-classifier@2.3.0",
    payload: "channel=harassment.targeted p=0.94 conf=0.88 span=0..92",
    reads:
      "The safety classifier put targeted harassment at 0.94 and pointed at the whole comment.",
  },
  {
    index: 2,
    ts: "2026-07-24T14:01:58Z",
    event: "signal",
    actor: "skill:threat-heuristics@0.9.4",
    payload: "channel=threat.implied p=0.71 conf=0.62 span=29..52",
    reads:
      "The threat heuristic put an implied threat at 0.71, pointing at twenty-three characters in the middle.",
  },
  {
    index: 3,
    ts: "2026-07-24T14:02:01Z",
    event: "routed",
    actor: "policy:review-router@4.1",
    payload: "rule=R-07 gate=mandated action=remove_content",
    reads:
      "The router matched rule R-07 and held the removal for a human.",
  },
  {
    index: 4,
    ts: "2026-07-24T14:02:06Z",
    event: "decided",
    actor: "human:reviewer-2",
    payload: "decision=approved action=remove_content latency_s=41",
    reads:
      "Reviewer 2 approved the removal, forty-one seconds after being asked.",
  },
];

/** Which entry the exhibit starts on. One in the middle, so the break has
 *  somewhere to walk to. */
export const DEFAULT_TARGET_INDEX = 2;

/**
 * A plausible rewrite of each entry, with the reason someone would want it.
 *
 * The motive matters more than the diff: a log is worth hash-chaining only
 * where somebody stands to gain by editing it, and every entry here is worth
 * something to somebody.
 */
export interface Forgery {
  payload: string;
  /** How the rewritten record now reads. */
  reads: string;
  /** What writing this instead would be worth, and to whom. */
  motive: string;
}

export const FORGERIES: Record<number, Forgery> = {
  0: {
    payload: "asset=ast_9f2c41 surface=comments reports=41",
    reads: "The comment arrived with forty-one reports against it.",
    motive:
      "Makes the removal look like a response to overwhelming user pressure rather than to two model signals.",
  },
  1: {
    payload: "channel=harassment.targeted p=0.99 conf=0.97 span=0..92",
    reads: "The classifier was all but certain.",
    motive:
      "Turns a strong signal into an open-and-shut one, so the approval never has to be defended.",
  },
  2: {
    payload: "channel=threat.implied p=0.06 conf=0.62 span=29..52",
    reads: "The threat heuristic found almost nothing.",
    motive:
      "Written by someone arguing the removal was unjustified: with this channel at 0.06 the whole case rests on one model.",
  },
  3: {
    payload: "rule=R-11 gate=discretionary action=remove_content",
    reads: "The router treated the removal as discretionary. No approval required.",
    motive:
      "Reclassifies the action so it never needed a human at all: the cleanest way to explain an approval nobody remembers giving.",
  },
  4: {
    payload: "decision=approved action=remove_content latency_s=612",
    reads: "The reviewer approved after ten minutes.",
    motive:
      "Forty-one seconds looks like a rubber stamp. Ten minutes looks like someone read it.",
  },
};

/** How a payload reads now: the entry's own gloss, the forgery's, or neither. */
export function readsFor(index: number, payload: string): string | null {
  if (payload === PRISTINE_ENTRIES[index].payload) {
    return PRISTINE_ENTRIES[index].reads;
  }
  if (payload === FORGERIES[index]?.payload) return FORGERIES[index].reads;
  return null;
}

export interface StoredLink {
  /** The prevHash as it appears in the stored record. */
  prev: string;
  /** The hash as it appears in the stored record. */
  hash: string;
}

/** Recompute a whole chain from entries, what an honest writer produces. */
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
export const ANCHORED_WITH = "notary:transparency-log@2 · witnessed 14:02:07Z";

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
 *   link. The stored prevHash is not the previous entry's hash
 *   content. The stored hash is not the hash of this entry's own content
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
  "congrats on the promotion, genuinely thrilled for you. next time you're in town I'm going to take you out and we are absolutely not splitting the bill.";

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
    reads:
      "Reads “I’m going to take you out” as a threat of violence against the person being replied to.",
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
    /** The verdict in words. There is nothing else to say about it. */
    reads: "Take it down. We are 0.91 sure.",
  },
  /** What the words actually are, once you can see where they sit. */
  truth:
    "In place, the flagged words are the middle of a congratulations message: an offer to buy someone dinner.",
} as const;

/** What each way of deciding turns out to have been. */
export const CONTRAST_OUTCOMES = {
  approved: {
    head: "The comment came down.",
    body: "It was an invitation to dinner. The author is told their message was removed as a threat; they can appeal, and appeals against removals like this are rarely granted.",
  },
  rejected: {
    head: "The comment stays up.",
    body: "It was an invitation to dinner, so you were right. Had the channel been reading a real threat, the person it named would keep seeing it until someone else reached the queue.",
  },
} as const;

/** Why the same decision means different things depending on what you saw. */
export const CONTRAST_BASIS = {
  verdict:
    "You decided on a label and a number. Nothing you were shown could have separated this from a real threat, not the score, which was 0.91, and not the confidence band, which said high.",
  located:
    "You decided on the sentence the score came from, with the span resolved in the source and the emitting skill's own confidence on the table at 0.44, below the floor this queue trusts. Right or wrong, the decision can be shown to someone else.",
} as const;
