"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Copy command"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[color:var(--accent-emerald)]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
