import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { REGISTRY_ITEMS } from "@/lib/registry-items";
import { ProjectSection } from "./project-section";
import { prose, quiet } from "./shared";

const UI_ITEMS = REGISTRY_ITEMS.filter((i) => i.type === "registry:ui");

const WAYS_IN = [
  {
    href: "/components",
    title: "Live component gallery",
    body: "Every primitive rendered live and interactive: states, variants, and seed data you can click through.",
  },
  {
    href: "/registry",
    title: "Registry and install",
    body: "Copy-paste install commands for each primitive, plus the accent-token setup your globals.css needs first.",
  },
];

/** HITL Kit only: the component library, itemized, with the two ways in. */
export function ProjectLibrary() {
  return (
    <ProjectSection
      title="The component library"
      href="/components"
      link="see them live"
      meta={`${UI_ITEMS.length} primitives · shadcn registry`}
    >
      <p className={`max-w-2xl ${prose}`}>
        Every primitive is the physical embodiment of a claim from the paper, and each installs on its own through
        the shadcn CLI: copy, paste, own. The quiet line under each is its registry identifier.
      </p>

      <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {UI_ITEMS.map((item) => (
          <li key={item.name} className="settle">
            <Link href="/components" className="card-gloss group flex h-full flex-col p-6">
              <h3 className="text-[15px] font-medium leading-snug tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-[12.5px] font-light leading-relaxed text-muted-foreground/70">{item.description}</p>
              <span className={`mt-auto pt-4 ${quiet}`}>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {WAYS_IN.map((way) => (
          <li key={way.href} className="settle">
            <Link href={way.href} className="card-gloss group flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[15px] font-medium leading-snug tracking-tight text-foreground">{way.title}</h3>
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 shrink-0 text-muted-foreground/50 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </div>
              <p className="mt-1.5 text-[12.5px] font-light leading-relaxed text-muted-foreground/70">{way.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ProjectSection>
  );
}
