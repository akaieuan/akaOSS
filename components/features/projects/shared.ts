/* Class strings the project pages share. Server-only, no runtime. The
   voice is the landing's: quiet 12.5px for anything that is not content,
   small light sans for prose. */

export const quiet = "text-[12.5px] text-muted-foreground/60";
export const quietLink = "transition-colors hover:text-foreground";
export const prose = "text-[13.5px] font-light leading-relaxed text-muted-foreground/80";
/** One hairline row in a list of links: name left, destination right. */
export const row = "group flex items-center justify-between gap-4 border-t border-border/50 py-3.5";
export const rowName = "min-w-0 truncate text-[13px] text-foreground";
export const rowArrow =
  "size-3 shrink-0 transition-transform group-hover:-translate-y-px group-hover:translate-x-px";
