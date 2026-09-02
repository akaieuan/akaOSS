"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LIBRARY_GROUPS } from "@/lib/library";

/**
 * `rail` is the sticky column on large screens: every group, and under each
 * group every primitive, so any component in the kit is one click from
 * anywhere in the catalogue. `bar` is the horizontally scrollable strip that
 * replaces it below `lg`, groups only, so the catalogue is still navigable on
 * a phone.
 */
export function LibraryNav({ variant }: { variant: "rail" | "bar" }) {
  const pathname = usePathname();
  const overview = { href: "/components", title: "Overview" };

  if (variant === "bar") {
    const items = [
      overview,
      ...LIBRARY_GROUPS.map((g) => ({ href: `/components/${g.slug}`, title: g.title })),
    ];
    return (
      <nav
        aria-label="Component library"
        className="-mx-6 flex gap-4 overflow-x-auto border-b border-border/60 px-6 pb-3 md:-mx-8 md:px-8"
      >
        {items.map((item) => (
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
      <Link
        href={overview.href}
        aria-current={pathname === overview.href ? "page" : undefined}
        className={cn(
          "rounded-md px-2 py-1.5 text-xs transition-colors",
          pathname === overview.href
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {overview.title}
      </Link>

      {LIBRARY_GROUPS.map((g) => {
        const href = `/components/${g.slug}`;
        const here = pathname === href;
        return (
          <div key={g.slug} className="mt-2">
            <Link
              href={href}
              aria-current={here ? "page" : undefined}
              className={cn(
                "block rounded-md px-2 py-1 text-xs font-medium transition-colors",
                here ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {g.title}
            </Link>
            <ul className="m-0 list-none border-l border-border/60 p-0 ml-2.5">
              {g.specimens.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`${href}#${s.id}`}
                    className={cn(
                      "block -ml-px border-l border-transparent py-1 pl-3 text-[11px] leading-snug transition-colors",
                      here
                        ? "text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        : "text-muted-foreground/80 hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
