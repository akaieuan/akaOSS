# akaOSS

**Open-source software for human-in-the-loop AI.**

A measurement family with one thesis, a reproducible research feed, and the HITL Kit component registry — served as one site at [akaoss.dev](https://www.akaoss.dev). Plus two developer tools that share the workshop, not the thesis.

[![CI](https://github.com/akaieuan/akaOSS/actions/workflows/ci.yml/badge.svg)](https://github.com/akaieuan/akaOSS/actions/workflows/ci.yml)
[![Registry](https://github.com/akaieuan/akaOSS/actions/workflows/registry.yml/badge.svg)](https://github.com/akaieuan/akaOSS/actions/workflows/registry.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4_CSS--first-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## The thesis

Benchmarks ask *"can the model complete this task autonomously?"* Deployment asks a different question: when the agent pauses for a human — an approval, an escalation, a review — **was that pause real oversight or a rubber stamp?** Every current protocol records that the pause happened; none records whether it did anything. The two are byte-identical in the event stream.

That gap grows as models improve. The more reliable the automation, the rarer the human moment — and the rarer the moment, the more the residual risk concentrates exactly where vigilance has decayed ([Bainbridge 1983](https://www.sciencedirect.com/science/article/abs/pii/0005109883900468); the automation-bias literature since). Regulation now mandates that oversight be *effective* (EU AI Act, Art. 14) while nothing measures whether it was. **The value of a gate is inversely proportional to how often it fires** — and the family below exists to measure the gate.

The argument in full: [**An AI Measurement Problem**](https://www.akaoss.dev/paper). Tested in public on the [research feed](https://www.akaoss.dev/research), where every finding is a reproducible experiment with checked-in runs — including the ones where our own instruments failed ([№ 007](https://www.akaoss.dev/research/007-absence-passes)).

## The measurement family

Three projects, one loop: HITL Kit renders the gate, eval-kit measures it, tag-kit calibrates the humans doing the measuring.

| Project | What it is | Status |
|---|---|---|
| [**HITL Kit**](https://github.com/akaieuan/HITL-KIT) · [site](https://www.akaoss.dev/projects/hitl-kit) | The protocol and surfaces of the approval moment: typed HITL events, composable gates, 19 React primitives via the shadcn CLI (registry served from this repo), six `@hitl-kit/*` packages on npm — schemas, gates, LangGraph / AI-SDK / MCP adapters. | v0.6 |
| [**eval-kit**](https://github.com/akaieuan/eval-kit) · [site](https://www.akaoss.dev/projects/eval-kit) | Measures whether the approval was real: mandated-gate compliance and discretionary ask-precision/blocker-recall scored from the trace — never averaged — plus a five-dimension human rubric. Humans score, not LLMs. | v0.4.0 on npm |
| [**tag-kit**](https://github.com/akaieuan/tag-kit) · [site](https://www.akaoss.dev/projects/tag-kit) | Calibrates the reviewers: structured tagging with per-modality scoping and scope-aware inter-rater agreement scoring. Zero-dependency core, headless React. | v0.3.1 on npm |

## Developer tooling

Separate work, same standards — these serve the building of software, not the measurement thesis.

| Project | What it is | Status |
|---|---|---|
| [**Collapse**](https://github.com/akaieuan/collapse) · [site](https://www.akaoss.dev/projects/collapse) | A Claude Code skill-building framework — compile MDX lessons and Jupyter notebooks into `SKILL.md` files and MCP tool scaffolds. | v0.2 |
| [**Hologram**](https://github.com/akaieuan/Hologram) · [site](https://www.akaoss.dev/projects/hologram) | Live observability, guided skills, and a non-destructive MCP surface for Blender → glTF pipelines. Stdlib Python, no build step. | v0.6.0 on PyPI |

## What's in this repo

This is the **site** repo. The projects above live in their own repos; this one holds:

```
src/app/               routes: / · /projects/[slug] · /research · /paper · /registry · /components
src/components/hitl/   the 19 registry primitives (source of truth for the shadcn registry)
src/components/site/   chrome: nav, footer, theming, the PixelHead mark
registry.json          shadcn registry manifest → built into public/r/*.json
content/research/      findings feed posts (markdown + frontmatter)
content/paper.md       An AI Measurement Problem
experiments/           reproducible experiments backing research posts (self-contained, npm-installed)
```

- **Stack:** Next.js 16 (App Router) · Tailwind v4 CSS-first · next-themes (dark default, light "warm paper", `d` hotkey + header toggle) · file-based content, no CMS, no database.
- **The registry:** `src/components/hitl/*` → `pnpm registry:build` → `public/r/*.json`, served at `/r/*.json`. Existing consumer URLs on `hitlkit.dev/r/*` keep resolving via a domain alias to this site. CI fails on registry drift.
- **The research feed:** posts in `content/research/` follow a fixed shape — question, runs against real models, human-scored results, checked-in run JSON, repro link. Aggregate scores are internal signal, not leaderboard fodder.

## Develop

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm verify           # typecheck + registry drift check + production build
pnpm registry:build   # rebuild public/r after editing registry components
```

## License

MIT © [Ieuan King](https://github.com/akaieuan)
