import { BRAND } from "@/lib/site";

/* Two lines and no rule: who wrote this, and why the source is not here. */

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-[72rem] flex-wrap justify-between gap-2 px-4 pb-10 text-[13px] text-muted-foreground md:px-6">
      <span>
        {BRAND.name} · research by{" "}
        <a
          href={BRAND.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          {BRAND.author}
        </a>
      </span>
      <span>source closed until local protection</span>
    </footer>
  );
}
