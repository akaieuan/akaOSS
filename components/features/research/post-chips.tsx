import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ResearchPost } from "@/lib/research";

/** Minimal **bold** renderer for frontmatter strings. */
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

export function Pill({
  children,
  mono = false,
  className,
}: {
  children: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-muted-foreground",
        mono ? "font-mono text-meta" : "text-xs",
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
