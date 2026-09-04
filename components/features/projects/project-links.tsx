import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { ProjectSection } from "./project-section";
import { prose, quiet, quietLink, row, rowArrow, rowName } from "./shared";

/** Deep dives where the project has them, then the repository. */
export function ProjectLinks({ project }: { project: Project }) {
  return (
    <ProjectSection title="Explore further">
      <p className={`max-w-2xl ${prose}`}>The source lives on GitHub. Copy, paste, own. No fork, no vendor lock-in.</p>
      <div className="mt-5 flex flex-col border-b border-border/50">
        {project.links.map((link) => (
          <Link key={link.href} href={link.href} className={row}>
            <span className={rowName}>{link.label}</span>
            <ArrowUpRight aria-hidden className={cn(rowArrow, "text-muted-foreground/60 group-hover:text-foreground")} />
          </Link>
        ))}
        <a href={project.repo} target="_blank" rel="noreferrer" className={row}>
          <span className={rowName}>Repository</span>
          <span className={cn("inline-flex shrink-0 items-center gap-1", quiet, quietLink)}>
            github.com
            <ArrowUpRight aria-hidden className={rowArrow} />
          </span>
        </a>
      </div>
    </ProjectSection>
  );
}
