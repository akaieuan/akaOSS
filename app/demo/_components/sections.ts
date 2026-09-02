/**
 * The brand catalogue's table of contents. `/components` catalogues the HITL
 * *product* primitives; this catalogues the things the site itself is made
 * of: the mark, the small site helpers, the token palette.
 *
 * Unlisted on purpose: nothing here is linked from the main nav or the
 * sitemap. It is reachable by URL, the same way the studio reference keeps
 * its own demo section.
 */

export type DemoSectionMeta = {
  slug: string;
  title: string;
  blurb: string;
  /** Named on the overview card, so the page is legible without clicking. */
  contents: string[];
};

export const DEMO_SECTIONS: DemoSectionMeta[] = [
  {
    slug: "marks",
    title: "Marks",
    blurb:
      "PixelHead, the one canvas component behind the favicon, the nav mark, the project badges and the hero. Every knockout, every dissolve mode, every animation behaviour.",
    contents: [
      "Icon knockouts",
      "Hero treatment",
      "Dissolve modes",
      "Animation behaviours",
      "variant",
      "faces",
      "Grid density",
      "fluid",
      "Remaining props",
    ],
  },
  {
    slug: "primitives",
    title: "Primitives",
    blurb:
      "The small site-level helpers: the fading rule, the canonical thesis link, the theme toggle, and the class idioms that carry the page furniture.",
    contents: [
      "Hairline",
      "AssistNotComplete",
      "ThemeToggle",
      ".label",
      "Card surfaces",
      "Link idioms",
      "Entrance",
    ],
  },
  {
    slug: "tokens",
    title: "Tokens",
    blurb:
      "The palette as swatches, read straight out of globals.css at build time so this page cannot drift from the stylesheet. Surfaces, lines, text, and the five accents.",
    contents: [
      "Surfaces",
      "Lines & borders",
      "Text",
      "Accents",
      "Contrast",
      "Radius",
    ],
  },
];

export const DEMO_NAV = [
  { href: "/demo", title: "Overview" },
  ...DEMO_SECTIONS.map((s) => ({ href: `/demo/${s.slug}`, title: s.title })),
];

/** Prev/next neighbours for the pager, so the catalogue reads as a sequence. */
export function demoNeighbours(slug: string) {
  const i = DEMO_NAV.findIndex((n) => n.href === `/demo/${slug}`);
  return {
    prev: i > 0 ? DEMO_NAV[i - 1] : undefined,
    next: i >= 0 && i < DEMO_NAV.length - 1 ? DEMO_NAV[i + 1] : undefined,
  };
}
