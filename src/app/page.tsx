import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PixelHead } from "@/components/site/PixelHead";
import { cn } from "@/lib/utils";
import { PARADIGM, FEED_ENTRY, ACCENT_CLASSES } from "@/lib/content";
import { PROJECTS } from "@/lib/projects";

/* Hero entrance — light reveal, top-to-bottom 120ms stagger (motion-safe only). */
const reveal =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-backwards motion-safe:duration-700";
const stagger = (step: number) => ({ animationDelay: `${step * 120}ms` });

const primaryCta =
  "group inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground/15 px-6 text-sm font-medium text-foreground transition-colors hover:bg-foreground/25";
const arrowLink =
  "text-muted-foreground hover:text-foreground group inline-flex items-center gap-1 text-sm transition-colors";

const arrowNudge =
  "size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

const GROUPS: { key: "measurement" | "tooling"; label: string }[] = [
  { key: "measurement", label: "Human-in-the-loop measurement" },
  { key: "tooling", label: "Developer tooling" },
];

/* Per-project badges: the human figure for HITL Kit (the human in the
   loop), a three-tier podium for eval-kit (measurement, ranked), a code
   tag for tag-kit, the terminal prompt for the developer tooling. */
const PROJECT_BADGES: Record<string, "head" | "podium" | "codetag" | "prompt"> = {
  "hitl-kit": "head",
  "eval-kit": "podium",
  "tag-kit": "codetag",
  collapse: "prompt",
  hologram: "prompt",
};

export default function Home() {
  return (
    <>
      <Nav />

      <main className="mx-auto max-w-5xl px-6 md:px-8">
        {/* ── Hero ── */}
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
          <div
            className={cn("mx-auto hidden md:block", reveal)}
            style={stagger(2)}
          >
            <PixelHead size={340} grid={22} icon="spark" once fluid />
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="scroll-mt-16 pt-4 pb-16">
          {GROUPS.map((group) => (
            <div key={group.key} className="mt-10 first:mt-0">
              <span className="label block">{group.label}</span>
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {PROJECTS.filter((p) => p.group === group.key).map((p) => {
                  const accent = ACCENT_CLASSES[p.accent];
                  return (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="group rounded-2xl border border-border/40 bg-card/40 p-5 transition-all duration-200 hover:bg-card hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", accent.dot)}
                        />
                        <h2 className="text-lg font-light tracking-tight text-foreground">
                          {p.name}
                        </h2>
                        <span className="ml-auto flex items-center gap-3">
                          <PixelHead
                            size={36}
                            grid={18}
                            gap={0.12}
                            icon={PROJECT_BADGES[p.slug] ?? "spark"}
                            once
                          />
                          <ArrowUpRight
                            aria-hidden
                            className={cn(arrowNudge, "text-muted-foreground group-hover:text-foreground")}
                          />
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                        {p.oneLiner}
                      </p>
                      <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
                        {p.status}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* ── The thesis, compressed ── */}
        <section className="pt-8 pb-16">
          <span className="label block">The thesis</span>
          <p className="mt-6 max-w-xl text-2xl leading-snug font-light tracking-tight">
            Human-in-the-loop AI, measured properly
            <span className="text-[color:var(--accent-amber)]">.</span>
          </p>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
            {PARADIGM.def}
          </p>
          <Link href="/paper" className={cn(arrowLink, "mt-6")}>
            Read the paper: An AI Measurement Problem
            <ArrowUpRight aria-hidden className={arrowNudge} />
          </Link>
        </section>

        {/* ── Latest finding ── */}
        <section className="pt-8 pb-24">
          <span className="label block">Latest finding</span>
          <Link
            href={FEED_ENTRY.href}
            className="group mt-5 block max-w-3xl"
          >
            <h2 className="text-lg font-medium tracking-tight text-foreground underline-offset-4 group-hover:underline md:text-xl">
              {FEED_ENTRY.question}
            </h2>
            <p className="mt-2 font-mono text-[13px] text-muted-foreground">
              {FEED_ENTRY.num}
              <span className="mx-2 text-muted-foreground/50">·</span>
              <span className="text-[color:var(--accent-amber)]">
                {FEED_ENTRY.status}
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {FEED_ENTRY.description}
            </p>
          </Link>
          <Link href="/research" className={cn(arrowLink, "mt-6")}>
            All findings
            <ArrowUpRight aria-hidden className={arrowNudge} />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
