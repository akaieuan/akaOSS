---
title: "An instrument, not a judge: why humans score the agents"
date: "2026-07-18"
experiment: null
models: []
tags: ["eval-kit", "LLM-as-judge", "5-dim rubric", "distractor tasks", "tool_match", "Assist-Not-Complete"]
keywords: ["agent evaluation", "LLM-as-judge", "human scoring", "tool selection", "distractors", "calibration"]
kind: "essay"
status: "published"
summary: "LLM-as-judge shares the blind spots of the agent it grades — both were trained against similar objectives, so the judge rationalizes the same failures. eval-kit's answer is a measurement instrument built around step-level human judgment: per-step tool-match assertions, distractor tasks that score the refusal, and a five-dimension 0–3 rubric the judge never touches by default."
key_findings:
  - "A judge trained like the defendant misses what the defendant misses: **calibration drift, agency erosion, and fabricated grounding** survive LLM-as-judge because both models rationalize them the same way."
  - "The most honest per-step signal is **tool selection** — whether the agent reached for `academic_search` or invented a citation — and it is almost never measured. eval-kit makes it a first-class assertion."
  - "The LLM gets exactly one role: **opt-in pre-fill, flagged on every score it touches**. A human edit flips the flag. If LLM-judge became the default scorer, the framework would lose its reason to exist."
---

This essay is the design argument behind [eval-kit](/projects/eval-kit) — why
it scores the way it scores, and what it refuses to become.

## 1. The judge shares the defendant's blind spots

The convenient way to evaluate an agent is to ask another model whether the
output looks good. It scales, it's cheap, and it produces numbers on demand.
It also has a structural flaw that no prompt engineering removes: the judge
and the agent were trained against similar objectives, on similar
distributions, with similar failure modes. When the agent drifts in
calibration — confidently asserting what it should hedge — the judge's
calibration drifted the same way. When the agent erodes the user's agency by
steamrolling a decision, the judge reads fluent, decisive prose and calls it
quality. When grounding is fabricated but plausible, plausibility is exactly
what the judge measures.

A judge that rationalizes the defendant's failures for the same reasons the
defendant makes them is not an instrument. It's a mirror.

## 2. What a step actually reveals

The second problem is altitude. Existing agent evals — MMLU, SWE-bench, GAIA,
AgentBench — score a final output on a synthetic, single-turn, closed-form
task. But a deployed research workflow runs five to nine steps with a person
at the other end, and the interesting failures live *between* the steps:
looping during canvas creation, regenerating notes that drift from their
sources, declining to push back when the cited papers disagree with the
user's thesis. A score on the output doesn't see any of it.

Step-level measurement starts with the most honest signal available: which
tools the agent reached for. Whether it called `academic_search` or invented
a citation, `read_pdf` or paraphrased from a hallucinated abstract, is a
mechanical, checkable fact — no judgment required. eval-kit makes per-step
`expected_tools` versus actual calls a first-class assertion, with a strict,
subset, or any matching mode per step.

Distractor tasks push the inversion further. Suites mark certain tasks
`is_distraction` — future-dated papers, unverifiable claims, out-of-scope
asks — and those tasks are pass-when-the-agent-pushes-back. The framework
scores the refusal, not the compliance, because in deployment catching the
trap *is* the competent behavior. № 001 in this feed measures exactly that.

## 3. The rubric as instrument

What machines can check, machines check: tier-1 auto-scoring computes
tool-match and distraction-caught at trace time. Everything that requires
judgment goes to a person with a structured rubric: a 0–3 golden-truth score
per step, plus 0–3 on the dimensions in scope — explainability, agency
preservation, long-term capability, calibration, and collaborative
performance. These are the Assist-Not-Complete axes from
[the paper](/paper), turned into a scoring surface.

The LLM is allowed one role in this pipeline: optional pre-fill that the
human accepts or overrides, marked `pre_filled: true` on every score it
touches. Any human edit flips the flag. Tier-3 triage then spends the scarce
resource — human attention — where it pays: low-confidence drafts and
auto-score disagreements float to the top of the review inbox.

## 4. What it refuses to become

The guardrails are load-bearing. No leaderboards: aggregate scores are
internal signal, and "model X beats model Y" framing is the failure mode the
framework was built against. No synthetic benchmark fixtures: every seed task
is ported from observed real usage. No hosted service: runs are JSON files on
disk, the dashboard runs locally, and that stays true by design. And no
default LLM judge — because an instrument that grades itself isn't measuring
anything.
