"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "create" | "followup" | "readurl";

const MODE_LABEL: Record<Mode, string> = {
  create: "Create",
  followup: "Follow-up",
  readurl: "Read URL",
};

export function ResearchAgent() {
  const [mode, setMode] = useState<Mode>("create");

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-[color:var(--accent-violet)]" />
          <span className="text-sm font-medium text-foreground">
            Research Agent
          </span>
        </div>
        <div className="flex gap-1">
          {(["create", "followup", "readurl"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                mode === m
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg bg-background/40 px-3 py-2.5 text-xs">
        {mode === "create" && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profile</span>
              <span className="font-medium text-foreground">
                Academic, Climate Policy
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engine</span>
              <span className="font-medium text-foreground">
                Semantic Scholar + Web
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Depth</span>
              <span className="font-medium text-foreground">
                Deep (5 hops)
              </span>
            </div>
          </>
        )}
        {mode === "followup" && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session</span>
              <span className="font-mono text-[10px] text-foreground">
                sess_3a9f12
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Query</span>
              <span className="font-medium text-foreground">
                EU ETS price volatility
              </span>
            </div>
          </>
        )}
        {mode === "readurl" && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">URL</span>
              <span className="max-w-[160px] truncate font-mono text-[10px] text-foreground">
                ec.europa.eu/clima/ets
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Extract</span>
              <span className="font-medium text-foreground">
                Tables + Key passages
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
