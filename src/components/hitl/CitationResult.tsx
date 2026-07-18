"use client";

import { useState } from "react";
import {
  Check,
  X,
  Quote,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CitationSource {
  title: string;
  authors: string;
  year: number | string;
  venue?: string;
  url?: string;
  quote?: string;
  pages?: string;
}

export interface CitationResultConfig {
  id?: string;
  claim: string;
  source: CitationSource;
  confidence?: number;
}

interface CitationResultProps {
  config: CitationResultConfig;
  onVerify?: () => void;
  onReject?: () => void;
}

export function CitationResult({
  config,
  onVerify,
  onReject,
}: CitationResultProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "verified" | "rejected">("idle");

  if (state !== "idle") {
    return (
      <div
        className="my-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
        role="status"
        aria-live="polite"
      >
        {state === "verified" ? (
          <>
            <Check className="h-3.5 w-3.5 text-[color:var(--accent-emerald)]" aria-hidden="true" />
            <span className="font-medium text-foreground">Citation verified</span>
          </>
        ) : (
          <>
            <X className="h-3.5 w-3.5 text-[color:var(--accent-rose)]" aria-hidden="true" />
            <span className="font-medium text-foreground">Citation rejected</span>
          </>
        )}
      </div>
    );
  }

  const confPct =
    config.confidence === undefined ? null : Math.round(config.confidence * 100);

  const quoteId = `citation-${config.id ?? "default"}-quote`;

  return (
    <div
      className="my-1.5 rounded-xl border border-border bg-card text-xs"
      role="group"
      aria-label="Citation for review"
    >
      <div className="px-3 py-2.5">
        <div className="flex items-start gap-2">
          <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--accent-violet)]" aria-hidden="true" />
          <p className="flex-1 leading-relaxed text-foreground">{config.claim}</p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          <span className="font-medium text-foreground">{config.source.authors}</span>
          <span>·</span>
          <span>{config.source.year}</span>
          {config.source.venue && (
            <>
              <span>·</span>
              <span className="italic">{config.source.venue}</span>
            </>
          )}
          {confPct !== null && (
            <span className="ml-auto rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">
              {confPct}% conf
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
          <span>{config.source.title}</span>
          {config.source.url && (
            <a
              href={config.source.url}
              target="_blank"
              rel="noreferrer"
              className="ml-1 inline-flex items-center hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {config.source.quote && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={quoteId}
          className="flex w-full items-center gap-1 border-t border-border px-3 py-1.5 text-left text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {open ? (
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
          )}
          <span>Supporting quote</span>
        </button>
      )}

      {open && config.source.quote && (
        <blockquote
          id={quoteId}
          className="border-t border-border bg-muted/30 px-3 py-2 italic leading-relaxed text-muted-foreground"
        >
          &ldquo;{config.source.quote}&rdquo;
          {config.source.pages && (
            <span className="ml-2 not-italic">(pp. {config.source.pages})</span>
          )}
        </blockquote>
      )}

      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <button
          type="button"
          onClick={() => {
            setState("verified");
            onVerify?.();
          }}
          className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-medium text-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Check className="h-3 w-3" aria-hidden="true" />
          Verify
        </button>
        <button
          type="button"
          onClick={() => {
            setState("rejected");
            onReject?.();
          }}
          className={cn(
            "ml-auto flex h-6 items-center gap-1 rounded-md px-2 text-muted-foreground",
            "transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <X className="h-3 w-3" aria-hidden="true" />
          Reject
        </button>
      </div>
    </div>
  );
}

export const DEMO_CITATION: CitationResultConfig = {
  id: "demo-citation",
  claim:
    "Roughly 95% of enterprise generative-AI pilots fail to reach production deployment.",
  source: {
    title: "The GenAI Divide: State of AI in Business 2025",
    authors: "Challapally et al.",
    year: 2025,
    venue: "MIT NANDA",
    url: "https://example.com/genai-divide",
    quote:
      "Across 312 enterprise rollouts surveyed in Q1-Q3 2025, only 5.4 percent reached sustained production usage; the remainder either stalled in pilot or were withdrawn within 90 days of go-live.",
    pages: "12-14",
  },
  confidence: 0.78,
};
