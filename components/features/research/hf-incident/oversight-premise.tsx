"use client";

import { ExhibitFrame } from "@/components/features/research/exhibits/frame";
import { PremiseFlip } from "@/components/features/research/exhibits/premise-flip";
import {
  JUNE_27_EVIDENCE,
  JUNE_27_READINGS,
  type JuneFrame,
} from "./fixtures";

/**
 * The 27 June decision, as the responder met it.
 *
 * The control changes only the premise. Flip it and watch a correct reading of
 * correct evidence produce the opposite action.
 */
export function OversightPremise() {
  return (
    <ExhibitFrame title="The 27 June decision" accent="rose" interactive>
      <PremiseFlip<JuneFrame>
        legend="What the responder believes this is"
        evidenceLabel="What the responder actually saw, 27 June"
        evidence={JUNE_27_EVIDENCE}
        readings={JUNE_27_READINGS}
        initial="evaluation"
        footnote="evidence from OpenAI, Hugging Face Incident Technical Report, 26 August 2026, p.8"
      />
    </ExhibitFrame>
  );
}
