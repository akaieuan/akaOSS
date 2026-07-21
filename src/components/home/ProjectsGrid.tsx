import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PixelHead } from "@/components/site/PixelHead";
import { ACCENT_CLASSES } from "@/lib/content";
import { PROJECTS } from "@/lib/projects";
import { arrowNudge } from "./shared";

const GROUPS: { key: "measurement" | "tooling"; label: string }[] = [
  { key: "measurement", label: "Human-in-the-loop measurement" },
  { key: "tooling", label: "Developer tooling" },
];

/* Per-project badges: the human figure for HITL Kit (the human in the
   loop), a three-tier podium for eval-kit (measurement, ranked), a code
   tag for tag-kit, the terminal prompt for the developer tooling. */
const PROJECT_BADGES: Record<string, "head" | "podium" | "codetag" | "prompt"> = {
  "hitl-kit": "head",
  "eval-kit": "podium",
  "tag-kit": "codetag",
  collapse: "prompt",
  hologram: "prompt",
};

export function ProjectsGrid() {
  return (
    <section id="projects" className="scroll-mt-16 pt-4 pb-16">
      {GROUPS.map((group) => (
        <div key={group.key} className="mt-10 first:mt-0">
          <span className="label block">{group.label}</span>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.filter((p) => p.group === group.key).map((p) => {
              const accent = ACCENT_CLASSES[p.accent];
              return (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group rounded-2xl border border-border/40 bg-card/40 p-5 transition-all duration-200 hover:bg-card hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", accent.dot)}
                    />
                    <h2 className="text-lg font-light tracking-tight text-foreground">
                      {p.name}
                    </h2>
                    <span className="ml-auto flex items-center gap-3">
                      <PixelHead
                        size={36}
                        grid={18}
                        gap={0.12}
                        icon={PROJECT_BADGES[p.slug] ?? "spark"}
                        once
                      />
                      <ArrowUpRight
                        aria-hidden
                        className={cn(arrowNudge, "text-muted-foreground group-hover:text-foreground")}
                      />
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {p.oneLiner}
                  </p>
                  <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {p.status}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
