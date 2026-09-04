import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectCard } from "@/components/ui/project-card";
import { ProjectSection } from "./project-section";

export function ProjectSiblings({ current }: { current: Project }) {
  const siblings = PROJECTS.filter((p) => p.slug !== current.slug);
  return (
    <ProjectSection title="The other projects" href="/projects" link="all projects" className="pb-24">
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {siblings.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </ul>
    </ProjectSection>
  );
}
