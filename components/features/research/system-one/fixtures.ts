/**
 * Fixture data for № 011's exhibits.
 *
 * Every threshold here is TypeSafe's own, taken from the voice-banking example
 * in their "Confidence-gated routing" pattern (docs.typesafe.ai, read
 * 2026-09-21): a 0.6 floor under everything, a balance check that acts at the
 * floor, and a transfer that acts only above 0.85 and otherwise asks the user
 * to confirm. Nothing is tuned to make the argument land.
 *
 * The failure routes in TYPED_ROUTES are the vendor's own disclosures, from
 * the "Jev 1.13 jaggedness" page (last reviewed by them 2026-09-17).
 */

import type { RoutedAction } from "@/components/features/research/exhibits/confidence-router";
import type {
  ProbeCheck,
  ProbeRoute,
} from "@/components/features/research/exhibits/scorer-probe";

export const ROUTING_FLOOR = 0.6;

export const ROUTED_ACTIONS: readonly RoutedAction[] = [
  {
    value: "check_balance",
    label: "check the balance",
    actAbove: 0.6,
    // Their code acts on a balance check at the floor itself, not above it.
    inclusive: true,
    worstCase: "the user hears a balance they did not ask for",
  },
  {
    value: "approve_transfer",
    label: "approve the transfer",
    actAbove: 0.85,
    worstCase: "money moves on a misheard instruction",
  },
] as const;

export const ROUTING_NOTES = {
  act: "The model reports a clear read, and the cost of being wrong is one the system can absorb. This is the discretionary question answered well: no person is interrupted for something that did not need them.",
  confirm:
    "Understood, probably. The system asks before it acts. This band is where a calibrated number earns its keep, because it is the difference between asking about everything and asking about nothing.",
  person:
    "Below the floor the model is saying it does not know, and the honest response to that is not a guess. The case leaves the automated path.",
  approval:
    "The number was never read. Policy says a person approves this action, so a person approves it, at 0.61 and at 0.99 alike. Confidence measures whether the request was understood. It has nothing to say about whether the action is allowed.",
} as const;

// ─── Well-typed is not the same as right ─────────────────────────────────────

export const TYPED_ROUTES: readonly ProbeRoute[] = [
  {
    value: "right",
    label: "the answer is right",
    how: "The question was scoped to one specific judgement, the state contained what it needed, and the option the model chose is the correct one.",
    earned: true,
  },
  {
    value: "literal",
    label: "the question was read literally",
    how: "The instruction said one thing and meant another. The model answered the words on the page: a scoping word or a negation taken at face value, and a confident answer to a question nobody intended to ask.",
    earned: false,
    aside: "listed first among the vendor's own disclosed failure modes",
  },
  {
    value: "counted",
    label: "the question needed counting",
    how: "The answer depended on tallying items in a long list. The model recognises the shape of an answer rather than counting, so it returns a plausible level from the allowed set, and the error grows with the size of the list.",
    earned: false,
    aside: "the vendor's guidance is to keep arithmetic in code",
  },
] as const;

export const TYPED_CHECKS: readonly ProbeCheck[] = [
  { label: "the output is one of the declared options", checked: true },
  { label: "the chosen option is the correct one", checked: false },
  { label: "the question was read the way it was meant", checked: false },
] as const;
