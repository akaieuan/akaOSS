---
title: "Signals, not verdicts: the gate thesis applied"
date: "2026-07-26"
experiment: null
models: []
tags: ["gates", "human-in-the-loop", "content review", "audit", "HITL Kit", "inertial", "Assist-Not-Complete"]
keywords: ["approval gates", "human oversight", "hash-chained audit", "evidence pointers", "calibration", "reference architecture"]
kind: "essay"
status: "published"
summary: "The companion to the gate thesis: what happens when you build it into a domain where being wrong has a victim either way. Content review turns out to produce both gate kinds without being asked to, and the architecture that results has one property worth stating plainly. The machine may resolve a case alone only when the resolution is to do nothing."
key_findings:
  - "The two gate kinds were not imposed on the domain; they fell out of it. Removal is held as a **proposal** that needs both a confidence floor and a human signature; a case the policy does not cover **escalates rather than guesses**. The sharper form of the same rule: across twenty events the only outcome the machine resolves by itself is *leave it where it was*. **Autonomy is permitted for inaction and withheld for destruction.**"
  - "A gate is affordable only when the checkable half of the standard is already checked. Evidence is a typed pointer: a character span, a bounding box, a video segment, so the reviewer's attention lands on the disputed thing rather than the whole document. **Without located evidence a reviewer can only trust or re-derive, and both are failures of the gate.**"
  - "Building the first genuine consumer of the akaOSS family proved the family is not yet consumable end to end: **tag-kit was never published, and eval-kit's gate release exists only on main.** Two of four kits are documented seams rather than dependencies. The previous version of this project claimed those integrations and did not have them, which is the specific mistake this note exists to not repeat."
---

The [previous piece](/research/005-the-gate-is-the-unit-of-measurement) argued
that the gate. The moment control returns to a human, is the unit worth
measuring. That argument was made in the abstract, which is the easy place to
make it. This one reports what happened when it was built into a domain where
being wrong has a victim in either direction: leave harmful content up, or
remove someone's speech in error.

The vehicle is **inertial**, a reference application for auditable content
review. Sub-agents emit calibrated signals; a policy layer routes them; humans
decide; every transition lands in a hash-chained log. Three of its mechanisms
are built into this piece as working instruments rather than described from a
distance: a gate that refuses to execute, a hash chain you can try to forge,
and the same decision shown with and without its evidence. They are live. Use
them.

## 1. Why this domain is the right test

Content review has a property most agent benchmarks lack: **both errors are
real**. A false negative leaves harassment in front of the person it targets. A
false positive removes someone's speech and is rarely appealed successfully.
There is no direction in which caution is free, so a system cannot dodge the
problem by being conservative. Something has to decide, and the interesting
question is what "something" is allowed to be.

It also has consequence asymmetry, which turns out to be the load-bearing fact.
Leaving a post up is reversible; you can remove it later. Removing a post is
not reversible in any way the author experiences as reversible. An architecture
that ignores this asymmetry will treat both as symmetric "actions" and gate
them identically, which is either too slow or too dangerous depending on which
side it optimizes.

## 2. What the machine is allowed to decide alone

Twenty events run through the demonstration corpus. The policy routes them:
five to auto-allow, one proposed for removal, four to a quick queue, seven to a
deep queue, three escalated. The number that matters is not any of those. It is
this: **the only outcome resolved without a human is auto-allow, and auto-allow
means leaving the content exactly where the author put it.**

That is not a scheduling detail; it is the whole design compressed into one
rule. The machine may decline to act on its own. It may not destroy on its own.
The single removal in the corpus is not an action the policy took. It is a
*proposal* the policy raised, held until it clears a confidence floor and
collects a human signature. The state machine enforcing that is
[HITL Kit](/projects/hitl-kit)'s gates package, so the invariant "nothing
reaches an executed state without an approval event" is a property of a
library rather than a promise made by an `if` statement in a route handler.

Stating it as a rule an operator could adopt: *autonomy is permitted for
inaction and withheld for destruction.* It is cheap to implement, it survives
contact with a real policy file, and it makes the honest claim about what the
automation is for. The system is not deciding. It is deciding what deserves
your attention, and in what order.

Below is that rule as running code. The removal is queued and the model is
confident; try to execute it before approving anything and watch the executor
refuse. The refusal is not a UI affordance being disabled. It is the executor
finding no approval event in the log and declining on that basis.

```exhibit
mandated-gate
```

## 3. Two gates, found rather than imposed

The prior piece separated **mandated** gates (policy compliance, binary,
machine-checkable, the agent's confidence irrelevant) from **discretionary**
gates (judgment under missing or ambiguous information, with over-asking and
silent guessing as the two failure modes). That split was derived from thinking
about agents in general. The useful result here is that a domain built for
other reasons produced both without being asked to.

The mandated gate is the removal proposal above. Compliance is a yes or no
question about ordering: did an approval precede the consequential act. There
is nothing to interpret.

The discretionary gate arrived as an ordinary policy rule. Content appears that
the rule set does not describe, a pattern nobody wrote a threshold for. The
policy's answer is to escalate, which in gate terms is the system saying *I do
not have grounds to route this and I am not going to invent them.* Two of the
twenty events resolve that way. That is a judgment call with a precision and
recall shape: escalate everything and you have delegated your job to the
reviewer; escalate nothing and you are guessing quietly. Neither failure is
visible in a task-success score, which is the argument the previous piece made
and this one now has a concrete instance of.

The two must not share a metric. One measures whether the system obeyed its
operator. The other measures whether it knew the edge of its own competence.

## 4. What makes a gate affordable

A gate costs human attention, and attention is the scarcest thing in a review
operation. The way to make it affordable is not to gate less. It is to arrive
at the gate with the checkable half of the standard already checked.

In practice that means evidence is a **typed pointer**, not a paragraph of
explanation. A signal carries a discriminated union: a character span into the
text with its exact offsets, a normalized bounding box on an image, a timestamped
segment of video. The reviewer is not handed a document and a score and asked to
form an opinion. They are shown the disputed thing, in its surrounding context,
with the channel and the probability attached to it.

The difference is visible rather than arguable. Below, the same decision is
shown both ways, turn the evidence off and ask yourself what you would do.
Without location, a reviewer has two options: trust the score, which is the
automation bias the EU AI Act's Article 14 names as a risk oversight design
must counter, or re-derive the judgment themselves, which erases the reason for
delegating. Both are failures of the gate, and neither is visible in any
accuracy metric.

```exhibit
verification-contrast
```

One structural detail carries more weight than it looks like it should. A
probability is only emitted when the model has something to say; a skill that is
uncertain omits the channel rather than reporting a low number. **Absence is
meaningful.** It means the run produced no evidence on that dimension, which is
a different claim from evidence of innocence, and a policy that cannot tell
those apart will quietly convert crashes into clean bills of health.

## 5. The chain, and what it does not prove

Every transition: ingested, signalled, routed, decided, appends one entry to a
hash chain: each entry hashes its own contents together with the hash of the
entry before it. Editing history invalidates every hash downstream of the edit.

Prose cannot make that claim land, so here is the chain itself. Tamper with an
entry and verification fails at that index, which most people expect. Then
*repair* the forged entry by recomputing its own hash so it is internally
consistent, and the break simply moves one position later. Local repair is
impossible. That is the entire content of the guarantee, and it is worth
operating yourself because "hash-chained" is frequently claimed and rarely
inspected.

```exhibit
audit-chain
```

What it does not prove deserves equal space. The chain shows that the recorded
history has not been altered since it was written. It says nothing about
whether what was written was true at the time, nothing about whether the
reviewer read the evidence before clicking, and nothing about whether the
policy was reasonable. It converts a claim about the past into an artifact. It
does not convert a judgment into a fact.

## 6. What the build proved about the family

This project was intended as the proof that the akaOSS kits compose into a real
application. It proved something less flattering first.

[HITL Kit](/projects/hitl-kit) is genuinely wired in: UI primitives installed
from the live registry, and the gates package imported as the decision state
machine described above. Remove the dependency and the application stops
working, which is the only definition of "uses" worth accepting.

The other two are not. **tag-kit was never published to npm.** **eval-kit's
gate release exists on main and has not shipped.** So the scope-aware tagging
layer and the calibration surface in this build are local implementations
standing exactly where those packages will plug in, and they are labelled that
way in the repository rather than described as integrations.

This matters beyond bookkeeping. The [credibility stack](/research/004-the-credibility-stack)
argued that a package which works inside its own monorepo can be broken for
every outside consumer, and that the fix is to test the artifact a stranger
actually receives. This is the same failure one level up: a family of kits can
look coherent from the inside and be un-composable from the outside, and the
thing that reveals it is trying to build the first honest consumer. The
previous version of this project claimed both integrations in its README while
importing neither. That is the specific mistake this note exists to not repeat,
and the reason the limitation is in the summary rather than a footnote.

## 7. What is real and what is demonstration

Real: the contracts, the policy evaluator (a structured AST, first match wins,
no string evaluation anywhere, and the matched subtree is preserved so an audit
entry can say precisely why), the hash chain and its verification, the
calibration math, the gate state machine, and the review surfaces.

Demonstration: the corpus is twenty hand-authored events with pre-computed
signals. No model is called. There is no database, and decisions reset when the
process restarts. The gold set is thirty rows, which is enough to show that the
Brier and calibration-error arithmetic is plumbed correctly and nowhere near
enough to claim anything about how well any classifier is calibrated in the
world.

The connectors that would carry real platform events do not exist, which is the
honest ceiling on the whole thing: it is a verification substrate with a
reference interface on top, not a moderation service. That was true of the
prototype this replaces, and stating it clearly was the best thing about that
project's documentation. It seemed worth keeping.
