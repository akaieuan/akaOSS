export interface RegistryItem {
  name: string;
  title: string;
  description: string;
  type: "registry:ui" | "registry:lib";
  registryDependencies?: string[];
}

export const REGISTRY_ITEMS: RegistryItem[] = [
  { name: "hitl-card", title: "Interrupt Card", description: "In-thread approval boundary for agent actions. Three variants, four states.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-types"] },
  { name: "subagent-status-card", title: "Subagent Status Card", description: "Single-row agent status with icon, label, detail, and state badge.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-types", "hitl-subagent-meta"] },
  { name: "mini-trace", title: "MiniTrace", description: "Collapsible thought, action, result renderer. Supporting-facts pattern.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "ai-generation-scale", title: "AI Generation Scale", description: "Five-segment ordinal scale for AI vs. human contribution.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "context-chips", title: "Context Chips", description: "Removable pill chips for notes, files, URLs. Overflow truncation.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "qa-flow", title: "QA Flow", description: "Multi-question approval card. Single, multi, text.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "writing-agent", title: "Writing Agent", description: "Compound widget for a draft-in-progress document with six status states.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-types", "hitl-subagent-meta"] },
  { name: "research-agent", title: "Research Agent", description: "Three-mode research config: create, follow-up, read URL.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "batch-queue", title: "Batch Queue", description: "Sequential approve and reject across mixed agent items with auto-advance.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "search-result-card", title: "Search Result Card", description: "Ranked result with metadata, snippet, and relevance bar.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "approve-reject-row", title: "Approve / Reject Row", description: "Binary decision row with pending, approved, rejected, optional undo.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-types"] },
  { name: "shared-primitives", title: "Shared Primitives", description: "Accent swatches, approval badges, approve and reject rows.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "hitl-utils", title: "cn utility", description: "Tailwind classname merge helper.", type: "registry:lib" },
  { name: "hitl-types", title: "HITL type definitions", description: "AgentStatus, ApprovalStatus, HitlCardState, RightTab.", type: "registry:lib" },
  { name: "hitl-subagent-meta", title: "Subagent status metadata", description: "Icon and color mapping for the six agent states.", type: "registry:lib", registryDependencies: ["hitl-types"] },
];

export const REGISTRY_BASE_URL = "https://www.hitlkit.dev/r";
