import type { Metadata } from "next";

import { SubagentStatusCard } from "@/components/hitl/SubagentStatusCard";
import type { AgentStatus } from "@/components/hitl/core";

import {
  DemoSection,
  LibraryHeader,
  LibraryPager,
  Specimen,
} from "@/components/features/library/catalogue";
import {
  ContextStripSpecimen,
  MiniTraceSpecimen,
  ToolCallSpecimen,
} from "@/components/features/library/specimens";
import { groupBySlug, pagerFor } from "@/lib/library";

const GROUP = groupBySlug("agent-state");

export const metadata: Metadata = {
  title: "Agent state · component library · akaOSS",
  description: GROUP.blurb,
};

const STATUSES: AgentStatus[] = [
  "idle",
  "running",
  "completed",
  "error",
  "skipped",
  "cancelled",
];

export default function AgentStatePage() {
  return (
    <>
      <LibraryHeader
        group={GROUP.title}
        title="Agent state."
        lede={GROUP.blurb}
        meta={`${GROUP.specimens.length} specimens`}
      />

      <DemoSection
        id="agent-status"
        title="Subagent Status"
        meta="subagent-status-card"
        description="Six discrete agent execution states. The running state animates. Use it in any card that wraps an in-progress agentic task."
        cols={2}
      >
        {STATUSES.map((status) => (
          <Specimen key={status} label={status} hint={`status="${status}"`}>
            <SubagentStatusCard
              status={status}
              label="Research Agent"
              detail="Climate Policy workspace"
            />
          </Specimen>
        ))}
      </DemoSection>

      <DemoSection
        id="trace"
        title="MiniTrace"
        meta="mini-trace"
        description="Step-by-step thought, action, result renderer; each step collapses to reveal its detail. A visible implementation of the supporting-facts requirement from §3.3 of the paper."
      >
        <Specimen label="Search trace" hint="3 steps · click a row">
          <MiniTraceSpecimen />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="tool-call"
        title="Tool Call Preview"
        meta="tool-call-preview"
        description="The tool call the agent wants to make: name, arguments, optional rationale and signals, shown before it runs so the human can approve or reject. Pairs with the gates layer for confidence, cost, and scope checks."
      >
        <Specimen label="Outbound email" hint="expand Arguments">
          <ToolCallSpecimen />
        </Specimen>
      </DemoSection>

      <DemoSection
        id="context"
        title="Context Chips"
        meta="context-chips"
        description="Pill chips for the context attached to an agent run: notes, files, URLs. Removable, with overflow truncation built in."
      >
        <Specimen label="Context strip" hint="click × to remove">
          <ContextStripSpecimen />
        </Specimen>
      </DemoSection>

      <LibraryPager {...pagerFor(GROUP.slug)} />
    </>
  );
}
