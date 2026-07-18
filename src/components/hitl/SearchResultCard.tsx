"use client";

import { cn } from "@/lib/utils";

export interface SearchResult {
  id: string;
  rank: number;
  title: string;
  authors: string;
  venue: string;
  year: number | string;
  snippet: string;
  relevance: number;
  cites?: number;
}

export interface SearchResultCardProps {
  result: SearchResult;
  className?: string;
}

export function SearchResultCard({ result, className }: SearchResultCardProps) {
  return (
    <div className={cn("", className)}>
      <div className="mb-1 flex items-start gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[color:var(--accent-violet)] to-[color:var(--accent-blue)] text-[9px] font-bold text-white">
          {result.rank}
        </div>
        <p className="text-xs font-medium leading-snug text-foreground">
          {result.title}
        </p>
      </div>
      <p className="mb-1 text-[10px] text-muted-foreground">{result.authors}</p>
      <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
        {result.snippet}
      </p>
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[color:var(--accent-violet)] transition-all"
            style={{ width: `${result.relevance * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground">
          {Math.round(result.relevance * 100)}%
        </span>
      </div>
    </div>
  );
}
