import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/features/home/hero";
import { ProjectsGrid } from "@/components/features/home/projects-grid";
import { Primitives } from "@/components/features/home/primitives";
import { Thesis } from "@/components/features/home/thesis";
import { LatestFinding } from "@/components/features/home/latest-finding";

/* The landing is a composition of atomic server sections. Interactive
   islands (theme, the mark, the live primitives) live inside the sections
   that need them. */

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-site px-6 md:px-8">
        <Hero />
        <ProjectsGrid />
        <Primitives />
        <Thesis />
        <LatestFinding />
      </main>
      <Footer />
    </>
  );
}
