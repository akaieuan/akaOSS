import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PROJECTS, getProject, ACCENT_COLORS } from "@/lib/projects";
import { CopyButton } from "../copy-button";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — ${project.oneLiner}`,
    description: project.oneLiner,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const accent = ACCENT_COLORS[project.accent];
  const siblings = PROJECTS.filter((p) => p.slug !== project.slug);
  const hasPackages = project.packages.length > 0;
  const hasLinks = project.links.length > 0;

  return (
    <>
      <Nav active="projects" />

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="py-20">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/projects"
              className="label transition-colors hover:text-foreground"
            >
              Projects
            </Link>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: accent }}
              />
              {project.name}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl leading-[1.1] font-light tracking-tight text-foreground md:text-5xl">
            {project.oneLiner}
          </h1>

          <p className="mt-6 max-w-2xl font-mono text-[11px] leading-relaxed text-muted-foreground">
            {project.status}
          </p>
        </section>

        {/* Install */}
        <section className="pb-16">
          <p className="label mb-5">Install</p>
          <div className="flex max-w-2xl flex-col gap-4">
            {project.install.map((step) => (
              <div key={step.command} className="flex flex-col gap-2">
                <span className="label">{step.label}</span>
                <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5">
                  <pre className="flex-1 overflow-x-auto font-mono text-[11.5px] text-foreground">
                    <span className="text-muted-foreground">$</span>{" "}
                    {step.command}
                  </pre>
                  <CopyButton text={step.command} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why it exists */}
        <section className="pb-16">
          <h2 className="mb-6 text-2xl font-light tracking-tight text-foreground">
            Why it exists.
          </h2>
          <div className="flex max-w-2xl flex-col gap-5">
            {project.why.map((para, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="pb-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-2xl font-light tracking-tight text-foreground">
              Signature features.
            </h2>
            <span className="label">{project.features.length} features</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature) => (
              <div
                key={feature.title}
                className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card"
              >
                <h3 className="text-lg font-light tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Packages — hidden when the project ships nothing on npm */}
        {hasPackages && (
          <section className="pb-16">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                Packages.
              </h2>
              <span className="label">{project.packages.length} on npm</span>
            </div>
            <div className="flex flex-col">
              {project.packages.map((pkg) => (
                <a
                  key={pkg}
                  href={`https://www.npmjs.com/package/${pkg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
                >
                  <span className="font-mono text-sm text-foreground">
                    {pkg}
                  </span>
                  <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors">
                    npmjs.com
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Deep dives (hitl-kit) + repo */}
        <section className="pb-16">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
            <div>
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                Explore further.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                The source lives on GitHub. Copy, paste, own — no fork, no
                vendor lock-in.
              </p>
            </div>

            <div className="flex flex-col">
              {hasLinks &&
                project.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
                  >
                    <span className="text-lg font-light tracking-tight text-foreground">
                      {link.label}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </Link>
                ))}
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
              >
                <span className="text-lg font-light tracking-tight text-foreground">
                  Repository
                </span>
                <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors">
                  github.com
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Sibling projects */}
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
                className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card"
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
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {sibling.oneLiner}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
