import { cn } from "@/lib/utils";

/** Edge-fading horizontal divider — quieter than a full-width border. */
export function Hairline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-px", className)}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, var(--border) 14%, var(--border) 86%, transparent 100%)",
      }}
    />
  );
}
