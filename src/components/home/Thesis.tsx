import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PARADIGM } from "@/lib/content";
import { arrowLink, arrowNudge } from "./shared";

export function Thesis() {
  return (
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
  );
}
