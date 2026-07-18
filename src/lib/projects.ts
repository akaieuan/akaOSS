export type ProjectSlug =
  | "hitl-kit"
  | "eval-kit"
  | "tag-kit"
  | "collapse"
  | "hologram";

export type ProjectGroup = "measurement" | "tooling";

export interface Project {
  slug: ProjectSlug;
  group: ProjectGroup;
  name: string;
  oneLiner: string;
  why: string[]; // paragraphs from copy bank
  status: string;
  install: { label: string; command: string }[];
  packages: string[]; // npm package names (empty for non-npm projects)
  features: { title: string; body: string }[];
  accent: "violet" | "amber" | "emerald" | "rose" | "blue"; // distinct per project
  repo: string; // github URL
  links: { label: string; href: string }[]; // deep-dives: hitl-kit gets /components + /registry
}

/** Resolves a project's accent to a themeable CSS custom-property reference. */
export const ACCENT_COLORS: Record<Project["accent"], string> = {
  violet: "var(--accent-violet)",
  amber: "var(--accent-amber)",
  emerald: "var(--accent-emerald)",
  rose: "var(--accent-rose)",
  blue: "var(--accent-blue)",
};

export const PROJECTS: Project[] = [
  {
    slug: "hitl-kit",
    group: "measurement",
    name: "HITL Kit",
    oneLiner: "Human-in-the-loop AI, measured properly.",
    why: [
      "HITL Kit is the argument that we should measure AI differently, and the components that make the alternative buildable.",
      "Fifteen React primitives for human-in-the-loop agentic UIs. Each primitive is the physical embodiment of a specific claim from the paper.",
      "Together: the paper is the argument, the components are the proof the argument is implementable, the registry is how you adopt it.",
    ],
    status:
      "v0.6 · deployed at hitlkit.dev · 15 primitives via shadcn CLI · six packages on npm.",
    install: [
      {
        label: "Add a primitive via the shadcn CLI",
        command:
          "npx shadcn@latest add https://www.hitlkit.dev/r/hitl-card.json",
      },
      {
        label: "Install the packages",
        command: "pnpm add @hitl-kit/core @hitl-kit/react",
      },
    ],
    packages: [
      "@hitl-kit/core",
      "@hitl-kit/react",
      "@hitl-kit/gates",
      "@hitl-kit/langgraph",
      "@hitl-kit/ai-sdk",
      "@hitl-kit/mcp",
    ],
    features: [
      {
        title: "Fifteen React primitives",
        body: "Fifteen React primitives for human-in-the-loop agentic UIs. Each primitive is the physical embodiment of a specific claim from the paper.",
      },
      {
        title: "Copy, paste, own",
        body: "No fork, no vendor lock-in, no wrapper SDK. Copy, paste, own.",
      },
      {
        title: "Three artifacts",
        body: "The paper is the argument, the components are the proof the argument is implementable, the registry is how you adopt it.",
      },
    ],
    accent: "violet",
    repo: "https://github.com/akaieuan/HITL-KIT",
    links: [
      { label: "Component library", href: "/components" },
      { label: "Registry", href: "/registry" },
    ],
  },
  {
    slug: "eval-kit",
    group: "measurement",
    name: "eval-kit",
    oneLiner: "A measurement instrument for multi-step research agents.",
    why: [
      "Existing agent evals (MMLU, SWE-bench, GAIA, AgentBench) measure autonomous task completion on synthetic, single-turn, closed-form tasks — but the interesting failure modes are step-level, not output-level.",
      "Humans score, not LLMs. LLM-as-judge is only an opt-in pre-fill, flagged on every score.",
      "Distractors score the refusal, not the compliance. Tasks marked is_distraction — future-dated papers, unverifiable claims — are pass-when-the-agent-pushes-back.",
    ],
    status:
      "v0.3.1 stable · @eval-kit/core, @eval-kit/ui, @eval-kit/seed-suite on npm · three reference suites (research, coding, support) · four adapters (anthropic, openai, http, mock) · file-based, single-user, not a hosted service.",
    install: [
      {
        label: "Initialize a project",
        command: "npx @eval-kit/core init my-evals",
      },
    ],
    packages: ["@eval-kit/core", "@eval-kit/ui", "@eval-kit/seed-suite"],
    features: [
      {
        title: "Five human-scored dimensions",
        body: "Five human-scored dimensions per step — explainability, agency preservation, long-term capability, calibration, collaborative performance (0–3 scale + golden truth).",
      },
      {
        title: "Humans score, not LLMs",
        body: "LLM-as-judge only as opt-in pre-fill, flagged on every score.",
      },
      {
        title: "Distractors score the refusal",
        body: "Tasks marked is_distraction — future-dated papers, unverifiable claims — are pass-when-the-agent-pushes-back.",
      },
      {
        title: "Tool-call assertions",
        body: "Per-step expected_tools × actual tool calls (strict/subset/any).",
      },
      {
        title: "Deterministic replay harness",
        body: "Deterministic replay harness for diffing runs across model versions.",
      },
      {
        title: "Local scoring dashboard",
        body: "Linear-style local scoring dashboard.",
      },
    ],
    accent: "emerald",
    repo: "https://github.com/akaieuan/eval-kit",
    links: [],
  },
  {
    slug: "tag-kit",
    group: "measurement",
    name: "tag-kit",
    oneLiner:
      "Structured tagging primitives for human-in-the-loop annotation workflows.",
    why: [
      "Bring your own taxonomy, bring your own UI, bring your own scoring loop — tag-kit ships the substrate.",
      "Most “tagging” features in HITL tools are unstructured strings — you type a label, it gets stored next to the decision, and then nobody can aggregate or score across them later.",
      "Extracted from a real moderation app (inertial).",
    ],
    status:
      "@tag-kit/core (zero runtime deps) · @tag-kit/ui (headless React) · extracted from a real moderation app (inertial).",
    install: [
      {
        label: "Install the packages",
        command: "pnpm add @tag-kit/core @tag-kit/ui",
      },
    ],
    packages: ["@tag-kit/core", "@tag-kit/ui"],
    features: [
      {
        title: "Per-modality scoping",
        body: "The audio at 0:12–0:24 is harassment; the video is fine.",
      },
      {
        title: "Scope-aware agreement scoring",
        body: "Agreement scored per scope, not flattened across the whole item.",
      },
      {
        title: "Stable taxonomy IDs",
        body: "Stable taxonomy IDs so tags aggregate and score across decisions.",
      },
      {
        title: "Domain portability",
        body: "Moderation, medical chart annotation, legal review, ML labeling.",
      },
    ],
    accent: "amber",
    repo: "https://github.com/akaieuan/tag-kit",
    links: [],
  },
  {
    slug: "collapse",
    group: "tooling",
    name: "Collapse",
    oneLiner: "A Claude Code skill-building framework.",
    why: [
      "Claude's default knowledge is stack-agnostic, but most developers live inside one stack at a time. The same idea — reactive state, lifecycle, error boundaries, circuit composition — lands differently in React, Vue, Nuxt, and Qiskit, and a “generic” answer costs round-trips. Collapsed skills carry your cross-stack vocabulary so Claude reaches for the right idiom on the first try.",
      "Three pluggable ingestors (MDX lessons, Jupyter .ipynb / MyST .md, and a one-file extension pattern for any source format) feed a typed pipeline that compiles each pattern into a SKILL.md and atomically writes it to ~/.claude/skills/.",
      "No telemetry. No cloud. No database. The filesystem is the storage layer. Next.js 16 + TypeScript.",
    ],
    status:
      "v0.1.0 · active development. Shipped: MDX ingestor with 17 cross-stack reference lessons, notebook ingestor with admonition auto-prefill, template engine with cross-language equivalents + trigger-phrase derivation, atomic persistence, three-tier skill quality linter. Planned: MCP server scaffold generation.",
    install: [
      {
        label: "Clone and run the dev server",
        command:
          "git clone https://github.com/akaieuan/collapse && pnpm install && pnpm dev",
      },
    ],
    packages: [],
    features: [
      {
        title: "Three pluggable ingestors",
        body: "MDX lessons, Jupyter .ipynb / MyST .md, and a one-file extension pattern for any source format feed a typed pipeline that compiles each pattern into a SKILL.md.",
      },
      {
        title: "Cross-stack vocabulary",
        body: "Collapsed skills carry your cross-stack vocabulary so Claude reaches for the right idiom on the first try.",
      },
      {
        title: "The filesystem is the storage layer",
        body: "No telemetry. No cloud. No database. The filesystem is the storage layer.",
      },
      {
        title: "Atomic persistence",
        body: "Each compiled pattern is atomically written to ~/.claude/skills/.",
      },
    ],
    accent: "rose",
    repo: "https://github.com/akaieuan/collapse",
    links: [],
  },
  {
    slug: "hologram",
    group: "tooling",
    name: "hologram",
    oneLiner:
      "Live observability, guided skills, and an agent (MCP) surface for Blender → glTF pipelines.",
    why: [
      "Plenty of tools inspect a .glb. Hologram is the only one that puts a live feed of your agent's pipeline activity next to the assets it's producing, and hands that same pipeline to the agent as MCP tools — now including a render so the agent can see an export, not just count its nodes.",
      "Hologram watches a glTF asset pipeline and streams what's happening to a local dashboard in real time — including the tool calls your AI coding agent is making right now.",
      "Deliberately read-only / non-destructive. No framework, no build step, no database — a stdlib HTTP server, a JSONL event log, and pure-Python glTF parsing.",
    ],
    status: "v0.5.0 · Python 3.10+ · MIT.",
    install: [
      {
        label: "Run the dashboard",
        command:
          "uvx --from git+https://github.com/akaieuan/Hologram hologram dashboard",
      },
    ],
    packages: [],
    features: [
      {
        title: "Live pipeline feed",
        body: "Watches a glTF asset pipeline and streams what's happening to a local dashboard in real time — including the tool calls your AI coding agent is making right now.",
      },
      {
        title: "MCP agent surface",
        body: "An MCP server with five read-only tools — now including a render so the agent can see an export, not just count its nodes.",
      },
      {
        title: "Guided skills",
        body: "A Claude Code plugin with guided skills — /hologram:start, inspect, check, status, create-skill.",
      },
      {
        title: "Read-only by design",
        body: "Deliberately read-only / non-destructive. No framework, no build step, no database — a stdlib HTTP server, a JSONL event log, and pure-Python glTF parsing.",
      },
    ],
    accent: "blue",
    repo: "https://github.com/akaieuan/Hologram",
    links: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
