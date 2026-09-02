# Site structure: a plain Next.js app, laid out like fkayion

**Date:** 2026-09-02
**Status:** design, implemented by `docs/superpowers/plans/2026-09-02-site-structure.md`

## The problem

akaoss is a normal Next.js App Router site, but the tree does not read as one.
Someone opening the repo cannot tell, from the folder names alone, what is a
route, what is a section owned by a route, what is shared vocabulary, what is
data, and what is generated. Concretely:

- Everything sits under `src/`, unlike fkayion (the reference site), where
  `app/`, `components/` and `lib/` are at the root and `@/*` means `./*`.
- Two route folders carry private `_components/` directories holding data
  (`sections.ts`, `tokens.ts`), page scaffolding (`demo-ui.tsx`), client
  leaves (`live.tsx`, `LibraryNav.tsx`) and a redirect shim, so a route
  folder is also a component library and a data module.
- The dependency direction is inverted in two places: a landing section
  imports a specimen out of the `/components` route folder, and another
  imports the research loader out of the `/research` route folder.
  Components reaching into `app/` means nothing can be understood without
  reading the routes.
- The research content loader (`app/research/posts.tsx`) mixes file-system
  loading, frontmatter parsing and three JSX helpers in one route-private
  file.
- `lib/content.ts` is 177 lines of which four exports are used. The other
  eleven are copy for a homepage design that no longer exists.
- Two `CopyButton` components exist, one of them inline in a page.
- File naming is mixed: `Nav.tsx`, `PixelHead.tsx`, `demo-ui.tsx`,
  `copy-button.tsx`, `sections.ts`.
- `/demo` is the brand catalogue, but in fkayion `/demo` is the projects hub,
  so the same word means two different things across the two sites.
- `/inertial` is a one-line redirect stub that belongs in `next.config.ts`.
- Leftovers: five create-next-app SVGs in `public/`, and a stale copy of the
  HITL Kit API-unification doc that the kit repo owns and has since executed.

None of this is enforced by anything, so it drifts.

## The reference

fkayion's conventions (its `CLAUDE.md`), adopted here verbatim:

> **Pages are composition.** A `page.tsx` holds metadata, the shell, and the
> imports; the sections it composes live in `components/features/<area>/`,
> one file per section, owned by that page. Shared vocabulary stays in
> `components/ui/`; data stays in `lib/`. No barrel files: every import names
> the file it comes from, so the server/client boundary stays visible.
>
> **Server by default.** A component stays server-rendered unless it needs
> state, an event, or a canvas, and the client boundary is drawn as deep in
> the tree as possible.

Plus one akaoss-specific rule that already exists and stays: `components/hitl/`,
`public/r/` and `lib/registry-items.ts` are **generated** by `pnpm hitl:sync`
from `@hitl-kit/ui` and are never hand-edited. Generated files keep the
package's own file names.

## Target tree

```
app/                              routes only: metadata, shell, imports
  layout.tsx  page.tsx  globals.css  prose.css  icon.svg  sitemap.ts
  projects/page.tsx  projects/[slug]/page.tsx
  research/layout.tsx  research/page.tsx  research/[slug]/page.tsx
  paper/layout.tsx  paper/page.tsx
  components/layout.tsx  components/page.tsx  components/<group>/page.tsx   (5 groups)
  registry/page.tsx
  style/layout.tsx  style/page.tsx  style/{marks,primitives,tokens}/page.tsx  (was /demo)
  test/page.tsx                   dev-only registry health page
components/
  ui/                             site vocabulary: nav, footer, theme, hairline,
                                  assist-not-complete, section-head, copy-button
  brand/                          the marks: pixel-head, project-glyph
  hitl/                           GENERATED from @hitl-kit/ui, do not edit
  features/
    home/                         hero, projects-grid, primitives, thesis, latest-finding, shared
    projects/                     the detail page's sections, one file each
    library/                      /components scaffolding: catalogue, specimens, library-nav,
                                  legacy-anchor-redirect
    style/                        /style scaffolding: catalogue, style-nav
    research/                     post-chips, inertial/ (the exhibits one essay embeds)
    paper/                        paper-toc
    registry/                     install-guide, health-check
lib/                              data and loaders, no JSX, never imports components
  site.ts                         BRAND, THESIS, PARADIGM (was content.ts, trimmed)
  projects.ts  facts.ts  utils.ts
  registry-items.ts               GENERATED
  research.ts                     loader + frontmatter types (was app/research/posts.tsx)
  library.ts                      /components table of contents (was app/components/_components/sections.ts)
  style.ts                        /style table of contents (was app/demo/_components/sections.ts)
  tokens.ts                       reads app/globals.css at build time
content/  experiments/  docs/  public/  scripts/  facts.json
```

## Rules, checked by `scripts/structure-check.mjs`

1. **root-layout** — `app/`, `components/`, `lib/` at the root; no `src/`.
2. **no-route-private-components** — no `_components/` directory under `app/`.
3. **no-app-imports** — nothing under `components/` or `lib/` imports `@/app/`.
4. **lib-imports-ui** — nothing under `lib/` imports `@/components/`.
5. **no-barrels** — no `index.ts(x)` under `components/` or `lib/`, except in
   generated `components/hitl/`.
6. **kebab-case** — every `.ts`, `.tsx`, `.css`, `.mjs` under `app/`,
   `components/`, `lib/` has a kebab-case basename, except in generated
   `components/hitl/`.
7. **no-parent-imports** — no import path starts with `../`. Siblings use
   `./`, everything else uses `@/`.
8. **pages-compose** — no `page.tsx` or `layout.tsx` carries `"use client"`.
   Client leaves live in `components/`.

`pnpm structure:check` runs it; `pnpm verify` and CI include it.

## Non-goals

- No visual change. Every route renders the same HTML before and after,
  except `/demo` (now redirects to `/style`) and `/inertial` (redirect moves
  from a page to `next.config.ts`).
- The two catalogue scaffolds (`library/catalogue.tsx` and
  `style/catalogue.tsx`) stay separate. They diverged on purpose (breadcrumb
  vs unlisted label, `cols` prop, `ReactNode` descriptions) and unifying them
  is a design task, not a structure task.
- The three `/style` pages stay as single files. They are catalogue pages
  for an unlisted route; splitting them is a follow-up.
- No changes to `components/hitl/`, `public/r/` or `lib/registry-items.ts`
  beyond the path move. The sync contract with the HITL Kit repo is
  unchanged; only its output directory loses the `src/` prefix.
