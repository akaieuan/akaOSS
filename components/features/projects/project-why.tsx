import type { Project } from "@/lib/projects";

export function ProjectWhy({ project }: { project: Project }) {
  return (
    <section className="settle pb-16">
      <h2 className="mb-6 text-title-2 font-light text-foreground">
        Why it exists.
      </h2>
      <div className="flex max-w-2xl flex-col gap-5">
        {project.why.map((para, i) => (
          <p key={i} className="text-lede text-muted-foreground">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
