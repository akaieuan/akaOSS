import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, ACCENT_COLORS, type Project } from "@/lib/projects";

export function ProjectSiblings({ current }: { current: Project }) {
  const siblings = PROJECTS.filter((p) => p.slug !== current.slug);
  return (
    <section className="pb-24">
      <div className="mb-6 flex items-center gap-4">
        <span className="label">The other projects</span>
        <span
          aria-hidden
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, var(--border) 0%, var(--border) 86%, transparent 100%)",
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {siblings.map((sibling) => (
          <Link
            key={sibling.slug}
            href={`/projects/${sibling.slug}`}
            className="group relative flex flex-col gap-2 overflow-hidden card card-link settle p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: ACCENT_COLORS[sibling.accent] }}
                />
                <span className="font-mono text-sm text-foreground">
                  {sibling.name}
                </span>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </div>
            <p className="text-small text-muted-foreground">
              {sibling.oneLiner}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
