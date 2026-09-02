import { REGISTRY_ITEMS } from "./registry-items";

/** Derived from the generated registry index; never hand-typed. */
const HITL_PRIMITIVE_COUNT = REGISTRY_ITEMS.filter(
  (i) => i.type === "registry:ui",
).length;

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
  /** Long-form sections. The "small research paper" treatment: why it was
   * built and how, sourced from each repo's own docs. */
  deepDive: { heading: string; paragraphs: string[] }[];
  status: string;
  install: { label: string; command: string }[];
  packages: string[]; // npm package names (empty for non-npm projects)
  /** PyPI package name, for projects that publish to PyPI instead of npm. */
  pypi?: string;
  features: { title: string; body: string }[];
  accent: "violet" | "amber" | "emerald" | "rose" | "blue"; // distinct per project
  repo: string; // github URL
  links: { label: string; href: string }[]; // deep-dives: hitl-kit gets /components + /registry
  /**
   * Product screenshots, reusing the SAME images the repo's README ships so
   * the site and the repo show one product. Live under
   * `public/projects/<slug>/`. Regenerate at the source repo, then copy:
* a positioning change is not done until this page matches.
   */
  screenshots?: { src: string; alt: string; caption: string }[];
}

/**
 * The PixelHead icon each project wears. Lives here rather than in a single
 * component because the grid, the nav dropdown and the project hero all need
 * the same answer, and three copies would drift.
 */
export const PROJECT_BADGES: Record<
  ProjectSlug,
  "head" | "podium" | "codetag" | "prompt"
> = {
  "hitl-kit": "head",
  "eval-kit": "podium",
  "tag-kit": "codetag",
  collapse: "prompt",
  hologram: "prompt",
};

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
      `${HITL_PRIMITIVE_COUNT} React primitives for human-in-the-loop agentic UIs. Each primitive is the physical embodiment of a specific claim from the paper.`,
      "Together: the paper is the argument, the components are the proof the argument is implementable, the registry is how you adopt it.",
    ],
    deepDive: [
      {
        heading: "The measurement problem",
        paragraphs: [
          "95% of enterprise AI pilots fail, not because the models are bad, but because we measure the wrong thing. Despite $30–40 billion in investment, 95% of organizations achieve zero measurable return from generative AI initiatives (Challapally et al., 2025). The paper argues this failure crisis is at root a measurement crisis.",
          "Current benchmarks ask one question: can the model complete this task autonomously? Deployment asks another: does it respect the user's authority, preserve their agency, and make them better over time? The benchmark-to-deployment gap is the distance between those two questions, and every component in this kit exists because something falls into that gap.",
          "The alternative is Assist-Not-Complete: evaluate AI on whether it assists humans without displacing them, not on whether it can finish the task alone. The paper synthesizes benchmark-saturation research (Ott et al., 2022, a large fraction of 3,765 mapped benchmarks quickly trending toward near-saturation), cognitive-debt findings from AI-assisted learning (Kosmyna et al., 2025), scaffolding theory (Dhillon et al., 2024), and uncertainty quantification (Liu et al., 2025) into that single reframing.",
        ],
      },
      {
        heading: "Every primitive embodies a claim",
        paragraphs: [
          "The component library is not a grab-bag of agent UI widgets. Each primitive is the physical embodiment of a specific claim from the paper. The MiniTrace instantiates the supporting-facts requirement from HotpotQA (Yang et al., 2018): an answer without its evidence trail is unverifiable, so the trace rides along. The AI Generation Scale operationalises Dhillon et al.'s scaffolding principle, their CHI study found sentence-level suggestions reduced writing quality while paragraph-level scaffolds improved it, so the scale makes the level of AI involvement a first-class, visible control. The Interrupt Card is the agency-preservation boundary: the moment the system pauses and the human decides.",
          "That traceability is the design discipline for the whole kit: if a primitive can't be tied to a claim the paper defends, it doesn't ship. The paper is the spec.",
        ],
      },
      {
        heading: "How it's built",
        paragraphs: [
          "The architecture is a protocol with adapters. @hitl-kit/core defines Zod event schemas, a framework-agnostic wire format for human-in-the-loop moments (approvals, interrupts, traces, generation-scale changes). @hitl-kit/react ships HitlEventRenderer, a typed dispatcher that maps validated events to UI primitives. @hitl-kit/gates adds composable decision gates: confidence, cost, scope, approval-chain, rate-limit, pure functions that wrap any adapter's emit point and decide allow, deny, or escalate.",
          "Three adapters carry the protocol into real agent stacks: LangGraph (emit events from interrupt() nodes, resume with typed Commands), the Vercel AI SDK (typed tool() wrappers), and MCP (an MCP server exposing the primitive event kinds as tools, so any MCP-aware client can emit schema-validated HITL events). The paper becomes the protocol; the protocol becomes the platform.",
          "The UI primitives live in one package, @hitl-kit/ui, and distribute two ways from that one source: as the package, or the shadcn way, copy, paste, own. The registry JSON the CLI resolves into your codebase is generated from the package source and drift-checked, so the copy you install and the copy the site demonstrates cannot disagree. Every primitive takes its core event as props and reports the human's decision through one typed onAction, whose vocabulary is shared: approve, reject, can't tell, undo. The kit was originally extracted from Agatha, a research-agent workspace. The primitives earned their shapes in a real product before they were generalized.",
        ],
      },
    ],
    status:
      "Deployed at hitlkit.dev · every primitive installs individually via the shadcn CLI · copy, paste, own.",
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
        title: `${HITL_PRIMITIVE_COUNT} React primitives, one API`,
        body: `${HITL_PRIMITIVE_COUNT} React primitives for human-in-the-loop agentic UIs, from one package, @hitl-kit/ui. Props are the event; every decision comes back through one typed onAction, and every surface offers approve, reject, can't tell, and undo.`,
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
    links: [], // component library + registry get a dedicated showcase section instead
  },
  {
    slug: "eval-kit",
    group: "measurement",
    name: "eval-kit",
    oneLiner:
      "Scores whether your agent respects human authority, stops when it must, asks when it should.",
    why: [
      "Agent protocols now standardise that an agent CAN pause for approval. Nothing measures whether it does, whether approval actually preceded the irreversible call, or whether the agent asked when it faced a real blocker.",
      "Mandated and discretionary gates are never averaged. Compliance is binary and ordering-sensitive; asking is a precision/recall problem. Collapsing them destroys the only information worth having.",
      "Humans score, not LLMs. Golden truth calibrates reviewers and thresholds. It is not a training signal.",
    ],
    deepDive: [
      {
        heading: "The gap regulation left open",
        paragraphs: [
          "The EU AI Act's Article 14 requires human oversight of high-risk systems to be effective, and explicitly names automation bias as something deployers must counter. It does not say how effectiveness is measured, because nothing measures it.",
          "That gap widens as models improve, which is the counterintuitive part. Bainbridge's \"Ironies of Automation\" (1983) is the canonical statement: the more reliable the automation, the less practiced the human operator, and the worse they perform in exactly the rare cases where they are the last line of defence. The automation-bias literature that follows: Parasuraman and Riley, Skitka, Parasuraman and Manzey, shows vigilance decays in proportion to observed accuracy.",
          "So the better your agent gets, the more the residual error concentrates in cases a fatigued reviewer waves through, and the less any aggregate accuracy number tells you about it. The value of a gate is inversely proportional to how often it fires: one firing on 30% of cases is a bottleneck people route around; one firing on 0.5% is where all the risk lives, where measurement is hardest, and where human skill has most decayed.",
        ],
      },
      {
        heading: "Two kinds of gate, never averaged",
        paragraphs: [
          "Mandated gates are policy: approval must precede this action. Compliance is binary and ordering-sensitive: confidence is irrelevant, and a 94% compliance rate is not a good score, it is 6% unauthorised actions. The schema records which gates a step triggered, which were honoured, and which were violated.",
          "Discretionary gates are judgment: should the agent have asked here? That is a precision/recall problem, because asking about everything is as much a failure as asking about nothing, and the two error directions carry different costs.",
          "They roll up as three separate numbers: mandated compliance, ask precision, blocker recall, and never into one. Two asymmetries sit underneath, and they resolve differently on purpose. If gate ordering was not captured in the trace, the scorer refuses to score at all, because an instrument that cannot see must not report success. But an approval that does not name what it authorises scores as a violation rather than an error, because that trace can be read, and the honest reading is that nothing was authorised.",
        ],
      },
      {
        heading: "What the reviewer actually sees",
        paragraphs: [
          "Ordering is the compliance claim, so ordering is drawn rather than summarised. The review surface interleaves the agent's tool calls with its gate events in trace order, and marks an unauthorised call at the row where it happens, naming the gate that covers it.",
          "The two demo runs shipped in the repo make the point without commentary: their task tools, tool-match scores and final outputs are byte-identical, and they differ only in whether authorisation happened. Six gated calls authorised versus six unauthorised. A benchmark scores those two runs the same.",
          "Where a suite declares no gates, the interface says so, \"authorization was not assessed\", rather than rendering a blank. Absence of measurement is stated, never left to look like a clean result.",
        ],
      },
      {
        heading: "Where this applies",
        paragraphs: [
          "Anywhere a decision creates an obligation or a record that outlives it: content moderation, customer support, public-sector determinations, and scientific or academic review. The gate is the unit; the domain is an instance.",
          "Known limits are stated up front rather than left implicit. Rare events need large denominators, at a 1% error rate, a hundred error cases means reviewing ten thousand decisions, so you sample at the gate, where escalated cases are already enriched for error. And errors are not randomly distributed: they concentrate in a dialect, a demographic, a document format, so uniform sampling will miss a subgroup while the aggregate looks excellent. Stratified audit is a requirement, not a nice-to-have.",
        ],
      },
    ],
    status:
      "The gates release · mandated compliance and discretionary precision/recall scored from the trace, never averaged · three reference suites · four adapters (anthropic, openai, http, mock) · file-based, single-user, not a hosted service.",
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
        body: "Five human-scored dimensions per step: explainability, agency preservation, long-term capability, calibration, collaborative performance (0–3 scale + golden truth).",
      },
      {
        title: "Humans score, not LLMs",
        body: "LLM-as-judge only as opt-in pre-fill, flagged on every score.",
      },
      {
        title: "Distractors score the refusal",
        body: "Tasks marked is_distraction, future-dated papers, unverifiable claims, are pass-when-the-agent-pushes-back.",
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
    screenshots: [
      {
        src: "/projects/eval-kit/review.png",
        alt: "The review surface: a trace with two tool calls marked unauthorized beneath a tools-matched badge",
        caption:
          "The trace, in order. `issue_refund` and `apply_account_credit` are marked UNAUTHORIZED, called with no prior approval, directly beneath a green TOOLS MATCHED badge. The agent did the task correctly and skipped the authorization; a benchmark scores this run as a pass.",
      },
      {
        src: "/projects/eval-kit/inbox.png",
        alt: "The triage queue: a compact rail of pending steps beside the selected step's evidence",
        caption:
          "Triage. The rail answers one question, is this worth my attention next, and gate violations outrank every other signal. Everything needed to act sits in the pane beside it, with the rubric pinned to the bottom so the next decision is always where the last one was.",
      },
      {
        src: "/projects/eval-kit/overview.png",
        alt: "Overview with gate compliance, ask precision and blocker recall as three separate cards",
        caption:
          "Three numbers, never one. Mandated compliance is shown as a count rather than a percentage: 0/3 reads as three unauthorized actions, where 0% reads as a grade.",
      },
      {
        src: "/projects/eval-kit/diff.png",
        alt: "Step-by-step diff between two scored runs",
        caption:
          "Replay and diff. Runs are JSON on disk, so a finding is reproducible by anyone from the repo alone.",
      },
    ],
    links: [],
  },
  {
    slug: "tag-kit",
    group: "measurement",
    name: "tag-kit",
    oneLiner:
      "Structured tagging primitives for human-in-the-loop annotation workflows.",
    why: [
      "Bring your own taxonomy, bring your own UI, bring your own scoring loop, tag-kit ships the substrate.",
      "Most “tagging” features in HITL tools are unstructured strings: you type a label, it gets stored next to the decision, and then nobody can aggregate or score across them later.",
      "Extracted from a real moderation app (inertial).",
    ],
    deepDive: [
      {
        heading: "The unstructured-string problem",
        paragraphs: [
          "Most \"tagging\" features in human-in-the-loop tools are unstructured strings: an annotator types a label, it gets stored next to the decision, and nobody can aggregate or score across them later. That's fine for one-off review, and useless the moment you want measurement.",
          "Real annotation is scoped. An annotator needs to say \"the audio at 0:12–0:24 is harassment; the video is fine\", not render one whole-asset verdict. And real quality measurement is agreement: when two reviewers tag overlapping segments with the same label, that's agreement; when they tag disjoint ones, it isn't. Neither works on strings.",
          "tag-kit is what falls out when you take the tag layer out of a real moderation app, inertial, and ask: what's the smallest reusable shape for this? Bring your own taxonomy, bring your own UI, bring your own scoring loop; tag-kit ships the substrate.",
        ],
      },
      {
        heading: "Conservative by construction",
        paragraphs: [
          "The scoring core is deliberately cautious. Scope overlap follows conservative rules: different modality never matches, different asset never matches, and ranges must genuinely overlap, half-open intervals, so segments that merely touch don't count. Each expected tag is consumed at most once when computing precision and recall, which prevents double-counting a single ground-truth item against multiple reviewer tags. Per-tag precision, recall, and F1 aggregate across entities from there.",
          "Tag IDs are stable by convention, once a tagId ships in any catalog it never gets renamed, because it's the foreign key from persisted reviewer tags to your taxonomy. That's what lets tags survive UI rewrites and feed longitudinal scoring.",
          "The portability test for every API decision: does this still work for medical chart annotation, legal document review, and ML training-data labeling, not just content moderation? If a change only makes sense for one domain, it doesn't land.",
        ],
      },
      {
        heading: "Zero dependencies, zero styles",
        paragraphs: [
          "@tag-kit/core has zero runtime dependencies: no Zod, no lodash, nothing. It is a TypeScript-only set of wire shapes and pure functions, which means it drops into any stack, any bundler, any runtime, with no version-conflict surface at all.",
          "@tag-kit/ui is headless React: a catalog-browsing TagPicker and a TagChip, shipping zero CSS. Styling hooks are data-tag-kit-* attributes; markup override is a children render-prop. Your design system stays yours. The primitives only bring behavior.",
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
      "Claude's default knowledge is stack-agnostic, but most developers live inside one stack at a time. The same idea: reactive state, lifecycle, error boundaries, circuit composition: lands differently in React, Vue, Nuxt, and Qiskit, and a “generic” answer costs round-trips. Collapsed skills carry your cross-stack vocabulary so Claude reaches for the right idiom on the first try.",
      "Three pluggable ingestors (MDX lessons, Jupyter .ipynb / MyST .md, and a one-file extension pattern for any source format) feed a typed pipeline that compiles each pattern into a SKILL.md and atomically writes it to ~/.claude/skills/.",
      "No telemetry. No cloud. No database. The filesystem is the storage layer. Next.js 16 + TypeScript.",
    ],
    deepDive: [
      {
        heading: "Why a skill compiler",
        paragraphs: [
          "Claude's default knowledge is stack-agnostic, but most developers live inside one stack at a time. The same idea: reactive state, lifecycle, error boundaries, circuit composition: lands differently in React, Vue, Nuxt, and Qiskit, and a generic answer costs round-trips. Collapse exists to close that gap: collapsed skills carry your cross-stack vocabulary so Claude reaches for the right idiom on the first try, with trigger phrases derived from your own annotations.",
          "There's a second, quieter payoff. Writing the Vue version of a lesson after the React version forces you to see where the languages actually diverge, ref is pull-based, mutates .value in place, the wrapper itself is the dependency edge, distinctions you only feel by writing both side-by-side. The lesson captures that, and the compiled skill preserves it.",
        ],
      },
      {
        heading: "How the pipeline works",
        paragraphs: [
          "Three pluggable ingestors feed one typed pipeline. The MDX ingestor reads annotated lessons, code fences with line-level annotation metadata linked to sibling notes, scoped per-stack. The notebook ingestor accepts pasted or uploaded Jupyter .ipynb and MyST markdown, infers the kernel language, and auto-prefills annotations from MyST admonitions. And any new source format ships in about four files following a documented extension pattern.",
          "The template engine compiles each pattern into a SKILL.md: it composes Claude trigger phrases from your annotations and lesson titles, populates cross-language equivalents automatically from sibling stack-tabs, and renders YAML-frontmatter markdown. A three-tier quality linter (clean / info / warn) grades every draft on description length, trigger-phrase ambiguity, and naming, surfaced as verdict dots so weak skills are visible before they ship.",
          "Persistence is local and atomic: temp-file-plus-rename writes into ~/.claude/skills/, path traversal rejected, collisions returned as 409s with the existing description for diff context. No telemetry, no cloud, no database. The filesystem is the storage layer, which is exactly right for artifacts whose whole purpose is to live in your local Claude configuration.",
          "Next on the roadmap: the same pipeline, second output target, MCP server scaffolds. The ingestor layer doesn't change; the work is a template engine that emits a tool surface instead of a skill.",
        ],
      },
    ],
    status:
      "Active development. Shipped: MDX ingestor with 21 cross-stack reference lessons, notebook ingestor with admonition auto-prefill, template engine with cross-language equivalents + trigger-phrase derivation, atomic persistence, three-tier skill quality linter, and MCP server scaffold generation. One annotation can now become a skill or a working MCP tool.",
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
      "Plenty of tools inspect a .glb. Hologram is the only one that puts a live feed of your agent's pipeline activity next to the assets it's producing, and hands that same pipeline to the agent as MCP tools, now including a render so the agent can see an export, not just count its nodes.",
      "Hologram watches a glTF asset pipeline and streams what's happening to a local dashboard in real time, including the tool calls your AI coding agent is making right now.",
      "Deliberately read-only / non-destructive. No framework, no build step, no database: a stdlib HTTP server, a JSONL event log, and pure-Python glTF parsing.",
    ],
    deepDive: [
      {
        heading: "Why it was built",
        paragraphs: [
          "Hologram comes from building games. The bulk of the asset work runs through Blender into glTF: characters, props, weapons, and at some point an AI coding agent became a real part of that pipeline: it writes the Blender scripts, runs the exports, and rearranges the .glb files that ship. That was a huge speed-up, right up until the realisation that there was no real idea what it was doing. Assets changed, exports appeared, and reconstructing which step touched which file meant scrolling back through a terminal.",
          "Hologram closes that gap. It tails a single event log and shows the agent's live activity: edits, shell commands, exports, right next to the assets those actions produce, in one local dashboard. Then it hands the agent that same pipeline back as a few MCP tools, so human and agent end up looking at the same picture instead of talking past each other.",
          "Plenty of tools inspect a .glb. Hologram is the only one that puts a live feed of your agent's pipeline activity next to the assets it's producing: and gives the agent a render, so it can see an export, not just count its nodes.",
        ],
      },
      {
        heading: "Constraints as design",
        paragraphs: [
          "Hologram is deliberately read-only / non-destructive: it observes, introspects, validates, and previews your pipeline, but it never modifies your assets. The one nuance is render_asset. It drives a live Blender to produce an image, in a throwaway scene with your scene restored afterward. Four tools are strictly read-only; the render is non-destructive. Checks you author run over assets but can't modify anything, and never run inside the MCP server.",
          "The second constraint is architectural austerity: no framework, no build step, no database. A stdlib HTTP server, a JSONL event log, and pure-Python glTF parsing. The MCP server imports none of your project code, and Hologram itself never imports bpy. It drives Blender over a socket, so its import purity stays intact. Austerity here isn't minimalism for its own sake; it's what makes the tool trustworthy enough to point at the pipeline that produces the assets you actually ship.",
        ],
      },
      {
        heading: "The pieces",
        paragraphs: [
          "Four pieces, none needing a manual install: an activity hook (a stdlib-only Claude Code hook that logs sessions, shell commands, edits, and MCP calls into the event log), the MCP server (launched by uvx per session), five guided skills (/hologram:start, inspect, check, status, create-skill, a natural-language front door), and the SSE dashboard you run in a terminal when you want eyes on the pipeline.",
          "On top of the live feed: read-only checks you author in .hologram/checks.py, fingerprint-based regression diffing so the dashboard can answer \"what changed since the last check\", and pipeline_status. One MCP read of what's wrong right now.",
        ],
      },
    ],
    status: "On PyPI as hologram-gltf · Python 3.10+ · MIT.",
    install: [
      {
        label: "Run the dashboard",
        command:
          "uvx --from hologram-gltf hologram dashboard",
      },
    ],
    packages: [],
    pypi: "hologram-gltf",
    features: [
      {
        title: "Live pipeline feed",
        body: "Watches a glTF asset pipeline and streams what's happening to a local dashboard in real time, including the tool calls your AI coding agent is making right now.",
      },
      {
        title: "MCP agent surface",
        body: "An MCP server with four read-only tools plus a non-destructive render, so the agent can see an export, not just count its nodes.",
      },
      {
        title: "Guided skills",
        body: "A Claude Code plugin with guided skills, /hologram:start, inspect, check, status, create-skill.",
      },
      {
        title: "Read-only by design",
        body: "Deliberately read-only / non-destructive. No framework, no build step, no database: a stdlib HTTP server, a JSONL event log, and pure-Python glTF parsing.",
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
