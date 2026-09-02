"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const buttonClass =
  "inline-flex size-8 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-[background-color,color,translate] select-none hover:bg-muted hover:text-foreground active:translate-y-px dark:hover:bg-muted/50";

/**
 * Which icon shows is decided by CSS (`dark:` variants), not by state. The
 * server cannot know the visitor's theme, so the usual fix is a `mounted` flag
 * set in an effect, an extra render on every page, and a setState-in-effect
 * the React compiler now flags. Letting the stylesheet choose removes the
 * state, the effect, and the mismatch in one go.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle light or dark theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(buttonClass, className)}
    >
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
    </button>
  );
}
