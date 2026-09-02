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

// ─────────────────────────────────────────────────────────────
// Homepage hybrid (Direction A shell · B feed · C interlock)
// All prose sourced from mockups/COPY-BANK.md. No invented dates/claims.
// ─────────────────────────────────────────────────────────────

// §1 hook
export const HOOK = {
  stat: "95%",
  headline:
    "of enterprise AI pilots fail. Not because the models are bad, because we measure the wrong thing.",
  source:
    "MIT NANDA enterprise failure report, Challapally et al., 2025, despite $30–40 billion in investment, 95% of organizations achieve zero measurable return from generative AI initiatives.",
};

// §2 two questions
export const FRAMING = {
  lead:
    "Current benchmarks ask one question. Deployment asks another. The benchmark-to-deployment gap is the distance between them.",
  benchmark: {
    tag: "What benchmarks ask",
    question: "Can the model complete this task autonomously?",
    note: "Optimises for a machine finishing the job alone: synthetic, single-turn, closed-form.",
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
  def: "Evaluate AI on whether it assists humans without displacing them, not on whether it can finish the task alone.",
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
  { n: "[01]", title: "Benchmark saturation", cite: "3,765 benchmarks mapped, a large fraction near-saturating · Ott et al., 2022" },
  { n: "[02]", title: "Cognitive debt", cite: "Kosmyna et al., 2025 · MIT" },
  { n: "[03]", title: "Scaffolding theory", cite: "sentence-level −0.29, paragraph-level +0.18 · Dhillon et al., 2024, CHI" },
  { n: "[04]", title: "Uncertainty quantification", cite: "Liu et al., 2025" },
  { n: "[05]", title: "Supporting-facts requirement", cite: "Yang et al., 2018 · HotpotQA" },
];

export const APPARATUS_INTRO =
  "Together: the paper is the argument, the components are the proof the argument is implementable, the registry is how you adopt it. Each kit is a peer.";


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
    role: "The primitives. eval-kit's scoring dashboard is built on @hitl-kit/react, dogfooding the components.",
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

export const FEED_INTRO =
  "Each finding is a reproducible experiment: a question, runs against real models, human-scored results, and a repro link. Aggregate scores are internal signal, not leaderboard fodder.";

export const FEED_PRINCIPLES = [
  "Findings are reproducible: experiment folder + checked-in run JSON",
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
