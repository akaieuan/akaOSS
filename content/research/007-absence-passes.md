---
title: "Absence passes: what a green check cannot tell you"
date: "2026-08-06"
experiment: null
models: []
tags: ["testing", "credibility stack", "npm packaging", "documentation", "tag-kit", "eval-kit", "HITL Kit", "release engineering"]
keywords: ["CI gates", "existsSync", "empty work-list", "npm README", "release workflow", "negative space", "documentation testing"]
kind: "essay"
status: "published"
summary: "We built four CI gates to check that a published package is trustworthy, then published a package whose npm page reads 'ERROR: No README data found!' — with every gate green. The cause generalises past this bug: a checker that filters its own input list by file existence converts a missing artifact into an empty work-list, and an empty work-list into a pass."
key_findings:
  - "`tag-kit` published to npm with all four credibility gates green and both package pages rendering **\"ERROR: No README data found!\"**. The gates verify that documented examples *compile*; not one verifies that documentation *exists where a stranger lands*. **The checklist from № 004 tested the presence of quality in things that existed, and said nothing about things that did not.**"
  - "The mechanism generalises past this bug. All three repos' README checkers filter their target list with `existsSync` — so a missing README becomes an empty work-list, and an empty work-list is indistinguishable from a satisfied one. **A checker that filters its own inputs by existence structurally cannot report absence.** `tag-kit`'s list held only the root README behind a comment reading *\"Add package READMEs here as they appear\"*: a TODO with no gate behind it."
  - "Nine of eleven published family packages render correctly — **by authorial habit, not by verification**. Two independent findings fell out of the same audit: `tag-kit`'s release workflow ran build, typecheck, and test and then published, never invoking the four gates it already had; and npm refreshes a package page **only on publish**, so a documentation defect in a shipped package is only reachable through a version bump. Documentation is a versioned artifact whether or not you treat it as one."
---

Three weeks ago we published [the credibility stack](/research/004-the-credibility-stack):
an argument that the checks a stranger runs first — does the *published*
package install, do the documented examples compile, does the public API move
without warning — are the least-tested surfaces in a normal repository, and a
set of CI harnesses built to close that gap across our own packages.

This week we published `tag-kit` to npm for the first time. All four gates ran
green. Both package pages on npmjs.com render, in place of any documentation,
the string:

```
ERROR: No README data found!
```

That is the first thing anyone evaluating the package sees. It is precisely
the failure mode № 004 was written to prevent, and it happened behind the
harness № 004 built. This note is about why, because the reason is more
general than the bug.

## 1. What the gates actually check

The stack, as it stands, is four checks:

| Gate | Question it answers |
|---|---|
| `smoke:publish` | Does the **packed tarball** install and import outside the monorepo? |
| `check:readme` | Do the fenced examples in the README **compile** against the built types? |
| `api:check` | Has the public type surface **drifted** from the committed snapshot? |
| `check:zero-dep` | Does `core` genuinely ship **no dependencies**, per the tarball? |

Every one of these is a question about a thing that exists. Does *this
tarball* install. Does *this example* compile. Has *this snapshot* moved. They
are well-posed and they work — № 004 reported the four real defects they caught
on their first run, including a package that shipped no type declarations at
all.

None of them can be failed by an absence. There is no gate whose subject is
"the documentation a stranger will land on," so when that documentation did not
exist, nothing had an opinion. The checklist tested for the presence of quality
in artifacts that existed, and was silent on the artifacts that did not.

## 2. The empty work-list

The specific mechanism is worth naming because it is a pattern, not an
oversight.

`tag-kit`'s README checker begins by assembling its list of targets:

```js
// READMEs to scan. Add package READMEs here as they appear.
const READMES = [join(ROOT, "README.md")].filter(existsSync);
```

Two things are happening in that line. The list contained only the root README —
the packages' own READMEs were never written, so there was nothing to add. And
the list is filtered by `existsSync`, which means a path that does not resolve
is silently dropped rather than reported.

The consequence is that a missing README does not produce a failure. It
produces a *shorter list*. The checker then does its job perfectly on every
item remaining, finds nothing wrong, and exits zero. An empty work-list and a
fully satisfied one are the same observation from the outside.

**A checker that filters its own input list by existence cannot report
absence.** It has converted the question "is the documentation there?" into the
question "of the documentation that is there, is it correct?" — and only ever
answers the second.

The comment above the line is the part worth sitting with. *"Add package
READMEs here as they appear."* The mechanism anticipated its own growth and
delegated that growth to memory. It is a TODO with no gate behind it, in a file
whose entire purpose is to be the gate. We did not fail to think of this; we
wrote it down and then relied on ourselves to remember.

## 3. What the audit found

Having found it in one place, the honest move is to check whether the property
holds anywhere else. Across all eleven published packages in the family:

| Repo | Packages | npm pages rendering |
|---|---|---|
| `eval-kit` | 3 | 3 ✓ |
| HITL Kit | 6 | 6 ✓ |
| `tag-kit` | 2 | **0** ✗ |

Nine of eleven are fine. That is the number worth being careful about, because
the tempting reading — *the stack is systematically broken* — is not what the
evidence supports. The nine are fine because somebody wrote those READMEs. They
are not fine because anything checked.

The three repos implement the same checker three ways: `eval-kit` **discovers**
package READMEs by scanning `packages/*/README.md`; HITL Kit **hardcodes** all
six; `tag-kit` listed only the root. All three then apply the same
existence filter. So even `eval-kit`'s dynamic discovery — the most robust of
the three — would pass silently if a package README were deleted tomorrow. The
property held in nine cases and was never enforced in any of them. `tag-kit` is
the control case that makes this visible: the only repo where the habit lapsed
is the only repo where the absence shipped.

## 4. Two findings that fell out of the same audit

**The release workflow ran none of the gates.** `tag-kit`'s `release.yml` built,
typechecked, tested, and then published. The four credibility gates existed in
the repo and were wired to pull requests — not to releases. A release was
therefore the one moment the published artifact was *least* exercised, which
inverts the intent. HITL Kit's release workflow already ran its equivalents;
the divergence was never noticed because nothing compares them. Both are now
aligned.

**npm only refreshes a package page on publish.** The README shown on
npmjs.com is a snapshot taken at publish time, not a live read of the
repository. A documentation defect in a shipped package is consequently not
fixable by fixing the documentation — it requires a version bump to carry the
correction to the registry. Ours went out as a documentation-only `0.3.1`,
whose `dist/` output is byte-identical to `0.3.0` and whose API-surface check
reports no drift.

That constraint is a small thing with a real implication: **documentation is a
versioned artifact whether or not you treat it as one.** If it can only be
corrected by a release, it belongs to the release process, and the release
process should be gating it.

## 5. Negative space

The generalisation is uncomfortable in a way that connects backwards.

Every check in the stack is a predicate over an object. Given a tarball, is it
sound; given an example, does it compile. Predicates are cheap to write and
they compose well, and they share one blind spot: **a predicate over an empty
set is vacuously true.** To catch an absence you need a different kind of
statement — an assertion about what the world should *contain*, checked against
what it does. Those are more annoying to write, because they require committing
in advance to the expected shape rather than reacting to what is found.

This is the same shape as an argument the gate work keeps arriving at from the
other direction: that [an omitted signal is not a low-confidence one](/research/006-signals-not-verdicts),
and a channel that reported nothing is not a channel that reported *safe*.
There we were arguing that a reviewer must be shown what was not assessed. Here
we ran into the machine version of it and lost. A silent gate and a satisfied
gate produced the same exit code, and we read the exit code.

The fix in this instance is small and specific — the checker now takes a
declared list of packages that must each have a README, and fails if one is
missing rather than skipping it. The fix is not the interesting part. The
question worth carrying forward is which of our other gates are predicates over
sets we never asserted the size of.

## Honest limits

This was not a correctness defect. No published code was wrong; `tag-kit`'s
145 tests, its type surface, and its zero-dependency claim were all accurate
before and after. Nobody's build broke. What broke was the first impression of
a package whose entire premise is that measurement claims should come with
receipts — which makes it a credibility failure specifically, and therefore
squarely the thing № 004 set out to prevent.

Nor is one instance evidence of a general rate. Nine of eleven pages were fine,
and we do not know how many similar absences remain unexamined in these repos,
because by construction the current tooling would not tell us. Establishing
that would mean enumerating the artifacts a consumer expects and checking the
list — which is the work this note argues for and does not yet claim to have
finished.
