import type { Project } from "@/lib/projects";
import { ProjectSection } from "./project-section";

export function ProjectFeatures({ project }: { project: Project }) {
  return (
    <ProjectSection title="Signature features" meta={`${project.features.length} features`}>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {project.features.map((feature) => (
          <li key={feature.title} className="card-gloss settle flex flex-col p-6">
            <h3 className="text-[15px] font-medium leading-snug tracking-tight text-foreground">{feature.title}</h3>
            <p className="mt-1.5 text-[12.5px] font-light leading-relaxed text-muted-foreground/70">{feature.body}</p>
          </li>
        ))}
      </ul>
    </ProjectSection>
  );
}
