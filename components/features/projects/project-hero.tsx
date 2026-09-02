import Link from "next/link";
import { PixelHead } from "@/components/brand/pixel-head";
import { ACCENT_COLORS, PROJECT_BADGES, type Project } from "@/lib/projects";

/** Breadcrumb, the project's own mark at hero scale, the one-liner, the status line. */
export function ProjectHero({ project }: { project: Project }) {
  const accent = ACCENT_COLORS[project.accent];
  return (
    <section className="py-20">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/projects" className="label transition-colors hover:text-foreground">
          Projects
        </Link>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-meta text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {project.name}
        </span>
      </div>

      {/* The canvas is aria-hidden, so the heading beside it carries the accessible name. */}
      <div className="flex items-start gap-5">
        <span aria-hidden className="mt-1 shrink-0">
          <PixelHead size={56} grid={18} gap={0.12} icon={PROJECT_BADGES[project.slug] ?? "spark"} once />
        </span>
        <h1 className="max-w-2xl text-title-1 font-light text-foreground">{project.oneLiner}</h1>
      </div>

      <p className="mt-6 max-w-2xl font-mono text-meta text-muted-foreground">{project.status}</p>
    </section>
  );
}
