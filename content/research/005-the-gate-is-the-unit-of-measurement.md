---
title: "The gate is the unit of measurement"
date: "2026-07-18"
experiment: null
models: []
tags: ["gates", "human-in-the-loop", "eval-kit", "HITL Kit", "EU AI Act", "measurement", "Assist-Not-Complete"]
keywords: ["human oversight", "approval gates", "automation bias", "Article 14", "agent evaluation", "verification", "conformance"]
kind: "essay"
status: "published"
summary: "A reframing of what the akaOSS measurement family actually measures: not task completion, but the gate, the moment an agent hands control back to a human. Gates come in two kinds that must never share a metric, autonomous benchmarks structurally penalize both, and a gate over unverifiable output is oversight theater. Regulation now mandates effective human oversight; nothing measures whether oversight is effective. That gap is the research program."
key_findings:
  - "Gates divide into two constructs with incompatible metrics: **mandated** gates (policy compliance, pass/fail, the agent's confidence is irrelevant) and **discretionary** gates (judgment under missing or ambiguous information, scored on the precision/recall tension between over-asking and silent guessing). Averaging them produces a number that means nothing."
  - "Under task-success scoring, a gate can only cost points: it adds latency and completes nothing. **Autonomous benchmarks do not merely neglect collaborative behavior; their scoring functions cannot represent its value.** Measuring a gate requires a comparative design, the same task run gated and ungated, which no leaderboard currently does."
  - "A gate over unverifiable output is theater: the reviewer either rubber-stamps (the automation bias the EU AI Act names) or re-does the work. The gate becomes real when the machine-checkable half of the standard is verified before the human is asked, so approval spends judgment only on what actually requires it."
---

We spent today rebuilding the measurement family, and in the middle of it the
actual object of study came into focus. It is not task completion, and it is
not tool use. It is the **gate**: the moment an agent stops and hands control
back to a human, to approve, to answer, to correct. This essay records that
reframing, because it changes what [eval-kit](/projects/eval-kit) measures,
what [HITL Kit](/projects/hitl-kit) renders, and what the family is for.

## 1. From "benchmarks are wrong" to a positive claim

Our [measurement-problem paper](/paper) argues that evaluation optimizes for
autonomous completion while deployment reality is collaborative. That is a
critique, and critiques age badly without a constructive counterpart. The
counterpart is this: **evaluation should measure conformance to an explicit
standard under human authority**, and the gate is where authority is
exercised. This is a deliberately narrower claim than "AI measurement is
broken," and the narrowing is the point. It is specific enough to build
against, and specific enough to be wrong, which is what distinguishes a
research program from a complaint.

The domain does not matter. A research agent pausing before it commits a
citation, a coding agent pausing before a destructive refactor, a support
agent escalating past the edge of its knowledge base: these are the same
event in three costumes. That is the argument for building one framework
rather than three products, and it is now a testable proposition rather than
a brand statement: if gate behavior measured in one domain fails to predict
gate behavior in another, the "same framework" claim is false, and we will
be in a position to see it.

## 2. Two kinds of gate, two metrics, no averaging

The first design consequence is a distinction the schema has to enforce,
because collapsing it would corrupt every downstream number.

**Mandated gates** are policy. Before anything is sent, published, spent, or
deleted, control returns to a human, regardless of how confident the agent
is. Compliance is binary and machine-checkable: either approval preceded the
consequential action or it did not. Confidence is irrelevant by design;
that is what makes it policy rather than judgment.

**Discretionary gates** are judgment. The agent should stop because
information is missing, ambiguous, or conflicting, and no amount of tool use
will resolve it. Here the failure surface is two-sided: an agent that asks
about everything is offloading its work onto the human, and an agent that
never asks is guessing silently. The right metric has a precision/recall
shape, and the tension between the two failure modes is structural. External
work has reached the same conclusion: Scale's
[HiL-Bench](https://arxiv.org/abs/2604.09408) measures exactly this
help-seeking judgment and finds that no frontier model recovers more than a
fraction of its full-information performance when it must decide *whether*
to ask, with over-commitment to an initial guess as the dominant failure
mode.

A compliance rate and a judgment score cannot share a field, cannot share a
metric, and must never be averaged. One is a property of the system's
obedience to its operator; the other is a property of its calibration. Our
earlier distraction tasks, where the correct behavior is refusing a
counterproductive instruction, turn out to be a special case of the
discretionary gate, which is the kind of unification that suggests the
framing is carving at a joint.

## 3. What autonomous scoring cannot see

Score an agent on task success and a gate can only hurt it. The gated run is
slower, and pausing completes no subtask. The scoring function has no term
in which stopping for authority is worth anything. This is stronger than
saying benchmarks neglect collaboration: **their scoring functions cannot
represent its value**, in the same way a ruler cannot represent temperature.

The consequence is methodological. A gate's value only appears in a
comparison: the same task, same model, same toolbox, run once with the gate
available and once without, with the difference in outcome quality, error
consequence, and human cost as the measurement. Single-run leaderboards
cannot produce this number. Our runner is therefore growing a single switch,
gating available or unavailable, so the comparative design is wired in from
the start. One honesty note belongs here rather than in a footnote: with one
reviewer, the cost side of the comparison (interrupted flow, minutes spent
per decision) is qualitative at our scale. Decision quality is measurable at
N=1; interruption cost is testimony. We would rather state that than design
a study that quietly assumes a review panel we do not have.

## 4. A gate over unverifiable output is theater

The sharpest version of the argument concerns what the human at the gate can
actually do. If the output is unverifiable, the reviewer has two options:
trust it, which is rubber-stamping, or re-derive it, which erases the
point of delegation. Regulation has now made this concrete. The EU AI Act's
[Article 14](https://artificialintelligenceact.eu/article/14/) requires that
high-risk systems "can be effectively overseen by natural persons," that
overseers can "correctly interpret the system's output," and it names
**automation bias**, the tendency to over-rely on machine output, as a risk
the oversight design must counter. The mandate exists. What does not exist
is any standard way to measure whether oversight is effective: a
rubber-stamp and a genuine review are indistinguishable in every current
benchmark. A legally required property of deployed systems is currently
unmeasurable. That is the gap this program aims at.

The design answer is to split every standard into its machine-checkable half
and its judgment half, and to verify the first before the human is asked.
Citations either appear verbatim in the cited source or they do not.
Required sections are present or absent. Output either parses or it does
not. When the gate surfaces work with the checkable half already verified,
the human's attention lands only on what genuinely requires judgment, and
approval becomes cheap enough to be real. We keep rediscovering this
pattern in our own tooling: Hologram's `golden.json` is a human-edited
standard that agents build against and never edit, with a gate that reports
only what missed. And we ran the manual version of it on ourselves this
week: a citation audit of our own paper against its sources found one
misattributed set of claims and one fabricated statistic, which we then
corrected in public. The check is real because it caught us.

The general claim underneath: **top-down control is not a limitation of
human-in-the-loop systems; it is their value.** The people this framework
serves are the ones who know what correct looks like, institutions with
citation standards, coding conventions, regulated language, and who need
that knowledge enforced on delegated work. A framework that measures
conformance to their standard is measuring the thing they actually care
about. And the open question it raises is itself a research quantity nobody
reports: *what fraction of a given institutional standard can be made
machine-checkable at all?*

## 5. What this changes in the instrument

The reframing is now being built into eval-kit directly, and one existing
flaw makes the stakes concrete: until today, the adapter offered each step
exactly the tools the eval expected it to use. A gate is a decision point,
and an instrument that pre-decides for the agent, whether by leaking the
answer key into the toolbox or by hard-coding the pause, measures nothing.
So: the full toolbox is offered on every step with the expected tools
demoted to answer key; gating becomes something the agent does, two
runner-injected actions for requesting approval and asking a question,
recorded as first-class gate events; mandated and discretionary gates enter
the schema as separate constructs with separate scores; and a verifier layer
checks the checkable half of the standard against sources we control. Then
the instrument gets the treatment the paper says instruments never get: a
corpus of hand-labeled golden traces with known-correct scores, replayed
deterministically in CI, so anyone can watch the instrument be right before
they are asked to trust it.

The comparative runs, gated against ungated across models, wait until we
have a task corpus worth running them on, sourced from human-authored
benchmarks rather than anything we generate ourselves. An instrument built
to catch fabrication should not be validated against fabricated ground
truth.
