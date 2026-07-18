import Link from "next/link";
import { BRAND } from "@/lib/content";

/* One quiet row in the wordmark's voice: identity left, destinations right. */
const footerLink =
  "text-muted-foreground hover:text-foreground text-sm font-light tracking-[0.06em] transition-colors";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 py-8 sm:flex-row sm:items-baseline">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-light tracking-[0.06em] text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}
          </span>
          <span className="text-[11px] italic text-foreground/40">
            {"// Assist-Not-Complete"}
          </span>
        </div>
        <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <Link href="/projects/hitl-kit" className={footerLink}>HITL Kit</Link>
          <Link href="/projects/eval-kit" className={footerLink}>eval-kit</Link>
          <Link href="/projects/tag-kit" className={footerLink}>tag-kit</Link>
          <Link href="/projects/collapse" className={footerLink}>Collapse</Link>
          <Link href="/projects/hologram" className={footerLink}>Hologram</Link>
          <Link href="/research" className={footerLink}>Research</Link>
          <Link href="/paper" className={footerLink}>Paper</Link>
          <Link href="/registry" className={footerLink}>Registry</Link>
          <Link href="/components" className={footerLink}>Components</Link>
          <a
            href={BRAND.github}
            target="_blank"
            rel="noopener noreferrer"
            className={footerLink}
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </footer>
  );
}
