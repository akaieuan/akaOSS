import { ExhibitFrame } from "@/components/features/research/exhibits/frame";
import { Timeline } from "@/components/features/research/exhibits/timeline";
import { INCIDENT_EVENTS, INCIDENT_TRACKS } from "./fixtures";

/**
 * Two sequences that overlap in time and are not the same story. Server
 * rendered, no JavaScript: the marked event is the one this note is about.
 */
export function IncidentTimeline() {
  return (
    <ExhibitFrame title="Two incidents, one summer" accent="amber">
      <Timeline
        label="Two sequences, one summer"
        tracks={INCIDENT_TRACKS}
        events={INCIDENT_EVENTS}
        footnote="the wiki swarm is reported by third-party researchers and has not been publicly confirmed by the model developer; the Artifactory and Hugging Face track is drawn from the developer's own report"
      />
    </ExhibitFrame>
  );
}
