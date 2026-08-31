---
title: "A rubber stamp is also an approval: recording whether oversight was real"
date: "2026-08-31"
experiment: null
models: []
tags: ["eval-kit", "gates", "oversight", "EU AI Act", "provenance", "schema", "release notes"]
keywords: ["rubber stamp", "automation bias", "Article 12", "Article 14", "four eyes", "decision latency", "unobserved", "JSON Schema", "refinement"]
kind: "essay"
status: "published"
summary: "№ 005 argued that no current benchmark can tell a rubber stamp from a genuine review. eval-kit's own gate schema could not either: `resolution: \"approved\"` is exactly the field that collapses the two. This note is about closing that gap without letting the instrument invent the thing it is measuring, and about two divergences between the published contract and the reference implementation that were recorded rather than resolved."
key_findings:
  - "The instrument had the blind spot it described. № 005's argument is that a rubber stamp and a careful review are indistinguishable in every current benchmark. eval-kit recorded **that** a gate resolved and **in what order**, and nothing else — so on that specific axis it was one of the benchmarks it was criticising. `GateEvent` now carries when the gate opened, when it resolved, how long the person took, and who they were, all defaulting to an explicit unobserved value."
  - "The hardest constraint was refusing to fill the fields in. eval-kit's runner has no human at the gate: `EvalStep.gate_response` is a canned reply for deterministic replay, so a timestamp written there would be **the harness impersonating a person**, and any latency derived from it would measure the harness. The runner writes nulls unconditionally, and that guarantee is mutation-checked — swapping one null for `new Date().toISOString()` fails the test, which is the only reason to believe the guard works."
  - "A test in the written plan would have passed without testing anything. It looped over every gate event in a legacy fixture asserting the new fields came back unobserved — and that fixture carries **zero gate events**, so the loop body never executes and the assertion never runs. Same shape as № 007: absence passes. The fix was a fixture that actually contains gate events plus an assertion on the iteration count, so it cannot quietly go vacuous again."
---

[Research № 005](/research/005-the-gate-is-the-unit-of-measurement) argued that the gate — the moment control returns to a human — is the unit worth measuring, and that no benchmark currently measures it. The sharpest version of that argument is a sentence about rubber stamps: an approval that a person considered and an approval a person clicked through look identical in every artifact anyone records.

[eval-kit](https://www.akaoss.dev/projects/eval-kit) has been making that argument for three releases. It also had the same hole.

`GateEvent` recorded that a gate resolved, and where it sat in the tool-call ordering, which is enough to score whether approval preceded the irreversible action. It recorded nothing about **when** the approval happened, **who** gave it, or **how long they took**. So on the one axis № 005 is loudest about, the instrument was doing exactly what it accused the benchmarks of: `resolution: "approved"` is the field that collapses a rubber stamp and a genuine review into the same value.

This note is about closing that, and about the part that turned out to be harder than adding fields.

## 1. Four fields, and why they are usually empty

`GateEvent` gains `opened_at`, `resolved_at`, `decision_latency_ms`, and `overseers`. The first three default to `null`; the last defaults to `[]`.

They map onto obligations that already exist in law. The EU AI Act's Article 12 requires automatic logs capturing the start and end time of each use, and identification of the natural persons involved in verifying results. Article 14(5) requires that certain systems act only after separate verification by **at least two** natural persons — which is why `overseers` is an array and not a scalar. A scalar cannot express that a four-eyes requirement was met, and counting array length rather than distinct entries would let one person sign twice.

None of this is a compliance claim, and the repo says so in the README. Articles 12 and 14 bind deployed high-risk systems at runtime; eval-kit is a pre-deployment instrument. What it can now do is *carry* that provenance into scoring.

Worth noting on timing: the Digital AI Omnibus deferred the Annex III standalone high-risk obligations to December 2027 and Annex I embedded high-risk to August 2028. One cited reason was that harmonised standards and compliance tooling are unfinished. That is the gap, not a deadline.

## 2. The constraint that shaped everything: the runner has no human

Here is the part that took the thinking.

eval-kit's runner does not have a person at the gate. `EvalStep.gate_response` is documented as a canned answer returned for deterministic replay. A run produces a **scripted** decision, not an observed one.

So the runner must never populate these fields. If it stamped `Date.now()` on a scripted approval it would manufacture an oversight record that no person ever produced, and any latency computed from it would be a measurement of the harness pretending to be a measurement of a human. The instrument would be generating the evidence it exists to check.

This rule is not new here. It is already written into `task_calls_before`, whose comment records that defaulting to `0` "would have been worse than null — it would silently read as approved before everything and manufacture compliance that was never observed." The new fields inherit it verbatim: **null means unobserved, and unobserved is never fabricated.**

The fields exist so that artifacts recorded *outside* eval-kit — a real HITL deployment, an agent harness session log — can carry real oversight provenance into the scorer. eval-kit stays the instrument. It does not become the thing measured.

That guarantee is only worth as much as the test behind it, so the test was mutation-checked: replacing the runner's `opened_at: null` with `new Date().toISOString()` fails it, and reverting passes. A guard nobody has tripped is not a guard.

## 3. Storing a number that is derivable, on purpose

`decision_latency_ms` is derivable from the two timestamps. Two sources of truth that can disagree is the failure this repo spends most of its CI budget guarding against, so storing it needs a real reason.

The reason is that a deployer may hold a **duration** while deliberately not retaining wall-clock times. A timestamp joined to an overseer identity is personal data under GDPR; a duration is far weaker. Refusing to represent that case would push honest deployers into fabricating timestamps to satisfy the schema — the exact harm the null discipline exists to prevent.

The two-sources problem is closed with a schema refinement instead: when the timestamps and the latency are all present, they must agree within 1000 ms, or the artifact fails to parse. A record that disagrees with itself is corrupt, not rounded, and it should fail loudly at the boundary rather than quietly at the scorer.

## 4. Signals, not a score

The new fields feed a report and never a grade: resolved gates with no overseer, resolved gates with two or more distinct overseers, approvals resolved faster than plausible for what they surfaced, gates whose latency is simply unknown, and whether anything in the run was **ever** denied.

Two details carry the argument.

`latency_unavailable` is counted separately and never folded into `fast_approvals`, because unknown is not the same as fine and must not be silently read as either. That is the same rule [№ 006](/research/006-signals-not-verdicts) makes about verdicts, applied one level down.

`never_denied` is included because a gate that never denies across a whole corpus is decorative by revealed preference. It is the cheapest possible check on whether oversight is real, and it needs no timestamps at all.

There is deliberately no combined "oversight score". Averaging these would repeat the mistake [№ 005](/research/005-the-gate-is-the-unit-of-measurement) exists to argue against, and it would do it on the axis where the temptation is strongest.

## 5. Absence passes, again

The written plan for this work contained a test that would have passed without testing anything.

It loops over every gate event in a frozen pre-change fixture, asserting the new fields come back unobserved. The fixture carries **zero gate events**. The loop body never executes, every assertion inside it never runs, and the test reports green.

This is [№ 007](/research/007-absence-passes) exactly: the failure is a thing that is absent, and absence only fails loudly where something asserts it should be present. It is also the same shape as the `packages/ui` test script that read `echo 'no ui tests yet'` for months while a 98-assertion contrast test sat next to it, never executed.

The fix was a second fixture that actually contains gate events in the pre-change shape, and an assertion on the **iteration count** — so if the fixture ever loses its gate events, the test fails rather than silently going vacuous again. The assertion that the loop ran is doing more work than any assertion inside the loop.

## 6. Two divergences, recorded rather than resolved

The published JSON Schema and the TypeScript reference implementation now disagree in two places, and they point in opposite directions.

**Unknown properties: the schema is stricter.** `schemas/v1/*.json` carries `additionalProperties: false`, so an unrecognised field fails validation. Zod's default `.strip()` mode silently discards unknown keys instead, so `parseRun` accepts that artifact and drops the field.

**Cross-field rules: the implementation is stricter.** The latency-consistency refinement above cannot be expressed in JSON Schema draft-07, which has no way to compare two sibling properties. The published contract therefore accepts a self-contradictory record that `parseRun` rejects.

Neither is a defect and neither is being fixed. They are limits of what draft-07 can express, and the useful move was to state plainly what each check answers: validate against `schemas/v1/` to confirm your **shape**, parse with `@eval-kit/core` to confirm your record is **coherent**. A producer that wants both runs both.

The reason to write it down rather than resolve it is the same reason the schemas carry a drift gate at all: a generated artifact that is committed but unverified becomes a second source of truth that lies. A divergence that is documented is a contract. A divergence that is discovered is a bug.

## Honest limits

The fast-approval threshold is a heuristic, and it is doing the least defensible work here. It scales with the character count of what `surfaced` put in front of the person, at 8ms per character over a one-second floor — roughly 1500 words per minute, far above careful reading. That flags the clearly implausible and stays quiet on the merely brisk, which is the right bias, but character count is a poor proxy for how much thought something required. A one-line approval to delete a production database deserves longer than a 2,000-character diff of formatting changes.

Nothing here measures whether the oversight was *good*. It measures whether it was plausibly *present*. A person who reads carefully and approves the wrong thing scores identically to one who reads carefully and approves the right thing, and that is correct — judging the decision is what the golden truth and the rubric are for.

And eval-kit's own runs will carry none of this. Every field stays unobserved on every artifact the project generates itself, which means the feature is untested against real human data by construction. The first real test is somebody else's deployment log.

*Shipped in eval-kit `main` as of 2026-08-31. No scoring change: mandated compliance and the two discretionary rates are untouched, `scoring_model` does not move, and the golden replay passes unchanged — which is the evidence, not the claim.*
