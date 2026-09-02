import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AiGenerationMeter } from "@/components/hitl/AiGenerationMeter";
import { AiGenerationBadge } from "@/components/hitl/AiGenerationBadge";
import { AI_GENERATION_LEVELS } from "@/components/hitl/ai-generation-levels";
import { SharedPrimitives } from "@/components/hitl/SharedPrimitives";

import {
  DemoSection,
  LibraryHeader,
  LibraryPager,
  Specimen,
} from "../_components/demo-ui";
import {
  BadgeSpecimen,
  SegmentedScaleSpecimen,
  SliderSpecimen,
} from "../_components/live";
import { groupBySlug, pagerFor } from "../_components/sections";

const GROUP = groupBySlug("scales");

export const metadata: Metadata = {
  title: "Scales & palette · component library · akaOSS",
  description: GROUP.blurb,
};

/** The one-line "reach for this when…" that sits under each density. */
function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 border-t border-border/40 pt-3 text-small text-muted-foreground">
      {children}
    </p>
  );
}

export default function ScalesPage() {
  return (
    <>
      <LibraryHeader
        group={GROUP.title}
        title="Scales & palette."
        lede={GROUP.blurb}
        meta={`${GROUP.specimens.length} specimens`}
      />

      <DemoSection
        id="ai-scale"
        title="AI Generation Scale"
        meta="four densities"
        description="One five-point ordinal: Human, Mostly Human, Collaborative, Mostly AI, AI, in four densities, from a settings panel down to a table cell. All four read the level names and the emerald → blue → amber → violet → rose accent progression from a single shared module, so a level cannot mean one thing in the slider and another in the badge. Accents stay punctuation: dots, fills, the thumb. Every label sits on foreground or muted-foreground, never on colour."
        cols={2}
      >
        <Specimen label="Slider" hint="ai-generation-slider">
          <SliderSpecimen />
          <Note>
            Reach for this when the human sets the value. One row, ~58px, and it
            holds at 320px. The current level reads in the header and the two
            endpoints carry the axis, so the middle labels never need to render.
            Drag it, or focus it and use ← → and Home / End.
          </Note>
        </Specimen>

        <Specimen label="Meter" hint="ai-generation-meter">
          {/* The meter is inline-flex by design, so the stack has to be an
              explicit column: `space-y-*` would let two of them share a line. */}
          <div className="flex flex-col items-start gap-2.5">
            {AI_GENERATION_LEVELS.map((_, i) => (
              <AiGenerationMeter key={i} value={i} />
            ))}
            <div className="flex items-center gap-3 pt-1">
              <AiGenerationMeter value={2} compact />
              <span className="font-mono text-meta text-muted-foreground">
                compact
              </span>
            </div>
          </div>
          <Note>
            Reach for this to show provenance in a list row or a header without
            inviting interaction. Read-only by design: a single{" "}
            <code className="font-mono text-[0.875em] text-foreground">
              role=&quot;img&quot;
            </code>{" "}
            element with no focusable children, so fifty rows do not become
            fifty tab stops.
          </Note>
        </Specimen>

        <Specimen label="Badge" hint="ai-generation-badge">
          <div className="space-y-3">
            <BadgeSpecimen />
            <div className="flex flex-wrap items-center gap-2">
              {AI_GENERATION_LEVELS.map((_, i) => (
                <AiGenerationBadge key={i} value={i} />
              ))}
            </div>
          </div>
          <Note>
            Reach for this in a table cell or a queue row where even the meter is
            too much furniture. Static by default; given an{" "}
            <code className="font-mono text-[0.875em] text-foreground">
              onAction
            </code>{" "}
            it grows ‹ › steppers with real 24px targets that go inert at the
            ends of the scale without dropping keyboard focus.
          </Note>
        </Specimen>

        <Specimen label="Segmented scale" hint="ai-generation-scale">
          {/* Five equal buttons cannot shrink below their labels, around
              230px the row is wider than its container. The well scrolls
              rather than bleeding, which is also the honest demonstration of
              why the other three densities exist. */}
          <div className="overflow-x-auto pb-1">
            <SegmentedScaleSpecimen />
          </div>
          <Note>
            The original, and still the right call in a settings panel or a form
            where every option should be visible and directly clickable at once.
            It needs the width, below roughly 400px, use the slider.
          </Note>
        </Specimen>
      </DemoSection>

      <DemoSection
        id="shared"
        title="Shared Primitives"
        meta="shared-primitives"
        description="The atomic palette the rest of the kit draws from: the five accent swatches, the four approval badges (pending, approved, rejected, and couldn't tell), and the decision row in situ."
      >
        <Specimen label="Shared palette" hint="interactive">
          <SharedPrimitives />
        </Specimen>
      </DemoSection>

      <LibraryPager {...pagerFor(GROUP.slug)} />
    </>
  );
}
