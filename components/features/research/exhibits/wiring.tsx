"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Note,
  Panel,
  Segmented,
} from "@/components/features/research/inertial/ui";

/**
 * "What is your measure connected to?"
 *
 * A measurement pipeline drawn as a row of stages, with an optional return
 * edge running back underneath it. The return edge is the whole argument: a
 * score that feeds a human's calibration is an instrument, and the same score
 * feeding a reward signal is a target.
 *
 * Generic on purpose. Any "the metric became the objective" argument can mount
 * this with its own stages.
 *
 * Motion is CSS only. Both wirings render on the server; switching cross-fades
 * between siblings that already exist, and the return edge animates with the
 * built-in pulse utility, which the reduced-motion guard below disables.
 */

export type StageKind = "source" | "measure" | "sink";

export interface WiringStage {
  readonly id: string;
  readonly label: string;
  readonly kind: StageKind;
  /** One line under the chip. */
  readonly note?: string;
}

export interface Wiring<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly stages: readonly WiringStage[];
  /** The return edge. Absent means the measure terminates in a person. */
  readonly feedback?: {
    readonly label: string;
    /** Rendered in the alarming tone. */
    readonly hazard?: boolean;
  };
  readonly caption: string;
}

const KIND_CHIP: Record<StageKind, string> = {
  source: "border-border text-muted-foreground",
  measure: "border-[color:var(--accent-amber)]/50 text-foreground",
  sink: "border-[color:var(--accent-emerald)]/45 text-foreground",
};

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="hidden shrink-0 select-none self-start font-mono text-[11px] text-muted-foreground/50 sm:mt-3.5 sm:inline"
    >
      &rarr;
    </span>
  );
}

function StageChip({ stage }: { stage: WiringStage }) {
  return (
    <div className="min-w-0 flex-1">
      <div
        className={cn(
          "flex min-h-10 items-center justify-center rounded-lg border bg-background/50 px-3 py-2 text-center",
          KIND_CHIP[stage.kind],
        )}
      >
        <span className="font-mono text-[11px]">{stage.label}</span>
      </div>
      {stage.note && (
        <p className="mt-1.5 text-center text-[11.5px] leading-snug text-muted-foreground">
          {stage.note}
        </p>
      )}
    </div>
  );
}

export function WiringDiagram<T extends string>({
  legend,
  wirings,
  initial,
  footnote,
}: {
  legend: string;
  wirings: readonly Wiring<T>[];
  initial: T;
  footnote?: string;
}) {
  const [active, setActive] = useState<T>(initial);

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <Segmented
          legend={legend}
          value={active}
          options={wirings.map((w) => ({ value: w.value, label: w.label }))}
          onChange={setActive}
        />

        <div className="mt-6 grid">
          {wirings.map((w) => {
            const on = w.value === active;
            return (
              <div
                key={w.value}
                aria-hidden={!on}
                className={cn(
                  "col-start-1 row-start-1 min-w-0",
                  "transition-opacity duration-300 ease-out",
                  "motion-reduce:transition-none",
                  on ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                {/* Stages */}
                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-start sm:gap-3">
                  {w.stages.map((s, i) => (
                    <span
                      key={s.id}
                      className="contents sm:flex sm:min-w-0 sm:flex-1 sm:items-start sm:gap-3"
                    >
                      <StageChip stage={s} />
                      {i < w.stages.length - 1 && <Arrow />}
                    </span>
                  ))}
                </div>

                {/* The return edge, or the absence of one. */}
                <div className="mt-4 border-t border-dashed border-border/60 pt-3">
                  {w.feedback ? (
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 font-mono text-[11px]",
                          w.feedback.hazard
                            ? "text-[color:var(--accent-rose)] motion-safe:animate-pulse"
                            : "text-muted-foreground",
                        )}
                      >
                        &larr;&mdash;
                      </span>
                      <span
                        className={cn(
                          "min-w-0 font-mono text-[11px]",
                          w.feedback.hazard
                            ? "text-[color:var(--accent-rose)]"
                            : "text-muted-foreground",
                        )}
                      >
                        {w.feedback.label}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      no return edge, the score stops at a person
                    </span>
                  )}
                </div>

                <p className="mt-4 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
                  {w.caption}
                </p>
              </div>
            );
          })}
        </div>
      </Panel>

      {footnote && <Note>{footnote}</Note>}
    </div>
  );
}
