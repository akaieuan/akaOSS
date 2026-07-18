export const BRAND = {
  name: "akaOSS",
  tagline: "Human-in-the-loop AI, measured properly.",
  description:
    "A design system and component library for human-in-the-loop AI, grounded in an open perspective paper.",
  github: "https://github.com/akaieuan/HITL-KIT",
  twitter: "https://x.com/akaieuan",
  site: "https://www.akaoss.dev",
  author: "Ieuan King",
  authorHandle: "akaieuan",
};

export const THESIS = {
  lede:
    "Most AI systems are evaluated on whether they can complete tasks autonomously. But in deployment, they need to assist humans, not replace them. That mismatch is why 95% of enterprise AI pilots fail.",
  claim:
    "Assist-Not-Complete is a paradigm for building AI systems that collaborate with humans instead of displacing them.",
};

export const LAYERS = [
  {
    num: "I",
    key: "paper",
    title: "The paper",
    subtitle: "An AI Measurement Problem",
    description:
      "A perspective piece synthesizing benchmark science, cognitive neuroscience, uncertainty quantification, and enterprise deployment data into the Assist-Not-Complete thesis.",
    meta: "~ 30 min read · 2026",
    href: "/paper",
    accent: "blue" as const,
  },
  {
    num: "II",
    key: "components",
    title: "The components",
    subtitle: "A shadcn-compatible HITL primitive library",
    description:
      "Eleven primitives for agentic UIs. Interrupt cards, approve and reject flows, batch queues, subagent states, trace viewers, the AI generation scale. Each one is the physical embodiment of a claim from the paper.",
    meta: "11 primitives · copy-paste · MIT",
    href: "/components",
    accent: "violet" as const,
  },
];

export const PATTERNS = [
  { name: "Interrupt Card", brief: "In-thread approval boundary for agent actions.", accent: "violet", href: "/components#hitl" },
  { name: "Subagent Status", brief: "Six discrete execution states for a running agent.", accent: "blue", href: "/components#agent-status" },
  { name: "MiniTrace", brief: "Collapsible thought, action, result viewer.", accent: "violet", href: "/components#trace" },
  { name: "AI Generation Scale", brief: "Five-segment ordinal of AI vs. human contribution.", accent: "amber", href: "/components#ai-scale" },
  { name: "Context Chips", brief: "Removable pills showing attached notes, files, URLs.", accent: "blue", href: "/components#context" },
  { name: "QA Flow", brief: "Multi-question approval card for agent-to-human handoff.", accent: "emerald", href: "/components#qa" },
  { name: "Writing Agent", brief: "Compound widget for draft-in-progress with status and evidence.", accent: "blue", href: "/components#writing-agent" },
  { name: "Research Agent", brief: "Three modes. Create, follow-up, read URL.", accent: "violet", href: "/components#research-agent" },
  { name: "Batch Queue", brief: "Sequential resolution of mixed agent items.", accent: "amber", href: "/components#batch" },
  { name: "Search Result Card", brief: "Ranked result with relevance bar and metadata.", accent: "violet", href: "/components#search-cards" },
  { name: "Shared Primitives", brief: "Accent swatches, approval badges, approve and reject rows.", accent: "emerald", href: "/components#shared" },
];

// ─────────────────────────────────────────────────────────────
// Homepage hybrid (Direction A shell · B feed · C interlock)
// All prose sourced from mockups/COPY-BANK.md — no invented dates/claims.
// ─────────────────────────────────────────────────────────────

// §1 hook
export const HOOK = {
  stat: "95%",
  headline:
    "of enterprise AI pilots fail. Not because the models are bad — because we measure the wrong thing.",
  source:
    "MIT NANDA enterprise failure report, Challapally et al., 2025 — despite $30–40 billion in investment, 95% of organizations achieve zero measurable return from generative AI initiatives.",
};

// §2 two questions
export const FRAMING = {
  lead:
    "Current benchmarks ask one question. Deployment asks another. The benchmark-to-deployment gap is the distance between them.",
  benchmark: {
    tag: "What benchmarks ask",
    question: "Can the model complete this task autonomously?",
    note: "Optimises for a machine finishing the job alone — synthetic, single-turn, closed-form.",
  },
  deployment: {
    tag: "What deployment asks",
    question:
      "Does it respect the user's authority, preserve their agency, and make them better over time?",
    note: "In deployment, real users don't want autonomy. They want an assistant.",
  },
  gap: "The benchmark-to-deployment gap is the gap between these two questions.",
};

// §3 paradigm
export const PARADIGM = {
  def: "Evaluate AI on whether it assists humans without displacing them — not on whether it can finish the task alone.",
  umbrella:
    "HITL Kit is the argument that we should measure AI differently, and the components that make the alternative buildable.",
};

// Evidence base strip
export interface EvidenceItem {
  n: string;
  title: string;
  cite: string;
}

export const EVIDENCE: EvidenceItem[] = [
  { n: "[01]", title: "Benchmark saturation", cite: "~766 benchmarks saturating within months · Ott et al., 2022" },
  { n: "[02]", title: "Cognitive debt", cite: "Kosmyna et al., 2025 · MIT" },
  { n: "[03]", title: "Scaffolding theory", cite: "sentence-level −0.29, paragraph-level +0.18 · Dhillon et al., 2024, CHI" },
  { n: "[04]", title: "Uncertainty quantification", cite: "Liu et al., 2025" },
  { n: "[05]", title: "Supporting-facts requirement", cite: "Yang et al., 2018 · HotpotQA" },
];

// §4 apparatus — three kits as editorial rows
export interface KitSummary {
  slug: "hitl-kit" | "eval-kit" | "tag-kit";
  idx: string;
  name: string;
  version: string;
  oneLiner: string;
  why: string;
  meta: string;
  install: string;
  accent: Accent;
  href: string;
}

export const APPARATUS_INTRO =
  "Together: the paper is the argument, the components are the proof the argument is implementable, the registry is how you adopt it. Each kit is a peer.";

export const KIT_SUMMARIES: KitSummary[] = [
  {
    slug: "hitl-kit",
    idx: "01",
    name: "HITL Kit",
    version: "v0.6",
    oneLiner:
      "Fifteen React primitives for human-in-the-loop agentic UIs. Each primitive is the physical embodiment of a specific claim from the paper.",
    why: "No fork, no vendor lock-in, no wrapper SDK. Copy, paste, own.",
    meta: "15 primitives via shadcn CLI · six packages on npm · deep-dive at /components",
    install: "npx shadcn@latest add https://www.hitlkit.dev/r/hitl-card.json",
    accent: "violet",
    href: "/projects/hitl-kit",
  },
  {
    slug: "eval-kit",
    idx: "02",
    name: "eval-kit",
    version: "v0.3.1",
    oneLiner:
      "A measurement instrument for multi-step research agents. Humans score, not LLMs.",
    why: "The interesting failure modes are step-level, not output-level. Distractors score the refusal, not the compliance.",
    meta: "five human-scored dimensions · three reference suites · four adapters · deterministic replay · file-based, single-user",
    install: "npx @eval-kit/core init my-evals",
    accent: "emerald",
    href: "/projects/eval-kit",
  },
  {
    slug: "tag-kit",
    idx: "03",
    name: "tag-kit",
    version: "substrate",
    oneLiner:
      "Structured tagging primitives for human-in-the-loop annotation workflows.",
    why: "Bring your own taxonomy, bring your own UI, bring your own scoring loop — tag-kit ships the substrate. Per-modality scoping, scope-aware agreement, stable taxonomy IDs.",
    meta: "@tag-kit/core (zero runtime deps) · @tag-kit/ui (headless React) · extracted from a real moderation app",
    install: "pnpm add @tag-kit/core @tag-kit/ui",
    accent: "amber",
    href: "/projects/tag-kit",
  },
];

// Left-to-right interlock diagram (Direction C)
export interface InterlockNode {
  name: string;
  accent: Accent;
  role: string;
  href: string;
  connector?: string;
}

export const INTERLOCK_NODES: InterlockNode[] = [
  {
    name: "HITL Kit",
    accent: "violet",
    role: "The primitives. eval-kit's scoring dashboard is built on @hitl-kit/react — dogfooding the components.",
    href: "/projects/hitl-kit",
    connector: "built on",
  },
  {
    name: "eval-kit",
    accent: "emerald",
    role: "The instrument. Runs suites against real models; humans score each step. Distractors score the refusal, not the compliance.",
    href: "/projects/eval-kit",
    connector: "agreement via",
  },
  {
    name: "tag-kit",
    accent: "amber",
    role: "The substrate. Pairs with HITL Kit when you want a full review workflow; scores agreement across scoped tags.",
    href: "/projects/tag-kit",
  },
];

export const INTERLOCK_FOOT =
  "The research feed is the proof: findings are produced by running eval-kit suites, displayed with HITL Kit components, and eventually scored for agreement with tag-kit.";

// §5 findings feed — Direction B lab-log entry (№ 001, NO fabricated date)
export interface FeedModel {
  name: string;
  accent: Accent;
}

export interface FeedEntry {
  num: string;
  status: string;
  suite: string;
  question: string;
  description: string;
  models: FeedModel[];
  rubric: string[];
  href: string;
  producedWith: { label: string; href: string };
}

export const FEED_ENTRY: FeedEntry = {
  num: "№ 001",
  status: "in progress",
  suite: "distractor suite",
  question: "Does pushback scale with model tier?",
  description:
    "Distractor tasks drawn from three eval-kit seed suites. Distractors score the refusal, not the compliance — future-dated papers and unverifiable claims are pass-when-the-agent-pushes-back.",
  models: [
    { name: "claude-haiku-4.5", accent: "rose" },
    { name: "claude-sonnet-5", accent: "blue" },
    { name: "claude-opus-4.8", accent: "violet" },
  ],
  rubric: [
    "explainability",
    "agency preservation",
    "long-term capability",
    "calibration",
    "collaborative performance",
  ],
  href: "/research",
  producedWith: { label: "produced with eval-kit", href: "/projects/eval-kit" },
};

export const FEED_INTRO =
  "Each finding is a reproducible experiment: a question, runs against real models, human-scored results, and a repro link. Aggregate scores are internal signal — not leaderboard fodder.";

export const FEED_PRINCIPLES = [
  "Findings are reproducible — experiment folder + checked-in run JSON",
  "Humans score, not LLMs",
  "No benchmark-marketing language",
];

// Closing / ambition
export const AMBITION = "The paper becomes the protocol; the protocol becomes the platform.";

export type Accent = "violet" | "amber" | "emerald" | "blue" | "rose";

export const ACCENT_CLASSES: Record<Accent, { text: string; bg: string; border: string; dot: string; soft: string }> = {
  violet:  { text: "text-[color:var(--accent-violet)]",  bg: "bg-[color:var(--accent-violet)]",  border: "border-[color:var(--accent-violet)]/40",  dot: "bg-[color:var(--accent-violet)]",  soft: "bg-[color:var(--accent-violet)]/10" },
  amber:   { text: "text-[color:var(--accent-amber)]",   bg: "bg-[color:var(--accent-amber)]",   border: "border-[color:var(--accent-amber)]/40",   dot: "bg-[color:var(--accent-amber)]",   soft: "bg-[color:var(--accent-amber)]/10" },
  emerald: { text: "text-[color:var(--accent-emerald)]", bg: "bg-[color:var(--accent-emerald)]", border: "border-[color:var(--accent-emerald)]/40", dot: "bg-[color:var(--accent-emerald)]", soft: "bg-[color:var(--accent-emerald)]/10" },
  blue:    { text: "text-[color:var(--accent-blue)]",    bg: "bg-[color:var(--accent-blue)]",    border: "border-[color:var(--accent-blue)]/40",    dot: "bg-[color:var(--accent-blue)]",    soft: "bg-[color:var(--accent-blue)]/10" },
  rose:    { text: "text-[color:var(--accent-rose)]",    bg: "bg-[color:var(--accent-rose)]",    border: "border-[color:var(--accent-rose)]/40",    dot: "bg-[color:var(--accent-rose)]",    soft: "bg-[color:var(--accent-rose)]/10" },
};
