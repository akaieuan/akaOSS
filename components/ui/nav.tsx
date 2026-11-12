import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_MARK_SEED } from "@/lib/pixel-tile";
import { PixelTile } from "@/components/brand/pixel-tile";
import { ThemeToggle } from "./theme-toggle";

/* The header is one floating glass pill: the mark, two links, the theme
   switch. It is the only surface in the chrome with a border. The older
   section keys stay in the type so pages outside the research feed still
   compile; none of them has a link here. */

export type NavActive =
  | "research"
  | "paper"
  | "projects"
  | "registry"
  | "components";

const LINKS: { href: string; key: NavActive; label: string }[] = [
  { href: "/", key: "research", label: "Research" },
  { href: "/paper", key: "paper", label: "Paper" },
];

export function Nav({ active }: { active?: NavActive }) {
  return (
    <header className="sticky top-0 z-40 h-[72px] px-4 pt-3 md:px-6">
      <div className="mx-auto flex h-12 w-full max-w-[640px] items-center gap-1 rounded-full border border-foreground/10 bg-white/55 pr-1.5 pl-2 shadow-[0_8px_40px_oklch(0.52_0.19_259/8%)] backdrop-blur-[14px] dark:bg-white/[0.035] dark:shadow-[0_0_64px_oklch(0.68_0.15_259/9%)]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 pl-1.5 text-[15px] tracking-[0.02em] text-foreground"
        >
          <PixelTile seed={SITE_MARK_SEED} size={24} />
          <span>
            <span className="font-medium">aka</span>
            <span className="font-light">OSS</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active === l.key ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center px-2.5 text-[13px] transition-colors hover:text-foreground",
                active === l.key ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle className="size-9" />
        </nav>
      </div>
    </header>
  );
}
