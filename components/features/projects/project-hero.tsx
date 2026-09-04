import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectGlyph } from "@/components/brand/project-glyph";
import type { Project } from "@/lib/projects";
import { prose, quiet, quietLink } from "./shared";

/** The project's mark beside its name, the one-liner, and one quiet line of status and links. */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="pt-16 pb-12">
      <div className="flex items-center gap-5">
        <ProjectGlyph slug={project.slug} size={72} className="shrink-0 text-foreground" />
        <div className="min-w-0">
          <h1 className="text-[22px] font-light leading-snug tracking-tight text-foreground sm:text-[24px]">
            {project.name}
          </h1>
          <p className={cn("mt-1 max-w-2xl", prose)}>{project.oneLiner}</p>
        </div>
      </div>
      <p className={cn("mt-6 flex flex-wrap items-center gap-x-5 gap-y-1", quiet)}>
        <span>{project.status}</span>
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className={cn("group inline-flex items-center gap-0.5 text-muted-foreground/70", quietLink)}
        >
          GitHub
          <ArrowUpRight aria-hidden className="size-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>
        {project.links.map((link) => (
          <Link key={link.href} href={link.href} className={cn("text-muted-foreground/70", quietLink)}>
            {link.label}
          </Link>
        ))}
      </p>
    </header>
  );
}
