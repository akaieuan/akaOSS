/**
 * The shape of the primitive library: five groups on one page, each holding a
 * coherent set of specimens.
 *
 * This file is the single source of truth for the jump row, the group heads
 * and the counts, so they can never disagree.
 *
 * The `id` on every entry is LOAD-BEARING. `/components#<id>` links exist in
 * the wild, and every one of those ids still has to resolve. Renaming an id
 * silently breaks an inbound link; adding a new specimen is free.
 */

export interface LibrarySpecimen {
  /** In-page anchor id. Never rename, inbound links depend on it. */
  id: string;
  /** Section heading on the page. */
  title: string;
}

export interface LibraryGroup {
  /** Anchor on the page: /components#<slug>. The old /components/<slug> routes redirect here. */
  slug: string;
  title: string;
  /** One line under the group's head. */
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
      { id: "evidence-pointer", title: "Evidence Pointer" },
      { id: "diff", title: "Diff Result" },
    ],
  },
  {
    slug: "composed",
    title: "Composed",
    blurb:
      "Whole task surfaces built from the primitives above. The shape a real agent panel takes once the parts are assembled.",
    specimens: [
      { id: "writing-agent", title: "Writing Agent" },
      { id: "research-agent", title: "Research Agent" },
    ],
  },
  {
    slug: "scales",
    title: "Scales & palette",
    blurb:
      "How much of this did a person do. One five-point scale from Human to AI in four densities, slider to inline pill, plus the five accents and four approval badges the kit draws from.",
    specimens: [
      { id: "ai-scale", title: "AI Generation Scale" },
      { id: "shared", title: "Shared Primitives" },
    ],
  },
];

/** Total specimens across the library, for the hero's counts line. */
export const LIBRARY_SPECIMEN_COUNT = LIBRARY_GROUPS.reduce(
  (n, g) => n + g.specimens.length,
  0,
);

export function groupBySlug(slug: string): LibraryGroup {
  const group = LIBRARY_GROUPS.find((g) => g.slug === slug);
  if (!group) throw new Error(`Unknown library group: ${slug}`);
  return group;
}
