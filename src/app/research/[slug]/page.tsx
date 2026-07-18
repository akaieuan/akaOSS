import type { ReactElement, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hairline } from "@/components/site/Hairline";
import {
  getResearchPost,
  getResearchPosts,
  extractToc,
  Bolded,
  ChipRow,
  formatDate,
} from "../posts";

export async function generateStaticParams() {
  const posts = await getResearchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getResearchPost(slug);
  if (!post) return { title: "Research · akaOSS" };
  return {
    title: `${post.title} · Research · akaOSS`,
    description: post.summary,
  };
}

// ---- Run-artifact fence renderers --------------------------------------
// A fenced block tagged `trace` or `summary` whose body is a path to a
// checked-in run JSON renders a placeholder card for now. The live
// HITL-component wiring (MiniTrace / summary card) lands with the first real
// finding. Add a new language key here to extend the mapping.

const FENCE_KINDS = {
  trace: {
    label: "trace",
    hint: "Renders as a HITL Kit MiniTrace when the run is wired in.",
  },
  summary: {
    label: "summary",
    hint: "Renders as a HITL Kit summary card when the run is wired in.",
  },
} as const;

type FenceKind = keyof typeof FENCE_KINDS;

function isFenceKind(lang: string | undefined): lang is FenceKind {
  return lang === "trace" || lang === "summary";
}

function RunPlaceholderCard({ kind, path }: { kind: FenceKind; path: string }) {
  const spec = FENCE_KINDS[kind];
  return (
    <div className="my-6 rounded-2xl border border-border/40 bg-card/40 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-amber)]" />
        <span className="label">{spec.label} · run artifact</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-[11.5px] text-foreground">
        {path || "(no path provided)"}
      </div>
      <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-muted-foreground/80">
        {spec.hint}
      </p>
    </div>
  );
}

// Unwrap fenced code blocks tagged with a known run-artifact language into
// their placeholder card; everything else keeps the default <pre> styling.
const markdownComponents: Components = {
  pre(props) {
    const child = props.children as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;
    const className = child?.props?.className ?? "";
    const lang = /language-(\w+)/.exec(className)?.[1];
    if (isFenceKind(lang)) {
      const path = String(child.props.children ?? "").trim();
      return <RunPlaceholderCard kind={lang} path={path} />;
    }
    return <pre {...props} />;
  },
};

export default async function ResearchPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getResearchPost(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);

  return (
    <>
      <Nav active="research" />

      <div className="mx-auto max-w-5xl px-6 md:px-8 pt-10">
        {/* Post header */}
        <header>
          <Link
            href="/research"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Research
          </Link>

          <h1 className="mt-6 max-w-3xl text-3xl leading-[1.15] font-light tracking-tight text-foreground md:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 font-mono text-[13px] text-muted-foreground">
            {formatDate(post.date)}
            {post.experiment && (
              <>
                <span className="mx-2 text-muted-foreground/50">·</span>
                <span className="text-muted-foreground/80">
                  {post.experiment}
                </span>
              </>
            )}
            {post.status === "in-progress" && (
              <>
                <span className="mx-2 text-muted-foreground/50">·</span>
                <span className="text-[color:var(--accent-amber)]">
                  in progress
                </span>
              </>
            )}
          </p>

          <ChipRow post={post} className="mt-5" />
        </header>

        <Hairline className="mt-10" />

        {/* Two-column: sticky contents + body */}
        <div className="grid grid-cols-1 gap-12 pt-10 pb-24 lg:grid-cols-[200px_minmax(0,1fr)]">
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <nav className="sticky top-24" aria-label="Contents">
                <p className="label mb-4">Contents</p>
                <ul className="space-y-2.5">
                  {toc.map((entry) => (
                    <li
                      key={entry.id}
                      className={entry.depth === 3 ? "pl-4" : undefined}
                    >
                      <a
                        href={`#${entry.id}`}
                        className="block text-[13px] leading-snug text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          <article className="min-w-0 max-w-3xl">
            {/* Key Findings panel — the headline numbers, up front */}
            {post.keyFindings.length > 0 && (
              <section
                aria-label="Key findings"
                className="mb-10 rounded-2xl border border-border/40 bg-card/60 p-6"
              >
                <p className="label mb-4 text-[color:var(--accent-amber)]">
                  Key findings
                </p>
                <div className="space-y-3">
                  {post.keyFindings.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-muted-foreground md:text-[15px]"
                    >
                      <Bolded text={paragraph} />
                    </p>
                  ))}
                </div>
              </section>
            )}

            <div className="paper-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {post.keywords.length > 0 && (
              <p className="mt-10 text-[13px] leading-relaxed text-muted-foreground/80">
                <span className="label mr-2">Keywords</span>
                {post.keywords.join(", ")}
              </p>
            )}
          </article>
        </div>
      </div>

      <Footer />
    </>
  );
}
