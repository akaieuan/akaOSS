import { CopyButton } from "@/components/ui/copy-button";
import type { Project } from "@/lib/projects";
import { ProjectSection } from "./project-section";
import { quiet } from "./shared";

/** One glossy well per command, the label above it, the copy button beside it. */
export function ProjectInstall({ project }: { project: Project }) {
  return (
    <ProjectSection title="Install">
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
        {project.install.map((step) => (
          <li key={step.command} className="card-gloss flex min-w-0 flex-col gap-3 p-5">
            <span className={quiet}>{step.label}</span>
            <div className="flex items-center gap-2">
              <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-[12.5px] text-foreground">
                <span className="text-muted-foreground/50">$</span> {step.command}
              </pre>
              <CopyButton text={step.command} />
            </div>
          </li>
        ))}
      </ul>
    </ProjectSection>
  );
}
