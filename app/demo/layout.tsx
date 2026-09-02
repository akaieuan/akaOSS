import type { Metadata } from "next";
import Link from "next/link";

import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { DemoNav } from "@/components/features/style/style-nav";

export const metadata: Metadata = {
  title: "Brand system · akaOSS",
  description:
    "The akaOSS brand catalogue: the PixelHead mark and every knockout it draws, the small site primitives, and the token palette.",
  // Internal catalogue, reachable by URL and nothing else. It is absent from
  // the nav and from the sitemap, so keep it out of the index too.
  robots: { index: false, follow: false },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* No `active` key: /demo is not one of the nav's destinations, and
          nothing in the bar should light up for it. */}
      <Nav />

      <div className="mx-auto flex max-w-5xl gap-12 px-6 pt-10 md:px-8">
        {/* Sticky rail on large screens. */}
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
          <p className="label mb-4">Brand</p>
          <DemoNav variant="rail" />
          <Link
            href="/components"
            className="mt-6 flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span> Product primitives
          </Link>
        </aside>

        <main className="min-w-0 flex-1 pb-24">
          {/* Same navigation, scrollable strip, below lg. */}
          <div className="lg:hidden">
            <DemoNav variant="bar" />
          </div>
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}
