import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { REGISTRY_ITEMS } from "@/lib/registry-items";

/** HITL Kit only: the component library, itemized, with the two ways in. */
export function ProjectLibrary() {
  return (
    <section className="pb-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-title-2 font-light text-foreground">
          The component library.
        </h2>
        <span className="label">
          {REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").length}{" "}
          primitives · shadcn registry
        </span>
      </div>
      <p className="mb-8 max-w-2xl text-body text-muted-foreground">
        Every primitive is the physical embodiment of a claim from the
        paper, and each installs individually via the shadcn CLI: copy,
        paste, own. Names below are their registry identifiers.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REGISTRY_ITEMS.filter((i) => i.type === "registry:ui").map(
          (item) => (
            <Link
              key={item.name}
              href="/components"
              className="group flex flex-col gap-2 card card-link settle p-5"
            >
              <h3 className="text-title-3 font-light text-foreground">
                {item.title}
              </h3>
              <p className="text-small text-muted-foreground">
                {item.description}
              </p>
              <span className="mt-auto pt-2 font-mono text-meta text-muted-foreground">
                {item.name}
              </span>
            </Link>
          ),
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/components"
          className="group card card-link settle p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-title-3 font-light text-foreground">
              Live component gallery
            </h3>
            <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </div>
          <p className="mt-2 text-body text-muted-foreground">
            Every primitive rendered live and interactive: states,
            variants, and seed data you can click through.
          </p>
        </Link>
        <Link
          href="/registry"
          className="group card card-link settle p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-title-3 font-light text-foreground">
              Registry &amp; install
            </h3>
            <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </div>
          <p className="mt-2 text-body text-muted-foreground">
            Copy-paste install commands for each primitive, plus the
            accent-token setup your globals.css needs first.
          </p>
        </Link>
      </div>
    </section>
  );
}
