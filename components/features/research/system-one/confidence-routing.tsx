"use client";

import { ExhibitFrame } from "@/components/features/research/exhibits/frame";
import { ConfidenceRouter } from "@/components/features/research/exhibits/confidence-router";
import { ROUTED_ACTIONS, ROUTING_FLOOR, ROUTING_NOTES } from "./fixtures";

/**
 * TypeSafe's own banking thresholds, with one control they do not have: the
 * switch that says policy, not confidence, governs this action.
 */
export function ConfidenceRouting() {
  return (
    <ExhibitFrame title="What a confidence can decide" accent="blue" interactive>
      <ConfidenceRouter
        legend="The action the model thinks was requested"
        actions={ROUTED_ACTIONS}
        floor={ROUTING_FLOOR}
        notes={ROUTING_NOTES}
        footnote="thresholds from TypeSafe's confidence-gated routing pattern, docs.typesafe.ai, read 2026-09-21. The policy switch is ours."
      />
    </ExhibitFrame>
  );
}
