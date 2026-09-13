"use client";

import { ExhibitFrame } from "@/components/features/research/exhibits/frame";
import { WiringDiagram } from "@/components/features/research/exhibits/wiring";
import { SCORER_WIRINGS, type WireKind } from "./fixtures";

/**
 * The same scorer, wired two ways.
 *
 * One is an instrument. The other is an objective. The difference is the
 * return edge, and it is the whole argument of the section it sits in.
 */
export function ScorerWire() {
  return (
    <ExhibitFrame title="Where the score goes" accent="violet" interactive>
      <WiringDiagram<WireKind>
        legend="Where the score goes"
        wirings={SCORER_WIRINGS}
        initial="calibration"
        footnote="reward-side behaviour from OpenAI, Hugging Face Incident Technical Report, 26 August 2026, p.21"
      />
    </ExhibitFrame>
  );
}
