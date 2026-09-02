import Link from "next/link";
import { BRAND } from "@/lib/site";
import { PixelHead } from "@/components/brand/pixel-head";

const footerLink =
  "text-[12.5px] text-muted-foreground/70 transition-colors hover:text-foreground";

const COLUMNS: {
  label: string;
  links: { name: string; href: string; external?: boolean }[];
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
      { name: "Components", href: "/components" },
      { name: "Registry", href: "/registry" },
      { name: "Paper", href: "/paper" },
      { name: "Research", href: "/research" },
    ],
  },
  {
    label: "Elsewhere",
    links: [
      { name: "GitHub", href: BRAND.github, external: true },
      { name: "akaBuild", href: "https://akabuild.dev", external: true },
      { name: "X", href: BRAND.twitter, external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/60">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-[1fr_auto] sm:gap-16">
          <div className="max-w-[18rem]">
            <div className="flex items-center gap-2.5">
              <PixelHead size={20} grid={16} gap={0.12} icon="head" still />
              <span className="text-[14px] text-foreground">
                <span className="font-medium">aka</span>
                <span className="font-light">OSS</span>
              </span>
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground/70">
              Open-source tools for human-in-the-loop AI: five toolkits, one
              thesis, a findings feed. By {BRAND.author}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-14">
            {COLUMNS.map((col) => (
              <nav key={col.label} aria-label={col.label} className="flex flex-col gap-2.5">
                <span className="label mb-1">{col.label}</span>
                {col.links.map((l) =>
                  l.external ? (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLink}
                    >
                      {l.name}
                    </a>
                  ) : (
                    <Link key={l.href} href={l.href} className={footerLink}>
                      {l.name}
                    </Link>
                  ),
                )}
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-border/40 py-6 sm:flex-row sm:items-baseline">
          <div className="flex items-baseline gap-3 text-[11.5px] text-muted-foreground/60">
            <span>© {new Date().getFullYear()} {BRAND.name}</span>
            <span className="italic text-muted-foreground/40">{"// Assist-Not-Complete"}</span>
          </div>
          <a
            href={`https://x.com/${BRAND.authorHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11.5px] text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            Built by {BRAND.authorHandle} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
