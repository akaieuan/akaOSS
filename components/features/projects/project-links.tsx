import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

/** Deep dives where the project has them, then the repository. */
export function ProjectLinks({ project }: { project: Project }) {
  const hasLinks = project.links.length > 0;
  return (
    <section className="settle pb-16">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <div>
          <h2 className="text-title-2 font-light text-foreground">
            Explore further.
          </h2>
          <p className="mt-4 max-w-md text-body text-muted-foreground">
            The source lives on GitHub. Copy, paste, own. No fork, no
            vendor lock-in.
          </p>
        </div>

        <div className="flex flex-col">
          {hasLinks &&
            project.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
              >
                <span className="text-title-3 font-light text-foreground">
                  {link.label}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
              </Link>
            ))}
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
          >
            <span className="text-title-3 font-light text-foreground">
              Repository
            </span>
            <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors">
              github.com
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
