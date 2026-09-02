import type { Project } from "@/lib/projects";

/** The same images the repo README ships, so the site and the repo show one product. */
export function ProjectScreenshots({ project }: { project: Project }) {
  if (!project.screenshots || project.screenshots.length === 0) return null;
  return (
    <section className="pb-16">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-title-2 font-light text-foreground">
          The instrument.
        </h2>
        <span className="label">{project.screenshots.length} views</span>
      </div>
      <div className="flex flex-col gap-10">
        {project.screenshots.map((shot) => (
          <figure key={shot.src} className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/40">
              {/* Unoptimized: these are already-sized PNG captures and
                  the loader would only re-encode them. */}
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 max-w-2xl text-small text-muted-foreground">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
