import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PixelHead } from "@/components/site/PixelHead";
import { ACCENT_COLORS, PROJECTS, PROJECT_BADGES, type Project } from "@/lib/projects";
import { SectionHead } from "./SectionHead";

const GROUP_LABEL: Record<Project["group"], string> = {
  measurement: "Measurement",
  tooling: "Tooling",
};

/**
 * The project's pixel glyph, in the foreground like every mark on the site,
 * with one accent pixel lit inside it. The accent is two cells of the same
 * grid, so it reads as part of the icon, not a badge stuck on it.
 */
function Glyph({ p, size }: { p: Project; size: number }) {
  const grid = 18;
  const cell = size / grid;
  // Two cells on a large glyph, three on a small one, so the lit pixel stays legible.
  const cells = size >= 100 ? 2 : 3;
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <PixelHead size={size} grid={grid} gap={0.12} icon={PROJECT_BADGES[p.slug] ?? "spark"} still />
      <span
        aria-hidden
        className="absolute rounded-[1px]"
        style={{
          width: cell * cells * 0.88,
          height: cell * cells * 0.88,
          right: cell * 2.5,
          top: cell * 2.5,
          background: ACCENT_COLORS[p.accent],
          boxShadow: `0 0 ${cell * 3}px ${ACCENT_COLORS[p.accent]}`,
        }}
      />
    </span>
  );
}

function ProjectCard({ p, featured = false }: { p: Project; featured?: boolean }) {
  return (
    <li className={cn("settle", featured && "md:col-span-2")}>
      <Link
        href={`/projects/${p.slug}`}
        className={cn(
          "card-gloss group flex h-full",
          featured ? "flex-col gap-8 p-7 sm:flex-row sm:items-center sm:gap-12 sm:p-9" : "flex-col p-6",
        )}
      >
        <Glyph p={p} size={featured ? 128 : 56} />

        <div className={cn("flex min-w-0 flex-1 flex-col", featured ? "" : "mt-7")}>
          <span className="label">{GROUP_LABEL[p.group]}</span>
          <h3
            className={cn(
              "mt-1.5 tracking-tight text-foreground",
              featured ? "text-[22px] font-medium leading-tight" : "text-[16px] font-medium leading-snug",
            )}
          >
            {p.name}
          </h3>
          <p
            className={cn(
              "mt-2 font-light leading-relaxed text-muted-foreground/80",
              featured ? "max-w-[30rem] text-[15px]" : "text-[13.5px]",
            )}
          >
            {p.oneLiner}
          </p>
          <p className="mt-auto flex items-center gap-2 pt-5 text-[11.5px] text-muted-foreground/55">
            <span className="truncate">{p.status}</span>
            <ArrowUpRight
              aria-hidden
              className="ml-auto size-3.5 shrink-0 text-muted-foreground/50 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            />
          </p>
        </div>
      </Link>
    </li>
  );
}

/**
 * Five projects on black glass: the flagship across the row, the other
 * four in pairs. The glyph is the only colour in the card.
 */
export function ProjectsGrid() {
  const [flagship, ...rest] = PROJECTS;
  return (
    <section id="projects" className="scroll-mt-16 pb-16">
      <SectionHead title="Projects" href="/projects" link="all projects" />
      <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
        {flagship && <ProjectCard p={flagship} featured />}
        {rest.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </ul>
    </section>
  );
}
