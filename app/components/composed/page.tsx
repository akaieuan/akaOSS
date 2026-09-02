import type { Metadata } from "next";

import {
  DemoSection,
  LibraryHeader,
  LibraryPager,
  Specimen,
} from "@/components/features/library/catalogue";
import { ResearchAgentSpecimen, WritingAgentSpecimen } from "@/components/features/library/specimens";
import { groupBySlug, pagerFor } from "@/lib/library";

const GROUP = groupBySlug("composed");

export const metadata: Metadata = {
  title: "Composed · component library · akaOSS",
  description: GROUP.blurb,
};

export default function ComposedPage() {
  return (
    <>
      <LibraryHeader
        group={GROUP.title}
        title="Composed."
        lede={GROUP.blurb}
        meta={`${GROUP.specimens.length} specimens`}
      />

      <DemoSection
        id="writing-agent"
        title="Writing Agent"
        meta="writing-agent"
        description="A compound widget for a draft in progress: title, target section, word range, evidence notes, and the same six status states the subagent card uses."
      >
        <Specimen label="Write doc agent" hint="click a status chip to cycle">
          <WritingAgentSpecimen />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="research-agent"
        title="Research Agent"
        meta="research-agent"
        description="Three operating modes for a long-running research task: create a new session, follow up on an existing one, or read a single URL."
      >
        <Specimen label="Research agent" hint="switch modes, top right">
          <ResearchAgentSpecimen />
        </Specimen>
      </DemoSection>

      <LibraryPager {...pagerFor(GROUP.slug)} />
    </>
  );
}
