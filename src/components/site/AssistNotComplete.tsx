import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/content";

interface AssistNotCompleteProps {
  label?: string;
  className?: string;
}

/**
 * Canonical mention of the Assist-Not-Complete paradigm.
 * Links to the author's personal site where the thesis lives.
 */
export function AssistNotComplete({
  label = "Assist-Not-Complete",
  className,
}: AssistNotCompleteProps) {
  return (
    <a
      href={BRAND.site}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "underline decoration-border-strong decoration-from-font underline-offset-[3px] transition-colors hover:decoration-[color:var(--accent-blue)] hover:text-foreground",
        className,
      )}
    >
      {label}
    </a>
  );
}
