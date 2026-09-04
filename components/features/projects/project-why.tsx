import type { Project } from "@/lib/projects";
import { ProjectSection } from "./project-section";
import { prose } from "./shared";

export function ProjectWhy({ project }: { project: Project }) {
  return (
    <ProjectSection title="Why it exists">
      <div className="flex max-w-2xl flex-col gap-4">
        {project.why.map((para, i) => (
          <p key={i} className={prose}>
            {para}
          </p>
        ))}
      </div>
    </ProjectSection>
  );
}
