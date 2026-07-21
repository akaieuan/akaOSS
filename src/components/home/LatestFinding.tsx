import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getResearchPosts } from "@/app/research/posts";
import { arrowLink, arrowNudge } from "./shared";

/* The landing's "Latest finding" derives from the research feed at build
   time — the newest post is always the one shown, so this section can
   never go stale. (House rule: every research post updates the landing;
   this component satisfies it structurally.) */

export async function LatestFinding() {
  const posts = await getResearchPosts();
  const latest = posts[0];
  if (!latest) return null;

  const statusLabel = latest.status.replace("-", " ");

  return (
    <section className="pt-8 pb-24">
      <span className="label block">
        {latest.kind === "essay" ? "Latest from the lab" : "Latest finding"}
      </span>
      <Link
        href={`/research/${latest.slug}`}
        className="group mt-5 block max-w-3xl"
      >
        <h2 className="text-lg font-medium tracking-tight text-foreground underline-offset-4 group-hover:underline md:text-xl">
          {latest.title}
        </h2>
        <p className="mt-2 font-mono text-[13px] text-muted-foreground">
          {`№ ${latest.numberLabel}`}
          <span className="mx-2 text-muted-foreground/50">·</span>
          <span className="text-[color:var(--accent-amber)]">
            {statusLabel}
          </span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
          {latest.summary}
        </p>
      </Link>
      <Link href="/research" className={cn(arrowLink, "mt-6")}>
        All findings
        <ArrowUpRight aria-hidden className={arrowNudge} />
      </Link>
    </section>
  );
}
