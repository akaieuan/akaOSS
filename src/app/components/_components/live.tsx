"use client";

/**
 * The specimens that cannot render from the server.
 *
 * Two reasons a specimen lands here:
 *
 *  1. It owns state (the scales, the approval rows, the context strip).
 *  2. It needs a `DEMO_*` fixture. Those fixtures are exported from modules
 *     carrying `"use client"`, so a server component receives a client-reference
 *     proxy rather than the array or object itself: `DEMO_HITL_CARDS.map(…)`
 *     throws on the server. Reading the fixture on this side is the fix, and it
 *     keeps the fixtures where the registry ships them.
 *
 * Each one is a thin leaf that renders the real shipped component. Nothing here
 * reimplements a primitive, if a specimen looks wrong, the component is wrong.
 * The surrounding frame (`DemoSection`, `Specimen`) stays on the server.
 *
 * `src/components/hitl/` is generated from `@hitl-kit/ui` by `pnpm hitl:sync`.
 */

import { useState } from "react";
import { ClipboardList } from "lucide-react";

import { AiGenerationScale } from "@/components/hitl/AiGenerationScale";
import { AiGenerationSlider } from "@/components/hitl/AiGenerationSlider";
import { AiGenerationBadge } from "@/components/hitl/AiGenerationBadge";
import { ApproveRejectRow } from "@/components/hitl/ApproveRejectRow";
import { BatchQueue } from "@/components/hitl/BatchQueue";
import { ContextChips } from "@/components/hitl/ContextChips";
import { HitlCard } from "@/components/hitl/HitlCard";
import { EditablePlan, DEMO_PLAN } from "@/components/hitl/EditablePlan";
import { MiniTrace, DEMO_TRACE } from "@/components/hitl/MiniTrace";
import { ToolCallPreview } from "@/components/hitl/ToolCallPreview";
import { CitationResult } from "@/components/hitl/CitationResult";
import { DiffResult } from "@/components/hitl/DiffResult";
import { EvidencePointer } from "@/components/hitl/EvidencePointer";
import { QAFlow, DEMO_QA } from "@/components/hitl/QAFlow";
import { SearchResultCard, DEMO_SEARCH_RESULTS } from "@/components/hitl/SearchResultCard";
import { WritingAgent, DEMO_WRITING_AGENT } from "@/components/hitl/WritingAgent";
import { ResearchAgent, DEMO_RESEARCH_AGENT } from "@/components/hitl/ResearchAgent";
import {
  DEMO_CITATION,
  DEMO_DIFF,
  DEMO_EVIDENCE,
  DEMO_HITL_CARDS,
  DEMO_TOOL_CALL,
} from "@/components/hitl/fixtures";
import type { ApprovalState, BatchQueueItem, ContextChipItem } from "@/components/hitl/core";

import { Specimen } from "./demo-ui";

// ─── Scales ──────────────────────────────────────────────────────────────────

export function SliderSpecimen() {
  const [value, setValue] = useState(2);
  return (
    <AiGenerationSlider
      value={value}
      onAction={(a) => setValue(a.value)}
      hint="section 2 draft"
      ariaLabel="AI generation level for section 2 draft"
    />
  );
}

export function BadgeSpecimen() {
  const [value, setValue] = useState(3);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AiGenerationBadge value={value} onAction={(a) => setValue(a.value)} />
      <span className="font-mono text-meta text-muted-foreground">
        interactive
      </span>
    </div>
  );
}

export function SegmentedScaleSpecimen() {
  const [value, setValue] = useState(2);
  return <AiGenerationScale value={value} onAction={(a) => setValue(a.value)} />;
}

// ─── Decision ────────────────────────────────────────────────────────────────

/** The three interrupt-card variants. Labels come from the fixture, so the
 *  whole grid, wells included, has to read it on the client. */
export function InterruptCardSpecimens() {
  return (
    <>
      {DEMO_HITL_CARDS.map((c) => (
        <Specimen key={c.id} label={c.variant} hint={`variant="${c.variant}"`}>
          <HitlCard {...c} />
        </Specimen>
      ))}
    </>
  );
}

export function EditablePlanSpecimen() {
  return <EditablePlan {...DEMO_PLAN} />;
}

export function QASpecimen() {
  return <QAFlow {...DEMO_QA} />;
}

const APPROVAL_ITEMS = [
  {
    label: "Verify citation accuracy",
    meta: "IPCC 2023 · p. 12",
    accent: "bg-[color:var(--accent-amber)]",
  },
  {
    label: "Confirm highlighted quote",
    meta: "Policy Brief §3.1",
    accent: "bg-[color:var(--accent-violet)]",
  },
  {
    label: "Approve section for export",
    meta: "Writing · Section 2",
    accent: "bg-[color:var(--accent-emerald)]",
  },
  {
    label: "Download: Carbon Pricing paper",
    meta: "Nature Climate, 2023",
    accent: "bg-[color:var(--accent-blue)]",
  },
];

export function ApprovalSpecimens() {
  const [states, setStates] = useState<ApprovalState[]>(
    APPROVAL_ITEMS.map(() => "pending"),
  );
  const set = (i: number, s: ApprovalState) =>
    setStates((p) => p.map((x, j) => (j === i ? s : x)));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {APPROVAL_ITEMS.map((item, i) => (
        <div
          key={item.label}
          className="flex min-w-0 flex-col gap-3 rounded-xl border border-border/40 bg-background/40 p-4"
        >
          <ApproveRejectRow
            label={item.label}
            meta={item.meta}
            state={states[i]}
            accentClass={item.accent}
            onAction={(a) =>
              set(
                i,
                a.kind === "approve"
                  ? "approved"
                  : a.kind === "reject"
                    ? "rejected"
                    : a.kind === "abstain"
                      ? "abstained"
                      : "pending",
              )
            }
          />
        </div>
      ))}
    </div>
  );
}

const BATCH: BatchQueueItem[] = [
  { id: "b1", kind: "search", label: "Search: carbon pricing 2024" },
  { id: "b2", kind: "write", label: "Write: Section 2 introduction" },
  { id: "b3", kind: "research", label: "Research: IPCC AR6 findings" },
  { id: "b4", kind: "qa", label: "QA: Verify citation accuracy" },
  { id: "b5", kind: "read", label: "Read: eu-ets.europa.eu" },
];

export function BatchSpecimen() {
  return <BatchQueue items={BATCH} icons={{ qa: ClipboardList }} />;
}

// ─── Agent state ─────────────────────────────────────────────────────────────

export function MiniTraceSpecimen() {
  return <MiniTrace {...DEMO_TRACE} />;
}

export function ToolCallSpecimen() {
  return <ToolCallPreview {...DEMO_TOOL_CALL} />;
}

const CONTEXT_SEEDS: ContextChipItem[] = [
  { id: "c1", color: "bg-[color:var(--accent-violet)]", label: "AR6 temperature finding" },
  { id: "c2", color: "bg-[color:var(--accent-blue)]", label: "IPCC AR6 Synthesis.pdf" },
  { id: "c3", color: "bg-[color:var(--accent-emerald)]", label: "eu-ets.europa.eu" },
  { id: "c4", color: "bg-[color:var(--accent-amber)]", label: "Price corridor note" },
  { id: "c5", color: "bg-[color:var(--accent-blue)]", label: "Carbon Markets 2024.pdf" },
];

export function ContextStripSpecimen() {
  const [items, setItems] = useState(CONTEXT_SEEDS);
  return (
    <div className="space-y-3">
      <ContextChips
        items={items}
        onAction={(a) => setItems((p) => p.filter((x) => x.id !== a.id))}
      />
      <button
        type="button"
        onClick={() => setItems(CONTEXT_SEEDS)}
        className="rounded text-meta text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
      >
        reset
      </button>
    </div>
  );
}

// ─── Evidence ────────────────────────────────────────────────────────────────

export function SearchResultSpecimens() {
  return (
    <>
      {DEMO_SEARCH_RESULTS.map((r) => (
        <Specimen
          key={r.id}
          label={`Result #${r.rank}`}
          hint={`${r.venue}, ${r.year} · ${Math.round(r.relevance * 100)}%`}
        >
          <SearchResultCard {...r} />
        </Specimen>
      ))}
    </>
  );
}

export function CitationSpecimen() {
  return <CitationResult {...DEMO_CITATION} />;
}

export function DiffSpecimen() {
  return <DiffResult {...DEMO_DIFF} />;
}

export function EvidenceSpecimen() {
  return <EvidencePointer {...DEMO_EVIDENCE} />;
}

// ─── Composed ────────────────────────────────────────────────────────────────

export function WritingAgentSpecimen() {
  return <WritingAgent {...DEMO_WRITING_AGENT} showStatusPicker />;
}

export function ResearchAgentSpecimen() {
  return <ResearchAgent {...DEMO_RESEARCH_AGENT} />;
}
