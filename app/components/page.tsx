import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { SectionHead } from "@/components/ui/section-head";
import { LibraryHeader } from "@/components/features/library/catalogue";
import { LegacyAnchorRedirect } from "@/components/features/library/legacy-anchor-redirect";
import { LIBRARY_GROUPS, LIBRARY_SPECIMEN_COUNT } from "@/lib/library";

const UI_COUNT = REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").length;

export default function ComponentsOverview() {
  return (
    <>
      {/* Old /components#<id> links land here; this forwards them. */}
      <LegacyAnchorRedirect />

      <LibraryHeader
        title="The primitive library."
        lede="Every primitive is the physical embodiment of a claim from the paper, and every specimen imports the shipped component, so the catalogue cannot drift from what the registry ships. Interactive, shadcn-compatible, copy-paste ready."
        meta={`${UI_COUNT} primitives · ${LIBRARY_SPECIMEN_COUNT} specimen sections · MIT`}
      />

      {/* Five equal cards on black glass, one per group: the tour. */}
      <section aria-label="Groups" className="pb-14">
        <SectionHead title="Groups" as="h2" />
        <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {LIBRARY_GROUPS.map((group) => (
            <li key={group.slug} className="settle">
              <Link href={`/components/${group.slug}`} className="card-gloss group flex h-full flex-col p-7">
                <div className="flex items-center justify-between gap-5">
                  <h3 className="min-w-0 text-[17px] font-medium leading-snug tracking-tight text-foreground">
                    {group.title}
                  </h3>
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 shrink-0 text-muted-foreground/50 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </div>
                <p className="mt-3 text-[13.5px] font-light leading-relaxed text-muted-foreground/80">
                  {group.blurb}
                </p>
                {/* Naming every specimen here is deliberate: it is what a visitor
                    following a stale anchor without JavaScript reads instead. */}
                <p className="mt-auto pt-7 text-[11.5px] leading-relaxed text-muted-foreground/55">
                  {group.specimens.map((s) => s.title).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Every primitive, one click: the destination for anyone who already
          knows what they want. */}
      <section aria-label="Primitives" className="pb-14">
        <SectionHead title="Primitives" as="h2" href="/registry" link="registry & install" />
        <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
          {LIBRARY_GROUPS.flatMap((group) =>
            group.specimens.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/components/${group.slug}#${s.id}`}
                  className="inline-flex items-center rounded-full border border-border/60 px-3 py-1.5 text-[12.5px] text-muted-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  {s.title}
                </Link>
              </li>
            )),
          )}
        </ul>
      </section>

      <section aria-label="Installing" className="pb-4">
        <SectionHead title="Installing" as="h2" />
        <p className="mt-3 max-w-2xl text-[13.5px] font-light leading-relaxed text-muted-foreground/80">
          Each primitive installs on its own through the shadcn CLI. No fork, no wrapper SDK. The{" "}
          <Link
            href="/registry"
            className="text-foreground underline decoration-border underline-offset-[3px] transition-colors hover:decoration-foreground"
          >
            registry page
          </Link>{" "}
          carries the exact command and dependency chain for every item.
        </p>
      </section>
    </>
  );
}
