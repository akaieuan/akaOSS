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
  { name: "ai-generation-scale", title: "AI Generation Scale", description: "Five-segment ordinal scale for AI vs. human contribution.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-ai-levels"] },
  { name: "ai-generation-slider", title: "AI Generation Slider", description: "The compact drag form of the scale. One row, ~52px, no wrapping at 320px. Drag, arrow keys, Home/End, full slider ARIA.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-ai-levels"] },
  { name: "ai-generation-meter", title: "AI Generation Meter", description: "Read-only provenance strip for a list row or header. Five segments plus the level name in one ~20px row, no focusable children.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-ai-levels"] },
  { name: "ai-generation-badge", title: "AI Generation Badge", description: "The densest form: a pill with a five-dot indicator and the level name. Optional ‹ › steppers with 24px hit areas.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-ai-levels"] },
  { name: "context-chips", title: "Context Chips", description: "Removable pill chips for notes, files, URLs. Overflow truncation.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "qa-flow", title: "QA Flow", description: "Multi-question approval card. Single, multi, text.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "writing-agent", title: "Writing Agent", description: "Compound widget for a draft-in-progress document with six status states.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-types", "hitl-subagent-meta"] },
  { name: "research-agent", title: "Research Agent", description: "Three-mode research config: create, follow-up, read URL.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "batch-queue", title: "Batch Queue", description: "Sequential approve and reject across mixed agent items with auto-advance.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "search-result-card", title: "Search Result Card", description: "Ranked result with metadata, snippet, and relevance bar.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "approve-reject-row", title: "Approve / Reject Row", description: "Binary decision row with pending, approved, rejected, optional undo.", type: "registry:ui", registryDependencies: ["hitl-utils", "hitl-types"] },
  { name: "shared-primitives", title: "Shared Primitives", description: "Accent swatches, approval badges, approve and reject rows.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "diff-result", title: "Diff Result", description: "Before/after diff card for proposed text or code edits. Per-hunk red/green strips, accept and reject states. The HITL-AI primitive for any in-place edit the human should approve before it lands.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "citation-result", title: "Citation Result", description: "Single source-backed citation card. Claim on top, source attribution below, optional supporting quote and confidence badge. Verify or reject.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "editable-plan", title: "Editable Plan", description: "Multi-step plan the human can reorder, rename, add to, or delete from before the agent executes. Locked steps cannot be removed.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "tool-call-preview", title: "Tool Call Preview", description: "Preview a tool call (name, args, optional rationale and signals) so the human can approve or reject before execution. Pairs with the gates layer for confidence/cost/scope checks.", type: "registry:ui", registryDependencies: ["hitl-utils"] },
  { name: "hitl-utils", title: "cn utility", description: "Tailwind classname merge helper.", type: "registry:lib" },
  { name: "hitl-types", title: "HITL type definitions", description: "AgentStatus, ApprovalStatus, HitlCardState, RightTab.", type: "registry:lib" },
  { name: "hitl-subagent-meta", title: "Subagent status metadata", description: "Icon and color mapping for the six agent states.", type: "registry:lib", registryDependencies: ["hitl-types"] },
  { name: "hitl-ai-levels", title: "AI generation levels", description: "The five-point AI-generation ordinal and its accent progression, shared by every scale variant.", type: "registry:lib" },
];

export const REGISTRY_BASE_URL = "https://www.hitlkit.dev/r";
