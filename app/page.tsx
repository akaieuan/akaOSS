import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/home/Hero";
import { ProjectsGrid } from "@/components/home/ProjectsGrid";
import { Primitives } from "@/components/home/Primitives";
import { Thesis } from "@/components/home/Thesis";
import { LatestFinding } from "@/components/home/LatestFinding";

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
