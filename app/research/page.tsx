import type { Metadata } from "next";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { PostGrid } from "@/components/features/research/post-grid";

export const metadata: Metadata = {
  title: "Research · akaOSS",
  description:
    "Every post and the paper: reproducible experiments and essays on measuring AI that works alongside people, scored by humans.",
  alternates: { canonical: "/" },
};

export default function ResearchPage() {
  return (
    <>
      <Nav active="research" />
      <main className="mx-auto max-w-[72rem] px-4 pt-8 pb-18 md:px-6 md:pt-12">
        <PostGrid heading="h1" />
      </main>
      <Footer />
    </>
  );
}
