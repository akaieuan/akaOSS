import { DemoSection, LibraryGroup, Specimen } from "./catalogue";
import {
  ApprovalSpecimens,
  BatchSpecimen,
  EditablePlanSpecimen,
  InterruptCardSpecimens,
  QASpecimen,
} from "./specimens";

/** The moments where the human answers. */
export function DecisionGroup() {
  return (
    <LibraryGroup slug="decision">
      <DemoSection
        id="hitl"
        title="Interrupt Cards"
        meta="hitl-card"
        description="Human-in-the-loop interrupt cards rendered inline in a chat thread. Three semantic variants, each with idle, expanded, confirmed, and dismissed states, and every resolution can be undone. Click any card to expand it."
        cols={3}
      >
        <InterruptCardSpecimens />
      </DemoSection>

      <DemoSection
        id="approval"
        title="Approve / Reject"
        meta="approve-reject-row"
        description="The core decision row used across review, download, and notes panels. Three answers, not two: approve, reject, and can't tell, because an unresolved question is not a no. Undo returns to pending."
      >
        <ApprovalSpecimens />
      </DemoSection>

      <DemoSection
        id="qa"
        title="QA Flow"
        meta="qa-flow"
        description="Multi-question approval card: single choice, multi-select, and a freeform text field. Submits to a resolved line that keeps the answers visible and can be reopened."
      >
        <Specimen label="QA form" hint="fill out, then Continue">
          <QASpecimen />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="batch"
        title="Batch Approval Queue"
        meta="batch-queue"
        description="Sequential approve-reject flow across mixed agent items. Auto-advances to the next item, can step back one, and resolves to a summary state."
      >
        <Specimen label="Kitchen sink batch" hint="5 items">
          <BatchSpecimen />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="plan"
        title="Editable Plan"
        meta="editable-plan"
        description="The multi-step plan the human can rename, reorder, add to, or delete from before the agent executes it. Steps marked locked cannot be removed."
      >
        <Specimen label="Research plan" hint="edit any unlocked step">
          <EditablePlanSpecimen />
        </Specimen>
      </DemoSection>
    </LibraryGroup>
  );
}
