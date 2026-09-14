"use client";

import { ExhibitFrame } from "@/components/features/research/exhibits/frame";
import { ScorerProbe } from "@/components/features/research/exhibits/scorer-probe";
import { SCORER_CHECKS, SCORER_ROUTES } from "./fixtures";

/**
 * The measurement problem in one control: change how the work was done, and
 * watch the benchmark return the same answer.
 */
export function ExploitGymScorer() {
  return (
    <ExhibitFrame title="What the scorer checked" accent="emerald" interactive>
      <ScorerProbe
        legend="How the agent got the flag"
        routes={SCORER_ROUTES}
        checks={SCORER_CHECKS}
        verdict="PASS"
        verdictNote="The same result for work that was done, work that was skipped, and work that was impossible. A score that cannot separate those three is not measuring capability, it is measuring whether a string was produced."
        footnote="routes and estimates from METR and Redwood Research, Hugging Face incident investigation, 26 August 2026"
      />
    </ExhibitFrame>
  );
}
