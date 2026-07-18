"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { REGISTRY_ITEMS, REGISTRY_BASE_URL } from "@/lib/registry-items";

const TOKENS = `:root {
  --accent-violet:  #a78bfa;
  --accent-amber:   #fbbf24;
  --accent-emerald: #4ade80;
  --accent-rose:    #fb7185;
  --accent-blue:    #007AFF;
}`;

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
    <div className="group grid grid-cols-1 gap-4 border-t border-border/60 py-8 sm:grid-cols-[240px_1fr]">
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

        <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5">
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
                className="rounded-full border border-border/40 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
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

      <main className="mx-auto max-w-5xl px-6 md:px-8">
        {/* Hero */}
        <section className="pt-14 pb-16">
          <nav className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[13px] text-muted-foreground">
            <Link href="/projects" className="transition-colors hover:text-foreground">
              Toolkits
            </Link>
            <span aria-hidden className="text-muted-foreground/40">·</span>
            <Link href="/projects/hitl-kit" className="transition-colors hover:text-foreground">
              HITL Kit
            </Link>
            <span aria-hidden className="text-muted-foreground/40">·</span>
            <span className="text-foreground/70">registry</span>
          </nav>

          <h1 className="text-3xl leading-[1.1] font-light tracking-tight text-foreground md:text-4xl">
            The registry.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Install any primitive with one command. HITL Kit ships as a
            shadcn-compatible registry — every primitive below installs directly
            into your existing shadcn/ui project. No fork, no wrapper SDK, no
            lock-in.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://ui.shadcn.com/docs/cli"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              shadcn CLI docs
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="/r/registry.json"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Raw registry.json
            </a>
          </div>
        </section>

        {/* Prereqs */}
        <section className="pb-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground">
            Before you install.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            You need a Tailwind project with the shadcn CLI initialized. HITL
            Kit also uses custom CSS variables for accent colors (violet,
            amber, blue, emerald, rose). Add these to your globals.css.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <span className="label">1 · Initialize shadcn (if you haven&apos;t)</span>
            <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5">
              <pre className="flex-1 overflow-x-auto font-mono text-[11.5px] text-foreground">
                <span className="text-muted-foreground">$</span> npx shadcn@latest init
              </pre>
              <CopyButton text="npx shadcn@latest init" />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <span className="label">2 · Add HITL Kit tokens to globals.css</span>
            <div className="flex items-start gap-2 rounded-xl border border-border/40 bg-card/40 px-3 py-3">
              <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed text-foreground">
                {TOKENS}
              </pre>
              <CopyButton text={TOKENS} />
            </div>
          </div>
        </section>

        {/* UI primitives */}
        <section className="pb-16" id="ui">
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
        <section className="pb-16" id="lib">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-light tracking-tight text-foreground">
              Lib &amp; shared
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
        <section className="pb-24">
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
