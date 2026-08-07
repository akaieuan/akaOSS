---
title: "Absence passes: what a green check cannot tell you"
date: "2026-08-06"
experiment: null
models: []
tags: ["testing", "credibility stack", "npm packaging", "documentation", "tag-kit", "eval-kit", "HITL Kit", "release engineering"]
keywords: ["CI gates", "existsSync", "empty work-list", "npm README", "release workflow", "negative space", "documentation testing"]
kind: "essay"
status: "published"
summary: "We built four CI gates to check that a published package is trustworthy, then published a package whose npm page reads 'ERROR: No README data found!' — with every gate green. The cause generalises past this bug: a checker that filters its own input list by file existence converts a missing artifact into an empty work-list, and an empty work-list into a pass. Shipping the fix then failed on a 404 that means four different things, which is the adjacent lesson."
key_findings:
  - "`tag-kit` published to npm with all four credibility gates green and both package pages rendering **\"ERROR: No README data found!\"**. The gates verify that documented examples **compile**; not one verifies that documentation **exists where a stranger lands**. **The checklist from № 004 tested the presence of quality in things that existed, and said nothing about things that did not.**"
  - "The mechanism generalises past this bug. All three repos' README checkers filter their target list with `existsSync` — so a missing README becomes an empty work-list, and an empty work-list is indistinguishable from a satisfied one. **A checker that filters its own inputs by existence structurally cannot report absence.** `tag-kit`'s list held only the root README behind a comment reading **\"Add package READMEs here as they appear\"** — a TODO with no gate behind it."
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
are well-posed and they work — on their first run № 004 reported a package that
shipped no type declarations at all, three README examples that had never
compiled, and a nondeterministic build.

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

## 6. Postscript: the release that reported the wrong thing

Shipping the fix produced one more instance of the same problem, which is
either embarrassing or the best available evidence for the argument.

The `0.3.1` release ran green through build, typecheck, tests, and all four
gates, packed both tarballs, signed a provenance statement to the sigstore
transparency log — and then died:

```
npm error 404 Not Found - PUT https://registry.npmjs.org/@tag-kit%2fcore
```

The publish is authenticated by OIDC: GitHub Actions presents a signed claim
about which repository and workflow is asking, and npm issues a short-lived
token if that claim matches the package's configured trusted publisher. Ours
did not match. npm's dashboard field for the workflow filename still held
`publish.yml` — the example value from the hint text directly above the input —
while the workflow is named `release.yml`. No match, no token, so npm fell
through to publishing anonymously.

An anonymous PUT to a package you do not have rights to is answered
`404 Not Found`. Not `401`, not "trusted publisher mismatch": the registry
reports a permission failure as a missing resource, on the reasonable-in-
isolation logic that you should not learn a private package exists by being
told you cannot write to it.

The result is that **two unrelated root causes emit a byte-identical error.**
A stale npm client that cannot perform the OIDC exchange at all produces this
404. A perfectly current client whose trust claim does not match produces the
same 404. We had been bitten by the first one before — the workflow already
carried a comment calling that step load-bearing — and that prior knowledge is
exactly what made the second one slow to see. The log could not distinguish
them, and the field that actually differed is not observable from the log at
all: npm exposes no API for trusted-publisher configuration, so it can only be
read off a web form by a human.

Correcting the filename and re-running the same tag published both packages
with provenance. The registry pages now render documentation instead of the
error string, which was the entire point.

The essay's claim was that a checker cannot report what it never looked for.
The postscript is the adjacent failure: **an error channel that collapses
distinct states into one signal is a checker that looked, and told you almost
nothing.** A 404 that means four things is not much better than silence — and
it is worse in one specific way, because silence does not send you confidently
down the wrong path.

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
