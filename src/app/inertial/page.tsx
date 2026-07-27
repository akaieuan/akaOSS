import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hairline } from "@/components/site/Hairline";
import { BRAND } from "@/lib/content";

import { Exhibit, Pill, Prose } from "@/components/inertial/ExhibitFrame";
import { MandatedGate } from "@/components/inertial/MandatedGate";
import { AuditChain } from "@/components/inertial/AuditChain";
import { VerificationContrast } from "@/components/inertial/VerificationContrast";

export const metadata: Metadata = {
  title: "inertial · live exhibits · akaOSS",
  description:
    "Three live exhibits from inertial, a reference application for auditable AI content review: a mandated gate that will not execute without approval, a tamper-evident hash-chained audit log, and the difference between located evidence and a bare verdict.",
};

const CHIPS = [
  "mandated gate",
  "discretionary gate",
  "signals, not verdicts",
  "hash-chained audit",
];

export default function InertialPage() {
  return (
    <>
      <Nav />

      <div className="mx-auto max-w-5xl px-6 pt-10 md:px-8">
        {/* ── Header ── */}
        <header>
          <Link
            href="/research"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Research
          </Link>

          <h1 className="mt-6 max-w-3xl text-3xl leading-[1.15] font-light tracking-tight text-foreground md:text-4xl">
            inertial, in the open
          </h1>

          <p className="mt-4 font-mono text-[13px] text-muted-foreground">
            reference application
            <span className="mx-2 text-muted-foreground/50">·</span>
            auditable AI content review
            <span className="mx-2 text-muted-foreground/50">·</span>
            <span className="text-[color:var(--accent-amber)]">
              exhibits are live
            </span>
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <Pill key={c}>{c}</Pill>
            ))}
          </div>
        </header>

        <Hairline className="mt-10" />

        {/* ── What it is ── */}
        <div className="max-w-3xl space-y-5 pt-10">
          <Prose>
            inertial is a reference application for AI-assisted content review.
            Its sub-agents emit calibrated <em>signals</em> and never verdicts: a
            probability, a confidence in that probability, and a pointer to the
            span of text that produced it. A policy layer routes those signals. A
            human decides. Every transition lands in a hash-chained audit log.
          </Prose>
          <Prose>
            The review loop is a gated agent loop with two kinds of gate. A{" "}
            <strong className="font-medium text-foreground">
              mandated gate
            </strong>{" "}
            is policy: a consequential action cannot execute until a human
            approves it, and compliance is binary and machine-checkable. A{" "}
            <strong className="font-medium text-foreground">
              discretionary gate
            </strong>{" "}
            is judgment: when policy does not cover a case the system escalates
            rather than guessing, and it can fail in two directions — asking
            about everything, or deciding silently.
          </Prose>
          <Prose>
            The three exhibits below accompany{" "}
            <Link
              href="/research/006-signals-not-verdicts"
              className="text-[color:var(--accent-blue)] underline decoration-[color:var(--accent-blue)]/35 underline-offset-[3px] transition-colors hover:decoration-[color:var(--accent-blue)]"
            >
              № 006, signals, not verdicts
            </Link>
            . They are the real HITL Kit primitives running against local
            fixture data — nothing here is a screenshot and nothing is
            pre-recorded. Operate them.
          </Prose>
        </div>

        <Hairline className="mt-14" />

        {/* ── Exhibits ── */}
        <div className="space-y-20 pt-14 pb-6">
          <Exhibit
            n="01"
            id="mandated-gate"
            kind="mandated gate"
            title="The removal does not execute until a human approves it."
            framing={
              <>
                <Prose>
                  A flagged comment as the reviewer receives it: the content, the
                  channels that fired with their probability, confidence and
                  emitting skill, and the tool call waiting behind the gate.
                </Prose>
                <Prose>
                  Try to execute the removal before deciding. The executor will
                  tell you what it went looking for and did not find.
                </Prose>
              </>
            }
          >
            <MandatedGate />
          </Exhibit>

          <Hairline />

          <Exhibit
            n="02"
            id="audit-chain"
            kind="tamper-evident log"
            title="Rewrite one entry and the break announces itself."
            framing={
              <>
                <Prose>
                  Five entries, each committing to its predecessor&apos;s digest.
                  Edit the entry in the middle — type into it, or use the forge
                  control — and verification fails at that index and names it.
                </Prose>
                <Prose>
                  Then recompute that entry&apos;s own hash so it commits to the
                  new content, and watch the break move one entry down. That
                  second step is the whole claim: a hash chain does not make
                  forgery hard, it makes forgery non-local. Repair every entry
                  and the links hold again — and the head stops matching the
                  value witnessed outside the log.
                </Prose>
              </>
            }
          >
            <AuditChain />
          </Exhibit>

          <Hairline />

          <Exhibit
            n="03"
            id="verification"
            kind="verification before judgment"
            title="An unverifiable gate is a rubber stamp."
            framing={
              <>
                <Prose>
                  One decision, presented twice. In one, the evidence is located:
                  the exact span, inside the sentence it came from, with the
                  channel, the score and the emitting skill attached. In the
                  other, a verdict and a number.
                </Prose>
                <Prose>
                  The decision control is identical in both. Only what the
                  reviewer can check has changed.
                </Prose>
              </>
            }
          >
            <VerificationContrast />
          </Exhibit>
        </div>

        <Hairline className="mt-6" />

        {/* ── Where this comes from ── */}
        <section aria-labelledby="further-title" className="py-14">
          <p className="label">Further</p>
          <h2
            id="further-title"
            className="mt-4 max-w-2xl text-xl leading-snug font-light tracking-tight text-foreground"
          >
            The argument these exhibits are made of.
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/research/006-signals-not-verdicts"
              className="group rounded-2xl border border-border/40 bg-card/40 p-5 transition-colors hover:border-border"
            >
              <p className="label">Research · № 006</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                Signals, not verdicts: the gate thesis applied
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                The paper these exhibits accompany. What happened when the gate
                thesis was built into a domain where being wrong has a victim
                either way — and why autonomy is permitted for inaction and
                withheld for destruction.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
                Read the paper
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/research/005-the-gate-is-the-unit-of-measurement"
              className="group rounded-2xl border border-border/40 bg-card/40 p-5 transition-colors hover:border-border"
            >
              <p className="label">Research · № 005</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                The gate is the unit of measurement
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                The argument in the abstract: two kinds of gate that must never
                share a metric, why autonomous scoring cannot represent a
                gate&apos;s value, and why a gate over unverifiable output is
                theatre.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
                Read the essay
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <div className="mt-8 space-y-3 border-t border-border/40 pt-6">
            <p className="max-w-[42rem] font-mono text-[11px] leading-relaxed text-muted-foreground">
              inertial-oss · the reference application publishes alongside the
              paper. HITL Kit is a real dependency of it; tag-kit and eval-kit
              are documented seams, not integrations — see § 6 of № 006.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/components"
                className="font-mono text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                /components
              </Link>
              <Link
                href="/projects/hitl-kit"
                className="font-mono text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                /projects/hitl-kit
              </Link>
              <Link
                href="/paper"
                className="font-mono text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                /paper
              </Link>
              <a
                href={BRAND.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                github.com/akaieuan ↗
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
