"use client";

import { ExhibitFrame } from "@/components/features/research/exhibits/frame";
import { ScorerProbe } from "@/components/features/research/exhibits/scorer-probe";
import { TYPED_CHECKS, TYPED_ROUTES } from "./fixtures";

/**
 * The same instrument № 010 pointed at ExploitGym, pointed at a schema
 * guarantee: change whether the answer is right, and watch the type check
 * return the same result.
 */
export function TypedNotRight() {
  return (
    <ExhibitFrame title="What a type guarantee checks" accent="emerald" interactive>
      <ScorerProbe
        legend="What happened inside the call"
        routes={TYPED_ROUTES}
        checks={TYPED_CHECKS}
        verdict="VALID"
        subjectLabel="What happened"
        earnedLabel="answer is correct"
        verdictLabel="What the schema check returns"
        verdictNote="A guarantee that the output is well-formed is real and worth having: it deletes a whole class of failure that string-generating models still have. It is a statement about shape. Whether the shape holds the right answer is a separate measurement, and it is the one that still has to be made."
        footnote="failure modes from TypeSafe's own jev-1.13 jaggedness page, last reviewed by them 2026-09-17"
      />
    </ExhibitFrame>
  );
}
