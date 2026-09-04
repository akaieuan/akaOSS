import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionHead } from "@/components/ui/section-head";
import { quiet } from "./shared";

/**
 * One section of a project page: a hairline, the quiet section head with an
 * optional link beside it and an optional count on the right, then the body.
 */
export function ProjectSection({
  title,
  href,
  link,
  meta,
  className,
  children,
}: {
  title: string;
  href?: string;
  link?: string;
  meta?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("border-t border-border/50 py-12", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <SectionHead title={title} as="h2" href={href} link={link} />
        {meta ? <span className={cn("shrink-0", quiet)}>{meta}</span> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
