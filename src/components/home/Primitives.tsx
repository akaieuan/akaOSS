import Link from "next/link";
import { AiGenerationBadge } from "@/components/hitl/AiGenerationBadge";
import { SubagentStatusCard } from "@/components/hitl/SubagentStatusCard";
import { AI_GENERATION_LEVELS } from "@/components/hitl/ai-generation-levels";
import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { SliderSpecimen } from "@/app/components/_components/live";
import { SectionHead } from "./SectionHead";

const COUNT = REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").length;

/**
 * Three live primitives on tiles, so the product is visible from the front
 * door. Each is the shipped component, not a picture of it.
 */
export function Primitives() {
  return (
    <section className="pb-16">
      <SectionHead title="Components" href="/components" link={`all ${COUNT} primitives`} />
      <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-x-5 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <li className="settle">
          <Link href="/components/scales#ai-scale" className="group block">
            <div className="tile aspect-[4/3] bg-tile-amber px-6">
              <div className="w-full max-w-[18rem]">
                <SliderSpecimen hint="" />
              </div>
            </div>
            <p className="mt-3 text-[14px] text-foreground">AI Generation Scale</p>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground/60">How much of this did a person do</p>
          </Link>
        </li>
        <li className="settle">
          <Link href="/components/agent-state#agent-status" className="group block">
            <div className="tile aspect-[4/3] bg-tile-blue px-6">
              <div className="w-full max-w-[18rem] space-y-2">
                <SubagentStatusCard status="running" label="Research agent" detail="Climate policy" />
                <SubagentStatusCard status="completed" label="Writing agent" detail="Section 2" />
              </div>
            </div>
            <p className="mt-3 text-[14px] text-foreground">Subagent Status</p>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground/60">What the agent is doing right now</p>
          </Link>
        </li>
        <li className="settle">
          <Link href="/components/scales#ai-scale" className="group block">
            <div className="tile aspect-[4/3] bg-tile-violet px-6">
              <div className="flex max-w-[18rem] flex-wrap justify-center gap-2">
                {AI_GENERATION_LEVELS.map((_, i) => (
                  <AiGenerationBadge key={i} value={i} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-[14px] text-foreground">Provenance badges</p>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground/60">The same scale, dense enough for a table cell</p>
          </Link>
        </li>
      </ul>
    </section>
  );
}
