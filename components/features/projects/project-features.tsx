import type { Project } from "@/lib/projects";

export function ProjectFeatures({ project }: { project: Project }) {
  return (
    <section className="pb-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-title-2 font-light text-foreground">
          Signature features.
        </h2>
        <span className="label">{project.features.length} features</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {project.features.map((feature) => (
          <div
            key={feature.title}
            className="group relative flex flex-col gap-2 overflow-hidden card card-link settle p-5"
          >
            <h3 className="text-title-3 font-light text-foreground">
              {feature.title}
            </h3>
            <p className="text-small text-muted-foreground">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
