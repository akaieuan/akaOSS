import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/site";
import { PixelHead } from "@/components/site/PixelHead";
import { reveal, stagger } from "./shared";

const LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "Components", href: "/components" },
  { label: "Paper", href: "/paper" },
  { label: "Research", href: "/research" },
  { label: "GitHub", href: BRAND.github, external: true },
];

/**
 * The hero says one sentence and shows the mark. The sentence is small on
 * purpose: a studio introduces itself, it does not announce. Everything
 * else the page has to say is below, where it can be looked at.
 */
export function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-[1fr_auto] md:gap-16 md:py-24">
      <div className="max-w-[34rem]">
        <h1
          className={cn(
            "text-[22px] font-light leading-snug tracking-tight text-foreground sm:text-[24px]",
            reveal,
          )}
        >
          Open-source tools for human-in-the-loop AI.
        </h1>
        <p
          className={cn("mt-3 text-[12.5px] text-muted-foreground/60", reveal)}
          style={stagger(1)}
        >
          {"// five toolkits, one thesis, a findings feed. Signals in, decisions by people."}
        </p>

        <nav
          aria-label="Quick links"
          className={cn("mt-6 flex flex-wrap items-center gap-x-5 gap-y-2", reveal)}
          style={stagger(2)}
        >
          {LINKS.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-0.5 text-[12.5px] text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
                <ArrowUpRight aria-hidden className="size-3" />
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12.5px] text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>
      </div>

      {/* The mark: the human in the loop. Assembles once on first view, then holds. */}
      <div className={cn("mx-auto hidden md:block", reveal)} style={stagger(1)}>
        <PixelHead size={200} grid={22} icon="head" still fluid />
      </div>
    </section>
  );
}
