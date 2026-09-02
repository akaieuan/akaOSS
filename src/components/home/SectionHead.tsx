import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One section head for the whole site: the section's name in plain sans,
 * and beside it one small link to the place that has all of it. No eyebrow,
 * no rule, no mono. The quiet head is what lets the content underneath be
 * the loud part.
 */
export function SectionHead({
  title,
  href,
  link,
  as: Tag = "h2",
  className,
}: {
  title: string;
  href?: string;
  link?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <Tag className="text-[15px] font-medium tracking-tight text-foreground">{title}</Tag>
      {href && link && (
        <Link
          href={href}
          className="group inline-flex items-center gap-0.5 text-[12.5px] text-muted-foreground/70 transition-colors hover:text-foreground"
        >
          {link}
          <ArrowUpRight
            aria-hidden
            className="size-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
          />
        </Link>
      )}
    </div>
  );
}
