import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cn } from "@/lib/utils";

// ---- Frontmatter schema (gray-matter) ----------------------------------
// title:        string        — the finding's question / headline
// date:         string        — ISO date (YYYY-MM-DD)
// experiment:   string | null — repo-relative path to the experiment folder
// models:       string[]      — models under test (rendered as mono pills)
// tags:         string[]      — methods/tools used (rendered as pills)
// keywords:     string[]      — optional keyword line on the post page
// status:       "in-progress" | "scored" | "published"
// summary:      string        — 2–3 line abstract that states the finding
// key_findings: string[]      — paragraphs for the Key Findings panel
//                               (**bold** marks the headline numbers)

export type ResearchStatus = "in-progress" | "scored" | "published";

/** finding = a reproducible experiment; essay = a design/argument piece. */
export type ResearchKind = "finding" | "essay";

export interface ResearchFrontmatter {
  title: string;
  date: string;
  experiment: string | null;
  models: string[];
  tags: string[];
  keywords: string[];
  kind: ResearchKind;
  status: ResearchStatus;
  summary: string;
  keyFindings: string[];
}

export interface ResearchPost extends ResearchFrontmatter {
  slug: string; // filename without extension, e.g. "000-hello-lab"
  number: number; // parsed NNN prefix
  numberLabel: string; // zero-padded prefix as written, e.g. "000"
  content: string; // markdown body (frontmatter stripped)
}

const RESEARCH_DIR = path.join(process.cwd(), "content", "research");

function toStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

async function readPost(file: string): Promise<ResearchPost | null> {
  const slug = file.replace(/\.md$/, "");
  const prefix = /^(\d+)/.exec(slug);
  const numberLabel = prefix ? prefix[1] : "";
  const number = prefix ? parseInt(prefix[1], 10) : 0;

  const raw = await fs.readFile(path.join(RESEARCH_DIR, file), "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    number,
    numberLabel,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    experiment: data.experiment == null ? null : String(data.experiment),
    models: toStringArray(data.models),
    tags: toStringArray(data.tags),
    keywords: toStringArray(data.keywords),
    kind: data.kind === "essay" ? "essay" : "finding",
    status: (data.status as ResearchStatus) ?? "in-progress",
    summary: String(data.summary ?? ""),
    keyFindings: toStringArray(data.key_findings),
    content,
  };
}

/** All posts in content/research/*.md, sorted by № descending (newest first). */
export async function getResearchPosts(): Promise<ResearchPost[]> {
  let files: string[];
  try {
    files = await fs.readdir(RESEARCH_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(
    files.filter((f) => f.endsWith(".md")).map(readPost),
  );
  return posts
    .filter((p): p is ResearchPost => p !== null)
    .sort((a, b) => b.number - a.number);
}

export async function getResearchPost(
  slug: string,
): Promise<ResearchPost | undefined> {
  const posts = await getResearchPosts();
  return posts.find((p) => p.slug === slug);
}

// ---- Contents extraction ------------------------------------------------
// Mirrors rehype-slug's github-slugger output closely enough for our own
// headings: lowercase, strip everything but word chars/spaces/hyphens,
// spaces → hyphens.

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(##{1,2})\s+(.+)$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/\*\*/g, "").trim();
    entries.push({
      id: slugify(text),
      text,
      depth: m[1].length === 2 ? 2 : 3,
    });
  }
  return entries;
}

// ---- Minimal **bold** renderer for frontmatter strings ------------------

export function Bolded({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-medium text-foreground">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// ---- Pills --------------------------------------------------------------

export function Pill({
  children,
  mono = false,
  className,
}: {
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-muted-foreground",
        mono ? "font-mono text-[11px]" : "text-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Method/tool tags first, then models + experiment tooling in mono. */
export function ChipRow({
  post,
  className,
}: {
  post: Pick<ResearchPost, "tags" | "models">;
  className?: string;
}) {
  if (post.tags.length === 0 && post.models.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {post.tags.map((t) => (
        <Pill key={t}>{t}</Pill>
      ))}
      {post.models.map((m) => (
        <Pill key={m} mono>
          {m}
        </Pill>
      ))}
    </div>
  );
}

export function formatDate(iso: string): string {
  return iso; // ISO dates read fine in the meta line (blaiseoss shows them raw)
}
