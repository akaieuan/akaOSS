# Derived facts: versions come from the registries, not from prose

**Date:** 2026-08-12
**Status:** approved, implemented in `feat/derived-facts`
**Scope:** akaoss only. No other repo is modified.

## The problem

akaoss is a publishing surface for facts about five sibling repos, and every
one of those facts was retyped by hand. There was no mechanism keeping any of
them true. The record:

| evidence | claim |
| --- | --- |
| PR #32 | "fix version/count drift" |
| `fix/registry-drift` | "correct primitive count to 16" |
| `chore/version-currency` | "site reflects the shipped releases" |
| PR #36 | stale screenshots, wrong gate-scoring claim |

Four corrections, one root cause. This is the failure mode research № 007 is
about: the page asserts things, nothing asks whether they are still true, and
absence of a check passes.

A second problem sat underneath it. The site asserted a *shape* of fact the
repos do not have. HITL Kit's root package is `private: true` and never
publishes, so the site's "v0.6" named nothing installable, while the six
packages people actually install spanned 0.2.0 to 0.8.0. tag-kit's "v0.3.1"
was right only because both its packages happened to sit at the same number,
and eval-kit's "v0.4.0" silently meant `@eval-kit/core` while ignoring two
other published packages.

## What is and is not derivable

Investigated before designing, because it decides everything:

- **Derivable, and now derived:** npm versions (11 packages) and the PyPI
  version for `hologram-gltf`. All 11 npm packages matched their local
  `package.json` exactly at time of writing, so the registry is a trustworthy
  source.
- **Already derived, left alone:** the primitive count. `REGISTRY_ITEMS` and
  `registry.json` both hold 19 `registry:ui` items with identical names in
  both directions, and the component-library section already renders
  `REGISTRY_ITEMS.filter(i => i.type === "registry:ui").length`. The counts
  were never broken. Only the hand-typed prose copy of the number was
  ungated, and that copy is now removed.
- **Not derivable, deliberately left in prose:** eval-kit's "three reference
  suites" and "four adapters", collapse's shipped-feature list. These are
  internal to repos that publish no machine-readable summary of them. Deriving
  them would require each repo to expose a facts endpoint, which is a larger
  change than this problem justifies.

## Design

One pipeline, mirroring the `registry:check` pattern the repo already uses.

```
scripts/facts.ts  ──fetch──>  npm registry + PyPI
       │
       └──writes──>  facts.json  (committed)
                          │
                          └──read at module scope──>  src/lib/facts.ts
                                                            │
                                                            └──>  the page
```

**`scripts/facts.ts`** derives its package list from `PROJECTS`, so adding a
package to a project entry is the only edit needed to cover it. The fetch is
all-or-nothing via `Promise.all`: one unreachable registry aborts the whole
write. A partially-refreshed file carrying a fresh `generatedAt` would be
worse than a stale file that honestly reports its age. Keys are sorted so the
diff is stable rather than registry-ordered.

**`facts.json`** is committed. This keeps `next build` hermetic: the network
is touched by `facts:build` and by CI, never by a Vercel deploy. It also keeps
old commits reproducible, which a live build-time fetch would not.

**`src/lib/facts.ts`** reads the JSON at module scope and exposes
`npmVersion(pkg)` and `pypiVersion(pkg)`, both returning `null` for unknown
packages. Callers render nothing on `null` rather than a placeholder: an
unlabelled gap is honest, `v?` is not.

**The gate** is `facts:check` = `facts:build && git diff --exit-code
facts.json`, wired into `pnpm verify` and into `.github/workflows/facts.yml`,
which mirrors `registry.yml`.

### Known cost of the gate

`facts.yml` reaches the network, so unlike every other gate in this repo it
can fail for reasons outside the diff: a registry outage, or a sibling package
publishing while an unrelated PR is open. That is a deliberate trade. The
alternative is the site quietly restating versions that have moved. The
failure is loud, the fix is one command, and the workflow comment says so.

A scheduled nightly refresh that opens a drift PR was designed and cut for
simplicity. Without it, drift is caught the next time any akaoss PR runs CI
rather than within a day. If a quiet month ever leaves the site visibly stale,
that workflow is the phase-two answer.

## Page changes

- The existing Packages section renders a version beside each package name,
  giving the per-package table. The six-package spread is now visible instead
  of flattened into one misleading number.
- Hologram gains a `pypi` field on `Project` and renders a PyPI row. Its
  section was previously hidden entirely, because the visibility check tested
  only `packages.length`.
- Every hand-typed version literal is removed from `src/`. Five were in
  `projects.ts` status prose; five more were in the `Nav.tsx` Toolkits
  dropdown, which renders on *every* page and was the most visible stale
  surface; one was a present-tense claim in `registry/page.tsx` phrased as
  "In v0.3".
- `KIT_SUMMARIES` and its `KitSummary` interface are deleted from
  `content.ts`. Nothing imported them, and its eval-kit entry already read
  `v0.3.1` against an actual 0.4.0. Dead code that was already wrong.
- Two prose counts are corrected. The page claimed both "Nineteen React
  primitives" and "the fifteen primitives" about the same library. These are
  different facts: 19 is `registry:ui` items, 15 was the count of event kinds
  in `@hitl-kit/core`. The conflated sentence loses its number, and so does
  the MCP sentence, since `evidence.pointer` landed on 2026-08-11 and made the
  event-kind count 16.

## Non-goals

No monorepo. No repo moves or is absorbed; all six stay independently
cloneable and independently published. No live fetch during `next build`. No
per-repo `CLAUDE.md` rewrites. No screenshot sync script, which stays a manual
step governed by a rule in the workspace `CLAUDE.md`.

## Verification

`pnpm verify` chains typecheck, `registry:check`, `facts:check`, and build.
Confirmed additionally in a browser against the dev server: all six HITL Kit
packages render with correct versions, the hologram PyPI row appears, and no
`v0.x` literal remains in `src/`. The nav and `content.ts` findings came from
that browser pass, not from the source read, which is why it was worth doing.
