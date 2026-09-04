import type { Project } from "@/lib/projects";
import { ProjectSection } from "./project-section";
import { quiet } from "./shared";

/** The same images the repo README ships, so the site and the repo show one product. */
export function ProjectScreenshots({ project }: { project: Project }) {
  if (!project.screenshots || project.screenshots.length === 0) return null;
  return (
    <ProjectSection title="The instrument" meta={`${project.screenshots.length} views`}>
      <div className="flex flex-col gap-8">
        {project.screenshots.map((shot) => (
          <figure key={shot.src} className="min-w-0 settle">
            <div className="card-gloss p-2">
              {/* Unoptimized: these are already-sized PNG captures and
                  the loader would only re-encode them. */}
              <img src={shot.src} alt={shot.alt} loading="lazy" className="block h-auto w-full rounded-[12px]" />
            </div>
            <figcaption className={`mt-3 max-w-2xl ${quiet}`}>{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
    </ProjectSection>
  );
}
