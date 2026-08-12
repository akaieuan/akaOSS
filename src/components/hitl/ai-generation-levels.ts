/**
 * The five-point AI-generation ordinal, shared by every scale variant.
 *
 * There is one array of level names and one accent progression in the kit.
 * `AiGenerationScale`, `AiGenerationSlider`, `AiGenerationMeter` and
 * `AiGenerationBadge` all read from here, so a level can never mean one thing
 * in the slider and another in the badge.
 *
 * Accents are punctuation: dots, segment fills, the thumb ring. They are never
 * a background for text. Light-theme accents sit around 3.3–4.1:1 on paper,
 * which clears WCAG 1.4.11 for graphical objects but not 1.4.3 for body text,
 * so every label in these components stays on `foreground` / `muted-foreground`.
 */

export const AI_GENERATION_LEVELS = [
  "Human",
  "Mostly Human",
  "Collaborative",
  "Mostly AI",
  "AI",
] as const;

export type AiGenerationLevelName = (typeof AI_GENERATION_LEVELS)[number];

/** Highest valid index. The scale is 0-based: 0 = Human, 4 = AI. */
export const AI_GENERATION_MAX = AI_GENERATION_LEVELS.length - 1;

/**
 * emerald → blue → amber → violet → rose, one per level.
 * Written as literal utility strings so Tailwind's source scan picks them up.
 */
export const AI_GENERATION_ACCENTS = [
  "bg-[color:var(--accent-emerald)]",
  "bg-[color:var(--accent-blue)]",
  "bg-[color:var(--accent-amber)]",
  "bg-[color:var(--accent-violet)]",
  "bg-[color:var(--accent-rose)]",
] as const;

/** Keep any incoming value inside 0…4 and integral. */
export function clampAiLevel(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(AI_GENERATION_MAX, Math.max(0, Math.round(value)));
}

/** The display name for a level, honouring a caller-supplied label override. */
export function aiLevelName(
  value: number,
  labels: readonly string[] = AI_GENERATION_LEVELS,
): string {
  return labels[clampAiLevel(value)] ?? AI_GENERATION_LEVELS[clampAiLevel(value)];
}

/** The accent utility class for a level. */
export function aiLevelAccent(value: number): string {
  return AI_GENERATION_ACCENTS[clampAiLevel(value)];
}

/**
 * Screen-reader text for a level: "Collaborative, 3 of 5".
 * Position is 1-based because that is how a human counts the marks they see.
 */
export function aiLevelDescription(
  value: number,
  labels: readonly string[] = AI_GENERATION_LEVELS,
): string {
  const i = clampAiLevel(value);
  return `${aiLevelName(i, labels)}, ${i + 1} of ${AI_GENERATION_LEVELS.length}`;
}
