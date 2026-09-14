"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Label,
  Mono,
  Note,
  Panel,
  Segmented,
  type Tone,
} from "@/components/features/research/inertial/ui";

/**
 * "Same evidence, different premise."
 *
 * A reviewer is shown a fixed set of observations and can flip the belief they
 * are holding about what those observations mean. The evidence never changes.
 * The licensed action does.
 *
 * Built generic on purpose: any argument of the form "the facts were right and
 * the frame was wrong" can mount this with its own data.
 *
 * Motion is CSS only. Every reading is rendered into the same grid cell on the
 * server, and the transition is opacity plus a small rise between siblings that
 * already exist, so the markup is identical before and after hydration and the
 * exhibit reads correctly with JavaScript disabled.
 */

export interface PremiseObservation {
  /** Machine field name. */
  readonly k: string;
  /** The observed value. */
  readonly v: string;
  /** Why a reviewer would care. Plain language, sits under the value. */
  readonly reads?: string;
}

export interface PremiseReading<T extends string> {
  readonly value: T;
  /** Short control label. */
  readonly label: string;
  /** The belief being held, in the reviewer's voice. */
  readonly frame: string;
  /** What the same evidence licenses under that belief. */
  readonly action: string;
  readonly tone: Tone;
  /** Why the action follows from the frame. */
  readonly rationale: string;
  /** What actually happened. Only ever known afterwards. */
  readonly outcome?: string;
}

const TONE_RING: Record<Tone, string> = {
  neutral: "border-border",
  ok: "border-[color:var(--accent-emerald)]/45",
  bad: "border-[color:var(--accent-rose)]/55",
  warn: "border-[color:var(--accent-amber)]/45",
  muted: "border-border/50",
};

const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-foreground",
  ok: "text-[color:var(--accent-emerald)]",
  bad: "text-[color:var(--accent-rose)]",
  warn: "text-[color:var(--accent-amber)]",
  muted: "text-muted-foreground",
};

export function PremiseFlip<T extends string>({
  legend,
  evidenceLabel = "What the responder actually saw",
  evidence,
  readings,
  initial,
  footnote,
}: {
  legend: string;
  evidenceLabel?: string;
  evidence: readonly PremiseObservation[];
  readings: readonly PremiseReading<T>[];
  initial: T;
  footnote?: string;
}) {
  const [active, setActive] = useState<T>(initial);

  return (
    <div className="space-y-4">
      {/* The evidence. Fixed, and deliberately shown first. */}
      <Panel className="p-5">
        <Label className="mb-3">{evidenceLabel}</Label>
        <ul className="space-y-2.5">
          {/* `k` is a field name, not an identifier: two observations can
              legitimately share one (two mechanisms, two checks). Index-qualify
              so a caller is never forced to invent unique labels. */}
          {evidence.map((o, i) => (
            <li key={`${o.k}-${i}`} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground/70">
                  {o.k}
                </span>
                <span className="min-w-0 font-mono text-[11px] text-foreground">
                  {o.v}
                </span>
              </div>
              {o.reads && (
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                  {o.reads}
                </p>
              )}
            </li>
          ))}
        </ul>
        <Note className="mt-4 border-t border-border/50 pt-3">
          none of this changes when you flip the control below
        </Note>
      </Panel>

      <Panel className="p-5">
        <Segmented
          legend={legend}
          value={active}
          options={readings.map((r) => ({ value: r.value, label: r.label }))}
          onChange={setActive}
        />

        {/* Every reading occupies one grid cell. The inactive ones stay in the
            DOM so the transition has something to cross-fade between, and are
            hidden from assistive tech rather than merely faded. */}
        <div className="mt-5 grid">
          {readings.map((r) => {
            const on = r.value === active;
            return (
              <div
                key={r.value}
                aria-hidden={!on}
                className={cn(
                  "col-start-1 row-start-1 min-w-0",
                  "transition-[opacity,transform] duration-300 ease-out",
                  "motion-reduce:transition-none",
                  on
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none translate-y-1 opacity-0",
                )}
              >
                <div
                  className={cn(
                    "rounded-xl border bg-background/50 p-4",
                    TONE_RING[r.tone],
                  )}
                >
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    <span className="text-foreground">Holding: </span>
                    {r.frame}
                  </p>

                  <p
                    className={cn(
                      "mt-4 font-mono text-lg tracking-tight",
                      TONE_TEXT[r.tone],
                    )}
                  >
                    {r.action}
                  </p>

                  <p className="mt-3 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
                    {r.rationale}
                  </p>

                  {r.outcome && (
                    <p className="mt-4 border-t border-border/50 pt-3 text-[12.5px] leading-relaxed text-muted-foreground">
                      <Mono tone="muted" className="mr-2">
                        what followed
                      </Mono>
                      {r.outcome}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {footnote && <Note>{footnote}</Note>}
    </div>
  );
}
