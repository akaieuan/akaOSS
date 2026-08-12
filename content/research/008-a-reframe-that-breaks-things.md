---
title: "A reframe that breaks things: rebuilding eval-kit around authorization"
date: "2026-08-11"
experiment: null
models: []
tags: ["eval-kit", "gates", "authorization", "release notes", "design systems", "accessibility", "shadcn", "HITL Kit"]
keywords: ["reframe", "mandated gates", "discretionary gates", "evidence pointer", "abstained", "contrast testing", "api surface", "publish smoke"]
kind: "essay"
status: "published"
summary: "eval-kit's pitch narrowed from evaluating research agents to measuring authorization. The useful part was not the new sentence. It was discovering which parts of the codebase the sentence contradicted. The reframe broke six things, and each break marked a place where the old claim had been carrying weight the new one will not."
key_findings:
  - "A reframe that changes only the README is a rewrite of the pitch, not of the project. This one was checkable because it broke things: the three shipped suites declared **zero gates**, so every gate surface would have rendered empty on everything eval-kit distributes; the dashboard computed three gate scores and **discarded all three**; and the demo runs the README told readers to reproduce were **gitignored**, so a fresh clone got an empty directory. None of that was visible while the old framing held."
  - "Seven guards fired across the work, and every one caught a genuine half-ship rather than a style violation: an exhaustive event-kind fixture that refused to typecheck, four separate hard-coded counts, two API-surface snapshots, and a publish-smoke test that caught a protocol primitive **no adapter could emit**. The recurring shape is the one from № 007. The failure was always a thing that was absent, and absence only fails loudly where something asserts it should be present."
  - "The narrower claim is falsifiable in a way the old one was not. **Two demo runs now ship whose task tools, tool-match scores and final outputs are byte-identical, and which differ only in whether authorization happened**. Three gates honoured versus three violated. Any benchmark scores that pair the same. That artifact is the argument, and it can be re-derived from the repo with one command."
---

Three weeks of work on [eval-kit](https://www.akaoss.dev/projects/eval-kit) came out of one sentence changing. The project used to say it was *a measurement instrument for multi-step research agents*. It now says it *scores whether your agent respects human authority, stops when it must, asks when it should*.

That reads like a marketing edit. It was not, and this note is mostly about how you can tell the difference: **a real reframe breaks things**, because the old claim was load-bearing somewhere, and the new one refuses to carry the same weight. This one broke six things. Each break marked a place where the project had been getting away with something.

What follows is closer to release notes than the usual essay. The owner asked for a changelog, and the changes are the evidence, but the finding at the end is the reason it is worth writing down.

## 1. Why the pitch narrowed

The old framing positioned eval-kit against the benchmark suites: MMLU, SWE-bench, GAIA, AgentBench measure autonomous task completion on synthetic single-turn tasks, and eval-kit measured collaborative multi-step work instead. True, defensible, and too wide to be falsifiable. "Collaborative performance" is a category, not a measurement.

The narrower claim came out of the argument in [№ 005](/research/005-the-gate-is-the-unit-of-measurement): the gate. The moment control returns to a human, is the unit worth measuring, and the domain is an instance. If that is right, then the thing to score is not how well the agent collaborated. It is whether **approval preceded the irreversible action**, and whether the agent **asked when it faced a real blocker**.

Two supports make that more than a preference.

The regulatory one: the EU AI Act's Article 14 requires human oversight of high-risk systems to be *effective*, and names automation bias as something deployers must counter. It does not say how effectiveness is measured, because nothing measures it.

The human-factors one, which is older and more uncomfortable: **Bainbridge's "Ironies of Automation" (1983)**: the more reliable the automation, the less practiced the operator, and the worse they perform in exactly the rare cases where they are the last line of defence. The automation-bias literature that follows (Parasuraman & Riley 1997; Skitka et al. 1999; Parasuraman & Manzey 2010) shows vigilance decaying in proportion to observed accuracy. So the better the agent gets, the more the residual error concentrates in the cases a fatigued reviewer waves through.

Which gives the line the whole project now rests on: **the value of a gate is inversely proportional to how often it fires.** A gate firing on 30% of cases is a bottleneck people route around. A gate firing on 0.5% is where all the risk lives, where measurement is hardest, and where human skill has most decayed.

## 2. The first break: the suites declared no gates

The 0.4.0 release had already shipped the schema: `MandatedGate`, `MandatedGateScore`, `DiscretionaryScore`, with the scorer computing compliance, ask precision and blocker recall. The reframe should therefore have been mostly copy.

Then a check of the three reference suites eval-kit ships (research, coding, support) found that **all three declared zero `mandated_gates` and zero blockers**. Every gate surface would have rendered empty on every suite the project distributes. The schema existed; nothing used it.

That is the first honest signal that the old framing had been carrying weight. Under "collaborative performance" a suite with no gates is a normal suite. Under "measures authorization" it is a suite that measures nothing.

Fixed by declaring gates where the domain actually has them: a `compensation-authority` gate on the three support tasks where money can move, including the de-escalation task, because pressure is exactly when the gate matters, and an `irreversible-vcs` gate on the coding suite's destructive-migration path. Blockers went on the policy-gap distractor, where nothing in the knowledge base answers the question and a good agent surfaces the gap rather than papering over it.

## 3. The artifact that makes the claim falsifiable

With gates declared, the mock adapter gained a `gateBehavior` switch, and `pnpm gen:gate-demo` now produces two run artifacts that are the sharpest thing in the repo:

Their task tools are identical. Their `tool_match` scores are identical. Their final outputs are byte-for-byte identical, verified programmatically, not asserted. They differ in exactly one respect: one honoured three mandated gates, the other violated three.

**Any benchmark scores that pair the same.** That is the argument stated as a file rather than a paragraph, and anyone can re-derive it from the repo with one command. It is also the thing the old framing could not have produced, because under "collaborative performance" the two runs genuinely are the same run.

## 4. The second break: the instrument had a reading it did not display

0.4.0 computed `mandated_compliance_rate`, `discretionary_ask_precision` and `discretionary_blocker_recall`. A search across the dashboard for `mandated` and `discretionary` returned **zero hits in any UI file**. Three numbers, computed on every run since the release, discarded before anyone saw them.

The gauge existed; there was no needle.

They now render as **three separate cards, never one combined number**. The never-averaged rule is a UI rule too, and as **counts rather than percentages**. `0/3` reads as three unauthorized actions. `0%` reads as a grade. For a compliance measure that distinction is the whole point, since 94% compliance is not a good score, it is 6% unauthorized actions.

The more important surface is the trace. Ordering *is* the compliance claim: approval must *precede* the gated call. So ordering is now drawn rather than summarised: tool calls and gate events interleaved in the order they happened, with an unauthorized call marked at the row where it occurs, naming the gate that covers it. Where a suite declares no gates, the interface says *"authorization was not assessed"* rather than rendering blank, which is [№ 007](/research/007-absence-passes)'s rule applied to the UI.

The screenshot in the README now shows `issue_refund` and `apply_account_credit` marked **UNAUTHORIZED** directly beneath a green **TOOLS MATCHED** badge. The agent did the task correctly and skipped the authorization. That single image carries the thesis better than this paragraph does.

## 5. The breaks that were not about gates at all

Narrowing the claim also raised the bar for everything around it, and three failures surfaced that had nothing to do with the reframe except that it made them intolerable.

**The demo runs were never in the repo.** `runs/*.json` was gitignored with no exception, while the README said "the runs ship in `runs/test-pristine.scored.json`" and invited the reader to reproduce the diff. A fresh clone got an empty directory. The dashboard rendered nothing for anyone but the author, and nobody else could regenerate the screenshots. Reviewer runs stay ignored, those are a user's own data, but the demo artifacts are evidence, and evidence belongs in the repo.

**`review.png` could not be regenerated.** The capture script drives routes by path, and the review screen lives at `/runs/[id]`, which needs a run id. So the app's most important surface, and a README image, had been stale since April while every other capture moved. The script now resolves an id from `runs/`, preferring the run that shows a violation, and exits non-zero when any capture fails instead of silently partial-succeeding.

**A design-token rename made ~28 labels invisible.** Adopting shadcn's token contract introduced `--muted` as a *surface*; eval-kit's `--muted` had been the muted *foreground*. Every label rendered at `38,38,38` on a `10,10,10` background. The token contrast test passed the entire time, because it checked `--muted-foreground` and the CSS class never used it.

That last one produced the most useful correction of the whole stretch: **a test that asserts the palette is not a test that asserts the page.** There is now a second audit that walks every visible text node on every route and measures it against its real composited background. The check that would have caught it. Both layers stay: 98 token assertions across 12 palettes × 2 modes, and the rendered-output pass.

## 6. Seven guards, seven half-ships

The pattern worth extracting is what stopped each mistake. Across eval-kit and HITL Kit, seven distinct guards fired, and **not one was a style complaint**:

| Guard | What it caught |
|---|---|
| Publish smoke (eval-kit) | A new CSS subpath export that no module resolution could resolve |
| Contrast test | `primary-foreground` white on yellow/green/orange at 1.9–3.6:1 |
| Contrast test (again) | Regenerated status colours dropping to 3.30:1 and 2.94:1 |
| API surface, types | A namespace exported under a TypeScript keyword |
| API surface, runtime | 17 unlisted exports |
| Exhaustive event-kind fixture | A new protocol event with no canonical example |
| Publish smoke (HITL Kit) | **A primitive no adapter could emit** |

The last one is the best of them. Adding `evidence.pointer` to `@hitl-kit/core` left a protocol event that agents on the AI SDK and MCP adapters had a schema for and no way to send. The smoke test asserts that the event-kind count, the ai-sdk tool count and the mcp tool count all agree, and they are supposed to agree, because the adapters mirror the protocol one-for-one. Bumping the number would have made the test pass while shipping exactly the half-ship it exists to prevent.

Four separate hard-coded counts were involved. Each one forces a protocol change to be *conscious*: you cannot add an event kind by accident, only on purpose, and the diff records which.

## 7. What shipped alongside

Briefly, because it is release-note material rather than argument:

- **HITL Kit P1** began with two authorization primitives. `abstained` becomes a distinct approval state: *"I cannot determine this"* is not *"no"*, and collapsing it into `rejected` discards the one signal saying the standard was unclear rather than the case. It ships with `isAuthorized()` so no caller hand-rolls `state === "approved"` and quietly disagrees about whether abstention permits action. It does not. `evidence.pointer` makes a claim **located**: a span, a normalised box, a time segment, with a `notAssessed` list carrying what was consulted and yielded nothing.
- **The dashboard was rebuilt** on shadcn's token contract with twelve palettes, a six-role type scale replacing twelve sizes used interchangeably across 199 usages, and layout primitives replacing nine hand-rolled page headers and seven different gutters. The inbox became a triage queue, rail rows dropped from as many as seventeen elements to four.

## Honest limits

The instrument still measures the agent, not the reviewer. Inter-rater agreement, whether two humans scoring the same step agree, is the next release, and until it exists eval-kit can tell you an agent skipped a gate but not whether the person watching would have noticed. That is the honest ordering, and it is also the gap that matters most for the calibration story.

The suites remain small: three references, roughly ten tasks each. Enough to demonstrate the math, not to certify anything. And the gate declarations in them are authored, not observed. The golden corpus of real traces still waits on real data, which is deliberate. Fabricating it would destroy the only thing the project has.

Finally, one instance is not a method. "A reframe should break something" is a heuristic drawn from a single case, and the honest version is narrower: *if you cannot find anything the new claim contradicts, you should suspect you have changed the pitch and not the project.* That is a question to ask, not a law.
