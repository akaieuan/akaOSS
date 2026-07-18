import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getResearchPosts, ChipRow, formatDate } from "./posts";

export const metadata: Metadata = {
  title: "Research · HITL Kit",
  description:
    "Findings and write-ups produced by running the kits — reproducible experiments, human-scored. Aggregate scores are internal signal, not leaderboard fodder.",
};

export default async function ResearchPage() {
  const posts = await getResearchPosts();

  return (
    <>
      <Nav active="research" />

      <main className="mx-auto max-w-6xl px-6">
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
