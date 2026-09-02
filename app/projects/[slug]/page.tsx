import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PROJECTS, getProject, ACCENT_COLORS, PROJECT_BADGES } from "@/lib/projects";
import { PixelHead } from "@/components/site/PixelHead";
import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { npmVersion, pypiVersion } from "@/lib/facts";
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
    title: `${project.name}, ${project.oneLiner}`,
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
  const hasPackages = project.packages.length > 0 || Boolean(project.pypi);
  const hasLinks = project.links.length > 0;

  return (
    <>
      <Nav active="projects" />

      <main className="mx-auto max-w-5xl px-6 md:px-8">
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
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-meta text-muted-foreground">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: accent }}
              />
              {project.name}
            </span>
          </div>

          {/* The project's own mark, at hero scale. The canvas is aria-hidden,
              so the heading beside it carries the accessible name. */}
          <div className="flex items-start gap-5">
            <span aria-hidden className="mt-1 shrink-0">
              <PixelHead
                size={56}
                grid={18}
                gap={0.12}
                icon={PROJECT_BADGES[project.slug] ?? "spark"}
                once
              />
            </span>
            <h1 className="max-w-2xl text-title-1 font-light text-foreground">
              {project.oneLiner}
            </h1>
          </div>

          <p className="mt-6 max-w-2xl font-mono text-meta text-muted-foreground">
            {project.status}
          </p>
        </section>

        {/* Install */}
        <section className="settle pb-16">
          <p className="label mb-5">Install</p>
          <div className="flex max-w-2xl flex-col gap-4">
            {project.install.map((step) => (
              <div key={step.command} className="flex flex-col gap-2">
                <span className="label">{step.label}</span>
                <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5">
                  <pre className="flex-1 overflow-x-auto font-mono text-xs text-foreground">
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

        {/* Screenshots. The same images the repo README ships, so the site
            and the repo show one product rather than two. */}
        {project.screenshots && project.screenshots.length > 0 && (
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
        )}

        {/* Deep dive. The small-research-paper treatment */}
        {project.deepDive.length > 0 && (
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
        )}

        {/* Features */}
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

        {/* HITL Kit only: the component library, itemized */}
        {project.slug === "hitl-kit" && (
          <section className="pb-16">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-title-2 font-light text-foreground">
                The component library.
              </h2>
              <span className="label">
                {REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").length}{" "}
                primitives · shadcn registry
              </span>
            </div>
            <p className="mb-8 max-w-2xl text-body text-muted-foreground">
              Every primitive is the physical embodiment of a claim from the
              paper, and each installs individually via the shadcn CLI: copy,
              paste, own. Names below are their registry identifiers.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").map(
                (item) => (
                  <Link
                    key={item.name}
                    href="/components"
                    className="group flex flex-col gap-2 card card-link settle p-5"
                  >
                    <h3 className="text-title-3 font-light text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-small text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-auto pt-2 font-mono text-meta text-muted-foreground">
                      {item.name}
                    </span>
                  </Link>
                ),
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/components"
                className="group card card-link settle p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-title-3 font-light text-foreground">
                    Live component gallery
                  </h3>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-2 text-body text-muted-foreground">
                  Every primitive rendered live and interactive: states,
                  variants, and seed data you can click through.
                </p>
              </Link>
              <Link
                href="/registry"
                className="group card card-link settle p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-title-3 font-light text-foreground">
                    Registry &amp; install
                  </h3>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-2 text-body text-muted-foreground">
                  Copy-paste install commands for each primitive, plus the
                  accent-token setup your globals.css needs first.
                </p>
              </Link>
            </div>
          </section>
        )}

        {/* Packages, hidden when the project ships nothing on npm */}
        {hasPackages && (
          <section className="settle pb-16">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-title-2 font-light text-foreground">
                Packages.
              </h2>
              <span className="label">
                {project.pypi
                  ? "on PyPI"
                  : `${project.packages.length} on npm`}
              </span>
            </div>
            <div className="flex flex-col">
              {project.pypi && (
                <a
                  href={`https://pypi.org/project/${project.pypi}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
                >
                  <span className="flex items-baseline gap-2.5">
                    <span className="font-mono text-sm text-foreground">
                      {project.pypi}
                    </span>
                    {pypiVersion(project.pypi) && (
                      <span className="font-mono text-meta text-muted-foreground">
                        {pypiVersion(project.pypi)}
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors">
                    pypi.org
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              )}
              {project.packages.map((pkg) => (
                <a
                  key={pkg}
                  href={`https://www.npmjs.com/package/${pkg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 border-t border-border/60 py-4"
                >
                  <span className="flex items-baseline gap-2.5">
                    <span className="font-mono text-sm text-foreground">
                      {pkg}
                    </span>
                    {npmVersion(pkg) && (
                      <span className="font-mono text-meta text-muted-foreground">
                        {npmVersion(pkg)}
                      </span>
                    )}
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
        <section className="settle pb-16">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
            <div>
              <h2 className="text-title-2 font-light text-foreground">
                Explore further.
              </h2>
              <p className="mt-4 max-w-md text-body text-muted-foreground">
                The source lives on GitHub. Copy, paste, own. No fork, no
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
                    <span className="text-title-3 font-light text-foreground">
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
                <span className="text-title-3 font-light text-foreground">
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
      </main>

      <Footer />
    </>
  );
}
