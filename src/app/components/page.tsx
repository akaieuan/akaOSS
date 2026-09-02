import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { LibraryHeader } from "./_components/demo-ui";
import { LegacyAnchorRedirect } from "./_components/LegacyAnchorRedirect";
import {
  LIBRARY_GROUPS,
  LIBRARY_SPECIMEN_COUNT,
} from "./_components/sections";

const UI_COUNT = REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").length;

export default function ComponentsOverview() {
  return (
    <>
      {/* Old /components#<id> links land here; this forwards them. */}
      <LegacyAnchorRedirect />

      <LibraryHeader
        title="The primitive library."
        lede={
          <>
            Every primitive here is the physical embodiment of a claim from the
            paper. Every specimen imports the real component. Nothing on these
            pages is reimplemented, so the catalogue cannot drift from what the
            registry actually ships. Interactive, shadcn-compatible,
            copy-paste ready.
          </>
        }
        meta={`${UI_COUNT} primitives · ${LIBRARY_SPECIMEN_COUNT} specimen sections · MIT`}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {LIBRARY_GROUPS.map((group) => (
          <Link
            key={group.slug}
            href={`/components/${group.slug}`}
            className="group card card-link settle flex flex-col gap-2 p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-title-3 font-light text-foreground">
                {group.title}
              </h2>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 self-center text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </div>
            <p className="text-small text-muted-foreground">
              {group.blurb}
            </p>
            {/* Naming every specimen here is deliberate: it is what a visitor
                following a stale anchor without JavaScript reads instead. */}
            <p className="mt-auto pt-3 font-mono text-meta text-muted-foreground">
              {group.specimens.map((s) => s.title).join(" · ")}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12 border-t border-border/60 pt-8">
        <p className="label">Installing</p>
        <p className="mt-3 max-w-2xl text-body text-muted-foreground">
          Each primitive installs on its own through the shadcn CLI. No fork,
          no wrapper SDK. The{" "}
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
