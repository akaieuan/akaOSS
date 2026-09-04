import type { Metadata } from "next";
import Link from "next/link";

import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { SectionHead } from "@/components/ui/section-head";
import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { LIBRARY_GROUPS, LIBRARY_SPECIMEN_COUNT } from "@/lib/library";
import { LibraryHeader } from "@/components/features/library/catalogue";
import { DecisionGroup } from "@/components/features/library/decision";
import { AgentStateGroup } from "@/components/features/library/agent-state";
import { EvidenceGroup } from "@/components/features/library/evidence";
import { ComposedGroup } from "@/components/features/library/composed";
import { ScalesGroup } from "@/components/features/library/scales";

export const metadata: Metadata = {
  title: "Component library · HITL Kit · akaOSS",
  description:
    "The HITL Kit primitive library, live on one page. Decision surfaces, agent state, evidence, composed panels, and the AI-generation scales. Every specimen is the shipped component, not a reimplementation.",
};

const UI_COUNT = REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").length;

/* One page that scrolls through the whole library: the hero, a row of jump
   links, then every group with its specimens inline. No sidebar, no
   sub-pages; the old /components/<group> routes redirect to the anchors. */
export default function ComponentsPage() {
  return (
    <>
      <Nav active="components" />
      <main className="mx-auto max-w-site px-6 md:px-8">
        <LibraryHeader
          title="The primitive library."
          lede="Every primitive is the physical embodiment of a claim from the paper, and every specimen imports the shipped component, so the catalogue cannot drift from what the registry ships. Interactive, shadcn-compatible, copy-paste ready."
          meta={`${UI_COUNT} primitives · ${LIBRARY_SPECIMEN_COUNT} specimens · MIT`}
        >
          <nav aria-label="Jump to a group" className="flex flex-wrap gap-x-5 gap-y-2">
            {LIBRARY_GROUPS.map((g) => (
              <a
                key={g.slug}
                href={`#${g.slug}`}
                className="text-[12.5px] text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {g.title}
              </a>
            ))}
          </nav>
        </LibraryHeader>

        <DecisionGroup />
        <AgentStateGroup />
        <EvidenceGroup />
        <ComposedGroup />
        <ScalesGroup />

        <section aria-label="Installing" className="border-t border-border/50 pt-12 pb-24">
          <SectionHead title="Installing" as="h2" href="/registry" link="registry & install" />
          <p className="mt-3 max-w-2xl text-[13.5px] font-light leading-relaxed text-muted-foreground/80">
            Each primitive installs on its own through the shadcn CLI. No fork, no wrapper SDK. The{" "}
            <Link
              href="/registry"
              className="text-foreground underline decoration-border underline-offset-[3px] transition-colors hover:decoration-foreground"
            >
              registry page
            </Link>{" "}
            carries the exact command and dependency chain for every item.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
