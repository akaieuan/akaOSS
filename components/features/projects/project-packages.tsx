import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { npmVersion, pypiVersion } from "@/lib/facts";
import type { Project } from "@/lib/projects";
import { ProjectSection } from "./project-section";
import { quiet, quietLink, row, rowArrow, rowName } from "./shared";

function PackageRow({ name, version, href, host }: { name: string; version: string | null; href: string; host: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={row}>
      <span className="flex min-w-0 items-baseline gap-2.5">
        <span className={rowName}>{name}</span>
        {version ? <span className={cn("shrink-0", quiet)}>{version}</span> : null}
      </span>
      <span className={cn("inline-flex shrink-0 items-center gap-1", quiet, quietLink)}>
        {host}
        <ArrowUpRight aria-hidden className={rowArrow} />
      </span>
    </a>
  );
}

/** Hidden when the project ships nothing on npm or PyPI. Versions come from facts.json, never typed here. */
export function ProjectPackages({ project }: { project: Project }) {
  if (project.packages.length === 0 && !project.pypi) return null;
  return (
    <ProjectSection title="Packages" meta={project.pypi ? "on PyPI" : `${project.packages.length} on npm`}>
      <div className="flex flex-col border-b border-border/50">
        {project.pypi ? (
          <PackageRow
            name={project.pypi}
            version={pypiVersion(project.pypi)}
            href={`https://pypi.org/project/${project.pypi}/`}
            host="pypi.org"
          />
        ) : null}
        {project.packages.map((pkg) => (
          <PackageRow
            key={pkg}
            name={pkg}
            version={npmVersion(pkg)}
            href={`https://www.npmjs.com/package/${pkg}`}
            host="npmjs.com"
          />
        ))}
      </div>
    </ProjectSection>
  );
}
