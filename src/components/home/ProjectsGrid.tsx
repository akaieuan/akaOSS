import Link from "next/link";
import { cn } from "@/lib/utils";
import { PixelHead } from "@/components/site/PixelHead";
import { ACCENT_COLORS, PROJECTS, PROJECT_BADGES, type Project } from "@/lib/projects";
import { SectionHead } from "./SectionHead";

const TILE: Record<Project["accent"], string> = {
  violet: "bg-tile-violet",
  amber: "bg-tile-amber",
  blue: "bg-tile-blue",
  emerald: "bg-tile-green",
  rose: "bg-tile-rose",
};

const GROUP_LABEL: Record<Project["group"], string> = {
  measurement: "Measurement",
  tooling: "Tooling",
};

/**
 * A project is its glyph. Each tile is a tinted field with the project's own
 * pixel mark drawn large in the project's accent, a soft glow of the same
 * colour behind it, and nothing else on the surface; the name and what it
 * is sit underneath. The flagship takes the full row, the other four pair
 * up, so five projects fill the grid with no gap.
 */
function ProjectTile({ p, featured = false }: { p: Project; featured?: boolean }) {
  const accent = ACCENT_COLORS[p.accent];
  return (
    <li className={cn("settle", featured && "md:col-span-2")}>
      <Link href={`/projects/${p.slug}`} className="group block">
        <div className={cn("tile", TILE[p.accent], featured ? "aspect-[2.4/1]" : "aspect-[4/3]")}>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(55% 65% at 50% 52%, color-mix(in oklab, ${accent} 22%, transparent), transparent 72%)`,
            }}
          />
          <PixelHead
            size={featured ? 150 : 112}
            grid={18}
            gap={0.14}
            icon={PROJECT_BADGES[p.slug] ?? "spark"}
            color={accent}
            still
            className="relative"
          />
        </div>
        <p className="mt-3 flex items-center gap-2 text-[14px] text-foreground">
          <span className="size-1.5 shrink-0 rounded-full" style={{ background: accent }} aria-hidden />
          {p.name}
        </p>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground/60">
          {GROUP_LABEL[p.group]}
          <span aria-hidden> · </span>
          {p.oneLiner}
        </p>
      </Link>
    </li>
  );
}

export function ProjectsGrid() {
  const [flagship, ...rest] = PROJECTS;
  return (
    <section id="projects" className="scroll-mt-16 pb-16">
      <SectionHead title="Projects" href="/projects" link="all projects" />
      <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-x-5 gap-y-8 p-0 md:grid-cols-2">
        {flagship && <ProjectTile p={flagship} featured />}
        {rest.map((p) => (
          <ProjectTile key={p.slug} p={p} />
        ))}
      </ul>
    </section>
  );
}
