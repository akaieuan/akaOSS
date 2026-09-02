import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
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
      { href: "/components", name: "HITL Kit", meta: "20 primitives, live · npm or the shadcn CLI", icon: "head" },
      { href: "/projects/eval-kit", name: "eval-kit", meta: "scores whether the agent respects human authority", icon: "podium" },
      { href: "/projects/tag-kit", name: "tag-kit", meta: "structured tagging primitives · zero runtime deps", icon: "codetag" },
    ],
  },
  {
    label: "Developer tooling",
    links: [
      { href: "/projects/collapse", name: "Collapse", meta: "skills + MCP tools from your lessons", icon: "prompt" },
      { href: "/projects/hologram", name: "Hologram", meta: "Blender → glTF observability · on PyPI", icon: "prompt" },
    ],
  },
];

const LINKS: { href: string; key: NavActive; label: string }[] = [
  { href: "/components", key: "components", label: "Components" },
  { href: "/registry", key: "registry", label: "Registry" },
  { href: "/research", key: "research", label: "Research" },
];

const linkClass = (isActive: boolean) =>
  cn(
    "transition-colors",
    isActive ? "text-foreground" : "hover:text-foreground",
  );

export function Nav({ active }: { active?: NavActive }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {/* The chrome mark: the human in the loop, held still */}
          <PixelHead size={22} grid={16} gap={0.12} icon="head" still />
          {/* Nothing in this bar can shrink. The wordmark is the one element
              the mark beside it already stands in for, so below 375px it is
              what gives way. */}
          <span className="hidden text-[14px] text-foreground min-[375px]:inline">
            <span className="font-medium">aka</span>
            <span className="font-light">OSS</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-[12.5px] text-muted-foreground/70 sm:gap-5 md:gap-6 md:text-[13px]">
          {/* Toolkits, CSS-only dropdown revealed on hover/focus */}
          <div className="group relative">
            <Link
              href="/projects"
              className={cn(
                linkClass(active === "projects"),
                "inline-flex items-center gap-1",
              )}
            >
              Toolkits
              <ChevronDown className="hidden h-3 w-3 opacity-60 md:block" />
            </Link>
            {/* The dropdown is a hover affordance, desktop only. On touch,
                Toolkits is a plain link straight to /projects. */}
            <div className="invisible absolute left-0 top-full z-50 hidden w-80 translate-y-1 pt-3 opacity-0 transition-[opacity,translate,visibility] duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 md:block">
              {/* Solid surface. No translucency, page text must never bleed through */}
              <div className="flex flex-col gap-0.5 rounded-2xl border border-border bg-popover p-2 shadow-lg">
                {PROJECT_GROUPS.map((group, gi) => (
                  <div
                    key={group.label}
                    className={cn(
                      "flex flex-col gap-0.5",
                      gi > 0 && "mt-1.5 border-t border-border/60 pt-1.5",
                    )}
                  >
                    <span className="label px-3 pt-1.5 pb-1">
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
                          <span className="text-[13px] text-foreground">
                            {p.name}
                          </span>
                          <span className="text-[11.5px] text-muted-foreground/70">
                            {p.meta}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
                <Link
                  href="/projects"
                  className="mt-1 rounded-xl px-3 py-2 text-[12px] text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
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

          {/* Footer carries GitHub on small screens. The bar stays breathable */}
          <a
            href={BRAND.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            GitHub ↗
          </a>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
