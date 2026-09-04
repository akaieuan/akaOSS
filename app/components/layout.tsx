import type { Metadata } from "next";
import Link from "next/link";

import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { LibraryNav } from "@/components/features/library/library-nav";

export const metadata: Metadata = {
  title: "Component library · HITL Kit · akaOSS",
  description:
    "The HITL Kit primitive library, live. Decision surfaces, agent state, evidence, composed panels, and the AI-generation scales. Every specimen is the shipped component, not a reimplementation.",
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav active="components" />

      <div className="mx-auto flex max-w-site gap-12 px-6 pt-10 md:px-8">
        {/* Sticky rail on large screens. */}
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
          <p className="mb-3 text-[15px] font-medium tracking-tight text-foreground">Library</p>
          <LibraryNav variant="rail" />
          <Link
            href="/projects/hitl-kit"
            className="mt-6 flex items-center gap-1.5 border-t border-border/50 pt-4 text-[12.5px] text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span> Back to HITL Kit
          </Link>
        </aside>

        <main className="min-w-0 flex-1 pb-24">
          {/* Same navigation, scrollable strip, below lg. */}
          <div className="lg:hidden">
            <LibraryNav variant="bar" />
          </div>
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}
