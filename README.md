# akaOSS

The studio site at [akaoss.dev](https://www.akaoss.dev) — five open-source projects for human-in-the-loop AI measurement and developer tooling, one thesis, and a findings feed.

## The projects

**Human-in-the-loop measurement**

- [HITL Kit](https://github.com/akaieuan/HITL-KIT) — Human-in-the-loop AI, measured properly. 15 React primitives via the shadcn registry (served from this site at `/r/*.json`), six packages on npm.
- [eval-kit](https://github.com/akaieuan/eval-kit) — a measurement instrument for multi-step research agents. Humans score, not LLMs.
- [tag-kit](https://github.com/akaieuan/tag-kit) — structured tagging primitives for human-in-the-loop annotation workflows.

**Developer tooling**

- [Collapse](https://github.com/akaieuan/collapse) — a Claude Code skill-building framework.
- [Hologram](https://github.com/akaieuan/Hologram) — live observability, guided skills, and an MCP surface for Blender → glTF pipelines.

## This repo

Next.js 16 · Tailwind v4 (CSS-first) · dark/light theming · file-based research posts (`content/research/*.md`) · reproducible experiments under `experiments/`.

It also builds and serves the **HITL Kit shadcn registry**: `registry.json` → `pnpm registry:build` → `public/r/*.json`. Registry component source lives in `src/components/hitl/`. Existing consumer install URLs on `hitlkit.dev/r/*` continue to resolve via a domain alias to this site.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm verify     # typecheck + registry drift check + production build
```

## The thesis

Current benchmarks ask "can the model complete this task autonomously?" In deployment, real users want an assistant that respects their authority, preserves their agency, and makes them better over time. **Assist-Not-Complete**: evaluate AI on whether it assists humans without displacing them. Read the paper: [A Measurement Problem](https://www.akaoss.dev/paper).

## License

MIT © Ieuan King
