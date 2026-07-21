import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { ProjectsGrid } from "@/components/home/ProjectsGrid";
import { Thesis } from "@/components/home/Thesis";
import { LatestFinding } from "@/components/home/LatestFinding";

/* The landing is a composition of atomic server sections — no client
   JavaScript at this level. Interactive islands (theme, canvas mark) live
   inside the sections that need them. */

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 md:px-8">
        <Hero />
        <ProjectsGrid />
        <Thesis />
        <LatestFinding />
      </main>
      <Footer />
    </>
  );
}
