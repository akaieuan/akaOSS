# Site Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape the akaoss repo into a plain Next.js App Router layout, matching fkayion's conventions, with the layout rules enforced by a script that runs in `pnpm verify` and CI.

**Architecture:** Routes under `app/` hold only metadata, the shell and imports. Sections a page composes live in `components/features/<area>/`, shared vocabulary in `components/ui/`, the marks in `components/brand/`, data and loaders in `lib/`. The generated HITL Kit surfaces (`components/hitl/`, `public/r/`, `lib/registry-items.ts`) keep their sync contract and only lose the `src/` prefix. A structure check script states the rules and fails on violations.

**Tech Stack:** Next.js 16.2.12 (App Router), React 19.2.7, TypeScript 5, Tailwind v4, pnpm 10, Node 22. No test runner exists in this repo; the verification loop is `pnpm typecheck`, `pnpm lint`, `pnpm structure:check`, `pnpm hitl:check`, `pnpm build`.

**Spec:** `docs/superpowers/specs/2026-09-02-site-structure-design.md`

## Global Constraints

- Work in `/Users/ieuanking/Desktop/hilt-projs/akaoss` on branch `design/typography-motion`. Commit locally after every task. **Never push, open a PR, or merge without explicit sign-off** (workspace rule).
- **Stop the dev server before `pnpm build`.** `next build` rewrites `.next` under a running server and leaves it serving chunk hashes that no longer exist. If a preview server is running on port 3000, stop it first (`preview_stop`, or `lsof -ti:3000 | xargs kill`).
- **Delete iCloud duplicates before every typecheck.** The Desktop is iCloud-synced and leaves `* 2.ts` copies that break `tsc`:
  ```bash
  find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
  ```
- After Task 2 the alias `@/*` resolves to `./*` (repo root). Before Task 2 it resolves to `./src/*`.
- Hand-written files under `app/`, `components/`, `lib/` are **kebab-case**. `components/hitl/` is generated and keeps the package's PascalCase names.
- **No barrel files.** Every import names the file it comes from.
- **`components/` and `lib/` never import from `@/app/`. `lib/` never imports from `@/components/`.** Relative imports go to siblings only (`./x`), never `../`.
- **Generated surfaces are never hand-edited:** `components/hitl/**`, `public/r/**`, `lib/registry-items.ts`. Only their location changes (Task 2), via `git mv`.
- Use `git mv` for every move so history follows the file.
- No em dashes in user-facing copy or comments you write. Sentences or colons.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## File map

| Now | After |
|---|---|
| `src/app/**` | `app/**` (Task 2) |
| `src/components/hitl/**` | `components/hitl/**` (generated, Task 2) |
| `src/lib/registry-items.ts` | `lib/registry-items.ts` (generated, Task 2) |
| `src/lib/{projects,facts,utils}.ts` | `lib/{projects,facts,utils}.ts` (Task 2) |
| `src/lib/content.ts` | `lib/site.ts`, trimmed to BRAND, THESIS, PARADIGM (Task 3) |
| `src/app/research/posts.tsx` | `lib/research.ts` + `components/features/research/post-chips.tsx` (Task 3) |
| `src/app/components/_components/sections.ts` | `lib/library.ts` (Task 3) |
| `src/app/demo/_components/sections.ts` | `lib/style.ts` (Task 3) |
| `src/app/demo/_components/tokens.ts` | `lib/tokens.ts` (Task 3) |
| `src/components/site/{Nav,Footer,ThemeProvider,ThemeToggle,Hairline,AssistNotComplete}.tsx` | `components/ui/{nav,footer,theme-provider,theme-toggle,hairline,assist-not-complete}.tsx` (Task 4) |
| `src/components/home/SectionHead.tsx` | `components/ui/section-head.tsx` (Task 4) |
| `src/app/projects/copy-button.tsx` + inline copy in `registry/page.tsx` | `components/ui/copy-button.tsx` (Task 4) |
| `src/components/site/PixelHead.tsx` | `components/brand/pixel-head.tsx` (Task 4) |
| `src/components/home/ProjectGlyph.tsx` | `components/brand/project-glyph.tsx` (Task 4) |
| `src/components/home/{Hero,ProjectsGrid,Primitives,Thesis,LatestFinding}.tsx`, `shared.ts` | `components/features/home/{hero,projects-grid,primitives,thesis,latest-finding}.tsx`, `shared.ts` (Task 5) |
| `src/app/components/_components/{demo-ui,live,LibraryNav,LegacyAnchorRedirect}.tsx` | `components/features/library/{catalogue,specimens,library-nav,legacy-anchor-redirect}.tsx` (Task 5) |
| `src/app/demo/_components/{demo-ui,DemoNav}.tsx` | `components/features/style/{catalogue,style-nav}.tsx` (Task 6) |
| `src/components/inertial/*` | `components/features/research/inertial/*` kebab-case (Task 6) |
| `src/app/paper/PaperTOC.tsx` | `components/features/paper/paper-toc.tsx` (Task 6) |
| `src/app/paper/paper.css` | `app/prose.css` (Task 6) |
| `src/app/test/TestPageClient.tsx` | `components/features/registry/health-check.tsx` (Task 6) |
| `src/app/registry/page.tsx` (client) | `components/features/registry/install-guide.tsx` + thin server page (Task 6) |
| `src/app/demo/**` | `app/style/**`, redirect from `/demo` (Task 7) |
| `src/app/inertial/page.tsx` | deleted; redirect in `next.config.ts` (Task 7) |
| `public/{file,globe,next,vercel,window}.svg`, `docs/api-unification.md` | deleted (Task 7) |
| `app/projects/[slug]/page.tsx` (438 lines) | thin page + `components/features/projects/project-*.tsx` (Task 8) |
| new | `scripts/structure-check.mjs`, `CLAUDE.md`, README layout block, CI step (Tasks 1, 9) |

---

### Task 1: The structure check, red

The rules from the spec as a script. It fails on the current tree and goes green in Task 9. Nothing else in the repo changes in this task.

**Files:**
- Create: `scripts/structure-check.mjs`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `pnpm structure:check`, exit 0 with `✓ structure ok`, exit 1 with one `rule  path  (detail)` line per violation.

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
/**
 * structure-check.mjs: the repo layout, stated as rules a script can check.
 *
 * akaoss is a plain Next.js App Router site. Routes under `app/` hold
 * metadata, the shell and imports; the sections a page composes live in
 * `components/features/<area>/`; shared vocabulary in `components/ui/`; the
 * marks in `components/brand/`; data and loaders in `lib/`. Three surfaces
 * are generated by `pnpm hitl:sync` and exempt from naming rules:
 * `components/hitl/`, `public/r/`, `lib/registry-items.ts`.
 *
 * Rules (see docs/superpowers/specs/2026-09-02-site-structure-design.md):
 *   root-layout                  app/, components/, lib/ at the root; no src/
 *   no-route-private-components  no `_components/` under app/
 *   no-app-imports               components/ and lib/ never import @/app/
 *   lib-imports-ui               lib/ never imports @/components/
 *   no-barrels                   no index.ts(x) under components/ or lib/
 *   kebab-case                   file basenames are kebab-case
 *   no-parent-imports            no import path starts with ../
 *   pages-compose                page.tsx and layout.tsx are never "use client"
 *
 *   pnpm structure:check
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED = ["components/hitl/"];
const SOURCE_EXT = new Set([".ts", ".tsx", ".css", ".mjs"]);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+)*\.(ts|tsx|css|mjs)$/;

const problems = [];
const fail = (rule, path, detail) =>
  problems.push(`${rule.padEnd(28)} ${path}${detail ? `  (${detail})` : ""}`);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const rel = (p) => relative(ROOT, p).split("\\").join("/");
const isGenerated = (r) => GENERATED.some((g) => r.startsWith(g));
const isRouteFile = (r) => /^app\/(.*\/)?(page|layout)\.tsx$/.test(r);

// root-layout
for (const d of ["app", "components", "lib"]) {
  if (!existsSync(join(ROOT, d))) fail("root-layout", `${d}/`, "missing");
}
if (existsSync(join(ROOT, "src"))) {
  fail("root-layout", "src/", "app/, components/ and lib/ live at the root");
}

const files = ["app", "components", "lib"]
  .flatMap((d) => walk(join(ROOT, d)))
  .map(rel)
  .filter((r) => SOURCE_EXT.has(extname(r)))
  .sort();

for (const r of files) {
  const generated = isGenerated(r);
  const source = readFileSync(join(ROOT, r), "utf8");
  const imports = [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g), ...source.matchAll(/^\s*import\s+["']([^"']+)["']/gm)].map((m) => m[1]);

  if (r.startsWith("app/") && r.split("/").includes("_components")) {
    fail("no-route-private-components", r, "move to components/features/<area>/");
  }
  if (!generated && /(^|\/)index\.tsx?$/.test(r)) {
    fail("no-barrels", r, "import the file, not the folder");
  }
  if (!generated && !KEBAB.test(basename(r))) {
    fail("kebab-case", r);
  }
  if (!r.startsWith("app/") && imports.some((i) => i.startsWith("@/app/"))) {
    fail("no-app-imports", r, "components/ and lib/ never reach into app/");
  }
  if (r.startsWith("lib/") && imports.some((i) => i.startsWith("@/components/"))) {
    fail("lib-imports-ui", r, "data does not depend on UI");
  }
  if (!generated && imports.some((i) => i.startsWith("../"))) {
    fail("no-parent-imports", r, "siblings use ./, everything else uses @/");
  }
  if (isRouteFile(r) && /^\s*["']use client["']/m.test(source)) {
    fail("pages-compose", r, "client leaves belong in components/");
  }
}

if (problems.length) {
  console.error(`✗ structure: ${problems.length} problem${problems.length === 1 ? "" : "s"}\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error("\n  Rules: docs/superpowers/specs/2026-09-02-site-structure-design.md");
  process.exit(1);
}
console.log(`✓ structure ok (${files.length} files)`);
```

- [ ] **Step 2: Add the script to package.json**

In `package.json` `scripts`, after `"hitl:check"`, add:

```json
    "structure:check": "node scripts/structure-check.mjs",
```

Do not add it to `verify` yet; that happens in Task 9 once it is green.

- [ ] **Step 3: Run it and confirm it fails on the current tree**

Run: `pnpm structure:check`
Expected: exit 1, with these four lines and nothing else (the walker finds no root `app/`, `components/`, `lib/` yet, so only the layout rule fires):

```
root-layout                  app/  (missing)
root-layout                  components/  (missing)
root-layout                  lib/  (missing)
root-layout                  src/  (app/, components/ and lib/ live at the root)
```

- [ ] **Step 4: Lint the script**

Run: `pnpm lint`
Expected: 0 errors (the two pre-existing warnings in the demo pages are fine).

- [ ] **Step 5: Commit**

```bash
git add scripts/structure-check.mjs package.json
git commit -m "chore: structure check, the repo layout as rules

Red on purpose: the tree it describes lands over the next tasks.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Drop `src/`

Pure move. `app/`, `components/`, `lib/` go to the root, the alias follows, and every script or config that spelled `src/` is updated. Generated files move with `git mv` and are not regenerated.

**Files:**
- Move: `src/app` → `app`, `src/components` → `components`, `src/lib` → `lib`
- Modify: `tsconfig.json`, `scripts/hitl-sync.mjs`, `scripts/facts.ts`, `lib/facts.ts`, `app/demo/_components/tokens.ts`, `.github/workflows/registry.yml`

**Interfaces:**
- Produces: `@/*` → `./*`. Every existing `@/components/...` and `@/lib/...` import keeps working unchanged.

- [ ] **Step 1: Stop the dev server and clear stale generated types**

`.next/types` holds route types that spell `src/app/...`; they would break typecheck after the move.

```bash
lsof -ti:3000 | xargs kill 2>/dev/null; rm -rf .next tsconfig.tsbuildinfo
```

- [ ] **Step 2: Move the three directories**

```bash
git mv src/app app && git mv src/components components && git mv src/lib lib
rm -rf src
```

(`rm -rf src` clears the untracked `.DS_Store` files that `git mv` leaves behind. Confirm `ls src` reports no such directory.)

- [ ] **Step 3: Point the alias at the root**

`tsconfig.json`:

```json
    "paths": {
      "@/*": ["./*"]
    }
```

- [ ] **Step 4: Update the sync script's output paths**

`scripts/hitl-sync.mjs`:

Line 42–44:
```js
const OUT_COMPONENTS = join(SITE, "components", "hitl");
const OUT_REGISTRY = join(SITE, "public", "r");
const OUT_ITEMS = join(SITE, "lib", "registry-items.ts");
```

Line 143:
```js
  const paths = ["components/hitl", "public/r", "lib/registry-items.ts"];
```

Header comment, lines 6–7, 15, 17–18: replace each `src/components/hitl/` with `components/hitl/` and each `src/lib/registry-items.ts` with `lib/registry-items.ts`.

- [ ] **Step 5: Update the facts script imports**

`scripts/facts.ts` lines 18–19:
```ts
import { PROJECTS } from "../lib/projects.js";
import type { Facts } from "../lib/facts.js";
```

- [ ] **Step 6: Read facts.json through the alias**

`lib/facts.ts` line 12 (the old `../../facts.json` now points outside the repo):
```ts
import factsJson from "@/facts.json" with { type: "json" };
```

- [ ] **Step 7: Point the token reader at the moved stylesheet**

`app/demo/_components/tokens.ts` line 37:
```ts
  const file = path.join(process.cwd(), "app", "globals.css");
```

- [ ] **Step 8: Fix the CI comment**

`.github/workflows/registry.yml` line 31:
```yaml
      # components/hitl, public/r and lib/registry-items.ts are
```

- [ ] **Step 9: Check for any other `src/` spelling**

Run:
```bash
grep -rn "src/" app components lib scripts .github tsconfig.json next.config.ts | grep -v "smoke-test.sh"
```
Expected: no output. (`scripts/smoke-test.sh` legitimately spells `src/components/hitl` because it scaffolds a throwaway consumer project with `--src-dir`; that is the consumer's layout, not ours. `join(KIT, "packages", "core", "src")` in hitl-sync is the kit repo's path and does not match `src/`.) Fix anything else the grep shows the same way as above.

- [ ] **Step 10: Verify**

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm typecheck && pnpm lint && pnpm build
```
Expected: typecheck clean, lint 0 errors, build succeeds with the same route list as before (`/`, `/components/*`, `/demo/*`, `/paper`, `/projects/*`, `/registry`, `/research/*`, `/test`, `/inertial`).

Run: `pnpm structure:check`
Expected: `✗ structure: 46 problems`. `root-layout` no longer fires, and `lib/facts.ts` is clean after Step 6. The 46 remaining are exactly the ones later tasks fix: `no-route-private-components` (10 files under `app/components/_components` and `app/demo/_components`), `no-app-imports` (2: `components/home/LatestFinding.tsx`, `components/home/Primitives.tsx`), `kebab-case` (PascalCase files under `components/site`, `components/home`, `components/inertial`, `app/paper/PaperTOC.tsx`, `app/test/TestPageClient.tsx`, `app/components/_components/LibraryNav.tsx`, `LegacyAnchorRedirect.tsx`, `app/demo/_components/DemoNav.tsx`), `no-parent-imports` (the `../_components/...` and `../posts`, `../copy-button`, `../paper/paper.css` imports), `pages-compose` (`app/registry/page.tsx`).

- [ ] **Step 11: Commit, then confirm the generated surfaces did not drift**

```bash
git add -A
git commit -m "chore: drop src/, app, components and lib at the root

Same layout as fkayion: @/* resolves to the repo root. The generated
HITL surfaces move with git mv and are not regenerated; only the sync
script's output paths change.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
pnpm hitl:check
```
Expected: `✓ hitl up to date` (the sync script rewrites the same bytes into the new location, so `git diff` is empty).

---

### Task 3: Data out of routes into `lib/`

Four data modules leave route folders; the content loader loses its JSX; `content.ts` becomes `site.ts` with only what is used.

**Files:**
- Move: `app/research/posts.tsx` → `lib/research.ts`; `app/components/_components/sections.ts` → `lib/library.ts`; `app/demo/_components/sections.ts` → `lib/style.ts`; `app/demo/_components/tokens.ts` → `lib/tokens.ts`; `lib/content.ts` → `lib/site.ts`
- Create: `components/features/research/post-chips.tsx`
- Modify: `app/research/page.tsx`, `app/research/[slug]/page.tsx`, `components/home/LatestFinding.tsx`, `app/components/page.tsx`, `app/components/{decision,agent-state,evidence,composed,scales}/page.tsx`, `app/components/_components/{LibraryNav,LegacyAnchorRedirect}.tsx`, `app/demo/{page,layout}.tsx`, `app/demo/{marks,primitives,tokens}/page.tsx`, `app/demo/_components/DemoNav.tsx`, `components/home/{Hero,Thesis}.tsx`, `components/site/{Nav,Footer,AssistNotComplete}.tsx`

**Interfaces:**
- Produces: `lib/research.ts` exports `ResearchStatus`, `ResearchKind`, `ResearchFrontmatter`, `ResearchPost`, `TocEntry`, `getResearchPosts()`, `getResearchPost(slug)`, `extractToc(markdown)`, `formatDate(iso)`.
- Produces: `components/features/research/post-chips.tsx` exports `Bolded({ text })`, `Pill({ children, mono?, className? })`, `ChipRow({ post, className? })`.
- Produces: `lib/library.ts` exports unchanged: `LibrarySpecimen`, `LibraryGroup`, `LIBRARY_GROUPS`, `LEGACY_ANCHORS`, `LIBRARY_SPECIMEN_COUNT`, `groupBySlug`, `pagerFor`.
- Produces: `lib/style.ts` exports unchanged for now: `DemoSectionMeta`, `DEMO_SECTIONS`, `DEMO_NAV`, `demoNeighbours` (renamed in Task 7, hrefs still `/demo` until then).
- Produces: `lib/tokens.ts` exports unchanged: `TokenTable`, `CONTRAST`, `readTokenTables`.
- Produces: `lib/site.ts` exports `BRAND`, `THESIS`, `PARADIGM`.

- [ ] **Step 1: Split the research loader**

```bash
git mv app/research/posts.tsx lib/research.ts
```

In `lib/research.ts`: delete `import { cn } from "@/lib/utils";` (line 4), and delete everything from the comment `// ---- Minimal **bold** renderer for frontmatter strings` (line 139) through the end of `ChipRow` (line 203), leaving `formatDate` as the last export. The file now contains no JSX.

Create `components/features/research/post-chips.tsx` with the deleted code:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ResearchPost } from "@/lib/research";

/** Minimal **bold** renderer for frontmatter strings. */
export function Bolded({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-medium text-foreground">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function Pill({
  children,
  mono = false,
  className,
}: {
  children: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-muted-foreground",
        mono ? "font-mono text-meta" : "text-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Method/tool tags first, then models + experiment tooling in mono. */
export function ChipRow({
  post,
  className,
}: {
  post: Pick<ResearchPost, "tags" | "models">;
  className?: string;
}) {
  if (post.tags.length === 0 && post.models.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {post.tags.map((t) => (
        <Pill key={t}>{t}</Pill>
      ))}
      {post.models.map((m) => (
        <Pill key={m} mono>
          {m}
        </Pill>
      ))}
    </div>
  );
}
```

Update the three importers:

`app/research/page.tsx` line 5:
```ts
import { getResearchPosts, formatDate } from "@/lib/research";
import { ChipRow } from "@/components/features/research/post-chips";
```

`app/research/[slug]/page.tsx` lines 16–23:
```ts
import { getResearchPost, getResearchPosts, extractToc, formatDate } from "@/lib/research";
import { Bolded, ChipRow } from "@/components/features/research/post-chips";
```

`components/home/LatestFinding.tsx` line 2:
```ts
import { getResearchPosts } from "@/lib/research";
```

- [ ] **Step 2: Move the library table of contents**

```bash
git mv app/components/_components/sections.ts lib/library.ts
```

In `lib/library.ts`, replace the doc-comment sentence that names `src/lib/content.ts` (PATTERNS) so it reads:

```ts
 * The `id` on every entry is LOAD-BEARING. `/components#<id>` links exist in
 * the wild, and every one of those ids still has to resolve. Renaming an id
 * silently breaks an inbound link; adding a new specimen is free. See
 * `LEGACY_ANCHORS` below.
```

Update importers, replacing the relative path with `@/lib/library`:
- `app/components/page.tsx`: `from "./_components/sections"` → `from "@/lib/library"`
- `app/components/{decision,agent-state,evidence,composed,scales}/page.tsx`: `from "../_components/sections"` → `from "@/lib/library"`
- `app/components/_components/LibraryNav.tsx` and `LegacyAnchorRedirect.tsx`: `from "./sections"` → `from "@/lib/library"`

```bash
grep -rl "_components/sections\|from \"./sections\"" app/components | xargs sed -i '' -e 's#"\.\./_components/sections"#"@/lib/library"#; s#"\./_components/sections"#"@/lib/library"#; s#"\./sections"#"@/lib/library"#'
```

- [ ] **Step 3: Move the brand catalogue's table of contents and token reader**

```bash
git mv app/demo/_components/sections.ts lib/style.ts
git mv app/demo/_components/tokens.ts lib/tokens.ts
grep -rl "_components/sections\|_components/tokens\|from \"./sections\"" app/demo | xargs sed -i '' -e 's#"\.\./_components/sections"#"@/lib/style"#; s#"\./_components/sections"#"@/lib/style"#; s#"\./sections"#"@/lib/style"#; s#"\.\./_components/tokens"#"@/lib/tokens"#'
```

Leave the `/demo` hrefs inside `lib/style.ts` alone; Task 7 renames the route and flips them together.

- [ ] **Step 4: Trim content.ts into site.ts**

```bash
git mv lib/content.ts lib/site.ts
```

Replace the whole of `lib/site.ts` with:

```ts
/**
 * The studio's identity and the sentence it exists to make. Everything else
 * that used to live here (layer copy, evidence strips, an interlock diagram)
 * belonged to a homepage that no longer exists and was deleted with it.
 */

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

export const PARADIGM = {
  def: "Evaluate AI on whether it assists humans without displacing them, not on whether it can finish the task alone.",
  umbrella:
    "HITL Kit is the argument that we should measure AI differently, and the components that make the alternative buildable.",
};
```

Update the five importers:

```bash
grep -rl '@/lib/content' app components | xargs sed -i '' 's#@/lib/content#@/lib/site#'
```

Expected files touched: `components/home/Hero.tsx`, `components/home/Thesis.tsx`, `components/site/Nav.tsx`, `components/site/Footer.tsx`, `components/site/AssistNotComplete.tsx`.

- [ ] **Step 5: Verify**

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm typecheck && pnpm lint && pnpm structure:check; pnpm build
```
Expected: typecheck and lint clean; build succeeds. Structure check: `no-app-imports` drops to 1 (`components/home/Primitives.tsx`); `no-parent-imports` no longer lists `../posts` or `../_components/sections`; the rest as in Task 2.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: data out of route folders into lib/

research loader, the two catalogue tables of contents and the token
reader become lib modules; the research chips become a feature
component; content.ts becomes site.ts holding only what is used.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Chrome into `components/ui/`, marks into `components/brand/`

The site vocabulary gets one home with kebab-case names, and the duplicate copy button becomes one component.

**Files:**
- Move: `components/site/Nav.tsx` → `components/ui/nav.tsx`; `Footer.tsx` → `ui/footer.tsx`; `ThemeProvider.tsx` → `ui/theme-provider.tsx`; `ThemeToggle.tsx` → `ui/theme-toggle.tsx`; `Hairline.tsx` → `ui/hairline.tsx`; `AssistNotComplete.tsx` → `ui/assist-not-complete.tsx`; `components/home/SectionHead.tsx` → `ui/section-head.tsx`; `app/projects/copy-button.tsx` → `ui/copy-button.tsx`; `components/site/PixelHead.tsx` → `components/brand/pixel-head.tsx`; `components/home/ProjectGlyph.tsx` → `components/brand/project-glyph.tsx`
- Modify: every importer (listed in Step 2), `app/registry/page.tsx`

**Interfaces:**
- Produces: `@/components/ui/nav` (`Nav`, `NavActive`), `@/components/ui/footer` (`Footer`), `@/components/ui/theme-provider` (`ThemeProvider`), `@/components/ui/theme-toggle` (`ThemeToggle`), `@/components/ui/hairline` (`Hairline`), `@/components/ui/assist-not-complete` (`AssistNotComplete`), `@/components/ui/section-head` (`SectionHead`), `@/components/ui/copy-button` (`CopyButton({ text })`), `@/components/brand/pixel-head` (`PixelHead`, `PixelIcon`), `@/components/brand/project-glyph` (`ProjectGlyph`). Export names unchanged.

- [ ] **Step 1: Move the files**

```bash
mkdir -p components/ui components/brand
git mv components/site/Nav.tsx components/ui/nav.tsx
git mv components/site/Footer.tsx components/ui/footer.tsx
git mv components/site/ThemeProvider.tsx components/ui/theme-provider.tsx
git mv components/site/ThemeToggle.tsx components/ui/theme-toggle.tsx
git mv components/site/Hairline.tsx components/ui/hairline.tsx
git mv components/site/AssistNotComplete.tsx components/ui/assist-not-complete.tsx
git mv components/home/SectionHead.tsx components/ui/section-head.tsx
git mv app/projects/copy-button.tsx components/ui/copy-button.tsx
git mv components/site/PixelHead.tsx components/brand/pixel-head.tsx
git mv components/home/ProjectGlyph.tsx components/brand/project-glyph.tsx
rmdir components/site 2>/dev/null; ls components/site 2>&1
```
Expected: `components/site` is gone (if `.DS_Store` blocks `rmdir`, `rm -rf components/site`).

- [ ] **Step 2: Rewrite the imports**

```bash
grep -rl "components/site/\|components/home/SectionHead\|components/home/ProjectGlyph\|\"./SectionHead\"\|\"./ProjectGlyph\"\|\"../copy-button\"" app components lib | xargs sed -i '' \
  -e 's#@/components/site/Nav"#@/components/ui/nav"#' \
  -e 's#@/components/site/Footer"#@/components/ui/footer"#' \
  -e 's#@/components/site/ThemeProvider"#@/components/ui/theme-provider"#' \
  -e 's#@/components/site/ThemeToggle"#@/components/ui/theme-toggle"#' \
  -e 's#@/components/site/Hairline"#@/components/ui/hairline"#' \
  -e 's#@/components/site/AssistNotComplete"#@/components/ui/assist-not-complete"#' \
  -e 's#@/components/site/PixelHead"#@/components/brand/pixel-head"#' \
  -e 's#"\./SectionHead"#"@/components/ui/section-head"#' \
  -e 's#"\./ProjectGlyph"#"@/components/brand/project-glyph"#' \
  -e 's#"\.\./copy-button"#"@/components/ui/copy-button"#'
```

Then confirm nothing still spells the old paths:
```bash
grep -rn "components/site\|SectionHead\"\|ProjectGlyph\"\|PixelHead\"" app components lib
```
Expected: no output.

- [ ] **Step 3: Use the shared copy button on the registry page**

In `app/registry/page.tsx`:
- Delete the local `function CopyButton({ text }: { text: string }) { ... }` (lines 18–36, from the `function` line through its closing `}` immediately before `function InstallRow`).
- Add `import { CopyButton } from "@/components/ui/copy-button";` after the `@/lib/registry-items` import.
- Remove `Check` and `Copy` from the `lucide-react` import on line 5 if `pnpm lint` reports them unused (it will, unless `InstallRow` uses them; keep whichever it does).
- The shared button's label is "Copy command" rather than "Copy install command"; that is fine.

- [ ] **Step 4: Verify**

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm typecheck && pnpm lint && pnpm structure:check; pnpm build
```
Expected: typecheck and lint clean; build succeeds. Structure check: `kebab-case` no longer lists anything under `components/ui`, `components/brand`; `no-parent-imports` no longer lists `app/projects/[slug]/page.tsx`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: site vocabulary in components/ui, marks in components/brand

Kebab-case names, one copy button instead of two.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Home and library features

The landing sections and the `/components` scaffolding become feature folders. This is where the two inverted imports (a home section reaching into the `/components` route folder) get fixed.

**Files:**
- Move: `components/home/{Hero,ProjectsGrid,Primitives,Thesis,LatestFinding}.tsx`, `components/home/shared.ts` → `components/features/home/{hero,projects-grid,primitives,thesis,latest-finding}.tsx`, `shared.ts`
- Move: `app/components/_components/demo-ui.tsx` → `components/features/library/catalogue.tsx`; `live.tsx` → `library/specimens.tsx`; `LibraryNav.tsx` → `library/library-nav.tsx`; `LegacyAnchorRedirect.tsx` → `library/legacy-anchor-redirect.tsx`
- Modify: `app/page.tsx`, `app/components/{layout,page}.tsx`, `app/components/{decision,agent-state,evidence,composed,scales}/page.tsx`, `app/demo/primitives/page.tsx`, `components/features/home/primitives.tsx`, `components/features/library/specimens.tsx`

**Interfaces:**
- Produces: `@/components/features/home/{hero,projects-grid,primitives,thesis,latest-finding}` exporting `Hero`, `ProjectsGrid`, `Primitives`, `Thesis`, `LatestFinding`; `@/components/features/home/shared` exporting `reveal`, `stagger`, `primaryCta`, `arrowLink`, `arrowNudge`.
- Produces: `@/components/features/library/catalogue` exporting `LibraryBreadcrumb`, `LibraryHeader`, `DemoSection`, `Specimen`, `LibraryPager`; `@/components/features/library/specimens` exporting every `*Specimen`/`*Specimens` function (`SliderSpecimen`, `BadgeSpecimen`, `SegmentedScaleSpecimen`, `InterruptCardSpecimens`, `EditablePlanSpecimen`, `QASpecimen`, `ApprovalSpecimens`, `BatchSpecimen`, `MiniTraceSpecimen`, `ToolCallSpecimen`, `ContextStripSpecimen`, `SearchResultSpecimens`, `CitationSpecimen`, `DiffSpecimen`, `EvidenceSpecimen`, `WritingAgentSpecimen`, `ResearchAgentSpecimen`); `@/components/features/library/library-nav` exporting `LibraryNav`; `@/components/features/library/legacy-anchor-redirect` exporting `LegacyAnchorRedirect`.

- [ ] **Step 1: Move the home sections**

```bash
mkdir -p components/features/home
git mv components/home/Hero.tsx components/features/home/hero.tsx
git mv components/home/ProjectsGrid.tsx components/features/home/projects-grid.tsx
git mv components/home/Primitives.tsx components/features/home/primitives.tsx
git mv components/home/Thesis.tsx components/features/home/thesis.tsx
git mv components/home/LatestFinding.tsx components/features/home/latest-finding.tsx
git mv components/home/shared.ts components/features/home/shared.ts
rm -rf components/home
```

`app/page.tsx` lines 3–7:
```ts
import { Hero } from "@/components/features/home/hero";
import { ProjectsGrid } from "@/components/features/home/projects-grid";
import { Primitives } from "@/components/features/home/primitives";
import { Thesis } from "@/components/features/home/thesis";
import { LatestFinding } from "@/components/features/home/latest-finding";
```

`app/demo/primitives/page.tsx`: `from "@/components/home/shared"` → `from "@/components/features/home/shared"`.

Inside `components/features/home/hero.tsx`, the import `from "./shared"` still resolves (sibling). Confirm:
```bash
grep -rn "components/home" app components lib
```
Expected: no output.

- [ ] **Step 2: Move the library scaffolding**

```bash
mkdir -p components/features/library
git mv app/components/_components/demo-ui.tsx components/features/library/catalogue.tsx
git mv app/components/_components/live.tsx components/features/library/specimens.tsx
git mv app/components/_components/LibraryNav.tsx components/features/library/library-nav.tsx
git mv app/components/_components/LegacyAnchorRedirect.tsx components/features/library/legacy-anchor-redirect.tsx
rmdir app/components/_components 2>/dev/null || rm -rf app/components/_components
```

In `components/features/library/specimens.tsx`: line 19 comment `src/components/hitl/` → `components/hitl/`; the import `from "./demo-ui"` → `from "./catalogue"`.

In `components/features/home/primitives.tsx` line 8:
```ts
import { SliderSpecimen } from "@/components/features/library/specimens";
```

Rewrite the route imports:
```bash
grep -rl "_components/" app/components | xargs sed -i '' \
  -e 's#"\.\./_components/demo-ui"#"@/components/features/library/catalogue"#' \
  -e 's#"\./_components/demo-ui"#"@/components/features/library/catalogue"#' \
  -e 's#"\.\./_components/live"#"@/components/features/library/specimens"#' \
  -e 's#"\./_components/LibraryNav"#"@/components/features/library/library-nav"#' \
  -e 's#"\./_components/LegacyAnchorRedirect"#"@/components/features/library/legacy-anchor-redirect"#'
grep -rn "_components" app/components components/features/library
```
Expected: no output from the final grep.

- [ ] **Step 3: Verify**

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm typecheck && pnpm lint && pnpm structure:check; pnpm build
```
Expected: typecheck and lint clean; build succeeds. Structure check: `no-app-imports` is gone; `no-route-private-components` lists only the two files under `app/demo/_components`; `kebab-case` lists only `components/inertial/*`, `app/paper/PaperTOC.tsx`, `app/test/TestPageClient.tsx`, `app/demo/_components/DemoNav.tsx`; `no-parent-imports` lists only `app/demo/**` and `app/research/layout.tsx`; `pages-compose` lists `app/registry/page.tsx`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: home sections and library scaffolding as features

Nothing under components/ imports from app/ any more.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Style, research, paper and registry features

The remaining route-private files, the research exhibits, the paper contents rail, the shared prose stylesheet, and the two client pages that should be client leaves.

**Files:**
- Move: `app/demo/_components/demo-ui.tsx` → `components/features/style/catalogue.tsx`; `DemoNav.tsx` → `style/style-nav.tsx`
- Move: `components/inertial/AuditChain.tsx` → `components/features/research/inertial/audit-chain.tsx`; `ExhibitFrame.tsx` → `exhibit-frame.tsx`; `MandatedGate.tsx` → `mandated-gate.tsx`; `VerificationContrast.tsx` → `verification-contrast.tsx`; `fixtures.ts`, `sha256.ts`, `ui.ts` (or `ui.tsx`, keep its extension) → same names
- Move: `app/paper/PaperTOC.tsx` → `components/features/paper/paper-toc.tsx`; `app/paper/paper.css` → `app/prose.css`
- Move: `app/test/TestPageClient.tsx` → `components/features/registry/health-check.tsx`; `app/registry/page.tsx` → `components/features/registry/install-guide.tsx`
- Create: `app/registry/page.tsx` (thin)
- Modify: `app/demo/layout.tsx`, `app/demo/page.tsx`, `app/demo/{marks,primitives,tokens}/page.tsx`, `app/research/layout.tsx`, `app/research/[slug]/page.tsx`, `app/paper/layout.tsx`, `app/paper/page.tsx`, `app/test/page.tsx`, the moved inertial files (sibling imports only)

**Interfaces:**
- Produces: `@/components/features/style/catalogue` exporting `DemoHeader`, `DemoSection`, `TileGrid`, `Specimen`, `Well`, `Note`, `Mono`, `DemoPager` (renamed in Task 7); `@/components/features/style/style-nav` exporting `DemoNav` (renamed in Task 7).
- Produces: `@/components/features/research/inertial/{mandated-gate,audit-chain,verification-contrast}` exporting `MandatedGate`, `AuditChain`, `VerificationContrast`.
- Produces: `@/components/features/paper/paper-toc` exporting `PaperTOC`, `PAPER_TOC`.
- Produces: `@/components/features/registry/health-check` exporting `RegistryHealthCheck` (named, was default `TestPageClient`); `@/components/features/registry/install-guide` exporting `InstallGuide` (named, was default `RegistryPage`).
- Produces: `app/prose.css`, imported by `app/paper/layout.tsx` and `app/research/layout.tsx`.

- [ ] **Step 1: Style scaffolding**

```bash
mkdir -p components/features/style
git mv app/demo/_components/demo-ui.tsx components/features/style/catalogue.tsx
git mv app/demo/_components/DemoNav.tsx components/features/style/style-nav.tsx
rmdir app/demo/_components 2>/dev/null || rm -rf app/demo/_components
grep -rl "_components/" app/demo | xargs sed -i '' \
  -e 's#"\.\./_components/demo-ui"#"@/components/features/style/catalogue"#' \
  -e 's#"\./_components/demo-ui"#"@/components/features/style/catalogue"#' \
  -e 's#"\./_components/DemoNav"#"@/components/features/style/style-nav"#'
```

In `components/features/style/catalogue.tsx`, update the doc comment that names `app/components/_components/demo-ui.tsx` to name `components/features/library/catalogue.tsx`. Then:

```bash
grep -rn "_components" app components
```
Expected: no output.

- [ ] **Step 2: Research exhibits**

```bash
mkdir -p components/features/research/inertial
git mv components/inertial/AuditChain.tsx components/features/research/inertial/audit-chain.tsx
git mv components/inertial/ExhibitFrame.tsx components/features/research/inertial/exhibit-frame.tsx
git mv components/inertial/MandatedGate.tsx components/features/research/inertial/mandated-gate.tsx
git mv components/inertial/VerificationContrast.tsx components/features/research/inertial/verification-contrast.tsx
git mv components/inertial/fixtures.ts components/features/research/inertial/fixtures.ts
git mv components/inertial/sha256.ts components/features/research/inertial/sha256.ts
git mv components/inertial/ui.tsx components/features/research/inertial/ui.tsx
rm -rf components/inertial
```

Inside the moved files, imports of each other are `./ui`, `./fixtures`, `./sha256`, `./ExhibitFrame`: change any `"./ExhibitFrame"` to `"./exhibit-frame"`, `"./AuditChain"` to `"./audit-chain"`, `"./MandatedGate"` to `"./mandated-gate"`, `"./VerificationContrast"` to `"./verification-contrast"`:
```bash
sed -i '' -e 's#"\./ExhibitFrame"#"./exhibit-frame"#; s#"\./AuditChain"#"./audit-chain"#; s#"\./MandatedGate"#"./mandated-gate"#; s#"\./VerificationContrast"#"./verification-contrast"#' components/features/research/inertial/*.tsx
```

`app/research/[slug]/page.tsx` lines 13–15:
```ts
import { MandatedGate } from "@/components/features/research/inertial/mandated-gate";
import { AuditChain } from "@/components/features/research/inertial/audit-chain";
import { VerificationContrast } from "@/components/features/research/inertial/verification-contrast";
```

- [ ] **Step 3: Paper contents rail and the prose stylesheet**

```bash
mkdir -p components/features/paper
git mv app/paper/PaperTOC.tsx components/features/paper/paper-toc.tsx
git mv app/paper/paper.css app/prose.css
```

`app/paper/page.tsx`: `import { PaperTOC } from "./PaperTOC";` → `import { PaperTOC } from "@/components/features/paper/paper-toc";`

`app/paper/layout.tsx` line 1: `import "./paper.css";` → `import "@/app/prose.css";`

`app/research/layout.tsx` lines 1–2:
```ts
// The paper's .paper-body typography, shared with rendered research posts.
import "@/app/prose.css";
```

- [ ] **Step 4: Registry health page as a client leaf**

```bash
mkdir -p components/features/registry
git mv app/test/TestPageClient.tsx components/features/registry/health-check.tsx
```

In `components/features/registry/health-check.tsx`, change the default export to a named one: `export default function TestPageClient(` → `export function RegistryHealthCheck(`. If a `export default` line exists at the bottom instead, remove it and add `export` to the function declaration.

`app/test/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { RegistryHealthCheck } from "@/components/features/registry/health-check";

export const metadata = {
  title: "Registry health · akaOSS (dev)",
  robots: { index: false, follow: false },
};

/**
 * Dev-only gate. `process.env.NODE_ENV` is resolved at build time for
 * server components, so on a Vercel production build this branch runs
 * and Next statically marks /test as 404. In `pnpm dev` the other branch
 * runs and the page is accessible.
 */
export default function TestPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <RegistryHealthCheck />;
}
```

- [ ] **Step 5: Registry install page as a client leaf under a server page**

```bash
git mv app/registry/page.tsx components/features/registry/install-guide.tsx
```

In `components/features/registry/install-guide.tsx`: `export default function RegistryPage()` → `export function InstallGuide()`. Keep `"use client"` at the top; everything else unchanged.

Create `app/registry/page.tsx`:
```tsx
import type { Metadata } from "next";
import { InstallGuide } from "@/components/features/registry/install-guide";

export const metadata: Metadata = {
  title: "Registry · akaOSS",
  description:
    "Install any HITL Kit primitive with the shadcn CLI: the registry index, one command per component, and the accent tokens your globals.css needs first.",
};

export default function RegistryPage() {
  return <InstallGuide />;
}
```

- [ ] **Step 6: Verify**

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm typecheck && pnpm lint && pnpm structure:check; pnpm build
```
Expected: typecheck and lint clean; build succeeds; `/registry` now shows a `<title>` of "Registry · akaOSS". Structure check: every rule except `kebab-case` is clean, and `kebab-case` should list nothing either. If it lists anything, it is a file missed above: move it the same way.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: style, research, paper and registry features

Client pages become client leaves under thin server pages; the paper
stylesheet is shared prose at app/prose.css.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: `/demo` becomes `/style`; redirects into config; dead files out

The brand catalogue takes the name fkayion uses for the same thing, the old URL redirects, the one-line redirect page becomes a config entry, and leftovers go.

**Files:**
- Move: `app/demo` → `app/style`
- Modify: `lib/style.ts`, `components/features/style/{catalogue,style-nav}.tsx`, `app/style/**`, `next.config.ts`
- Delete: `app/inertial/page.tsx`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `docs/api-unification.md`

**Interfaces:**
- Produces: `lib/style.ts` exports `StyleSectionMeta`, `STYLE_SECTIONS`, `STYLE_NAV`, `styleNeighbours(slug)`; `components/features/style/style-nav` exports `StyleNav`; `components/features/style/catalogue` exports `StyleHeader`, `StylePager` (and `DemoSection`, `TileGrid`, `Specimen`, `Well`, `Note`, `Mono` unchanged).
- Produces: routes `/style`, `/style/marks`, `/style/primitives`, `/style/tokens`; permanent redirects `/demo/:path*` → `/style/:path*` and `/inertial` → `/research/006-signals-not-verdicts`.

- [ ] **Step 1: Move the route and rename the identifiers**

```bash
git mv app/demo app/style
sed -i '' \
  -e 's#"/demo"#"/style"#g; s#`/demo/#`/style/#g' \
  -e 's/DemoSectionMeta/StyleSectionMeta/g; s/DEMO_SECTIONS/STYLE_SECTIONS/g; s/DEMO_NAV/STYLE_NAV/g; s/demoNeighbours/styleNeighbours/g' \
  -e 's/DemoNav/StyleNav/g; s/DemoHeader/StyleHeader/g; s/DemoPager/StylePager/g' \
  lib/style.ts components/features/style/catalogue.tsx components/features/style/style-nav.tsx app/style/layout.tsx app/style/page.tsx app/style/marks/page.tsx app/style/primitives/page.tsx app/style/tokens/page.tsx
grep -rnE "demo|Demo[A-Z]" lib/style.ts components/features/style app/style | grep -v "DemoSection"
```
(macOS `sed` is BSD sed: no `\b`, and `-i ''` is required. The three identifier patterns are unique enough not to need word boundaries; `DemoSection` is untouched by them.)

Expected from the grep: only prose (comments or copy) that still says "demo" in the sense of "the brand demo". Rewrite those to "brand catalogue" or "style". `DemoSection` stays as the shared catalogue vocabulary.

Also update `lib/style.ts`'s doc comment: `/components` catalogues the product primitives; this catalogues the site's own vocabulary, at `/style`. And `app/style/page.tsx` meta string `not in the nav, not in the sitemap` is still true.

- [ ] **Step 2: Redirects into next.config.ts**

```bash
git rm -q app/inertial/page.tsx
```

`next.config.ts`, inside the returned array after the hitlkit.dev entry:

```ts
      // The brand catalogue was /demo; it is /style now, the name fkayion
      // uses for the same page. Unlisted and noindex, so this is belt and
      // braces for anyone who bookmarked it.
      { source: "/demo", destination: "/style", permanent: true },
      { source: "/demo/:path*", destination: "/style/:path*", permanent: true },
      // The inertial exhibits used to have their own page; they now render
      // inline in the essay that earns them.
      { source: "/inertial", destination: "/research/006-signals-not-verdicts", permanent: true },
```

- [ ] **Step 3: Delete the leftovers**

```bash
git rm -q public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg docs/api-unification.md
grep -rn "file.svg\|globe.svg\|next.svg\|vercel.svg\|window.svg\|api-unification" app components lib README.md
```
Expected: no output. (`docs/api-unification.md` was a stale copy of a HITL Kit design doc the kit repo owns and has since executed.)

- [ ] **Step 4: Verify, including the redirects**

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm typecheck && pnpm lint && pnpm structure:check && pnpm build
(pnpm start > /dev/null 2>&1 &) ; sleep 4
curl -sI http://localhost:3000/demo/marks | head -1
curl -sI http://localhost:3000/inertial | head -1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/style/tokens
lsof -ti:3000 | xargs kill
```
Expected: all four checks pass; the two redirect requests return `HTTP/1.1 308 Permanent Redirect`; `/style/tokens` returns `200`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "site: brand catalogue at /style, redirects in config, leftovers out

/demo meant the projects hub on fkayion and the brand catalogue here;
now both sites use the same word for the same thing. The inertial
redirect page becomes a config entry. create-next-app SVGs and a stale
copy of a HITL Kit design doc are removed.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: The project detail page as sections

`app/projects/[slug]/page.tsx` is 438 lines of ten sections in one function. Each section becomes a file under `components/features/projects/`, and the page becomes composition. Rendered HTML is unchanged.

**Files:**
- Create: `components/features/projects/project-hero.tsx`, `project-install.tsx`, `project-why.tsx`, `project-screenshots.tsx`, `project-deep-dive.tsx`, `project-features.tsx`, `project-library.tsx`, `project-packages.tsx`, `project-links.tsx`, `project-siblings.tsx`
- Modify: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `Project`, `PROJECTS`, `getProject`, `ACCENT_COLORS`, `PROJECT_BADGES` from `@/lib/projects`; `REGISTRY_ITEMS` from `@/lib/registry-items`; `npmVersion`, `pypiVersion` from `@/lib/facts`; `PixelHead` from `@/components/brand/pixel-head`; `CopyButton` from `@/components/ui/copy-button`.
- Produces: ten components, all server, all taking `{ project: Project }` except `ProjectLibrary()` (no props) and `ProjectSiblings({ current: Project })`. Each returns the exact `<section>` it replaces; the ones that were conditional return `null` under the same condition.

Line numbers below refer to the page as it stands at the start of this task (unchanged since Task 4 except the two import lines).

- [ ] **Step 0: Capture the rendered pages before touching anything**

Step 5 diffs the HTML before and after the split, so the "before" has to be captured first:

```bash
rm -rf .next && pnpm build
(pnpm start > /dev/null 2>&1 &) ; sleep 4
curl -s http://localhost:3000/projects/hitl-kit > /tmp/hitl-kit-before.html
curl -s http://localhost:3000/projects/hologram > /tmp/hologram-before.html
lsof -ti:3000 | xargs kill
```

- [ ] **Step 1: Hero**

`components/features/projects/project-hero.tsx`:
```tsx
import Link from "next/link";
import { PixelHead } from "@/components/brand/pixel-head";
import { ACCENT_COLORS, PROJECT_BADGES, type Project } from "@/lib/projects";

/** Breadcrumb, the project's own mark at hero scale, the one-liner, the status line. */
export function ProjectHero({ project }: { project: Project }) {
  const accent = ACCENT_COLORS[project.accent];
  return (
    <section className="py-20">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/projects" className="label transition-colors hover:text-foreground">
          Projects
        </Link>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-meta text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {project.name}
        </span>
      </div>

      {/* The canvas is aria-hidden, so the heading beside it carries the accessible name. */}
      <div className="flex items-start gap-5">
        <span aria-hidden className="mt-1 shrink-0">
          <PixelHead size={56} grid={18} gap={0.12} icon={PROJECT_BADGES[project.slug] ?? "spark"} once />
        </span>
        <h1 className="max-w-2xl text-title-1 font-light text-foreground">{project.oneLiner}</h1>
      </div>

      <p className="mt-6 max-w-2xl font-mono text-meta text-muted-foreground">{project.status}</p>
    </section>
  );
}
```

- [ ] **Step 2: Install, Why, Screenshots, Deep dive, Features**

Each of these is the `<section>` at the given lines, moved verbatim into a function that takes `{ project }: { project: Project }`. Imports needed are listed. The conditional wrappers become early returns.

`project-install.tsx`: lines 92–108. Imports: `CopyButton` from `@/components/ui/copy-button`, `type Project` from `@/lib/projects`.
```tsx
export function ProjectInstall({ project }: { project: Project }) {
  return (
    <section className="settle pb-16">
      {/* lines 93–107 verbatim */}
    </section>
  );
}
```

`project-why.tsx`: lines 111–122. Imports: `type Project`.
```tsx
export function ProjectWhy({ project }: { project: Project }) {
  return (
    <section className="settle pb-16">
      {/* lines 112–121 verbatim */}
    </section>
  );
}
```

`project-screenshots.tsx`: lines 126–154, with the `&&` guard turned into a return. Imports: `type Project`.
```tsx
/** The same images the repo README ships, so the site and the repo show one product. */
export function ProjectScreenshots({ project }: { project: Project }) {
  if (!project.screenshots || project.screenshots.length === 0) return null;
  return (
    <section className="pb-16">
      {/* lines 128–152 verbatim */}
    </section>
  );
}
```

`project-deep-dive.tsx`: lines 157–182. Imports: `type Project`.
```tsx
/** The small-research-paper treatment. */
export function ProjectDeepDive({ project }: { project: Project }) {
  if (project.deepDive.length === 0) return null;
  return (
    <section className="pb-16">
      {/* lines 159–180 verbatim */}
    </section>
  );
}
```

`project-features.tsx`: lines 185–207. Imports: `type Project`.
```tsx
export function ProjectFeatures({ project }: { project: Project }) {
  return (
    <section className="pb-16">
      {/* lines 186–206 verbatim */}
    </section>
  );
}
```

- [ ] **Step 3: Library, Packages, Links, Siblings**

`project-library.tsx`: lines 211–281. Imports: `Link` from `next/link`, `ArrowUpRight` from `lucide-react`, `REGISTRY_ITEMS` from `@/lib/registry-items`. No props; the page decides when to render it.
```tsx
/** HITL Kit only: the component library, itemized, with the two ways in. */
export function ProjectLibrary() {
  return (
    <section className="pb-16">
      {/* lines 212–280 verbatim */}
    </section>
  );
}
```

`project-packages.tsx`: lines 286–346. Imports: `ArrowUpRight`, `npmVersion`, `pypiVersion` from `@/lib/facts`, `type Project`.
```tsx
/** Hidden when the project ships nothing on npm or PyPI. */
export function ProjectPackages({ project }: { project: Project }) {
  if (project.packages.length === 0 && !project.pypi) return null;
  return (
    <section className="settle pb-16">
      {/* lines 287–345 verbatim */}
    </section>
  );
}
```

`project-links.tsx`: lines 350–392. Imports: `Link`, `ArrowUpRight`, `type Project`. The page's `hasLinks` becomes a local: `const hasLinks = project.links.length > 0;` (or simply map `project.links`, since mapping an empty array renders nothing; keep the guard to stay byte-identical).
```tsx
/** Deep dives where the project has them, then the repository. */
export function ProjectLinks({ project }: { project: Project }) {
  const hasLinks = project.links.length > 0;
  return (
    <section className="settle pb-16">
      {/* lines 351–391 verbatim */}
    </section>
  );
}
```

`project-siblings.tsx`: lines 395–432. Imports: `Link`, `ArrowUpRight`, `PROJECTS`, `ACCENT_COLORS`, `type Project`.
```tsx
export function ProjectSiblings({ current }: { current: Project }) {
  const siblings = PROJECTS.filter((p) => p.slug !== current.slug);
  return (
    <section className="pb-24">
      {/* lines 396–431 verbatim */}
    </section>
  );
}
```

- [ ] **Step 4: The page as composition**

Replace `app/projects/[slug]/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { PROJECTS, getProject } from "@/lib/projects";
import { ProjectHero } from "@/components/features/projects/project-hero";
import { ProjectInstall } from "@/components/features/projects/project-install";
import { ProjectWhy } from "@/components/features/projects/project-why";
import { ProjectScreenshots } from "@/components/features/projects/project-screenshots";
import { ProjectDeepDive } from "@/components/features/projects/project-deep-dive";
import { ProjectFeatures } from "@/components/features/projects/project-features";
import { ProjectLibrary } from "@/components/features/projects/project-library";
import { ProjectPackages } from "@/components/features/projects/project-packages";
import { ProjectLinks } from "@/components/features/projects/project-links";
import { ProjectSiblings } from "@/components/features/projects/project-siblings";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name}, ${project.oneLiner}`,
    description: project.oneLiner,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Nav active="projects" />
      <main className="mx-auto max-w-5xl px-6 md:px-8">
        <ProjectHero project={project} />
        <ProjectInstall project={project} />
        <ProjectWhy project={project} />
        <ProjectScreenshots project={project} />
        <ProjectDeepDive project={project} />
        <ProjectFeatures project={project} />
        {project.slug === "hitl-kit" && <ProjectLibrary />}
        <ProjectPackages project={project} />
        <ProjectLinks project={project} />
        <ProjectSiblings current={project} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Prove the HTML did not change**

Diff the two pages captured in Step 0 against the same pages built from the split:

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm typecheck && pnpm lint && pnpm structure:check && pnpm build
(pnpm start > /dev/null 2>&1 &) ; sleep 4
curl -s http://localhost:3000/projects/hitl-kit > /tmp/hitl-kit-after.html
curl -s http://localhost:3000/projects/hologram > /tmp/hologram-after.html
lsof -ti:3000 | xargs kill
diff <(sed 's/[a-f0-9]\{16,\}//g' /tmp/hitl-kit-before.html) <(sed 's/[a-f0-9]\{16,\}//g' /tmp/hitl-kit-after.html) && echo "hitl-kit identical"
diff <(sed 's/[a-f0-9]\{16,\}//g' /tmp/hologram-before.html) <(sed 's/[a-f0-9]\{16,\}//g' /tmp/hologram-after.html) && echo "hologram identical"
```
Expected: both print `identical` (the `sed` strips build hashes in chunk URLs). If a diff shows, a section's markup was not moved verbatim; fix the section, not the page.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: project detail page as ten sections

Pages are composition. The rendered HTML is unchanged.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Green check, CI, and the docs that describe the tree

**Files:**
- Modify: `package.json` (`verify`), `.github/workflows/ci.yml`, `README.md`
- Create: `CLAUDE.md` (akaoss)
- Modify (outside the repo): `/Users/ieuanking/Desktop/hilt-projs/CLAUDE.md`, the memory file `unified-ui-sync-contract.md` if it names `src/` paths

- [ ] **Step 1: Confirm the structure check is green**

Run: `pnpm structure:check`
Expected: `✓ structure ok (N files)`. If any line remains, fix it in the spirit of the task that owned that rule, then continue.

- [ ] **Step 2: Put it in verify and CI**

`package.json`:
```json
    "verify": "pnpm typecheck && pnpm structure:check && pnpm hitl:check && pnpm facts:check && pnpm build",
```

`.github/workflows/ci.yml`, after the `Typecheck` step:
```yaml
      # The repo layout is a set of rules, not a convention. See
      # docs/superpowers/specs/2026-09-02-site-structure-design.md.
      - name: Check repo structure
        run: pnpm structure:check
```

- [ ] **Step 3: README, the "What's in this repo" block**

Replace the fenced tree and the three bullets under "What's in this repo" with:

```
app/                    routes only: metadata, shell, imports
components/ui/          site vocabulary: nav, footer, theme, copy button
components/brand/       the marks: PixelHead, the project glyphs
components/features/    the sections each page composes, one folder per area
components/hitl/        GENERATED from @hitl-kit/ui by `pnpm hitl:sync`; do not edit
lib/                    data and loaders: projects, facts, research, the catalogue contents
lib/registry-items.ts   GENERATED, the registry index
public/r/               GENERATED, the shadcn registry served at /r/*.json
content/                the paper and the research posts (markdown + frontmatter)
experiments/            reproducible experiments backing research posts
scripts/                hitl-sync, facts, structure-check, smoke-test
```

- **Stack:** Next.js 16 (App Router) · Tailwind v4 CSS-first · next-themes (dark default, light "warm paper", `d` hotkey + header toggle) · file-based content, no CMS, no database.
- **The registry:** the primitives live in the HITL Kit repo as `@hitl-kit/ui`. `pnpm hitl:sync` copies the built registry into `public/r/` and derives `components/hitl/` and `lib/registry-items.ts` from it; `pnpm hitl:check` fails CI on drift. Existing consumer URLs on `hitlkit.dev/r/*` keep resolving via a domain alias to this site.
- **The research feed:** posts in `content/research/` follow a fixed shape: question, runs against real models, human-scored results, checked-in run JSON, repro link. Aggregate scores are internal signal, not leaderboard fodder.
- **The layout is checked:** `pnpm structure:check` enforces the rules in `docs/superpowers/specs/2026-09-02-site-structure-design.md`. It runs in `pnpm verify` and CI.

Also in the Develop block, replace `pnpm registry:build   # rebuild public/r after editing registry components` with `pnpm hitl:sync        # pull the built registry from ../hitl-ai2 and regenerate the site's copies` and `pnpm verify` with `pnpm verify           # typecheck + structure + registry drift + facts drift + production build`. Drop the number from "the 19 registry primitives" wherever the README states it (the count is a fact the site derives; the README should not hand-type it).

- [ ] **Step 4: akaoss/CLAUDE.md**

Create `CLAUDE.md` at the repo root:

```markdown
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
```

- [ ] **Step 5: The workspace CLAUDE.md and memory**

In `/Users/ieuanking/Desktop/hilt-projs/CLAUDE.md`, under "Counts worth not confusing", change `akaoss's src/components/hitl/, public/r/ and src/lib/registry-items.ts` to `akaoss's components/hitl/, public/r/ and lib/registry-items.ts`.

In the memory directory `/Users/ieuanking/.claude/projects/-Users-ieuanking-Desktop-hilt-projs-hitl-ai2/memory/`, open `unified-ui-sync-contract.md`; if it names `src/components/hitl` or `src/lib/registry-items.ts`, update those two paths. Nothing else changes.

- [ ] **Step 6: Final verify**

```bash
find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules | xargs -I{} rm "{}"
pnpm verify
```
Expected: every gate passes, ending in a successful production build. (`facts:check` reaches npm and PyPI; if it fails on a network error rather than drift, rerun it.)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: repo conventions; structure check in verify and CI

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Do not push. The branch `design/typography-motion` now carries the redesign and the restructure; opening the PR is the user's call.

---

## Self-review

**Spec coverage.** Rules 1–8 are the eight checks in Task 1. Every row of the spec's target tree is produced by a task: `app/` (2, 6, 7), `components/ui` and `components/brand` (4), `components/hitl` (2), `features/home` and `features/library` (5), `features/style`, `features/research`, `features/paper`, `features/registry` (6), `features/projects` (8), `lib/` (2, 3). Redirects and deletions (7). Docs and CI (9). Non-goals respected: no catalogue unification, no split of the `/style` pages, no edits inside generated surfaces.

**Placeholder scan.** Every code step shows the code or an exact `git mv`/`sed`. Task 8's "verbatim" sections cite line ranges in a file that exists unchanged until that task and show the wrapper each range lands in.

**Type consistency.** `RegistryHealthCheck` and `InstallGuide` are named the same in Task 6's interface block and in the page files. `STYLE_SECTIONS`, `STYLE_NAV`, `styleNeighbours`, `StyleNav`, `StyleHeader`, `StylePager` are introduced in Task 7 only; Task 6 documents the pre-rename names. `ProjectSiblings` takes `current`, not `project`, in both its file and the page. `formatDate` stays in `lib/research.ts` and is imported from there by both research pages.

## Follow-ups (not in this plan)

- Unify `components/features/library/catalogue.tsx` and `components/features/style/catalogue.tsx` into `components/ui/catalogue.tsx` once the two headers are the only difference.
- Split `app/style/{marks,primitives,tokens}/page.tsx` (672, 515, 435 lines) into `components/features/style/<page>/` sections, the way `/projects/[slug]` was split here.
- `/projects` index and `/projects/[slug]` still use the older card style; the redesign that reached the landing has not reached them. Sections make that easier now.
