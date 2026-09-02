"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LIBRARY_GROUPS } from "./sections";

const ITEMS = [
  { href: "/components", title: "Overview" },
  ...LIBRARY_GROUPS.map((g) => ({
    href: `/components/${g.slug}`,
    title: g.title,
  })),
];

/**
 * `rail` is the sticky column on large screens; `bar` is the horizontally
 * scrollable strip that replaces it below `lg`, so the catalogue is still
 * navigable on a phone.
 */
export function LibraryNav({ variant }: { variant: "rail" | "bar" }) {
  const pathname = usePathname();

  if (variant === "bar") {
    return (
      <nav
        aria-label="Component library"
        className="-mx-6 flex gap-4 overflow-x-auto border-b border-border/60 px-6 pb-3 md:-mx-8 md:px-8"
      >
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "shrink-0 text-xs whitespace-nowrap transition-colors",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Component library" className="flex flex-col gap-0.5">
      {ITEMS.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="font-mono text-meta text-muted-foreground">
            {i === 0 ? "··" : String(i).padStart(2, "0")}
          </span>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
