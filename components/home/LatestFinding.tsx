import Link from "next/link";
import { getResearchPosts } from "@/lib/research";
import { SectionHead } from "./SectionHead";

/* The landing's research list derives from the feed at build time: the
   newest posts, always. (House rule: every research post updates the
   landing; this component satisfies it structurally.) */

const SHOW = 5;

export async function LatestFinding() {
  const posts = await getResearchPosts();
  if (posts.length === 0) return null;

  return (
    <section className="settle max-w-[38rem] pb-24">
      <SectionHead title="Research" href="/research" link="all findings" />
      <ul className="m-0 mt-4 list-none p-0">
        {posts.slice(0, SHOW).map((post) => (
          <li key={post.slug}>
            <Link
              href={`/research/${post.slug}`}
              className="group flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2.5"
            >
              <span className="text-[14px] text-foreground transition-colors group-hover:text-foreground/80">
                {post.title}
              </span>
              <span className="text-[11.5px] text-muted-foreground/60">
                {post.kind === "essay" ? "Essay" : "Finding"}
                <span aria-hidden> · </span>
                {post.date}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
