import Link from "next/link";
import { BRAND } from "@/lib/content";
import { PixelHead } from "@/components/site/PixelHead";

const footerLink =
  "text-muted-foreground hover:text-foreground text-sm font-light transition-colors";

const COLUMNS: {
  label: string;
  links: { name: string; href: string }[];
}[] = [
  {
    label: "Toolkits",
    links: [
      { name: "HITL Kit", href: "/projects/hitl-kit" },
      { name: "eval-kit", href: "/projects/eval-kit" },
      { name: "tag-kit", href: "/projects/tag-kit" },
      { name: "Collapse", href: "/projects/collapse" },
      { name: "Hologram", href: "/projects/hologram" },
    ],
  },
  {
    label: "Studio",
    links: [
      { name: "Research", href: "/research" },
      { name: "Paper", href: "/paper" },
      { name: "Registry", href: "/registry" },
      { name: "Components", href: "/components" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        {/* Columns: brand block left, link groups right */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-[1fr_auto_auto] sm:gap-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <PixelHead size={20} grid={16} gap={0.12} icon="spark" still />
              <span className="text-sm font-light tracking-[0.06em] text-foreground">
                {BRAND.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Open-source software for human-in-the-loop AI — five toolkits,
              one thesis, a findings feed.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.label} className="flex flex-col gap-2.5">
              <span className="label mb-1">{col.label}</span>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href} className={footerLink}>
                  {l.name}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Bottom row: identity + GitHub */}
        <div className="flex flex-col justify-between gap-3 border-t border-border/40 py-6 sm:flex-row sm:items-baseline">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-light tracking-[0.06em] text-muted-foreground">
              © {new Date().getFullYear()} {BRAND.name}
            </span>
            <span className="text-[11px] whitespace-nowrap italic text-foreground/40">
              {"// Assist-Not-Complete"}
            </span>
          </div>
          <a
            href={BRAND.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-light tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
