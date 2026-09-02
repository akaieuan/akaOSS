# akaoss.dev

Next.js 16 App Router, TypeScript, Tailwind v4, pnpm. Deployed from `main`.
The workspace `CLAUDE.md` one level up still applies: never push, open a PR or
merge without sign-off; facts are generated, never hand-typed; a repo change
is not done until `/projects/<slug>` matches it.

## Before pushing

```bash
pnpm verify
```

That is typecheck, the structure check, the HITL sync drift check, the facts
drift check, and a production build. Stop the dev server first: `next build`
rewrites `.next` under a running server and leaves it serving chunk hashes that
no longer exist.

## Conventions

- **Pages are composition.** A `page.tsx` holds metadata, the shell, and the
  imports; the sections it composes live in `components/features/<area>/`, one
  file per section, owned by that page. Shared vocabulary stays in
  `components/ui/`; the marks in `components/brand/`; data and loaders in
  `lib/`. No barrel files: every import names the file it comes from, so the
  server/client boundary stays visible.
- **Server by default.** A component stays server-rendered unless it needs
  state, an event, or a canvas, and the client boundary is drawn as deep in the
  tree as possible. `page.tsx` and `layout.tsx` are never `"use client"`.
- **Imports point one way.** `app/` imports `components/` and `lib/`;
  `components/` imports `lib/`; nothing imports `app/`. Siblings use `./`,
  everything else uses `@/`. Never `../`.
- **kebab-case files.** `nav.tsx`, `project-glyph.tsx`, `research.ts`. The one
  exception is `components/hitl/`, which is generated and keeps the package's
  names.
- **Three surfaces are generated and never hand-edited:** `components/hitl/`,
  `public/r/`, `lib/registry-items.ts`. Edit `hitl-ai2/packages/ui`, build its
  registry, run `pnpm hitl:sync` here, commit.
- **No em dashes in user-facing copy.** Sentences or colons.

`pnpm structure:check` enforces the layout rules; the spec is
`docs/superpowers/specs/2026-09-02-site-structure-design.md`.
