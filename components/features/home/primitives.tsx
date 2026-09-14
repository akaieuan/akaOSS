import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { AiGenerationBadge } from "@/components/hitl/AiGenerationBadge";
import { SubagentStatusCard } from "@/components/hitl/SubagentStatusCard";
import { AI_GENERATION_LEVELS } from "@/components/hitl/ai-generation-levels";
import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { SliderSpecimen } from "@/components/features/library/specimens";
import { SectionHead } from "@/components/ui/section-head";

const COUNT = REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").length;

function PrimitiveCard({
  href,
  title,
  blurb,
  children,
}: {
  href: string;
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <li className="settle">
      {/* The card is a container, not a link. Wrapping the whole card in an
          anchor made every live primitive inert: a click or drag on the slider
          navigated instead of moving the control, so the "shipped component,
          not a picture of it" promise below was not actually kept.

          Instead the title carries a stretched link that covers the card, and
          the demo sits above it on its own stacking context. Clicking the card
          still navigates; operating the control still works. */}
      <div className="card-gloss group relative flex h-full flex-col p-6">
        <div className="relative z-10 flex min-h-[7.5rem] flex-1 items-center justify-center py-2">
          {children}
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/50 pt-4">
          <div className="min-w-0">
            <h3 className="text-[15px] font-medium leading-snug tracking-tight text-foreground">
              <Link
                href={href}
                className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring"
              >
                {title}
              </Link>
            </h3>
            <p className="mt-1 text-[12.5px] font-light text-muted-foreground/70">{blurb}</p>
          </div>
          <ArrowUpRight
            aria-hidden
            className="mb-0.5 size-3.5 shrink-0 text-muted-foreground/50 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>
      </div>
    </li>
  );
}

/**
 * Three live primitives, so the product is visible from the front door.
 * Each is the shipped component, not a picture of it.
 */
export function Primitives() {
  return (
    <section className="pb-16">
      <SectionHead title="Components" href="/components" link={`all ${COUNT} primitives`} />
      <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <PrimitiveCard
          href="/components#ai-scale"
          title="AI Generation Scale"
          blurb="How much of this did a person do"
        >
          <div className="w-full max-w-[17rem]">
            <SliderSpecimen hint="" />
          </div>
        </PrimitiveCard>
        <PrimitiveCard
          href="/components#agent-status"
          title="Subagent Status"
          blurb="What the agent is doing right now"
        >
          <div className="w-full max-w-[17rem] space-y-2">
            <SubagentStatusCard status="running" label="Research agent" detail="Climate policy" />
            <SubagentStatusCard status="completed" label="Writing agent" detail="Section 2" />
          </div>
        </PrimitiveCard>
        <PrimitiveCard
          href="/components#ai-scale"
          title="Provenance badges"
          blurb="The same scale, dense enough for a table cell"
        >
          <div className="flex max-w-[17rem] flex-wrap justify-center gap-2">
            {AI_GENERATION_LEVELS.map((_, i) => (
              <AiGenerationBadge key={i} value={i} />
            ))}
          </div>
        </PrimitiveCard>
      </ul>
    </section>
  );
}
