import type { Metadata } from "next";

import { QAFlow, type QAQuestion } from "@/components/hitl/QAFlow";

import {
  DemoSection,
  LibraryHeader,
  LibraryPager,
  Specimen,
} from "../_components/demo-ui";
import {
  ApprovalSpecimens,
  BatchSpecimen,
  EditablePlanSpecimen,
  InterruptCardSpecimens,
} from "../_components/live";
import { groupBySlug, pagerFor } from "../_components/sections";

const GROUP = groupBySlug("decision");

export const metadata: Metadata = {
  title: "Decision · component library · akaOSS",
  description: GROUP.blurb,
};

const QA_QUESTIONS: QAQuestion[] = [
  {
    id: "mech",
    kind: "single",
    prompt: "Preferred mechanism?",
    options: [
      "Carbon pricing",
      "Regulation",
      "Voluntary markets",
      "Technology mandates",
    ],
  },
  {
    id: "challenges",
    kind: "multi",
    prompt: "Implementation challenges?",
    options: [
      "Stakeholder alignment",
      "Monitoring & verification",
      "Political feasibility",
      "Cost-effectiveness",
    ],
  },
  {
    id: "notes",
    kind: "text",
    prompt: "Other notes",
    placeholder: "Any additional context…",
  },
];

export default function DecisionPage() {
  return (
    <>
      <LibraryHeader
        group={GROUP.title}
        title="Decision."
        lede={GROUP.blurb}
        meta={`${GROUP.specimens.length} specimens`}
      />

      <DemoSection
        id="hitl"
        title="Interrupt Cards"
        meta="hitl-card"
        description="Human-in-the-loop interrupt cards rendered inline in a chat thread. Three semantic variants, each with idle, expanded, confirmed, and dismissed states. Click any card to expand it."
        cols={3}
      >
        <InterruptCardSpecimens />
      </DemoSection>

      <DemoSection
        id="approval"
        title="Approve / Reject"
        meta="approve-reject-row"
        description="The core binary decision row used across review, download, and notes panels. Three terminal states: pending, approved, rejected, with an undo back to pending."
      >
        <ApprovalSpecimens />
      </DemoSection>

      <DemoSection
        id="qa"
        title="QA Flow"
        meta="qa-flow"
        description="Multi-question approval card: single choice, multi-select, and a freeform text field. Submits to a confirmed state."
      >
        <Specimen label="QA form" hint="fill out, then Continue">
          <QAFlow questions={QA_QUESTIONS} />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="batch"
        title="Batch Approval Queue"
        meta="batch-queue"
        description="Sequential approve-reject flow across mixed agent items. Auto-advances to the next item and resolves to a summary state."
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

      <LibraryPager {...pagerFor(GROUP.slug)} />
    </>
  );
}
