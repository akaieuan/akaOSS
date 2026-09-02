import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { DemoHeader } from "./_components/demo-ui";
import { DEMO_SECTIONS } from "@/lib/style";

export default function DemoOverview() {
  return (
    <>
      <DemoHeader
        title="The brand system."
        lede={
          <>
            The other catalogue. <Link
              href="/components"
              className="text-foreground underline decoration-border underline-offset-[3px] transition-colors hover:decoration-foreground"
            >
              /components
            </Link>{" "}
            holds the HITL primitives the registry ships; this holds the things
            the site itself is made of: the animated mark, the small helpers
            around it, and the tokens underneath. Every specimen renders the
            real component or reads the real stylesheet, so the catalogue
            cannot drift from what the site actually does.
          </>
        }
        meta={`${DEMO_SECTIONS.length} sections · not in the nav, not in the sitemap`}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {DEMO_SECTIONS.map((section) => (
          <Link
            key={section.slug}
            href={`/demo/${section.slug}`}
            className="group card card-link settle flex flex-col gap-2 p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-title-3 font-light text-foreground">
                {section.title}
              </h2>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 self-center text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </div>
            <p className="text-small text-muted-foreground">
              {section.blurb}
            </p>
            <p className="mt-auto pt-3 font-mono text-meta text-muted-foreground">
              {section.contents.join(" · ")}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12 border-t border-border/60 pt-8">
        <p className="label">Why it is unlisted</p>
        <p className="mt-3 max-w-2xl text-body text-muted-foreground">
          Nothing here is secret. It is simply not a destination. The brand
          catalogue is a working surface for whoever is changing the mark or
          the palette, and putting it in the nav would imply the site has four
          top-level ideas when it has three. It is absent from the nav, absent
          from the sitemap, and marked <code className="font-mono text-[0.875em] text-foreground">noindex</code>.
        </p>
      </section>
    </>
  );
}
