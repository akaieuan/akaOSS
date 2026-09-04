import { DemoSection, LibraryGroup, Specimen } from "./catalogue";
import { CitationSpecimen, DiffSpecimen, EvidenceSpecimen, SearchResultSpecimens } from "./specimens";

/** What the agent found, and where it came from. */
export function EvidenceGroup() {
  return (
    <LibraryGroup slug="evidence">
      <DemoSection
        id="search-cards"
        title="Search Result Cards"
        meta="search-result-card"
        description="Ranked result cards with metadata, snippet, and a relevance bar. The relevance figure is a signal for the human to weigh, not a verdict the agent has already acted on."
        cols={2}
      >
        <SearchResultSpecimens />
      </DemoSection>

      <DemoSection
        id="citation"
        title="Citation Result"
        meta="citation-result"
        description="A single source-backed citation: the claim on top, the source attribution below, an expandable supporting quote, and an optional confidence badge. Verify, reject, or can't tell."
      >
        <Specimen label="Cited claim" hint="expand the supporting quote">
          <CitationSpecimen />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="evidence-pointer"
        title="Evidence Pointer"
        meta="evidence-pointer"
        description="Where a claim is grounded, not merely that it is. One row per pointer with the source, the locator in human units, and the excerpt. Sources the agent consulted and drew nothing from are listed too, so silence never reads as safety."
      >
        <Specimen label="Located claim" hint="two pointers, two sources not assessed">
          <EvidenceSpecimen />
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
    </LibraryGroup>
  );
}
