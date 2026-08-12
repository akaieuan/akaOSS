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
 */

import { useState } from "react";
import {
  Search,
  PenLine,
  GraduationCap,
  ClipboardList,
  Globe,
} from "lucide-react";

import { AiGenerationScale } from "@/components/hitl/AiGenerationScale";
import { AiGenerationSlider } from "@/components/hitl/AiGenerationSlider";
import { AiGenerationBadge } from "@/components/hitl/AiGenerationBadge";
import { ApproveRejectRow } from "@/components/hitl/ApproveRejectRow";
import { BatchQueue, type BatchItem } from "@/components/hitl/BatchQueue";
import { ContextChips, type ContextItem } from "@/components/hitl/ContextChips";
import { HitlCard, DEMO_HITL_CARDS } from "@/components/hitl/HitlCard";
import { EditablePlan, DEMO_PLAN } from "@/components/hitl/EditablePlan";
import { MiniTrace, DEMO_TRACE_STEPS } from "@/components/hitl/MiniTrace";
import {
  ToolCallPreview,
  DEMO_TOOL_CALL,
} from "@/components/hitl/ToolCallPreview";
import { CitationResult, DEMO_CITATION } from "@/components/hitl/CitationResult";
import { DiffResult, DEMO_DIFF } from "@/components/hitl/DiffResult";
import type { ApprovalStatus } from "@/components/hitl/types";

import { Specimen } from "./demo-ui";

// ─── Scales ──────────────────────────────────────────────────────────────────

export function SliderSpecimen() {
  const [value, setValue] = useState(2);
  return (
    <AiGenerationSlider
      value={value}
      onChange={setValue}
      hint="section 2 draft"
      ariaLabel="AI generation level for section 2 draft"
    />
  );
}

export function BadgeSpecimen() {
  const [value, setValue] = useState(3);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AiGenerationBadge value={value} onChange={setValue} />
      <span className="font-mono text-[10px] text-muted-foreground">
        interactive
      </span>
    </div>
  );
}

export function SegmentedScaleSpecimen() {
  const [value, setValue] = useState(2);
  return <AiGenerationScale value={value} onChange={setValue} />;
}

// ─── Decision ────────────────────────────────────────────────────────────────

/** The three interrupt-card variants. Labels come from the fixture, so the
 *  whole grid, wells included, has to read it on the client. */
export function InterruptCardSpecimens() {
  return (
    <>
      {DEMO_HITL_CARDS.map((c) => (
        <Specimen key={c.id} label={c.kind} hint={`kind="${c.kind}"`}>
          <HitlCard config={c} />
        </Specimen>
      ))}
    </>
  );
}

export function EditablePlanSpecimen() {
  return <EditablePlan config={DEMO_PLAN} />;
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
  const [states, setStates] = useState<ApprovalStatus[]>(
    APPROVAL_ITEMS.map(() => "pending"),
  );
  const set = (i: number, s: ApprovalStatus) =>
    setStates((p) => p.map((x, j) => (j === i ? s : x)));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {APPROVAL_ITEMS.map((item, i) => (
        <div
          key={item.label}
          className="flex min-w-0 flex-col gap-3 rounded-xl border border-border/40 bg-background/40 p-4"
        >
          {/* Same reason as `Specimen`: with a `shrink-0` meta on one line, the
              label eats the whole deficit at 320px ("Download: Carbon Pricing
              paper" lost 79 of its 185px). Wrapping keeps both intact. */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="min-w-0 truncate text-xs text-foreground">
              {item.label}
            </span>
            <span className="min-w-0 max-w-full shrink-0 truncate font-mono text-[10px] text-muted-foreground">
              {item.meta}
            </span>
          </div>
          <ApproveRejectRow
            state={states[i]}
            accentClass={item.accent}
            onApprove={() => set(i, "approved")}
            onReject={() => set(i, "rejected")}
            onUndo={() => set(i, "pending")}
          />
        </div>
      ))}
    </div>
  );
}

// BatchItem carries a component in `icon`, which cannot cross a server →
// client boundary as a prop. The seed data therefore lives on this side.
const BATCH: BatchItem[] = [
  { id: "b1", label: "Search: carbon pricing 2024", icon: Search },
  { id: "b2", label: "Write: Section 2 introduction", icon: PenLine },
  { id: "b3", label: "Research: IPCC AR6 findings", icon: GraduationCap },
  { id: "b4", label: "QA: Verify citation accuracy", icon: ClipboardList },
  { id: "b5", label: "Read: eu-ets.europa.eu", icon: Globe },
];

export function BatchSpecimen() {
  return <BatchQueue items={BATCH} />;
}

// ─── Agent state ─────────────────────────────────────────────────────────────

export function MiniTraceSpecimen() {
  return <MiniTrace steps={DEMO_TRACE_STEPS} />;
}

export function ToolCallSpecimen() {
  return <ToolCallPreview config={DEMO_TOOL_CALL} />;
}

const CONTEXT_SEEDS: ContextItem[] = [
  {
    id: "c1",
    color: "bg-[color:var(--accent-violet)]",
    label: "AR6 temperature finding",
  },
  {
    id: "c2",
    color: "bg-[color:var(--accent-blue)]",
    label: "IPCC AR6 Synthesis.pdf",
  },
  {
    id: "c3",
    color: "bg-[color:var(--accent-emerald)]",
    label: "eu-ets.europa.eu",
  },
  {
    id: "c4",
    color: "bg-[color:var(--accent-amber)]",
    label: "Price corridor note",
  },
  {
    id: "c5",
    color: "bg-[color:var(--accent-blue)]",
    label: "Carbon Markets 2024.pdf",
  },
];

export function ContextStripSpecimen() {
  const [items, setItems] = useState(CONTEXT_SEEDS);
  return (
    <div className="space-y-3">
      <ContextChips
        items={items}
        onRemove={(id) => setItems((p) => p.filter((x) => x.id !== id))}
      />
      <button
        type="button"
        onClick={() => setItems(CONTEXT_SEEDS)}
        className="rounded text-[10px] text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        reset
      </button>
    </div>
  );
}

// ─── Evidence ────────────────────────────────────────────────────────────────

export function CitationSpecimen() {
  return <CitationResult config={DEMO_CITATION} />;
}

export function DiffSpecimen() {
  return <DiffResult config={DEMO_DIFF} />;
}
