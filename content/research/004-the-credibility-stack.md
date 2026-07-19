---
title: "The credibility stack: what a stranger checks before trusting your package"
date: "2026-07-18"
experiment: null
models: []
tags: ["testing", "publish smoke", "README-runs", "API surface", "eval-kit", "HITL Kit", "tag-kit"]
keywords: ["OSS credibility", "npm packaging", "exports map", "arethetypeswrong", "documentation testing", "API stability"]
kind: "essay"
status: "published"
summary: "Before anyone reads your test suite, they run an implicit checklist: does the published package install, do the README examples compile, does the API change without warning. We built those checks as CI harnesses across three of our packages and ran them on ourselves. First run: one package shipped no type declarations at all, and three README examples had never compiled."
key_findings:
  - "The monorepo lies benignly: everything resolves to fresh source inside it, so **a published package can be broken for every outside consumer while all local tests stay green**. `@eval-kit/seed-suite` shipped zero type declarations and nothing we ran locally could have noticed."
  - "README examples are unenforced promises. Across three repos, **three of our load-bearing examples did not compile**: a wrong function signature, a non-existent prop, and one example that was pseudo-code from the start."
  - "The fix is cheap and permanent: a **publish smoke test** (pack, install outside the workspace, import every entry point), a **README typecheck** with explicit opt-in annotations, and a **committed API-surface snapshot** so breaking changes are conscious diffs. Roughly 40 lines of CI each, and they only ever have to be written once."
---

Our [measurement-problem paper](/paper) argues that the field ships evaluation
tools without evidence they measure anything. That argument cuts both ways: if
we ship packages, the same skepticism applies to us, starting well before
anyone reads a scoring function. This essay is about the checks a stranger
runs first, why almost nobody tests them, and what happened when we built them
for our own packages and looked at the results.

## 1. The implicit checklist

A developer deciding whether to depend on a package runs a sequence, mostly
unconsciously:

1. Does a fresh clone go green?
2. Does the **published** package work, not just the monorepo?
3. Do the README examples actually run?
4. Is the logic correct under adversarial input?
5. Does the public API change without warning?

Most open-source authors test step 4 heavily and skip 1 through 3. But steps 1
through 3 are where trust is actually lost, because they are the steps the
stranger hits first, and a failure there reads as "this author does not ship
working software." No amount of internal test depth recovers from an import
that explodes.

## 2. Why the monorepo hides all of it

Inside a pnpm workspace, every package resolves to live source: fresh types,
sibling packages by symlink, every file present. A consumer gets none of that.
They get a tarball filtered by a `files` field, routed by an `exports` map,
resolved under a module system you may never have tested, with workspace
references rewritten at pack time. Each of those is a place the artifact can
diverge from the source, and none of them is exercised by any unit test you
will ever write inside the repo.

This is a construct-validity problem in miniature. The thing you test (the
workspace) is not the thing you claim to ship (the package). The score is
real; it just measures the wrong object.

## 3. The three harnesses

**Publish smoke.** After build: pack every publishable package exactly as the
release pipeline would, install the tarballs into a scratch project outside
the workspace, with cross-package dependencies pinned to the tarballs and real
dependencies from the npm registry. Then import every subpath in every
`exports` map, typecheck a small usage under both `bundler` and `node16`
resolution, execute any CLI binary, and run
[arethetypeswrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io)
against each tarball for the ESM/CJS/types plumbing that breaks silently.

**README-runs.** Every fenced code block that presents API surface gets an
explicit `check` annotation and is typechecked in CI. Annotation is explicit
rather than inferred: install commands and illustrative fragments stay
unannotated, so the harness never guesses. When an API changes, the README
fails the build instead of quietly rotting.

**API-surface snapshot.** Each package's public surface (runtime export names
plus the built declaration inventory) is committed and diffed in CI. This is
not an API freeze. It converts every addition, removal, and retype into a
diff a human reviews on purpose, which for a pre-1.0 package is the entire
difference between an intentional breaking change and an accident someone
else discovers.

## 4. What the first run caught, in our own house

We ran these against three of our repos on day one. The results are the
reason this essay exists.

**`@eval-kit/seed-suite` shipped no type declarations at all.** Every
TypeScript consumer, under either module resolution, hit `TS7016: could not
find a declaration file`. The package worked perfectly inside the monorepo
and had working JavaScript in the tarball. Nothing in the existing test suite
could have caught it, because nothing consumed the artifact.

**Three README examples had never compiled.** eval-kit's core README called
`runSuite(suite, adapter)` when the real signature takes `{ adapter }`. Its UI
README used a prop that does not exist, omitted a required one, and mistyped
the run object. tag-kit's UI example turned out to be pseudo-code referencing
five undefined variables. Each of these is the first thing a visitor tries.

**The build itself was nondeterministic.** The declaration bundler emits
zod-inferred union members in a run-to-run varying order, which would have
made a naive API snapshot flap. The drift gate canonicalizes to a sorted
inventory, verified stable across eight rebuilds.

**And one repo was simply clean.** All six HITL Kit packages installed,
imported, and typechecked from tarballs on the first run. That result matters
too: the harness converts "probably fine" into "verified, and cannot silently
regress."

## 5. The general claim

Claims that are not enforced by a test decay. That holds for README examples,
for "zero runtime dependencies" (tag-kit's claim is now asserted against the
packed tarball, not the source tree), and, one level up, for the promises
evaluation tools make about what they measure. The credibility stack is the
cheapest tier of that enforcement: three small harnesses, written once, that
guard exactly the surfaces where a stranger's trust is won or lost.

The next tier is the one our paper says the field withholds: an instrument
should ship the evidence that it measures what it claims. For eval-kit that
means a corpus of hand-labeled agent traces with known-correct scores, run in
CI, reproducible by anyone with one command. That work is underway, and it
will be the subject of its own write-up.
