import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PixelHead } from "@/components/site/PixelHead";
import { arrowLink, arrowNudge, primaryCta, reveal, stagger } from "./shared";

export function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-12 py-24 md:grid-cols-[1fr_auto] md:py-32">
      <div>
        <span className={cn("label block", reveal)}>
          Open source · by akaieuan
        </span>
        <h1
          className={cn(
            "mt-6 max-w-xl text-lg leading-snug font-light tracking-tight md:text-2xl",
            reveal,
          )}
          style={stagger(1)}
        >
          Open-source software for human-in-the-loop AI
          <span className="text-[color:var(--accent-amber)]">.</span>
        </h1>
        <p
          className={cn(
            "mt-5 max-w-md leading-relaxed text-muted-foreground",
            reveal,
          )}
          style={stagger(2)}
        >
          Five projects: a measurement family for AI that assists without
          displacing — components, evals, annotation — and tooling for the
          agents that build alongside you.
        </p>

        <div
          className={cn("mt-8 flex flex-wrap items-center gap-5", reveal)}
          style={stagger(3)}
        >
          <a href="#projects" className={primaryCta}>
            See the projects
            <ArrowUpRight aria-hidden className={arrowNudge} />
          </a>
          <Link href="/research" className={arrowLink}>
            Research
            <ArrowUpRight aria-hidden className={arrowNudge} />
          </Link>
        </div>
      </div>

      {/* The mark — assembles once on first view, then holds. */}
      <div className={cn("mx-auto hidden md:block", reveal)} style={stagger(2)}>
        <PixelHead size={340} grid={22} icon="spark" once fluid />
      </div>
    </section>
  );
}
