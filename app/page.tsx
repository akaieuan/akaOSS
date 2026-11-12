import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { Intro } from "@/components/features/home/intro";
import { PostGrid } from "@/components/features/research/post-grid";

/* The site is its research. One paragraph on why the code is closed, then
   the feed. Both sections are server-rendered; nothing here ships state. */

export default function Home() {
  return (
    <>
      <Nav active="research" />
      <main className="mx-auto flex max-w-[72rem] flex-col gap-10 px-4 pt-8 pb-18 md:gap-12 md:px-6 md:pt-12">
        <Intro />
        <PostGrid />
      </main>
      <Footer />
    </>
  );
}
