/**
 * The shape of the primitive library: five sub-pages, each holding a coherent
 * group of specimens.
 *
 * This file is the single source of truth for three things that must never
 * disagree — the overview cards, the side rail, and the legacy-anchor redirect.
 *
 * The `id` on every entry is LOAD-BEARING. `/components#<id>` links exist in
 * `src/lib/content.ts` (PATTERNS) and in the wild, and every one of those ids
 * still has to resolve. Renaming an id silently breaks an inbound link; adding
 * a new specimen is free. See `LEGACY_ANCHORS` below.
 */

export interface LibrarySpecimen {
  /** In-page anchor id. Never rename — inbound links depend on it. */
  id: string;
  /** Section heading on the sub-page, and the name shown on the overview card. */
  title: string;
}

export interface LibraryGroup {
  /** URL segment: /components/<slug> */
  slug: string;
  title: string;
  /** One line on the overview card and in the page header. */
  blurb: string;
  specimens: LibrarySpecimen[];
}

export const LIBRARY_GROUPS: LibraryGroup[] = [
  {
    slug: "decision",
    title: "Decision",
    blurb:
      "The moments where the human answers. Interrupt boundaries, binary approvals, question sets, queues, and the plan the agent has not run yet.",
    specimens: [
      { id: "hitl", title: "Interrupt Cards" },
      { id: "approval", title: "Approve / Reject" },
      { id: "qa", title: "QA Flow" },
      { id: "batch", title: "Batch Approval Queue" },
      { id: "plan", title: "Editable Plan" },
    ],
  },
  {
    slug: "agent-state",
    title: "Agent state",
    blurb:
      "What the agent is doing and what it is about to do. Execution states, the reasoning trace, the pending tool call, and the context it was handed.",
    specimens: [
      { id: "agent-status", title: "Subagent Status" },
      { id: "trace", title: "MiniTrace" },
      { id: "tool-call", title: "Tool Call Preview" },
      { id: "context", title: "Context Chips" },
    ],
  },
  {
    slug: "evidence",
    title: "Evidence",
    blurb:
      "What the agent found, and where it came from. Ranked results, source-backed claims, and the exact text a proposed edit would change.",
    specimens: [
      { id: "search-cards", title: "Search Result Cards" },
      { id: "citation", title: "Citation Result" },
      { id: "diff", title: "Diff Result" },
    ],
  },
  {
    slug: "composed",
    title: "Composed",
    blurb:
      "Whole task surfaces built from the primitives above — the shape a real agent panel takes once the parts are assembled.",
    specimens: [
      { id: "writing-agent", title: "Writing Agent" },
      { id: "research-agent", title: "Research Agent" },
    ],
  },
  {
    slug: "scales",
    title: "Scales & palette",
    blurb:
      "The AI-generation ordinal in four densities, from the full five-button scale down to an inline pill, plus the atomic accent and badge palette they draw from.",
    specimens: [
      { id: "ai-scale", title: "AI Generation Scale" },
      { id: "shared", title: "Shared Primitives" },
    ],
  },
];

/**
 * Every legacy `/components#<id>` anchor mapped to where that content lives
 * now. Derived from LIBRARY_GROUPS so the two cannot drift.
 *
 * Consumed by `LegacyAnchorRedirect`, which runs on the overview page: hashes
 * never reach the server, so the rewrite has to happen client-side. With JS
 * off, the visitor simply lands on the overview, which names every specimen.
 */
export const LEGACY_ANCHORS: Record<string, string> = Object.fromEntries(
  LIBRARY_GROUPS.flatMap((group) =>
    group.specimens.map((s) => [s.id, `/components/${group.slug}#${s.id}`]),
  ),
);

/** Total specimen sections across the library — used in the overview meta. */
export const LIBRARY_SPECIMEN_COUNT = LIBRARY_GROUPS.reduce(
  (n, g) => n + g.specimens.length,
  0,
);

export function groupBySlug(slug: string): LibraryGroup {
  const group = LIBRARY_GROUPS.find((g) => g.slug === slug);
  if (!group) throw new Error(`Unknown library group: ${slug}`);
  return group;
}

/** Neighbours of a sub-page, for the prev/next pager at the foot of each one. */
export function pagerFor(slug: string): {
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
} {
  const i = LIBRARY_GROUPS.findIndex((g) => g.slug === slug);
  const at = (n: number) => {
    const g = LIBRARY_GROUPS[n];
    return g ? { href: `/components/${g.slug}`, title: g.title } : undefined;
  };
  return { prev: at(i - 1), next: at(i + 1) };
}
