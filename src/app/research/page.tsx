import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getResearchPosts, ChipRow, formatDate } from "./posts";

export const metadata: Metadata = {
  title: "Research · akaOSS",
  description:
    "Findings and write-ups produced by running the kits — reproducible experiments, human-scored. Aggregate scores are internal signal, not leaderboard fodder.",
};

export default async function ResearchPage() {
  const posts = await getResearchPosts();

  return (
    <>
      <Nav active="research" />

      <main className="mx-auto max-w-5xl px-6 md:px-8">
        {/* Header */}
        <section className="pt-20 pb-4">
          <p className="label mb-5">Research</p>
          <h1 className="text-2xl font-light tracking-tight text-foreground">
            Findings
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Case-study write-ups produced by running the kits — each one a
            reproducible experiment with checked-in runs, scored by humans, not
            LLMs.
          </p>
        </section>

        {/* The paper — pinned above the feed; the argument the findings test */}
        <section aria-label="The paper" className="pt-8">
          <p className="label">The paper</p>
          <h2 className="mt-3 max-w-3xl text-lg font-medium tracking-tight text-foreground md:text-xl">
            <Link
              href="/paper"
              className="underline-offset-4 transition-colors hover:underline"
            >
              An AI Measurement Problem
            </Link>
          </h2>
          <p className="mt-2 font-mono text-[13px] text-muted-foreground">
            perspective paper
            <span className="mx-2 text-muted-foreground/50">·</span>
            the argument this feed measures
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            The AI failure crisis is at root a measurement crisis. The paper
            synthesizes benchmark science, cognitive neuroscience, uncertainty
            quantification, and enterprise deployment data to argue for
            Assist-Not-Complete: evaluate AI on whether it assists humans
            without displacing them, not on whether it can finish the task
            alone.
          </p>
        </section>

        {/* Flat list — the finding does the selling, not the chrome */}
        <section aria-label="Findings" className="pb-24">
          {posts.map((post) => (
            <article key={post.slug} className="mt-14 first:mt-10">
              <h2 className="max-w-3xl text-lg font-medium tracking-tight text-foreground md:text-xl">
                <Link
                  href={`/research/${post.slug}`}
                  className="underline-offset-4 transition-colors hover:underline"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="mt-2 font-mono text-[13px] text-muted-foreground">
                {formatDate(post.date)}
                <span className="mx-2 text-muted-foreground/50">·</span>
                <span className="text-muted-foreground/80">{post.kind}</span>
                {post.experiment && (
                  <>
                    <span className="mx-2 text-muted-foreground/50">·</span>
                    <span className="text-muted-foreground/80">
                      {post.experiment}
                    </span>
                  </>
                )}
              </p>

              {post.summary && (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {post.summary}
                </p>
              )}

              <ChipRow post={post} className="mt-4" />
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
