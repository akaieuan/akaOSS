"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContextItem {
  id: string;
  label: string;
  color: string;
}

export interface ContextChipsProps {
  items: ContextItem[];
  onRemove?: (id: string) => void;
  maxVisible?: number;
  className?: string;
}

export function ContextChips({
  items,
  onRemove,
  maxVisible,
  className,
}: ContextChipsProps) {
  const visible = maxVisible ? items.slice(0, maxVisible) : items;
  const overflow = maxVisible ? items.length - maxVisible : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {visible.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-2 py-0.5 text-xs text-foreground"
        >
          <span className={cn("h-2 w-2 shrink-0 rounded-full", item.color)} />
          <span className="max-w-[180px] truncate">{item.label}</span>
          {onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`Remove ${item.label}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <span className="rounded-full border border-dashed border-border px-2 py-0.5 text-[10px] text-muted-foreground">
          +{overflow} more
        </span>
      )}
    </div>
  );
}
