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
  /** Long-form sections — the "small research paper" treatment: why it was
   * built and how, sourced from each repo's own docs. */
  deepDive: { heading: string; paragraphs: string[] }[];
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
    deepDive: [
      {
        heading: "The measurement problem",
        paragraphs: [
          "95% of enterprise AI pilots fail — not because the models are bad, but because we measure the wrong thing. Despite $30–40 billion in investment, 95% of organizations achieve zero measurable return from generative AI initiatives (Challapally et al., 2025). The paper argues this failure crisis is at root a measurement crisis.",
          "Current benchmarks ask one question: can the model complete this task autonomously? Deployment asks another: does it respect the user's authority, preserve their agency, and make them better over time? The benchmark-to-deployment gap is the distance between those two questions — and every component in this kit exists because something falls into that gap.",
          "The alternative is Assist-Not-Complete: evaluate AI on whether it assists humans without displacing them, not on whether it can finish the task alone. The paper synthesizes benchmark-saturation research (Ott et al., 2022 — roughly 766 benchmarks saturating within months of release), cognitive-debt findings from AI-assisted learning (Kosmyna et al., 2025), scaffolding theory (Dhillon et al., 2024), and uncertainty quantification (Liu et al., 2025) into that single reframing.",
        ],
      },
      {
        heading: "Every primitive embodies a claim",
        paragraphs: [
          "The component library is not a grab-bag of agent UI widgets — each of the fifteen primitives is the physical embodiment of a specific claim from the paper. The MiniTrace instantiates the supporting-facts requirement from HotpotQA (Yang et al., 2018): an answer without its evidence trail is unverifiable, so the trace rides along. The AI Generation Scale operationalises Dhillon et al.'s scaffolding principle — their CHI study found sentence-level suggestions reduced writing quality while paragraph-level scaffolds improved it, so the scale makes the level of AI involvement a first-class, visible control. The Interrupt Card is the agency-preservation boundary: the moment the system pauses and the human decides.",
          "That traceability is the design discipline for the whole kit: if a primitive can't be tied to a claim the paper defends, it doesn't ship. The paper is the spec.",
        ],
      },
      {
        heading: "How it's built",
        paragraphs: [
          "The architecture is a protocol with adapters. @hitl-kit/core defines Zod event schemas — a framework-agnostic wire format for human-in-the-loop moments (approvals, interrupts, traces, generation-scale changes). @hitl-kit/react ships HitlEventRenderer, a typed dispatcher that maps validated events to UI primitives. @hitl-kit/gates adds composable decision gates — confidence, cost, scope, approval-chain, rate-limit — pure functions that wrap any adapter's emit point and decide allow, deny, or escalate.",
          "Three adapters carry the protocol into real agent stacks: LangGraph (emit events from interrupt() nodes, resume with typed Commands), the Vercel AI SDK (typed tool() wrappers), and MCP (an MCP server exposing the fifteen primitive event kinds as tools, so any MCP-aware client can emit schema-validated HITL events). The paper becomes the protocol; the protocol becomes the platform.",
          "The UI primitives themselves distribute the shadcn way — copy, paste, own. No fork, no vendor lock-in, no wrapper SDK: the registry serves JSON that the shadcn CLI resolves into your own codebase, with the same tokens, the same conventions, and full ownership of the code afterward. The kit was originally extracted from Agatha, a research-agent workspace — the primitives earned their shapes in a real product before they were generalized.",
        ],
      },
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
    deepDive: [
      {
        heading: "Why existing evals miss",
        paragraphs: [
          "Existing agent evals — MMLU, SWE-bench, GAIA, AgentBench — measure autonomous task completion on synthetic, single-turn, closed-form tasks. That answers \"can the model finish this problem on its own?\", which is a fine question, but it is not the question a research, coding, or support agent has to answer in deployment. In deployment the agent runs a multi-step workflow with a real person at the other end, and the interesting failure modes are step-level, not output-level.",
          "A research workflow is five to nine steps. Looping during canvas creation, regenerating notes that drift from their sources, refusing to push back when the cited papers disagree with the user's thesis — these failures live across steps. A score on the final output doesn't see them.",
          "And tool selection — the most honest diagnostic there is — is almost never measured. Whether the agent reached for academic_search or invented a citation, read_pdf or paraphrased from a hallucinated abstract, says more than whether the prose reads well. eval-kit makes per-step expected-tools-versus-actual-calls a first-class assertion, with a strict, subset, or any matching mode per step.",
        ],
      },
      {
        heading: "Humans score, not LLMs",
        paragraphs: [
          "LLM-as-judge shares the blind spots of the agent it grades — both were trained against similar objectives, so the judge rationalizes the failures the agent makes for the same reasons the agent makes them: calibration drift, agency erosion, fabricated grounding. eval-kit's answer is a structured human rubric: every reviewed step gets a 0–3 golden-truth score plus 0–3 on the dimensions in scope — explainability, agency preservation, long-term capability, calibration, and collaborative performance — the same axes the Assist-Not-Complete paper argues for.",
          "The LLM is allowed exactly one role: optional pre-fill that a human accepts or overrides, flagged with pre_filled: true on every score it touches. Any human edit flips the flag. If LLM-judge ever became the default scorer, the framework would lose its reason to exist.",
          "Distractor tasks invert the usual assumption entirely. Suite tasks marked is_distraction — future-dated papers, unverifiable claims, out-of-scope asks — are pass-when-the-agent-pushes-back, not pass-when-it-tries. The framework scores the refusal, because in deployment, catching the trap is the competent behavior.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "You describe a multi-step workflow as YAML — Zod schemas are the source of truth for every shape — and run any agent against it through a small adapter contract (anthropic with tool-use and prompt caching, openai function-calling, a generic http adapter, or a deterministic mock). Tier-1 auto-scoring runs at trace time: tool-match and distraction-caught, computed mechanically. Tier-3 active triage then ranks the review inbox by where human attention pays off — low-confidence drafts and auto-score disagreements float up.",
          "The reviewer sits in a keyboard-first local dashboard — built on @hitl-kit/react primitives, dogfooding the sibling kit — scores step-by-step against golden truths, and the scored run becomes a JSON file on disk. A deterministic replay harness diffs runs across model versions; a CI gate exits non-zero on auto-scored regressions; an exporter turns approved scores into SFT or DPO training JSONL.",
          "Everything is file-based, single-user, and local by design — no auth, no multi-tenancy, no cloud. And aggregate scores are internal signal, not leaderboard fodder: every task in the seed suites is ported from observed real usage, and the framework's argument is that step-level human judgment is the eval signal.",
        ],
      },
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
    deepDive: [
      {
        heading: "The unstructured-string problem",
        paragraphs: [
          "Most \"tagging\" features in human-in-the-loop tools are unstructured strings: an annotator types a label, it gets stored next to the decision, and nobody can aggregate or score across them later. That's fine for one-off review, and useless the moment you want measurement.",
          "Real annotation is scoped. An annotator needs to say \"the audio at 0:12–0:24 is harassment; the video is fine\" — not render one whole-asset verdict. And real quality measurement is agreement: when two reviewers tag overlapping segments with the same label, that's agreement; when they tag disjoint ones, it isn't. Neither works on strings.",
          "tag-kit is what falls out when you take the tag layer out of a real moderation app — inertial — and ask: what's the smallest reusable shape for this? Bring your own taxonomy, bring your own UI, bring your own scoring loop; tag-kit ships the substrate.",
        ],
      },
      {
        heading: "Conservative by construction",
        paragraphs: [
          "The scoring core is deliberately cautious. Scope overlap follows conservative rules: different modality never matches, different asset never matches, and ranges must genuinely overlap — half-open intervals, so segments that merely touch don't count. Each expected tag is consumed at most once when computing precision and recall, which prevents double-counting a single ground-truth item against multiple reviewer tags. Per-tag precision, recall, and F1 aggregate across entities from there.",
          "Tag IDs are stable by convention — once a tagId ships in any catalog it never gets renamed, because it's the foreign key from persisted reviewer tags to your taxonomy. That's what lets tags survive UI rewrites and feed longitudinal scoring.",
          "The portability test for every API decision: does this still work for medical chart annotation, legal document review, and ML training-data labeling — not just content moderation? If a change only makes sense for one domain, it doesn't land.",
        ],
      },
      {
        heading: "Zero dependencies, zero styles",
        paragraphs: [
          "@tag-kit/core has zero runtime dependencies — no Zod, no lodash, nothing. It is a TypeScript-only set of wire shapes and pure functions, which means it drops into any stack, any bundler, any runtime, with no version-conflict surface at all.",
          "@tag-kit/ui is headless React: a catalog-browsing TagPicker and a TagChip, shipping zero CSS. Styling hooks are data-tag-kit-* attributes; markup override is a children render-prop. Your design system stays yours — the primitives only bring behavior.",
        ],
      },
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
    deepDive: [
      {
        heading: "Why a skill compiler",
        paragraphs: [
          "Claude's default knowledge is stack-agnostic, but most developers live inside one stack at a time. The same idea — reactive state, lifecycle, error boundaries, circuit composition — lands differently in React, Vue, Nuxt, and Qiskit, and a generic answer costs round-trips. Collapse exists to close that gap: collapsed skills carry your cross-stack vocabulary so Claude reaches for the right idiom on the first try, with trigger phrases derived from your own annotations.",
          "There's a second, quieter payoff. Writing the Vue version of a lesson after the React version forces you to see where the languages actually diverge — ref is pull-based, mutates .value in place, the wrapper itself is the dependency edge — distinctions you only feel by writing both side-by-side. The lesson captures that, and the compiled skill preserves it.",
        ],
      },
      {
        heading: "How the pipeline works",
        paragraphs: [
          "Three pluggable ingestors feed one typed pipeline. The MDX ingestor reads annotated lessons — code fences with line-level annotation metadata linked to sibling notes, scoped per-stack. The notebook ingestor accepts pasted or uploaded Jupyter .ipynb and MyST markdown, infers the kernel language, and auto-prefills annotations from MyST admonitions. And any new source format ships in about four files following a documented extension pattern.",
          "The template engine compiles each pattern into a SKILL.md: it composes Claude trigger phrases from your annotations and lesson titles, populates cross-language equivalents automatically from sibling stack-tabs, and renders YAML-frontmatter markdown. A three-tier quality linter (clean / info / warn) grades every draft on description length, trigger-phrase ambiguity, and naming — surfaced as verdict dots so weak skills are visible before they ship.",
          "Persistence is local and atomic: temp-file-plus-rename writes into ~/.claude/skills/, path traversal rejected, collisions returned as 409s with the existing description for diff context. No telemetry, no cloud, no database — the filesystem is the storage layer, which is exactly right for artifacts whose whole purpose is to live in your local Claude configuration.",
          "Next on the roadmap: the same pipeline, second output target — MCP server scaffolds. The ingestor layer doesn't change; the work is a template engine that emits a tool surface instead of a skill.",
        ],
      },
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
    name: "Hologram",
    oneLiner:
      "Live observability, guided skills, and an agent (MCP) surface for Blender → glTF pipelines.",
    why: [
      "Plenty of tools inspect a .glb. Hologram is the only one that puts a live feed of your agent's pipeline activity next to the assets it's producing, and hands that same pipeline to the agent as MCP tools — now including a render so the agent can see an export, not just count its nodes.",
      "Hologram watches a glTF asset pipeline and streams what's happening to a local dashboard in real time — including the tool calls your AI coding agent is making right now.",
      "Deliberately read-only / non-destructive. No framework, no build step, no database — a stdlib HTTP server, a JSONL event log, and pure-Python glTF parsing.",
    ],
    deepDive: [
      {
        heading: "Why it was built",
        paragraphs: [
          "Hologram comes from building games. The bulk of the asset work runs through Blender into glTF — characters, props, weapons — and at some point an AI coding agent became a real part of that pipeline: it writes the Blender scripts, runs the exports, and rearranges the .glb files that ship. That was a huge speed-up, right up until the realisation that there was no real idea what it was doing. Assets changed, exports appeared, and reconstructing which step touched which file meant scrolling back through a terminal.",
          "Hologram closes that gap. It tails a single event log and shows the agent's live activity — edits, shell commands, exports — right next to the assets those actions produce, in one local dashboard. Then it hands the agent that same pipeline back as a few MCP tools, so human and agent end up looking at the same picture instead of talking past each other.",
          "Plenty of tools inspect a .glb. Hologram is the only one that puts a live feed of your agent's pipeline activity next to the assets it's producing — and gives the agent a render, so it can see an export, not just count its nodes.",
        ],
      },
      {
        heading: "Constraints as design",
        paragraphs: [
          "Hologram is deliberately read-only / non-destructive: it observes, introspects, validates, and previews your pipeline, but it never modifies your assets. The one nuance is render_asset — it drives a live Blender to produce an image, in a throwaway scene with your scene restored afterward. Four tools are strictly read-only; the render is non-destructive. Checks you author run over assets but can't modify anything, and never run inside the MCP server.",
          "The second constraint is architectural austerity: no framework, no build step, no database. A stdlib HTTP server, a JSONL event log, and pure-Python glTF parsing. The MCP server imports none of your project code, and Hologram itself never imports bpy — it drives Blender over a socket, so its import purity stays intact. Austerity here isn't minimalism for its own sake; it's what makes the tool trustworthy enough to point at the pipeline that produces the assets you actually ship.",
        ],
      },
      {
        heading: "The pieces",
        paragraphs: [
          "Four pieces, none needing a manual install: an activity hook (a stdlib-only Claude Code hook that logs sessions, shell commands, edits, and MCP calls into the event log), the MCP server (launched by uvx per session), five guided skills (/hologram:start, inspect, check, status, create-skill — a natural-language front door), and the SSE dashboard you run in a terminal when you want eyes on the pipeline.",
          "On top of the live feed: read-only checks you author in .hologram/checks.py, fingerprint-based regression diffing so the dashboard can answer \"what changed since the last check\", and pipeline_status — one MCP read of what's wrong right now.",
        ],
      },
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
        body: "An MCP server with four read-only tools plus a non-destructive render — so the agent can see an export, not just count its nodes.",
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
