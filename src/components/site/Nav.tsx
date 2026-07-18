import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/content";
import { PixelHead } from "@/components/site/PixelHead";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export type NavActive =
  | "projects"
  | "research"
  | "registry"
  | "components";

type ProjectLink = { href: string; name: string; meta: string; dot: string };

const PROJECT_GROUPS: { label: string; links: ProjectLink[] }[] = [
  {
    label: "Human-in-the-loop measurement",
    links: [
      { href: "/projects/hitl-kit", name: "HITL Kit", meta: "15 primitives via shadcn CLI · six packages on npm · v0.6", dot: "var(--accent-violet)" },
      { href: "/projects/eval-kit", name: "eval-kit", meta: "measurement instrument for multi-step agents · v0.3.1", dot: "var(--accent-emerald)" },
      { href: "/projects/tag-kit", name: "tag-kit", meta: "structured tagging primitives · zero runtime deps", dot: "var(--accent-amber)" },
    ],
  },
  {
    label: "Developer tooling",
    links: [
      { href: "/projects/collapse", name: "Collapse", meta: "Claude Code skill-building framework · v0.1.0", dot: "var(--accent-rose)" },
      { href: "/projects/hologram", name: "Hologram", meta: "live observability for Blender → glTF · v0.5.0", dot: "var(--accent-blue)" },
    ],
  },
];

const LINKS: { href: string; key: NavActive; label: string }[] = [
  { href: "/research", key: "research", label: "Research" },
  { href: "/registry", key: "registry", label: "Registry" },
];

const linkClass = (isActive: boolean) =>
  cn(
    "transition-colors",
    isActive ? "text-foreground" : "hover:text-foreground",
  );

export function Nav({ active }: { active?: NavActive }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          {/* The chrome mark: single elongated sparkle, solid, held still */}
          <PixelHead size={22} gap={0.12} icon="sparkmark" still />
          <span className="text-sm font-light tracking-[0.06em] text-foreground">
            {BRAND.name}
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-light tracking-[0.06em] text-muted-foreground">
          {/* Projects — CSS-only dropdown revealed on hover/focus */}
          <div className="group relative">
            <Link
              href="/projects"
              className={cn(
                linkClass(active === "projects"),
                "inline-flex items-center gap-1",
              )}
            >
              Projects
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="card-surface flex flex-col gap-0.5 bg-card/95 p-1.5 backdrop-blur-md">
                {PROJECT_GROUPS.map((group, gi) => (
                  <div key={group.label} className={cn("flex flex-col gap-0.5", gi > 0 && "mt-1 border-t border-border/60 pt-1")}>
                    <span className="px-3 pt-1.5 pb-1 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70">
                      {group.label}
                    </span>
                    {group.links.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        className="flex flex-col gap-0.5 rounded-xl px-3 py-2 transition-colors hover:bg-muted"
                      >
                        <span className="flex items-center gap-2 text-xs font-normal tracking-normal text-foreground">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: p.dot }}
                          />
                          {p.name}
                        </span>
                        <span className="pl-3.5 font-mono text-[10px] tracking-normal text-muted-foreground">
                          {p.meta}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
                <Link
                  href="/projects"
                  className="mt-1 rounded-xl px-3 py-2 text-[11px] tracking-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  All projects →
                </Link>
              </div>
            </div>
          </div>

          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(active === l.key)}>
              {l.label}
            </Link>
          ))}

          <a
            href={BRAND.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub ↗
          </a>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
