import type { Project } from "@/lib/projects";

/** The small-research-paper treatment. */
export function ProjectDeepDive({ project }: { project: Project }) {
  if (project.deepDive.length === 0) return null;
  return (
    <section className="pb-16">
      <div className="flex flex-col gap-12">
        {project.deepDive.map((section, i) => (
          <div key={section.heading} className="settle">
            <p className="label mb-3">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mb-5 text-title-2 font-light text-foreground">
              {section.heading}
            </h3>
            <div className="flex max-w-2xl flex-col gap-4">
              {section.paragraphs.map((para, j) => (
                <p
                  key={j}
                  className="text-body text-muted-foreground"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
