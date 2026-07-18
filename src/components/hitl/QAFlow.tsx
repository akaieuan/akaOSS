"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type QAQuestion =
  | {
      id: string;
      kind: "single";
      prompt: string;
      options: readonly string[];
    }
  | {
      id: string;
      kind: "multi";
      prompt: string;
      options: readonly string[];
    }
  | {
      id: string;
      kind: "text";
      prompt: string;
      placeholder?: string;
    };

export type QAAnswer =
  | { id: string; kind: "single"; value: string }
  | { id: string; kind: "multi"; value: string[] }
  | { id: string; kind: "text"; value: string };

export interface QAFlowProps {
  questions: QAQuestion[];
  onSubmit?: (answers: QAAnswer[]) => void;
  submitLabel?: string;
  className?: string;
}

export function QAFlow({
  questions,
  onSubmit,
  submitLabel = "Continue",
  className,
}: QAFlowProps) {
  const [single, setSingle] = useState<Record<string, string>>({});
  const [multi, setMulti] = useState<Record<string, Set<string>>>({});
  const [text, setText] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const toggleMulti = (qid: string, value: string) =>
    setMulti((p) => {
      const set = new Set(p[qid] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...p, [qid]: set };
    });

  const submit = () => {
    const answers: QAAnswer[] = questions.map((q) => {
      if (q.kind === "single") {
        return { id: q.id, kind: "single", value: single[q.id] ?? "" };
      }
      if (q.kind === "multi") {
        return {
          id: q.id,
          kind: "multi",
          value: Array.from(multi[q.id] ?? []),
        };
      }
      return { id: q.id, kind: "text", value: text[q.id] ?? "" };
    });
    onSubmit?.(answers);
    setDone(true);
  };

  const reset = () => {
    setSingle({});
    setMulti({});
    setText({});
    setDone(false);
  };

  if (done) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-[color:var(--accent-emerald)]/30 bg-[color:var(--accent-emerald)]/5 p-3 text-sm font-medium text-[color:var(--accent-emerald)]",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <Check className="h-4 w-4" aria-hidden="true" /> Responses submitted
        <button
          type="button"
          onClick={reset}
          className="ml-auto text-[10px] underline underline-offset-2 opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          reset
        </button>
      </div>
    );
  }

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {questions.map((q) => (
        <fieldset key={q.id} className="border-0 p-0 m-0">
          <legend className="mb-1.5 text-xs font-medium text-foreground">
            {q.prompt}
          </legend>

          {q.kind === "single" && (
            <div className="space-y-1" role="radiogroup" aria-label={q.prompt}>
              {q.options.map((o) => {
                const active = single[q.id] === o;
                return (
                  <button
                    type="button"
                    key={o}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSingle((p) => ({ ...p, [q.id]: o }))}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-[color:var(--accent-blue)]/50 bg-[color:var(--accent-blue)]/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "h-3 w-3 shrink-0 rounded-full border",
                        active
                          ? "border-[color:var(--accent-blue)] bg-[color:var(--accent-blue)]"
                          : "border-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    {o}
                  </button>
                );
              })}
            </div>
          )}

          {q.kind === "multi" && (
            <div className="space-y-1" role="group" aria-label={q.prompt}>
              {q.options.map((o) => {
                const active = multi[q.id]?.has(o) ?? false;
                return (
                  <button
                    type="button"
                    key={o}
                    role="checkbox"
                    aria-checked={active}
                    onClick={() => toggleMulti(q.id, o)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-[color:var(--accent-blue)]/50 bg-[color:var(--accent-blue)]/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-3 w-3 shrink-0 items-center justify-center rounded",
                        active
                          ? "bg-[color:var(--accent-blue)]"
                          : "border border-muted-foreground",
                      )}
                      aria-hidden="true"
                    >
                      {active && <Check className="h-2 w-2 text-black" />}
                    </div>
                    {o}
                  </button>
                );
              })}
            </div>
          )}

          {q.kind === "text" && (
            <textarea
              aria-label={q.prompt}
              className="w-full resize-none rounded-lg border border-border bg-background/40 px-3 py-2 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-[color:var(--accent-blue)]"
              rows={2}
              placeholder={q.placeholder ?? ""}
              value={text[q.id] ?? ""}
              onChange={(e) =>
                setText((p) => ({ ...p, [q.id]: e.target.value }))
              }
            />
          )}
        </fieldset>
      ))}

      <button
        type="submit"
        className="w-full rounded-lg bg-foreground py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {submitLabel}
      </button>
    </form>
  );
}
