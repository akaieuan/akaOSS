import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/content";
import { PixelHead, type PixelIcon } from "@/components/site/PixelHead";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export type NavActive =
  | "projects"
  | "research"
  | "registry"
  | "components";

type ProjectLink = {
  href: string;
  name: string;
  meta: string;
  icon: PixelIcon;
};

const PROJECT_GROUPS: { label: string; links: ProjectLink[] }[] = [
  {
    label: "Human-in-the-loop measurement",
    links: [
      { href: "/projects/hitl-kit", name: "HITL Kit", meta: "15 primitives via shadcn CLI · six packages on npm · v0.6", icon: "head" },
      { href: "/projects/eval-kit", name: "eval-kit", meta: "measurement instrument for multi-step agents · v0.3.1", icon: "podium" },
      { href: "/projects/tag-kit", name: "tag-kit", meta: "structured tagging primitives · zero runtime deps", icon: "codetag" },
    ],
  },
  {
    label: "Developer tooling",
    links: [
      { href: "/projects/collapse", name: "Collapse", meta: "Claude Code skill-building framework · v0.1.0", icon: "prompt" },
      { href: "/projects/hologram", name: "Hologram", meta: "live observability for Blender → glTF · v0.5.0", icon: "prompt" },
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
          {/* Toolkits — CSS-only dropdown revealed on hover/focus */}
          <div className="group relative">
            <Link
              href="/projects"
              className={cn(
                linkClass(active === "projects"),
                "inline-flex items-center gap-1",
              )}
            >
              Toolkits
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-80 translate-y-1 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {/* Solid surface — no translucency, page text must never bleed through */}
              <div className="flex flex-col gap-0.5 rounded-2xl border border-border bg-popover p-2 shadow-lg">
                {PROJECT_GROUPS.map((group, gi) => (
                  <div
                    key={group.label}
                    className={cn(
                      "flex flex-col gap-0.5",
                      gi > 0 && "mt-1.5 border-t border-border/60 pt-1.5",
                    )}
                  >
                    <span className="px-3 pt-1.5 pb-1 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70">
                      {group.label}
                    </span>
                    {group.links.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                      >
                        <span className="mt-0.5 shrink-0 text-foreground">
                          <PixelHead
                            size={22}
                            grid={18}
                            gap={0.12}
                            icon={p.icon}
                            still
                          />
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-[13px] font-normal tracking-normal text-foreground">
                            {p.name}
                          </span>
                          <span className="font-mono text-[10px] leading-relaxed tracking-normal text-muted-foreground">
                            {p.meta}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
                <Link
                  href="/projects"
                  className="mt-1 rounded-xl px-3 py-2 text-[11px] tracking-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  All toolkits →
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
