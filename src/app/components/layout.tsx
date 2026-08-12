import type { Metadata } from "next";
import Link from "next/link";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { LibraryNav } from "./_components/LibraryNav";

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

      <div className="mx-auto flex max-w-5xl gap-12 px-6 pt-10 md:px-8">
        {/* Sticky rail on large screens. */}
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
          <p className="label mb-4">Library</p>
          <LibraryNav variant="rail" />
          <Link
            href="/projects/hitl-kit"
            className="mt-6 flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
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
