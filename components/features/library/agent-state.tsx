import { SubagentStatusCard } from "@/components/hitl/SubagentStatusCard";
import type { AgentStatus } from "@/components/hitl/core";
import { DemoSection, LibraryGroup, Specimen } from "./catalogue";
import { ContextStripSpecimen, MiniTraceSpecimen, ToolCallSpecimen } from "./specimens";

const STATUSES: AgentStatus[] = ["idle", "running", "completed", "error", "skipped", "cancelled"];

/** What the agent is doing and what it is about to do. */
export function AgentStateGroup() {
  return (
    <LibraryGroup slug="agent-state">
      <DemoSection
        id="agent-status"
        title="Subagent Status"
        meta="subagent-status-card"
        description="Six discrete agent execution states. The running state animates. Use it in any card that wraps an in-progress agentic task."
        cols={3}
      >
        {STATUSES.map((status) => (
          <Specimen key={status} label={status} hint={`status="${status}"`}>
            <SubagentStatusCard status={status} label="Research Agent" detail="Climate Policy workspace" />
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
    </LibraryGroup>
  );
}
