import type { Project } from "@/lib/projects";
import { ProjectSection } from "./project-section";
import { prose, quiet } from "./shared";

/** The small-research-paper treatment: numbered, in order, why and how it was built. */
export function ProjectDeepDive({ project }: { project: Project }) {
  if (project.deepDive.length === 0) return null;
  return (
    <ProjectSection title="In depth" meta={`${project.deepDive.length} sections`}>
      <div className="flex flex-col gap-10">
        {project.deepDive.map((section, i) => (
          <div key={section.heading} className="settle">
            <p className={quiet}>{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-[15px] font-medium tracking-tight text-foreground">{section.heading}</h3>
            <div className="mt-2 flex max-w-2xl flex-col gap-3">
              {section.paragraphs.map((para, j) => (
                <p key={j} className={prose}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ProjectSection>
  );
}
