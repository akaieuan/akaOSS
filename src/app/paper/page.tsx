import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AssistNotComplete } from "@/components/site/AssistNotComplete";
import { PaperTOC } from "./PaperTOC";

export const metadata: Metadata = {
  title: "The paper · HITL Kit",
  description:
    "An AI Measurement Problem — a perspective piece on why 95% of enterprise AI fails, and how the Assist-Not-Complete paradigm reframes design and evaluation.",
};

async function getPaper() {
  const filePath = path.join(process.cwd(), "content", "paper.md");
  return await fs.readFile(filePath, "utf-8");
}

export default async function PaperPage() {
  const md = await getPaper();

  return (
    <>
      <Nav active="paper" />

      <div className="mx-auto flex max-w-6xl gap-12 px-6 pt-10">
        <PaperTOC />

        <article className="min-w-0 flex-1 pb-24">
          <div className="mb-10">
            <p className="label mb-4">Perspective · 2026</p>
            <h1 className="text-4xl leading-[1.1] font-light tracking-tight text-foreground md:text-5xl">
              An AI Measurement Problem
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Why 95% of enterprise AI pilots fail, and how the{" "}
              <AssistNotComplete className="text-foreground hover:text-[color:var(--accent-blue)]" />{" "}
              paradigm reframes how we design, evaluate, and deploy these
              systems.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="label">Ieuan King</span>
              <span className="h-3 w-px bg-border" />
              <span className="label">~ 30 min read</span>
              <span className="h-3 w-px bg-border" />
              <a
                href="/content/paper.md"
                className="label underline-anim text-[color:var(--accent-violet)]"
                download
              >
                Download .md
              </a>
            </div>
          </div>

          <div className="paper-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
              ]}
            >
              {md}
            </ReactMarkdown>
          </div>
        </article>
      </div>

      <Footer />
    </>
  );
}
