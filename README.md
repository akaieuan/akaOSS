# akaOSS

**The akaOSS studio — open-source software for human-in-the-loop AI.**

Five projects, one thesis, a reproducible research feed, and the HITL Kit component registry — served as one site at [akaoss.dev](https://www.akaoss.dev).

[![CI](https://github.com/akaieuan/akaOSS/actions/workflows/ci.yml/badge.svg)](https://github.com/akaieuan/akaOSS/actions/workflows/ci.yml)
[![Registry](https://github.com/akaieuan/akaOSS/actions/workflows/registry.yml/badge.svg)](https://github.com/akaieuan/akaOSS/actions/workflows/registry.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4_CSS--first-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## The thesis

Current benchmarks ask *"can the model complete this task autonomously?"* In deployment, real users want an assistant that respects their authority, preserves their agency, and makes them better over time. **Assist-Not-Complete**: evaluate AI on whether it assists humans without displacing them, not on whether it can finish the task alone.

The argument is made in full in the paper — [**An AI Measurement Problem**](https://www.akaoss.dev/paper) — and tested in public in the [research feed](https://www.akaoss.dev/research), where every finding is a reproducible experiment run with the kits below.

## The projects

### Human-in-the-loop measurement

| Project | What it is | Status |
|---|---|---|
| [**HITL Kit**](https://github.com/akaieuan/HITL-KIT) · [site](https://www.akaoss.dev/projects/hitl-kit) | Human-in-the-loop AI, measured properly. 15 React primitives installable via the shadcn CLI (registry served from this repo), six `@hitl-kit/*` packages on npm — schemas, gates, LangGraph / AI-SDK / MCP adapters. | v0.6 |
| [**eval-kit**](https://github.com/akaieuan/eval-kit) · [site](https://www.akaoss.dev/projects/eval-kit) | A measurement instrument for multi-step research agents: YAML suites, per-step tool-match auto-scoring, a five-dimension human rubric, deterministic replay. Humans score, not LLMs. | v0.3.1 |
| [**tag-kit**](https://github.com/akaieuan/tag-kit) · [site](https://www.akaoss.dev/projects/tag-kit) | Structured tagging primitives for annotation workflows: per-modality scoping, scope-aware agreement scoring, headless React. | stable |

### Developer tooling

| Project | What it is | Status |
|---|---|---|
| [**Collapse**](https://github.com/akaieuan/collapse) · [site](https://www.akaoss.dev/projects/collapse) | A Claude Code skill-building framework — compile MDX lessons and Jupyter notebooks into `SKILL.md` files Claude reaches for first. | v0.1.0 |
| [**Hologram**](https://github.com/akaieuan/Hologram) · [site](https://www.akaoss.dev/projects/hologram) | Live observability, guided skills, and a non-destructive MCP surface for Blender → glTF pipelines. Stdlib Python, no build step. | v0.5.0 |

## What's in this repo

This is the **site** repo. The projects above live in their own repos; this one holds:

```
src/app/               routes: / · /projects/[slug] · /research · /paper · /registry · /components
src/components/hitl/   the 15 registry primitives (source of truth for the shadcn registry)
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
