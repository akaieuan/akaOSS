import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* tailwind-merge only knows Tailwind's stock font sizes, so without this it
   reads `text-title-2` as a colour, sees a conflict with `text-foreground`
   beside it, and silently drops whichever came first. Teach it the site's
   type scale; the names mirror the `--text-*` steps in globals.css. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "meta",
        "small",
        "body",
        "lede",
        "title-3",
        "title-2",
        "title-1",
        "display",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
