"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { cn } from "@/lib/utils";
import { REGISTRY_ITEMS, REGISTRY_BASE_URL } from "@/lib/registry-items";

function CopyButton({ text }: { text: string }) {
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
      aria-label="Copy install command"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--accent-emerald)]" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function InstallRow({ name, title, description, type, registryDependencies }: (typeof REGISTRY_ITEMS)[number]) {
  const url = `${REGISTRY_BASE_URL}/${name}.json`;
  const command = `npx shadcn@latest add ${url}`;

  return (
    <div className="group grid grid-cols-1 gap-4 border-t border-border py-8 sm:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="label">
            {type === "registry:ui" ? "UI" : "Lib"}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span className="font-mono text-[10.5px] text-muted-foreground">
            {name}
          </span>
        </div>
        <h3 className="text-lg font-light leading-tight tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-3 min-w-0">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2">
          <pre className="flex-1 overflow-x-auto font-mono text-[11.5px] text-foreground">
            <span className="text-muted-foreground">$</span> {command}
          </pre>
          <CopyButton text={command} />
        </div>

        {registryDependencies && registryDependencies.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="label">Depends on:</span>
            {registryDependencies.map((d) => (
              <span
                key={d}
                className="rounded-full border border-border bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegistryPage() {
  const uiItems = REGISTRY_ITEMS.filter((i) => i.type === "registry:ui");
  const libItems = REGISTRY_ITEMS.filter((i) => i.type === "registry:lib");

  return (
    <>
      <Nav active="registry" />

      <main className="mx-auto max-w-5xl px-6 md:px-8 pt-10">
        {/* Hero */}
        <section className="pt-12 pb-16">
          <p className="label mb-4">Registry · v0.1 · 15 items</p>
          <h1 className="text-4xl leading-[1.1] font-light tracking-tight text-foreground md:text-5xl">
            Install any primitive with{" "}
            <span className="text-[color:var(--accent-blue)] tracking-tight">
              one command
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            HITL Kit ships as a shadcn-compatible registry. Every primitive
            below installs directly into your existing shadcn/ui project. No
            fork, no wrapper SDK, no lock-in.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="https://ui.shadcn.com/docs/cli"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-transparent px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              shadcn CLI docs
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="/r/registry.json"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Raw registry.json
            </a>
          </div>
        </section>

        {/* Prereqs */}
        <section className="pt-8 pb-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground">
            Before you install.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            You need a Tailwind project with the shadcn CLI initialized. HITL
            Kit also uses custom CSS variables for accent colors (violet,
            amber, blue, emerald, rose). Add these to your globals.css.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-card/30 p-5">
            <p className="label mb-3">1. Initialize shadcn (if you haven&apos;t)</p>
            <pre className="overflow-x-auto font-mono text-xs text-foreground">
              <span className="text-muted-foreground">$</span> npx shadcn@latest init
            </pre>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card/30 p-5">
            <p className="label mb-3">2. Add HITL Kit tokens to globals.css</p>
            <pre className="overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed text-foreground">
{`:root {
  --accent-violet:  #a78bfa;
  --accent-amber:   #fbbf24;
  --accent-emerald: #4ade80;
  --accent-rose:    #fb7185;
  --accent-blue:    #007AFF;
}`}
            </pre>
          </div>
        </section>

        {/* UI primitives */}
        <section className="pt-8 pb-16" id="ui">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-light tracking-tight text-foreground">
              UI primitives
            </h2>
            <span className="label">{uiItems.length} components</span>
          </div>
          <div>
            {uiItems.map((item) => (
              <InstallRow key={item.name} {...item} />
            ))}
          </div>
        </section>

        {/* Lib entries */}
        <section className="pt-8 pb-16" id="lib">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-light tracking-tight text-foreground">
              Lib & shared
            </h2>
            <span className="label">{libItems.length} utilities</span>
          </div>
          <div>
            {libItems.map((item) => (
              <InstallRow key={item.name} {...item} />
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="pt-8 pb-24">
          <h2 className="text-2xl font-light tracking-tight text-foreground">
            Conventions.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="label mb-2">Target path</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                All UI primitives land under{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  components/hitl/
                </code>
                , lib entries under{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  lib/
                </code>
                . The shadcn CLI respects your{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  components.json
                </code>{" "}
                aliases.
              </p>
            </div>
            <div>
              <p className="label mb-2">Dependencies</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The CLI will auto-install npm packages (like{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  lucide-react
                </code>
                ) and transitive registry deps (like{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  hitl-utils
                </code>
                ) for you.
              </p>
            </div>
            <div>
              <p className="label mb-2">Copy-paste ownership</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Once installed, the files are yours. Edit them freely. This is
                the shadcn model. No npm update, no breaking-change anxiety,
                no framework lock-in.
              </p>
            </div>
            <div>
              <p className="label mb-2">LLM pluggability</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                In v0.3 each primitive ships with a Zod event schema and a
                dispatch renderer, so LangGraph and Vercel AI SDK agents can
                stream structured HITL events that render automatically.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
