---
title: "Windowless: when finding is free, trust shrinks to what one person can check"
date: "2026-11-12"
experiment: null
models: []
tags: ["verification", "security", "mathematics", "Lean", "local software", "measurement"]
keywords: ["Leibniz", "characteristica universalis", "Lean", "Mathlib", "formal verification", "Linux kernel", "local-first", "small software", "Cytowic", "monad"]
kind: "essay"
status: "published"
summary: "In October 2026 one pipeline produced 948 working Linux root exploits for about $1,279 each, and one release put hundreds of machine-found mathematical results in front of a field that has not yet understood them. Finding is now cheap and checking is not, and that observation is no longer new. This note argues for what follows from it: trust shrinks to what one person can check, the things worth trusting become small on purpose, and Leibniz described both halves of that arrangement three centuries ago. The second half is a prediction. Nothing here measures it yet."
key_findings:
  - "**The bottleneck is checking, and that is now common ground.** OpenAI's kernel report says so in its second paragraph, and the mathematics release of the same autumn shows the same shape: results arrive faster than anyone can understand them. We state it and move on."
  - "**A check can pass for the wrong reason.** In an early run, 20 of 200 reported root exploits had reached root through a different vulnerability than the one assigned. A root shell was the pass condition, and it was met. This is the failure № 007 and № 010 describe, at a scale where no person could have caught it by reading."
  - "**Leibniz specified the centre.** A formal language, an encyclopedia written in it, and an engine that settles claims by calculation. Lean and Mathlib are a working instance of all three. What he got wrong is instructive: the engine checks, it does not discover."
  - "**The part you trust is small by design.** Lean's guarantee rests on a kernel kept small enough for people to audit. That is the general rule, and it applies to a person's software as much as to a proof: what you rely on has to fit inside what you can check."
  - "**The claim about individuals is a prediction.** None of the sources measure whether small local software protects anyone. The last section says what we will run to find out, and reports no results."
---

Two things were published a month apart in the autumn of 2026, in fields that rarely read each other's news. One was a pile of mathematics. The other was a security report. **They describe the same event.**

## 1. What happened

OpenAI's report on the Linux kernel, [A thousand fewer paths to root](https://openai.com/index/a-thousand-fewer-paths-to-root/), describes a research pipeline pointed at a codebase of more than 40 million lines. In twelve hours its analyst agents produced 2,308 candidate findings. Within thirty hours the pipeline had reproduced 1,724 of them as real vulnerabilities. In a run the report dates to mid-October, it produced 948 working local privilege escalation exploits for a commonly used Linux distribution: programs that take an ordinary user to root. The whole run cost $1,213,430 in API credits, which the report divides out to $1,279 per exploit.

That report came out on 4 November. A month earlier, on 6 October, OpenAI had published [Sharing AI progress in mathematics](https://openai.com/index/sharing-ai-progress-in-mathematics/). Scott Aaronson's account of it the next day, [The Mathocalypse](https://scottaaronson.blog/?p=10169), counts 372 results, among them a claimed proof of the Unique Games Conjecture, at an average of about three hours of compute per problem solved. Some of the results come with a Lean certificate. Not all do. By his account no human has yet understood just about any of the proofs, and one item, partial progress on the Hodge conjecture, was retracted over a sign error.

## 2. The part that is no longer new

The security report opens by saying that discovery is becoming easier to scale while prioritisation and validation remain the bottleneck. Aaronson describes researchers rushing to pore over the manuscripts, make sense of them and explain them. The [Association for Human Mathematics](https://www.ahmath.org/statements) objected to the release of more than 700 files at once, called it a demonstration of power and not of scholarship, and urged mathematicians to return to a science that centres human understanding.

These are three positions on one fact. Producing a result is now cheap. Knowing whether the result is true, and whether it matters, costs what it always cost. This site has argued a version of that since [№ 002](/research/002-an-instrument-not-a-judge), and we do not claim it as a finding any more. By November it was the opening of a vendor's report.

One detail in that report deserves more attention than the headline number. In an early run the exploitation stage reported 200 successful root exploits. People reviewed them and found that 20 had reached root through a different vulnerability than the one each agent had been assigned. The pass condition was a root shell, and every one of the 20 had a root shell. The report's own takeaway is to "verify the path to a result in addition to verifying the result itself".

That is [№ 007](/research/007-absence-passes), where four gates stayed green over a package with no README, and it is [№ 010](/research/010-present-informed-and-wrong), where a responder had every fact right and still gave the wrong instruction. **A check answers the question it was written to ask.** At two hundred results a person can still read each one and notice. At 948, or at 372 proofs, nobody reads each one.

## 3. Why the gap does not close

It is tempting to treat this as a temporary shortage of reviewers. We think it is permanent, for a reason the neurologist Richard Cytowic sets out in *Your Stone Age Brain in the Screen Age*. A brain runs on a fixed energy budget. It is a small fraction of the body's mass and takes roughly a fifth of its resting energy, and it cannot draw more because the work in front of it got harder. Attention is that budget being spent. There is no setting that buys a second helping.

The other side of the ledger has no such ceiling. The kernel run was bought with API credits. A larger run is a larger invoice. So the quantity of things that could be checked grows with spending, and the quantity one person can check stays where it has been for as long as there have been people. The ratio moves in one direction only.

Two responses follow. One is to make the checking itself mechanical. The other is to shrink what needs checking until it fits. Gottfried Wilhelm Leibniz proposed both, in different decades of his life, and he is usually given credit for neither.

## 4. Leibniz, three centuries early

In 1666 Leibniz published a dissertation on the art of combinations and began describing a project he kept returning to until he died. It had three parts. The first was a *characteristica universalis*: a formal language in which concepts are written so exactly that the grammar itself rules out nonsense. The second was an encyclopedia of human knowledge written in that language. The third was a *calculus ratiocinator*, an engine of rules for working on those sentences as mechanically as arithmetic works on numbers. His summary of what it would be for is the famous one. When two people disagreed, they would not need to argue. They could sit down like accountants and say: let us calculate.

He was not speaking loosely. He built a calculating machine that could multiply and divide, and he published the binary arithmetic every computer now runs on. He understood that reasoning could be made of parts simple enough for a mechanism, and he said so before anyone had a mechanism worth the name. What he never finished was the encyclopedia. The language was useless until the concepts had been defined in it, one at a time, and that was more than one life's work.

Now look at what mathematicians have built. [Lean](https://lean-lang.org) is a formal language in which a statement and its proof are written exactly enough for a program to check every step. Mathlib is a library of mathematics written in it, where nothing enters unless the checker accepts it. The checker is a mechanical procedure that returns yes or no. That is the language, the encyclopedia and the engine, in that order, and the encyclopedia is being written the only way it could be: by a great many people defining one concept at a time.

So when a claimed proof arrives from a model, with reasoning no person follows, nobody has to take it on faith or reject it on principle. If it comes with a Lean proof, the answer to whether the proof establishes the statement is a calculation. The dispute between the lab and its critics has a part that can be settled the way Leibniz said disputes would be.

He was wrong about one thing, and the error is useful. He expected the engine to derive new truths, turning the crank on the encyclopedia until knowledge came out. The engine that got built is a checker. **The engine checks. It does not discover.** Proposing is done somewhere else: by people, for three hundred years, and since this autumn by models, in bulk. Discovery and checking turned out to be separate jobs with separate costs, and that separation is the event described at the top of this note.

It also changes what the mathematician's job is. Aaronson already describes the scene as a race among humans to digest and explain a messy machine proof. If machines propose and a kernel checks, what is left for people is the work no kernel does: deciding which questions are worth asking, and understanding the answers well enough to teach them. The field moves from discovering results toward inheriting them, taking apart proofs that are already known to be correct until someone can say why they are true. That is a quieter kind of mathematics than the one its practitioners signed up for, which is part of what the Association's statement is mourning. It is still mathematics. A proof that is certified and not understood is a fact about the world that nobody yet knows how to use.

## 5. What the kernel teaches

There is a detail in how proof checkers are built that carries the rest of this argument. Lean is a large system: an editor integration, a compiler, automation that searches for proofs. None of that has to be trusted. Whatever those parts produce is handed to a kernel, a deliberately small program that checks the finished proof against a short list of rules. The guarantee rests on the kernel alone, and the kernel is kept small so that people can read it, argue about it, and write independent copies of it.

That is a design decision about trust, and it generalises. You cannot make the whole system trustworthy, so you arrange for everything to pass through a part that is small enough to check, and you spend your fixed budget of attention there.

A kernel also has a limit that matters. It tells you the proof establishes the statement. It does not tell you the statement is the one you meant. Someone still has to read the formal statement and agree that it says what the paper's title claims. That reading is the path check from the kernel report in another form, and it is the remaining human job. It is small, and it is small on purpose.

## 6. Windowless

Late in his life Leibniz wrote a different kind of text. The *Monadology*, ninety short paragraphs from 1714, describes a world made of simple, self-contained units. Each one, he says, has no windows: nothing comes in from outside and nothing goes out. Each still reflects the whole world from its own position, and they stay in step with one another because they were all made to the same law, not because any of them reaches into another.

That was metaphysics, and we are not claiming Leibniz had computers in mind. We are borrowing the picture because it is the right one for the other response to the gap.

The centre he imagined is being built: a shared formal language, a checked library, an engine. The edge is the part nobody is building for you. A person cannot check a 40-million-line kernel, or the several hundred packages under an ordinary application, or the service behind a login. The kernel report's own remedies are addressed to institutions: rescan the code with each new generation of models, and treat formal verification of core software as a direction worth funding. Both are right. Neither is available to an individual. The report lists one more direction, and it is the one a person can act on: minimising attack surface by removing unnecessary features.

What is available to an individual is the kernel's design decision, applied to their own life. Keep the part you depend on small enough to check. Run it where you can see it. Give it no windows it does not need: no inbound access by default, no standing credentials, a narrow and explicit list of what it may reach. Let it stay in step with everything else through shared formats and protocols, not through someone else's access to its insides.

So here is the claim, stated plainly. **When finding is free and checking is fixed, trust shrinks to what one person can check, and small local software becomes the default protection for individuals.** Not because small software has no bugs, and not because local is private in some general sense, but because it is the only software whose behaviour one person can still afford to verify.

## 7. What this changes here

The code behind this site's projects is closed for now, and the reason should be stated carefully, because the obvious reason is wrong. Hiding source does not stop this kind of search. The kernel pipeline found and exploited a vulnerability in QEMU without access to QEMU's source code, and the report says its advice to keep rescanning applies to proprietary software as much as to open source. Anything already published to a package registry has shipped its source regardless.

The reason is narrower. Publishing code is a standing claim that someone is checking it at the rate it can be attacked. That rate changed this autumn, and ours did not. Closing the repositories withdraws a claim we cannot currently back. It is a holding position, and it ends when the checking is in place. The research stays open because an argument is the one thing here a reader can check for themselves.

## 8. What we are going to test

The claim in bold is a prediction. We intend to measure it on ourselves.

The setup is a handful of personal machines with one job each. One serves an open model, fine-tuned locally. One is the only way in from outside. One runs tools and computer use inside disposable environments that are reset after every task and hold no real accounts. Every point where an agent hands control back to a person is a gate in the sense of [№ 005](/research/005-the-gate-is-the-unit-of-measurement), and eval-kit records each one from the first run: that it fired, when, who answered, and how fast, the fields [№ 009](/research/009-a-rubber-stamp-is-also-an-approval) added because an approval nobody timed cannot be told apart from a rubber stamp.

The first measurement is the plain one: the tuned local model against a frontier model on the same gated tasks, on the same machines. It answers which work a person can actually move onto hardware they control, and at what cost in interventions.

## 9. Honest limits

Nothing in the last two sections is a result. The machines are not built. The claim that small local software protects individuals is an argument from a fixed budget and a design principle, and it could be wrong in at least two ways. Small software still sits on a large operating system that its owner cannot check. And a model fine-tuned at home may be too weak to do the work, in which case the protection is real and useless.

Every figure about the kernel run is OpenAI's own, from its own report on its own unreleased model. We have not reproduced any of it. Every figure about the mathematics release is taken from Aaronson's post, which is one informed reader's account written the day after. His own update to that post gives the count as 376. We have not read the proofs, and we are not in a position to say which of them will stand. The Association's statement is summarised here, and it speaks for its signatories, not for mathematics as a whole. Its objections to how the results were released are separate from whether the results are true.

The reading of Cytowic is ours, and the one-fifth figure for the brain's share of resting energy is the standard textbook estimate, not a number taken from his book. He is writing about attention and screens, and we are applying his fixed budget to verification, which is a step he does not take. The reading of Leibniz is a borrowing in two places. Lean was not built to fulfil his plan. The monad is a metaphysical object, and treating it as a design for software is an analogy, offered because it is exact about one thing: a unit can take part in a shared order without being open to it.

The test that would turn this note into research is the one described above: a few months of recorded gates on real tasks, with the local model's work beside the frontier model's. Until then this is a position with a plan attached.
