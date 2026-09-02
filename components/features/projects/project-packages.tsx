import { ArrowUpRight } from "lucide-react";
import { npmVersion, pypiVersion } from "@/lib/facts";
import type { Project } from "@/lib/projects";

/** Hidden when the project ships nothing on npm or PyPI. */
export function ProjectPackages({ project }: { project: Project }) {
  if (project.packages.length === 0 && !project.pypi) return null;
  return (
    <section className="settle pb-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-title-2 font-light text-foreground">
          Packages.
        </h2>
        <span className="label">
          {project.pypi
            ? "on PyPI"
            : `${project.packages.length} on npm`}
        </span>
      </div>
      <div className="flex flex-col">
        {project.pypi && (
          <a
            href={`https://pypi.org/project/${project.pypi}/`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
          >
            <span className="flex items-baseline gap-2.5">
              <span className="font-mono text-sm text-foreground">
                {project.pypi}
              </span>
              {pypiVersion(project.pypi) && (
                <span className="font-mono text-meta text-muted-foreground">
                  {pypiVersion(project.pypi)}
                </span>
              )}
            </span>
            <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors">
              pypi.org
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        )}
        {project.packages.map((pkg) => (
          <a
            key={pkg}
            href={`https://www.npmjs.com/package/${pkg}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
          >
            <span className="flex items-baseline gap-2.5">
              <span className="font-mono text-sm text-foreground">
                {pkg}
              </span>
              {npmVersion(pkg) && (
                <span className="font-mono text-meta text-muted-foreground">
                  {npmVersion(pkg)}
                </span>
              )}
            </span>
            <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors">
              npmjs.com
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
