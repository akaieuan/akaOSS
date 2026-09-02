/* Shared presentation constants for the landing sections. Server-only,
plain class strings, no client runtime. */

/* Hero entrance: a 700ms rise and fade on the house easing, 120ms stagger
   top to bottom. Every class is motion-safe: gated, so under reduced motion
   the elements are simply there. Below-the-fold blocks use `.settle` from
   globals.css instead, which is scroll-driven. */
export const reveal =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-backwards motion-safe:duration-700 motion-safe:ease-out-quart";
export const stagger = (step: number) => ({ animationDelay: `${step * 120}ms` });

/* One button shape on the site: the pill, with a 2% press. */
export const primaryCta =
  "group inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground/15 px-5 text-sm font-medium text-foreground transition-[background-color,scale] hover:bg-foreground/25 active:scale-[0.98]";
export const arrowLink =
  "text-muted-foreground hover:text-foreground group inline-flex items-center gap-1 text-sm transition-colors";
export const arrowNudge =
  "size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5";
