import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PROJECTS, ACCENT_COLORS, type ProjectGroup } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — akaOSS",
  description:
    "Five open-source projects. A human-in-the-loop measurement family and a pair of developer tools — each ships independently.",
};

const GROUPS: { key: ProjectGroup; label: string }[] = [
  { key: "measurement", label: "Human-in-the-loop measurement" },
  { key: "tooling", label: "Developer tooling" },
];

export default function ProjectsIndexPage() {
  return (
    <>
      <Nav active="projects" />

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="py-20">
          <p className="label mb-5">Open-source studio</p>
          <h1 className="max-w-2xl text-4xl leading-[1.1] font-light tracking-tight text-foreground md:text-5xl">
            Five projects. One studio.
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            A human-in-the-loop measurement family and a pair of developer
            tools — each ships independently.
          </p>
        </section>

        {/* Grouped project lists */}
        {GROUPS.map((group) => {
          const items = PROJECTS.filter((p) => p.group === group.key);
          if (items.length === 0) return null;
          return (
            <section key={group.key} className="pb-16">
              <div className="mb-6 flex items-center gap-4">
                <span className="label">{group.label}</span>
                <span
                  aria-hidden
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--border) 0%, var(--border) 86%, transparent 100%)",
                  }}
                />
                <span className="label">{items.length}</span>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {items.map((project) => {
                  const accent = ACCENT_COLORS[project.accent];
                  return (
                    <Link
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card"
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: accent }}
                        />
                        <span className="font-mono text-sm tracking-tight text-foreground">
                          {project.name}
                        </span>
                      </div>

                      <p className="mb-2.5 text-lg font-light leading-snug tracking-tight text-foreground">
                        {project.oneLiner}
                      </p>

                      <p className="mb-5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                        {project.why[1] ?? project.why[0]}
                      </p>

                      {project.packages.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-1.5">
                          {project.packages.slice(0, 3).map((pkg) => (
                            <span
                              key={pkg}
                              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                            >
                              {pkg}
                            </span>
                          ))}
                          {project.packages.length > 3 && (
                            <span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
                              +{project.packages.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/60 pt-4">
                        <code className="min-w-0 truncate font-mono text-[11px] text-muted-foreground">
                          {project.install[0].command}
                        </code>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="pb-8" />
      </main>

      <Footer />
    </>
  );
}
