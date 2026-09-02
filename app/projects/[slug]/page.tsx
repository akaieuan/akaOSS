import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { PROJECTS, getProject } from "@/lib/projects";
import { ProjectHero } from "@/components/features/projects/project-hero";
import { ProjectInstall } from "@/components/features/projects/project-install";
import { ProjectWhy } from "@/components/features/projects/project-why";
import { ProjectScreenshots } from "@/components/features/projects/project-screenshots";
import { ProjectDeepDive } from "@/components/features/projects/project-deep-dive";
import { ProjectFeatures } from "@/components/features/projects/project-features";
import { ProjectLibrary } from "@/components/features/projects/project-library";
import { ProjectPackages } from "@/components/features/projects/project-packages";
import { ProjectLinks } from "@/components/features/projects/project-links";
import { ProjectSiblings } from "@/components/features/projects/project-siblings";

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

  return (
    <>
      <Nav active="projects" />
      <main className="mx-auto max-w-5xl px-6 md:px-8">
        <ProjectHero project={project} />
        <ProjectInstall project={project} />
        <ProjectWhy project={project} />
        <ProjectScreenshots project={project} />
        <ProjectDeepDive project={project} />
        <ProjectFeatures project={project} />
        {project.slug === "hitl-kit" && <ProjectLibrary />}
        <ProjectPackages project={project} />
        <ProjectLinks project={project} />
        <ProjectSiblings current={project} />
      </main>
      <Footer />
    </>
  );
}
