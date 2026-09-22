---
title: "A gate with nothing to read: what a calibrated decision model answers, and what it cannot"
date: "2026-09-21"
experiment: null
models: []
tags: ["HITL Kit", "eval-kit", "gates", "calibration", "confidence", "measurement"]
keywords: ["System One models", "Jev", "TypeSafe", "calibrated decisions", "confidence gate", "discretionary gate", "mandated gate", "type safety", "structured outputs", "benchmarks"]
kind: "essay"
status: "published"
summary: "HITL Kit ships a confidence gate that fails open by default, because nothing we could wire to it produced a confidence worth reading. TypeSafe's Jev is the first model we have read that is designed to be that source: typed answers with a probability distribution and a confidence on every call. This note reads their launch material through the gate thesis. It answers the discretionary question well, it must be kept away from the mandated one, it carries two of the three parts of what № 006 calls a signal, and its calibration is a claim only your own labelled data can check. We have not run the model. Every number here is the vendor's."
key_findings:
  - "**We built the gate before there was anything for it to read.** `confidenceGate` in `@hitl-kit/gates` blocks when `signals.confidence` falls below a minimum, and its own documentation says it fails open when the signal is missing, because failing closed would block every adapter that does not emit one. That is every adapter. Asking a chat model for a confidence produces a number, not a calibrated one. A model trained to return a distribution and a confidence with each typed answer is the first credible source for the field we left empty."
  - "**It answers whether to ask. It cannot answer whether you may.** № 005 split gates into discretionary ones, a precision and recall problem about when to interrupt a person, and mandated ones, where policy requires approval and the agent's confidence is irrelevant. A calibrated confidence is exactly the missing input to the first. TypeSafe's own routing example lets a bank transfer proceed unconfirmed above 0.85. Under a mandated gate that number is never consulted, and a system that blurs the two has turned a policy into a threshold."
  - "**Two of the three parts of a signal, and a guarantee about shape.** № 006 defines a signal as a probability, a confidence, and a pointer to the evidence. System One models return the first two and, by design, no account of their reasoning. The pointer has to move into the question, which is why their guidance to ask atomic questions about named fields matters more than it looks. Separately, a guarantee that output always matches the schema removes a real class of failure and says nothing about whether the chosen option is right. The vendor's own list of failure modes starts with reading a question literally."
  - "**Calibration is a property of a population, and a gate acts on one case.** TypeSafe says as much in its own documentation. Their headline comparison scores agreement with the average of two frontier language models, written by their own team, which they disclose. That is agreement with judges, the thing № 002 argues against treating as truth. The check that closes it is the one they recommend themselves and the one eval-kit exists for: your own cases, labelled by people."
---

There is a function in [HITL Kit](/projects/hitl-kit) that has been waiting for something to read.

`confidenceGate` takes a minimum and blocks any action whose `signals.confidence` falls below it, escalating to a person instead. It is about thirty lines, it has tests, and it ships in `@hitl-kit/gates`. Its documentation also contains this, in our own words: by default the gate fails open when no confidence signal is supplied, because a gate that denied on a missing signal would block every legitimate call from adapters that have not been wired to emit one.

That describes all of them. We built a gate around a number that nothing upstream could be trusted to produce. You can ask a chat model how sure it is and it will tell you, fluently, and the figure will be one more piece of generated text. The field stayed optional because making it required would have meant requiring a fiction.

On 15 September [TypeSafe announced Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), the first of what they call System One models. It is the first thing we have read that is built to be the source for that field. This note goes through their launch post and [documentation](https://docs.typesafe.ai/introduction) with one question: which of the things this corpus has been asking does it answer, and which does it leave exactly where they were.

One caveat governs everything below. **We have not run Jev.** It is in early access and we do not have it. Every speed, price and accuracy figure here is TypeSafe's, and is labelled as theirs.

## What it is

An ordinary language model produces text, and software that wants a decision has to coax the text into a structure and parse it back out. Jev skips the text. You send a state, which is whatever unstructured context the decision depends on, and a set of typed questions. There are three kinds: a Choice among options you list, a Score against a rubric you define, and a Noul, a zero-to-one answer to whether a statement is true. Every question in a call is evaluated independently and in parallel against the same state.

What comes back is a typed value, the probability distribution behind it, and for Choice and Score a confidence derived from that distribution. It cannot write a reply, produce code, or explain itself. TypeSafe frames this as a trade: give up strings and you get output that always matches the declared schema, responses they put between 70 and 500 milliseconds, and input priced at about four cents per million tokens with output unmetered. They describe the training method, Reinforcement Learning for Calibrated Decisions, as optimising for honest probabilities rather than for text a human rater prefers.

## The question it answers

[№ 005](/research/005-the-gate-is-the-unit-of-measurement) argued that gates come in two kinds that must never share a metric. A discretionary gate is a judgement call: should the agent have stopped to ask here? It is scored on precision and recall, because asking about everything is as much a failure as asking about nothing. That framing has always had a hole in the middle of it. To decide when to ask, a system needs some measure of how unsure it is, and we never had one we believed.

TypeSafe's [confidence-gated routing pattern](https://docs.typesafe.ai/patterns/confidence-routing) is that measure turned into control flow. High confidence acts, a middle band proceeds with a confirmation, and low confidence leaves the automated path for a person. Their thresholds are not one number: they rise with the cost of acting on a misread, so a read-only action clears a lower bar than a destructive one. That is [№ 006](/research/006-signals-not-verdicts)'s rule, that autonomy is permitted for inaction and withheld for destruction, arrived at independently and expressed as an `if` statement.

The exhibit below uses their numbers, from their voice-banking example. Drag the confidence, switch the action, and the outcome follows.

```exhibit
confidence-routing
```

The part worth sitting with is the middle band. It does not exist for the balance check and is wide for the transfer, and everything about whether oversight is affordable lives in how wide it is. A person who is asked to confirm every action stops reading the confirmations, which is the rubber stamp [№ 009](/research/009-a-rubber-stamp-is-also-an-approval) was written about. A calibrated number is what lets that band be narrow without being reckless.

## The question it must not answer

Now tick the box in that exhibit.

A mandated gate is policy: approval must precede this action. № 005 was blunt about what that excludes: compliance is pass or fail, and the agent's confidence is irrelevant to it. The [eval-kit](/projects/eval-kit) page puts the consequence in one line, that a 94 percent compliance rate is not a good score, it is 6 percent unauthorised actions.

TypeSafe's banking example lets a transfer through without confirmation once confidence passes 0.85. As an illustration of thresholds scaling with risk it is a good one. As a design for moving money it shows how easily the two gate kinds blur, because nothing in the code distinguishes "we are fairly sure what the user said" from "this action is allowed to happen without a person". Confidence measures the first. It has no bearing on the second. A system that routes a policy decision through a threshold has quietly converted a rule into a probability, and the conversion will not show up in any test that only checks whether the model understood the request.

This is not a criticism of the model. It is a statement about where in the stack it belongs: upstream of the discretionary decision, and nowhere near the mandated one.

## Two thirds of a signal

№ 006 defined the unit a sub-agent should emit as a signal rather than a verdict: a probability, a confidence, and a pointer to the evidence that produced them. Its argument for the third part was that without located evidence a reviewer can only trust or re-derive, and both are failures of the gate.

A System One model returns the first two and, by construction, never the third. It does not generate explanations. When a low-confidence case lands in front of a person, it arrives with a distribution and no account of why.

The interesting thing is where TypeSafe's guidance puts the pointer instead. Their build documentation insists on atomic questions, each about one specific thing, and their worked example of verifying an agent's tool-call trace asks questions that name their evidence outright: whether a particular argument of a particular call matches a particular field of the request. The question carries the location, so the answer does not have to. That is a real answer to the missing pointer, and it is also a discipline the model cannot enforce. A vague question gets a confident, typed, unlocated answer.

That same example is worth noticing for another reason. Verifying a tool-call trace is what [eval-kit](/projects/eval-kit) does. № 005's design answer was to split every standard into a machine-checkable half and a judgement half, and verify the first before a person is asked. At the latency and price TypeSafe claims, the checkable half could run on every call rather than on a sample.

## Well-typed is not the same as right

The launch post says the model cannot hallucinate, and reports a type-error rate of zero. TypeSafe is careful about that zero: they note it is not an empirical result but a consequence of the architecture, since the possible outputs are fixed in advance. That is a legitimate guarantee, and for anyone who has debugged a malformed tool call three layers down a dependency chain it is not a small one.

It is a guarantee about shape. [№ 010](/research/010-present-informed-and-wrong) showed a benchmark that checked whether a flag matched and never whether it was earned. The same instrument pointed here:

```exhibit
typed-not-right
```

The two failing routes are not ours. They come from TypeSafe's own [page of known failure modes](https://docs.typesafe.ai/model-jaggedness/jev-1.13) for the current model, which is a more candid document than most vendors publish. The model reads instructions literally, does not count or compare dates reliably, struggles with indirection and with large states full of irrelevant detail, and can be pushed by adversarial content. Their advice throughout is the same: keep arithmetic and invariants in code, and ask the model only the judgement.

## Who calibrates the calibrator

The claim the whole design rests on is calibration: that when the model says 0.9, it is right about nine times in ten. Three things are worth holding onto about that.

It is a property of a population. TypeSafe's documentation states that calibration is measured across groups of predictions and does not guarantee any individual answer. A gate never sees a group. It sees one case, and the 27 June decision in № 010 is what one case looks like when the base rates were fine.

The confidence itself is a statistic of the model's own distribution. The interactive explorer on their [confidence page](https://docs.typesafe.ai/confidence) says it approximates a three-option Choice confidence from the largest probability alone, which under that approximation means a split of 60, 40 and 0 reports the same 0.40 as a split of 60, 20 and 20, though the first is a two-way contest and the second is not. They say plainly that this is a default, that the full distribution is returned so you can compute something else, and that the demo formula is an approximation; how the API computes it in production is not something we have measured. The general point survives either way: this is the model describing its own uncertainty, and [№ 002](/research/002-an-instrument-not-a-judge) is about why an instrument should not be asked to vouch for itself.

And the evidence offered for it is agreement with other models. Their workflow evaluation uses the average of two frontier language models as the reference answer, on workflows written by their own capabilities team. They disclose both facts, along with the bias each introduces, and they note their headline multiples are likely at the high end of real-world gains. Where labels are missing, their build guide suggests generating them with an ensemble of expensive reasoning models. That is a sensible engineering shortcut and it is also judges grading judges.

## Where we agree completely

Two short essays sit behind the launch, and they read like a second opinion on [An AI Measurement Problem](/paper).

The first argues that choosing the right task matters more than data, compute or algorithms, in that order, and that a model can show perfect loss curves and still be useless because it was optimised for the wrong thing. The second argues that public benchmarks become targets the moment builders can see them, and that much of what gets called jagged intelligence is the shape of the benchmarks themselves. Their conclusion is to publish no public benchmark results at all, to disclose the caveats on the evaluations they do run, and to tell users to build private evaluations on their own cases.

That is the paper's thesis from the supply side: the failure is a measurement failure, and № 010's ExploitGym is what it costs. It also sharpens a question for them that they do not answer. Calibration training is still optimisation against a measure, on data they generate and decline to describe. Whether that measure has the same gap between what it rewards and what deployment needs is not something an outsider can see. They do not ask to be believed on it. They ask you to check, which is the right request and the only honest one available.

## What this changes for us

Nothing ships from this note. It is worth saying where each piece would sit if it did, because a model this good at the discretionary question invites the conclusion that the rest of the stack is now redundant.

Jev sits at decision time and, by its interface, answers one question: how sure. The call takes a state and typed questions; it does not take the policy that made a gate mandatory, the order the gates fired in, or what the person at the gate went on to decide. HITL Kit is where those first two live, and it would consume the confidence as the signal `confidenceGate` was written for. The third, the human's verdict, exists only in the trace, and the trace is the one place all three meet. Scoring it is what eval-kit is for. If their numbers hold, the discretionary gate has a signal source for the first time; whether that source was tuned well in a given deployment is a precision and recall question, and that is the metric eval-kit already reports. Neither replaces the other. One supplies the number, one governs the action, one checks afterwards whether the number deserved to be trusted.

That division makes three things worth doing that were not before.

`confidenceGate` has a plausible signal source, so its fail-open default can be revisited rather than apologised for. The gate should also say in its documentation what this note argues: it belongs on discretionary decisions, and composing it in front of an approval requirement does not weaken the requirement.

eval-kit's `GateEvent` records that a gate fired, in what order, and since № 009 when and by whom. It does not record the confidence the gate acted on. Without that, nobody can ever check a deployment's calibration against what the people at the gate actually decided. It would be one more nullable field under the same rule as the others: unobserved unless something real observed it, and never fabricated by the runner.

And the per-call cost changes what the machine-checkable half of a standard can be. If a trace can be checked field by field for a fraction of a cent, the interesting quantity stops being whether checking is affordable and becomes what fraction of a standard can be written as atomic questions at all, which is the open question № 005 ended on.

## Honest limits

We have not used the model, so nothing here is a finding about its behaviour. It is a reading of a vendor's launch material, which is a genre with known properties, even when the vendor is unusually candid.

Every figure quoted is TypeSafe's: the latency range, the pricing, the multiples, the zero, and the thresholds in the exhibit. Their evaluation references are other models, the workflows are their own, the training data is undisclosed, and the model is text-only at version 1.13. Our description of how confidence is computed comes from a documentation demo that calls itself an approximation. The idea that the model could verify the machine-checkable half of a standard is an inference from its interface and price list, not something we have tried. Sources were read on 21 September 2026 and rechecked against the live pages on 22 September.

The test that would turn this note into research is small and specific: a few hundred gate decisions from a real deployment, labelled by the people who made them, with the model's confidence recorded beside each. That would say whether the number deserves the field we left open for it. Until then the gate still fails open, and now at least we know what we are waiting for.
