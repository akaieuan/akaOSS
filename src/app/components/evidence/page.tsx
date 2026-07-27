import type { Metadata } from "next";

import { SearchResultCard } from "@/components/hitl/SearchResultCard";
import { SEARCH_RESULTS } from "@/components/hitl/data";

import {
  DemoSection,
  LibraryHeader,
  LibraryPager,
  Specimen,
} from "../_components/demo-ui";
import { CitationSpecimen, DiffSpecimen } from "../_components/live";
import { groupBySlug, pagerFor } from "../_components/sections";

const GROUP = groupBySlug("evidence");

export const metadata: Metadata = {
  title: "Evidence · component library · akaOSS",
  description: GROUP.blurb,
};

export default function EvidencePage() {
  return (
    <>
      <LibraryHeader
        group={GROUP.title}
        title="Evidence."
        lede={GROUP.blurb}
        meta={`${GROUP.specimens.length} specimens`}
      />

      <DemoSection
        id="search-cards"
        title="Search Result Cards"
        meta="search-result-card"
        description="Ranked result cards with metadata, snippet, and a relevance bar. The relevance figure is a signal for the human to weigh, not a verdict the agent has already acted on."
        cols={2}
      >
        {SEARCH_RESULTS.slice(0, 4).map((r) => (
          <Specimen
            key={r.id}
            label={`Result #${r.rank}`}
            hint={`${r.venue}, ${r.year} · ${Math.round(r.relevance * 100)}%`}
          >
            <SearchResultCard result={r} />
          </Specimen>
        ))}
      </DemoSection>

      <DemoSection
        id="citation"
        title="Citation Result"
        meta="citation-result"
        description="A single source-backed citation: the claim on top, the source attribution below, an expandable supporting quote, and an optional confidence badge."
      >
        <Specimen label="Cited claim" hint="expand the supporting quote">
          <CitationSpecimen />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="diff"
        title="Diff Result"
        meta="diff-result"
        description="Before and after for a proposed text or code edit, with per-hunk strips. Drop it into any agent loop where the human should see exactly what will change before it lands."
      >
        <Specimen label="Markdown rewrite" hint="Apply edit to confirm">
          <DiffSpecimen />
        </Specimen>
      </DemoSection>

      <LibraryPager {...pagerFor(GROUP.slug)} />
    </>
  );
}
