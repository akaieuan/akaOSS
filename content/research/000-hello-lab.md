---
title: "Welcome to the lab log: what this feed measures, and how"
date: "2026-07-18"
experiment: null
models: []
tags: ["Assist-Not-Complete", "5-dim rubric", "distractor tasks", "eval-kit", "HITL Kit", "tag-kit"]
keywords: ["human-in-the-loop", "agent evaluation", "reproducible research", "Assist-Not-Complete", "distractors"]
status: "published"
summary: "Findings here are produced by running eval-kit suites, displayed with HITL Kit components, and scored by humans on a five-dimension rubric — never by an LLM judge. Every entry links its experiment folder and checked-in run JSON, and none of it is leaderboard material."
key_findings:
  - "This feed publishes **reproducible experiments**, not benchmark results: each finding is a question, runs against real models, **human-scored results on a 0–3, five-dimension rubric**, and a checked-in repro link."
  - "First up, **№ 001** asks whether pushback scales with model tier, using **distractor tasks** from three eval-kit seed suites — tasks where the pass is the refusal, not the compliance."
---

This is the findings feed — a working lab log for measuring human-in-the-loop
AI. Findings here are produced **by** running eval-kit suites, displayed
**with** HITL Kit components, and eventually scored for agreement **with**
tag-kit. Each entry is one reproducible experiment: a question, runs against
real models, human-scored results, and a checked-in repro link.

The premise is the same one the paper argues. Current benchmarks ask "can the
model complete this task autonomously?" But in deployment, real users don't
want autonomy — they want an assistant that respects their authority, preserves
their agency, and makes them better over time. We call the alternative
**Assist-Not-Complete**: evaluate AI on whether it assists humans without
displacing them, not on whether it can finish the task alone. This feed is where
that claim gets measured, one finding at a time.

## 1. Three principles

**Reproducible or it didn't happen.** Every finding links its experiment
folder and its checked-in run JSON. Re-run it and diff against ours. Nothing
here is a screenshot of a number you can't regenerate.

**Humans score, not LLMs.** Scoring runs on a rubric of five human
dimensions per step — explainability, agency preservation, long-term
capability, calibration, collaborative performance — on a 0–3 scale against a
golden truth. LLM-as-judge appears only as opt-in pre-fill, and it is flagged on
every score it touches.

**Signal, not a leaderboard.** Aggregate scores are internal signal, not
leaderboard fodder. You will not find "X beats Y" framing here. The ambition is
different: the paper becomes the protocol; the protocol becomes the platform.

## 2. How a finding renders

Once a run is wired in, its trace and summary render inline from the
checked-in artifact. For now these render as placeholder cards pointing at the
run path — the live HITL-component wiring lands with the first real finding:

```summary
content/research/001/run.summary.json
```

```trace
content/research/001/runs/opus-4.8.trace.json
```

## 3. What № 001 will measure

The first finding asks: **does pushback scale with model tier?** It draws
distractor tasks from three eval-kit seed suites — tasks marked as distractions,
like future-dated papers and unverifiable claims, where the right move is to
push back rather than comply. Distractors score the refusal, not the
compliance: they are pass-when-the-agent-pushes-back.

It runs three models under test — `claude-haiku-4.5`, `claude-sonnet-5`, and
`claude-opus-4.8` — and lands here once the human scoring pass completes.
