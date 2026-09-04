import { PROJECTS } from "@/lib/projects";
import { ProjectCard } from "@/components/ui/project-card";
import { SectionHead } from "@/components/ui/section-head";

/** Five equal cards on black glass. The glyph, top right of each, is the only colour. */
export function ProjectsGrid() {
  return (
    <section id="projects" className="scroll-mt-16 pb-16">
      <SectionHead title="Projects" href="/projects" link="all projects" />
      <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </ul>
    </section>
  );
}
