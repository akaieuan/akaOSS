import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { ProjectGlyph } from "@/components/brand/project-glyph";

const GROUP_LABEL: Record<Project["group"], string> = {
  measurement: "Measurement",
  tooling: "Tooling",
};

/**
 * One card shape for every project, everywhere a project is offered: the
 * landing grid, the projects index, the "other projects" row on a detail
 * page. Same inset, same glyph size, same rows, so the five read as a set.
 * Renders an `<li>`; put it in a list.
 */
export function ProjectCard({ p }: { p: Project }) {
  return (
    <li className="settle">
      <Link href={`/projects/${p.slug}`} className="card-gloss group flex h-full flex-col p-7">
        {/* Title row: the name on the left, the glyph on the right, on one line.
            The description runs the full width beneath so the glyph never
            squeezes it into a column. */}
        <div className="flex items-center justify-between gap-5">
          <h3 className="min-w-0 text-[17px] font-medium leading-snug tracking-tight text-foreground">{p.name}</h3>
          <ProjectGlyph slug={p.slug} size={56} className="-mr-1 shrink-0 text-foreground" />
        </div>
        <p className="mt-3 text-[13.5px] font-light leading-relaxed text-muted-foreground/80">{p.blurb}</p>

        <p className="mt-auto flex items-center gap-2 pt-7 text-[11.5px] text-muted-foreground/55">
          <span className="shrink-0 text-muted-foreground/70">{GROUP_LABEL[p.group]}</span>
          <span aria-hidden className="shrink-0">·</span>
          <span className="truncate">{p.status}</span>
          <ArrowUpRight
            aria-hidden
            className="ml-auto size-3.5 shrink-0 text-muted-foreground/50 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </p>
      </Link>
    </li>
  );
}
