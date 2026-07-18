"use client";

import { useState, useEffect } from "react";
import { Search, PenLine, GraduationCap, ClipboardList, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

import { HitlCard, DEMO_HITL_CARDS } from "@/components/hitl/HitlCard";
import { SubagentStatusCard } from "@/components/hitl/SubagentStatusCard";
import { MiniTrace, DEMO_TRACE_STEPS } from "@/components/hitl/MiniTrace";
import { AiGenerationScale } from "@/components/hitl/AiGenerationScale";
import { ContextChips, type ContextItem } from "@/components/hitl/ContextChips";
import { QAFlow, type QAQuestion } from "@/components/hitl/QAFlow";
import { WritingAgent } from "@/components/hitl/WritingAgent";
import { ResearchAgent } from "@/components/hitl/ResearchAgent";
import { BatchQueue, type BatchItem } from "@/components/hitl/BatchQueue";
import { SearchResultCard } from "@/components/hitl/SearchResultCard";
import { ApproveRejectRow } from "@/components/hitl/ApproveRejectRow";
import { SharedPrimitives } from "@/components/hitl/SharedPrimitives";
import { DiffResult, DEMO_DIFF } from "@/components/hitl/DiffResult";
import { CitationResult, DEMO_CITATION } from "@/components/hitl/CitationResult";
import { EditablePlan, DEMO_PLAN } from "@/components/hitl/EditablePlan";
import {
  ToolCallPreview,
  DEMO_TOOL_CALL,
} from "@/components/hitl/ToolCallPreview";
import { SEARCH_RESULTS } from "@/components/hitl/data";

import type { AgentStatus, ApprovalStatus } from "@/components/hitl/types";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

// ─── Layout wrappers ─────────────────────────────────────────────────────────

function Section({
  id,
  label,
  description,
  children,
  cols = 1,
}: {
  id: string;
  label: string;
  description: string;
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-20">
      <div className="mb-12">
        <h2 className="text-2xl font-light tracking-tight text-foreground">
          {label}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div
        className={cn(
          "grid gap-10",
          cols === 2 && "md:grid-cols-2",
          cols === 3 && "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}

function Demo({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2 border-t border-border pt-3">
        <span className="label">{label}</span>
        {hint && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HitlSection() {
  return (
    <Section
      id="hitl"
      label="Interrupt Cards"
      description="Human-in-the-loop interrupt cards rendered inline in a chat thread. Three semantic variants. Each has idle, expanded, confirmed, and dismissed states. Click any to expand."
      cols={3}
    >
      {DEMO_HITL_CARDS.map((c) => (
        <Demo key={c.id} label={c.kind} hint={`kind="${c.kind}"`}>
          <HitlCard config={c} />
        </Demo>
      ))}
    </Section>
  );
}

function AgentStatusSection() {
  const statuses: AgentStatus[] = [
    "idle",
    "running",
    "completed",
    "error",
    "skipped",
    "cancelled",
  ];
  return (
    <Section
      id="agent-status"
      label="Subagent Status"
      description="Six discrete agent execution states. The running state animates. Use in any card that wraps an in-progress agentic task."
      cols={2}
    >
      {statuses.map((status) => (
        <Demo key={status} label={status} hint={`status="${status}"`}>
          <SubagentStatusCard
            status={status}
            label="Research Agent"
            detail="Climate Policy workspace"
          />
        </Demo>
      ))}
    </Section>
  );
}

function MiniTraceSection() {
  return (
    <Section
      id="trace"
      label="MiniTrace"
      description="Step-by-step thought, action, result trace renderer. Each step is collapsible to reveal detail. Makes agent reasoning transparent. A visible implementation of the supporting-facts requirement from §3.3 of the paper."
    >
      <Demo label="Search trace" hint="3 steps. Click any row to expand.">
        <MiniTrace steps={DEMO_TRACE_STEPS} />
      </Demo>
    </Section>
  );
}

function AiScaleSection() {
  const [values, setValues] = useState([0, 2, 4]);
  return (
    <Section
      id="ai-scale"
      label="AI Generation Scale"
      description="Five-segment ordinal scale indicating AI involvement in a piece of work. Interactive. Click any segment to select. Embodies the scaffolding and expertise-matching principle from Dhillon et al. (2024)."
    >
      <Demo label="Three configurations" hint="Click segments to adjust">
        <div className="space-y-5">
          {values.map((v, idx) => (
            <AiGenerationScale
              key={idx}
              value={v}
              onChange={(nv) =>
                setValues((vals) => vals.map((x, j) => (j === idx ? nv : x)))
              }
            />
          ))}
        </div>
      </Demo>
    </Section>
  );
}

const CONTEXT_SEEDS: ContextItem[] = [
  { id: "c1", color: "bg-[color:var(--accent-violet)]", label: "AR6 temperature finding" },
  { id: "c2", color: "bg-[color:var(--accent-blue)]", label: "IPCC AR6 Synthesis.pdf" },
  { id: "c3", color: "bg-[color:var(--accent-emerald)]", label: "eu-ets.europa.eu" },
  { id: "c4", color: "bg-[color:var(--accent-amber)]", label: "Price corridor note" },
  { id: "c5", color: "bg-[color:var(--accent-blue)]", label: "Carbon Markets 2024.pdf" },
];

function ContextItemsSection() {
  const [items, setItems] = useState(CONTEXT_SEEDS);
  return (
    <Section
      id="context"
      label="Context Chips"
      description="Pill chips representing context attached to an agent run. Notes, files, URLs. Removable. Overflow truncation built in."
    >
      <Demo label="Context strip" hint="Click × to remove chips">
        <div className="space-y-3">
          <ContextChips
            items={items}
            onRemove={(id) => setItems((p) => p.filter((x) => x.id !== id))}
          />
          <button
            onClick={() => setItems(CONTEXT_SEEDS)}
            className="text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            reset
          </button>
        </div>
      </Demo>
    </Section>
  );
}

const QA_QUESTIONS: QAQuestion[] = [
  {
    id: "mech",
    kind: "single",
    prompt: "Preferred mechanism?",
    options: ["Carbon pricing", "Regulation", "Voluntary markets", "Technology mandates"],
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

function QASection() {
  return (
    <Section
      id="qa"
      label="QA Flow"
      description="Multi-question approval card. Single-choice, multi-select, and a freeform text field. Submits to a confirmed state."
    >
      <Demo label="QA form" hint="Fill out and hit Continue">
        <QAFlow questions={QA_QUESTIONS} />
      </Demo>
    </Section>
  );
}

function WritingAgentSection() {
  return (
    <Section
      id="writing-agent"
      label="Writing Agent"
      description="Compound widget for a draft-in-progress document. Shows title, target section, word range, evidence notes, and the six status states."
    >
      <Demo label="Write doc agent" hint="Click status chips to cycle">
        <WritingAgent />
      </Demo>
    </Section>
  );
}

function ResearchAgentSection() {
  return (
    <Section
      id="research-agent"
      label="Research Agent"
      description="Three operating modes. Create (new session), Follow-up (continue a session), Read URL (extract from a single page)."
    >
      <Demo label="Research agent" hint="Switch modes in the top right">
        <ResearchAgent />
      </Demo>
    </Section>
  );
}

const BATCH: BatchItem[] = [
  { id: "b1", label: "Search: carbon pricing 2024", icon: Search },
  { id: "b2", label: "Write: Section 2 introduction", icon: PenLine },
  { id: "b3", label: "Research: IPCC AR6 findings", icon: GraduationCap },
  { id: "b4", label: "QA: Verify citation accuracy", icon: ClipboardList },
  { id: "b5", label: "Read: eu-ets.europa.eu", icon: Globe },
];

function BatchSection() {
  return (
    <Section
      id="batch"
      label="Batch Approval Queue"
      description="Sequential approve-reject flow across mixed agent items. Auto-advances to the next item. Resolves to a summary state."
    >
      <Demo label="Kitchen sink batch" hint="5 items. Step through each decision.">
        <BatchQueue items={BATCH} />
      </Demo>
    </Section>
  );
}

function SearchCardsSection() {
  return (
    <Section
      id="search-cards"
      label="Search Result Cards"
      description="Ranked result cards with metadata, snippet, and relevance bar."
      cols={2}
    >
      {SEARCH_RESULTS.slice(0, 4).map((r) => (
        <Demo
          key={r.id}
          label={`Result #${r.rank}`}
          hint={`${r.venue}, ${r.year} · ${Math.round(r.relevance * 100)}%`}
        >
          <SearchResultCard result={r} />
        </Demo>
      ))}
    </Section>
  );
}

function ApprovalSection() {
  const items: {
    label: string;
    meta: string;
    accent: string;
  }[] = [
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

  const [states, setStates] = useState<ApprovalStatus[]>(
    items.map(() => "pending"),
  );
  const set = (i: number, s: ApprovalStatus) =>
    setStates((p) => p.map((x, j) => (j === i ? s : x)));

  return (
    <Section
      id="approval"
      label="Approve / Reject"
      description="The core binary decision row used across review, download, and notes panels. Three terminal states. Pending, approved, rejected."
      cols={2}
    >
      {items.map((item, i) => (
        <Demo key={i} label={item.label} hint={item.meta}>
          <ApproveRejectRow
            state={states[i]}
            accentClass={item.accent}
            onApprove={() => set(i, "approved")}
            onReject={() => set(i, "rejected")}
            onUndo={() => set(i, "pending")}
          />
        </Demo>
      ))}
    </Section>
  );
}

function SharedPrimitivesSection() {
  return (
    <Section
      id="shared"
      label="Shared Primitives"
      description="The atomic palette. Accent swatches, approval badge variants, and approve and reject rows."
    >
      <Demo label="Shared palette" hint="Interactive">
        <SharedPrimitives />
      </Demo>
    </Section>
  );
}

function DiffResultSection() {
  return (
    <Section
      id="diff"
      label="Diff Result"
      description="Before/after diff for a proposed text or code edit. Per-hunk red/green strips. Drop into any agent loop where the human should see exactly what will change before it lands."
    >
      <Demo label="Markdown rewrite" hint="Click Apply edit to confirm">
        <DiffResult config={DEMO_DIFF} />
      </Demo>
    </Section>
  );
}

function CitationResultSection() {
  return (
    <Section
      id="citation"
      label="Citation Result"
      description="Single source-backed citation card. Claim on top, source attribution below, expandable supporting quote, and an optional confidence badge."
    >
      <Demo label="Cited claim" hint="Expand the supporting quote">
        <CitationResult config={DEMO_CITATION} />
      </Demo>
    </Section>
  );
}

function EditablePlanSection() {
  return (
    <Section
      id="plan"
      label="Editable Plan"
      description="Multi-step plan the human can rename, reorder, add to, or delete from before the agent executes. Steps marked locked cannot be removed."
    >
      <Demo label="Research plan" hint="Edit any unlocked step">
        <EditablePlan config={DEMO_PLAN} />
      </Demo>
    </Section>
  );
}

function ToolCallPreviewSection() {
  return (
    <Section
      id="tool-call"
      label="Tool Call Preview"
      description="Preview a tool call (name, args, optional rationale and signals) so the human can approve or reject before execution. Pairs with the gates layer for confidence, cost, and scope checks."
    >
      <Demo label="Outbound email" hint="Expand Arguments to inspect">
        <ToolCallPreview config={DEMO_TOOL_CALL} />
      </Demo>
    </Section>
  );
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC = [
  { id: "hitl", label: "Interrupt Cards" },
  { id: "agent-status", label: "Subagent Status" },
  { id: "trace", label: "MiniTrace" },
  { id: "ai-scale", label: "AI Generation Scale" },
  { id: "context", label: "Context Chips" },
  { id: "qa", label: "QA Flow" },
  { id: "writing-agent", label: "Writing Agent" },
  { id: "research-agent", label: "Research Agent" },
  { id: "batch", label: "Batch Queue" },
  { id: "search-cards", label: "Search Result Cards" },
  { id: "approval", label: "Approve / Reject" },
  { id: "shared", label: "Shared Primitives" },
  { id: "diff", label: "Diff Result" },
  { id: "citation", label: "Citation Result" },
  { id: "plan", label: "Editable Plan" },
  { id: "tool-call", label: "Tool Call Preview" },
];

export default function ComponentsPage() {
  const [active, setActive] = useState("hitl");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Nav active="components" />

      <div className="mx-auto flex max-w-6xl gap-12 px-6 pt-10">
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
          <p className="label mb-4">Patterns</p>
          <nav className="flex flex-col gap-0.5">
            {TOC.map(({ id, label }, i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActive(id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                  active === id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono text-[9px] text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-24">
          <div className="mb-20 pt-4">
            <p className="label mb-3">Component library</p>
            <h1 className="text-4xl leading-[1.1] font-light tracking-tight text-foreground md:text-5xl">
              The HITL pattern language,{" "}
              <span className="text-[color:var(--accent-blue)] tracking-tight">
                as real components
              </span>
              .
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every primitive below is the physical embodiment of a claim from
              the paper. Interactive. shadcn-compatible. Copy-paste ready.
            </p>
          </div>

          <HitlSection />
          <AgentStatusSection />
          <MiniTraceSection />
          <AiScaleSection />
          <ContextItemsSection />
          <QASection />
          <WritingAgentSection />
          <ResearchAgentSection />
          <BatchSection />
          <SearchCardsSection />
          <ApprovalSection />
          <SharedPrimitivesSection />
          <DiffResultSection />
          <CitationResultSection />
          <EditablePlanSection />
          <ToolCallPreviewSection />
        </main>
      </div>

      <Footer />
    </>
  );
}
