/* Shared presentation constants for the landing sections. Server-only —
   plain class strings, no client runtime. */

/* Hero entrance — light reveal, top-to-bottom 120ms stagger (motion-safe only). */
export const reveal =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-backwards motion-safe:duration-700";
export const stagger = (step: number) => ({ animationDelay: `${step * 120}ms` });

export const primaryCta =
  "group inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground/15 px-6 text-sm font-medium text-foreground transition-colors hover:bg-foreground/25";
export const arrowLink =
  "text-muted-foreground hover:text-foreground group inline-flex items-center gap-1 text-sm transition-colors";
export const arrowNudge =
  "size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5";
