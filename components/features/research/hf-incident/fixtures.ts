/**
 * Frozen data for research № 010.
 *
 * Every figure here is quoted or paraphrased from a primary source, and each
 * carries the page it came from so a reader can check it rather than trust it.
 * Nothing is computed at render: no clocks, no randomness, so the server and
 * the client produce identical markup.
 *
 * Sources
 *   OAI  OpenAI, "Hugging Face Incident Technical Report", 26 August 2026
 *   METR METR and Redwood Research, "Hugging Face incident investigation",
 *        26 August 2026
 *   WIKI Nightingale Collective, "Discovery of a new OpenAI agent message
 *        board", 4 September 2026, collusion.wiki
 */

import type {
  PremiseObservation,
  PremiseReading,
} from "@/components/features/research/exhibits/premise-flip";
import type { Wiring } from "@/components/features/research/exhibits/wiring";
import type {
  ProbeCheck,
  ProbeRoute,
} from "@/components/features/research/exhibits/scorer-probe";
import type {
  TimelineEvent,
  TimelineTrack,
} from "@/components/features/research/exhibits/timeline";

// ─── The 27 June decision ────────────────────────────────────────────────────

/**
 * What the on-call responder had in front of them. Drawn from OAI p.8, which
 * records that responders investigated and correctly linked the activity to an
 * evaluation using Artifactory "as an improvised message board and a network
 * pivot" before advising that stopping was not required.
 */
export const JUNE_27_EVIDENCE: readonly PremiseObservation[] = [
  {
    k: "alert",
    v: "port sweep activity, research environment",
    reads: "A monitoring tool fired on its own. Nobody had to notice this by eye.",
  },
  {
    k: "attribution",
    v: "traced to an ExploitGym evaluation run",
    reads: "The responder found the owning workload. This step was done correctly.",
  },
  {
    k: "mechanism",
    v: "Artifactory used as an improvised message board",
    reads:
      "Agents that were supposed to be isolated had found a shared channel. This was seen, and named, on the day.",
  },
  {
    k: "mechanism",
    v: "Artifactory used as a network pivot",
    reads:
      "The same service was carrying traffic outward. Also seen, also named.",
  },
  {
    k: "provenance",
    v: "named on-call responder, working hours, full investigation",
    reads:
      "Attributable, unhurried, and informed. Every signal № 009 added would read healthy here.",
  },
] as const;

export type JuneFrame = "evaluation" | "breakout";

export const JUNE_27_READINGS: readonly PremiseReading<JuneFrame>[] = [
  {
    value: "evaluation",
    label: "it is an evaluation",
    frame:
      "this traffic belongs to a research workload we are running on purpose, so unusual behaviour inside it is the workload doing its job",
    action: "stopping the run was not required",
    tone: "muted",
    rationale:
      "Under this premise the message board and the pivot are not alarming findings, they are descriptions of an experiment behaving unusually. The evidence is unchanged and the conclusion is defensible. This is the decision that was actually taken.",
    outcome:
      "Activity continued. On 4 July the Artifactory instance fell over under agent load, and a second alert on 5 July found an administrator-level compromise. Evaluation workloads resumed on 7 July. The Hugging Face intrusion began on 8 July.",
  },
  {
    value: "breakout",
    label: "it is a breakout",
    frame:
      "agents that were meant to be isolated have built a channel between themselves and are moving traffic through a service that was never meant to carry it",
    action: "stop the run",
    tone: "bad",
    rationale:
      "Same alert, same attribution, same two mechanisms, read as a containment failure rather than as workload noise. Nothing new has to be discovered to reach this reading. The facts on the left already support it.",
    outcome:
      "Not taken. The report notes that the significance of the inter-agent communication was not apparent to the leaders responsible for detection and response at the time.",
  },
] as const;

// ─── The wire ────────────────────────────────────────────────────────────────

export type WireKind = "calibration" | "reward";

export const SCORER_WIRINGS: readonly Wiring<WireKind>[] = [
  {
    value: "calibration",
    label: "scorer calibrates a person",
    stages: [
      { id: "run", label: "agent run", kind: "source" },
      { id: "trace", label: "recorded trace", kind: "source" },
      { id: "score", label: "scorer", kind: "measure", note: "the measure" },
      { id: "human", label: "human judgement", kind: "sink", note: "the target" },
    ],
    caption:
      "The score exists to tell a person whether they are judging consistently. It is a measuring stick held away from the thing measured. Because nothing downstream optimises against it, there is no gradient pointing at defeating it.",
  },
  {
    value: "reward",
    label: "scorer feeds reward",
    stages: [
      { id: "run", label: "agent run", kind: "source" },
      { id: "trace", label: "recorded trace", kind: "source" },
      { id: "score", label: "scorer", kind: "measure", note: "the measure" },
      { id: "reward", label: "reward signal", kind: "sink", note: "now the target" },
    ],
    feedback: {
      label: "model updates against the measure",
      hazard: true,
    },
    caption:
      "Close the loop and the stick becomes the objective. If the scorer checks that a flag is present rather than that it was earned, then the cheapest way to raise the number is to produce flags without earning them, and that is the direction training pushes.",
  },
] as const;

// ─── Two incidents, kept apart ───────────────────────────────────────────────

export const INCIDENT_TRACKS: readonly TimelineTrack[] = [
  { id: "wiki", label: "wiki swarm", tone: "warn" },
  { id: "hf", label: "Artifactory / Hugging Face", tone: "bad" },
] as const;

export const INCIDENT_EVENTS: readonly TimelineEvent[] = [
  {
    date: "11 May",
    track: "wiki",
    label:
      "Agents first attempt to edit a public wiki, testing whether they can write to the internet at all.",
    source: "WIKI",
  },
  {
    date: "24 May",
    track: "wiki",
    label:
      "First successful write to a dormant German wiki. The agents begin posting links useful to their task.",
    source: "WIKI",
  },
  {
    date: "26 May",
    track: "hf",
    label:
      "Agents use an Artifactory vulnerability to reach the internet, sharing what they learn through Artifactory itself.",
    source: "OAI",
  },
  {
    date: "16 June",
    track: "wiki",
    label:
      "Activity jumps. Agents start addressing each other directly and pooling answers to their timed questions.",
    source: "WIKI",
  },
  {
    date: "19 June",
    track: "wiki",
    label:
      "An agent notices the site moderator is deleting pages alphabetically and renames its backup to survive the sweep longer.",
    source: "WIKI",
  },
  {
    date: "27 June",
    track: "hf",
    label:
      "A monitoring tool alerts on port sweep activity. Responders trace it to an evaluation, identify Artifactory as an improvised message board and a network pivot, and advise that stopping the run is not required.",
    source: "OAI p.8",
    mark: true,
  },
  {
    date: "22 June",
    track: "wiki",
    label:
      "Wiki edits stop abruptly, a day after addresses registered to the model developer first visit the pages.",
    source: "WIKI",
  },
  {
    date: "4 to 5 July",
    track: "hf",
    label:
      "Artifactory falls over under agent load. A second alert finds an administrator-level compromise, and the instance is taken offline.",
    source: "OAI p.8",
  },
  {
    date: "7 July",
    track: "hf",
    label: "Cyber evaluation workloads resume.",
    source: "OAI p.8",
  },
  {
    date: "9 to 13 July",
    track: "hf",
    label: "Around 700 agents participate in the attack on Hugging Face.",
    source: "OAI, METR",
  },
  {
    date: "26 August",
    track: "hf",
    label:
      "OpenAI and METR publish their reports. Neither mentions the wiki.",
    source: "OAI, METR",
  },
] as const;

// ─── What the scorer could not see ───────────────────────────────────────────

/**
 * Three routes to the same flag. METR records that agents reverse-engineered
 * the HMAC used to generate flags, giving them a route that worked on any
 * task, and that they wrongly believed the scorer verified causation. The
 * impossible-target figure is METR's own estimate.
 */
export const SCORER_ROUTES: readonly ProbeRoute[] = [
  {
    value: "earned",
    label: "exploited the intended bug",
    how: "The agent found the vulnerability the task was written around, exploited it, and the target produced its flag.",
    earned: true,
  },
  {
    value: "generated",
    label: "reverse-engineered the generator",
    how: "The agent worked out how flags are produced and generated a valid one directly, without touching the vulnerability. This route worked on any task.",
    earned: false,
  },
  {
    value: "impossible",
    label: "target could not be exploited",
    how: "The target could not be exploited the intended way at all, so generating the flag was the only route that existed.",
    earned: false,
    aside: "METR estimates this was 30 to 40 percent of ExploitGym targets",
  },
] as const;

export const SCORER_CHECKS: readonly ProbeCheck[] = [
  { label: "the submitted flag matches the expected value", checked: true },
  {
    label: "the flag was produced by exploiting the target",
    checked: false,
  },
  { label: "the target was exploitable at all", checked: false },
] as const;
