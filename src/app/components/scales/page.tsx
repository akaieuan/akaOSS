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
        description="One question, how much of this did a person do, answered on a five-point scale from Human to AI. Every density shows the same thing: a track filled to the current level, revealing the spectrum from emerald to rose as it goes, and the level in plain words. Colour is the cue; the words carry the meaning. Labels sit on foreground and muted-foreground, never on colour."
        cols={2}
      >
        <Specimen label="Slider" hint="ai-generation-slider">
          <SliderSpecimen />
          <Note>
            Reach for this when the person sets the value. The readout says the
            level and what it means, and the track fills as far as the thumb,
            revealing the spectrum. Drag it, tap either end, or focus it and
            use the arrow keys, Home and End.
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
              <span className="text-meta text-muted-foreground">compact</span>
            </div>
          </div>
          <Note>
            Reach for this to show provenance in a list row or a header without
            inviting interaction. Read-only by design: one image element with
            no focusable children, so fifty rows do not become fifty tab stops.
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
            too much furniture. Static by default; given an action handler it
            grows ‹ › steppers with real 24px targets that go inert at the ends
            of the scale without dropping keyboard focus.
          </Note>
        </Specimen>

        {/* Five segments cannot shrink below their labels, so this one takes
            the whole row; the scroll box is the fallback for a narrow phone. */}
        <Specimen label="Segmented" hint="ai-generation-scale" className="md:col-span-2">
          <div className="overflow-x-auto pb-1">
            <SegmentedScaleSpecimen />
          </div>
          <Note>
            The explicit form, for a settings panel or a form where every option
            should be visible and directly tappable. Five segments in one pill,
            the chosen one raised, each carrying its colour so the order reads
            before the words do. It needs about 400px; below that, use the
            slider.
          </Note>
        </Specimen>
      </DemoSection>

      <DemoSection
        id="shared"
        title="Shared Primitives"
        meta="shared-primitives"
        description="The palette the rest of the kit draws from. Five accents, each with one job; the four approval badges, because can't tell is not no; and the decision row that sets them."
      >
        <Specimen label="Shared palette" hint="interactive">
          <SharedPrimitives />
        </Specimen>
      </DemoSection>

      <LibraryPager {...pagerFor(GROUP.slug)} />
    </>
  );
}
