import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectGlyph } from "./ProjectGlyph";
import { SectionHead } from "./SectionHead";

const GROUP_LABEL: Record<Project["group"], string> = {
  measurement: "Measurement",
  tooling: "Tooling",
};

/** One card shape for every project: same inset, same glyph size, same rows. */
function ProjectCard({ p }: { p: Project }) {
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

/** Five equal cards on black glass. The glyph, top right of each, is the only colour. */
export function ProjectsGrid() {
  return (
    <section id="projects" className="scroll-mt-16 pb-16">
      <SectionHead title="Projects" href="/projects" link="all projects" />
      <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </ul>
    </section>
  );
}
