import type { Metadata } from "next";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { ProjectCard } from "@/components/ui/project-card";
import { PROJECTS, type ProjectGroup } from "@/lib/projects";
import { ProjectSection } from "@/components/features/projects/project-section";

export const metadata: Metadata = {
  title: "Projects · akaOSS",
  description:
    "Five open-source projects. A human-in-the-loop measurement family and a pair of developer tools. Each ships independently.",
};

const GROUPS: { key: ProjectGroup; title: string; lede: string }[] = [
  {
    key: "measurement",
    title: "Human-in-the-loop measurement",
    lede: "Three projects, one loop: HITL Kit renders the gate, eval-kit measures it, tag-kit calibrates the humans doing the measuring.",
  },
  {
    key: "tooling",
    title: "Developer tooling",
    lede: "Separate work, same standards. These serve the building of software, not the measurement thesis.",
  },
];

export default function ProjectsIndexPage() {
  const measurement = PROJECTS.filter((p) => p.group === "measurement").length;
  const tooling = PROJECTS.length - measurement;
  return (
    <>
      <Nav active="projects" />
      <main className="mx-auto max-w-site px-6 md:px-8">
        <header className="pt-16 pb-12">
          <h1 className="text-[22px] font-light leading-snug tracking-tight text-foreground sm:text-[24px]">
            Five projects. One studio.
          </h1>
          <p className="mt-3 max-w-2xl text-[13.5px] font-light leading-relaxed text-muted-foreground/80">
            A human-in-the-loop measurement family and a pair of developer tools. Each ships independently, and
            each repo carries its own verification story.
          </p>
          <p className="mt-3 text-[12.5px] text-muted-foreground/60">
            {PROJECTS.length} projects · {measurement} measurement · {tooling} tooling
          </p>
        </header>

        {GROUPS.map((group, i) => {
          const items = PROJECTS.filter((p) => p.group === group.key);
          if (items.length === 0) return null;
          return (
            <ProjectSection
              key={group.key}
              title={group.title}
              meta={`${items.length} projects`}
              className={i === GROUPS.length - 1 ? "pb-24" : undefined}
            >
              <p className="max-w-2xl text-[13.5px] font-light leading-relaxed text-muted-foreground/80">{group.lede}</p>
              <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <ProjectCard key={p.slug} p={p} />
                ))}
              </ul>
            </ProjectSection>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
