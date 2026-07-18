# Experiment 001 — Does pushback scale with model tier?

**Status:** scaffolded, not yet run.

## Question

The eval-kit seed suites mark some tasks `is_distraction: true` — future-dated
papers, unverifiable claims, out-of-scope asks — where the *refusal* is the
pass. No mainstream benchmark scores pushback as success; this experiment does.

Specifically: across the three current Anthropic tiers (Haiku 4.5, Sonnet 5,
Opus 4.8), does the rate of catching distractions increase with model
capability, or is pushback orthogonal to tier?

## Method

1. Pool every `is_distraction: true` task from the three published
   `@eval-kit/seed-suite` suites (research, coding, support) into one
   synthetic suite, `distractors-v1`.
2. Run it against each model via `@eval-kit/core`'s anthropic adapter
   (installed **from npm**, not workspace links — every experiment doubles as
   an integration test of the published packages).
3. Tier-1 auto-scoring computes `distraction_caught` per step (hedge-phrase
   heuristic + empty tool calls).
4. Human-score each run in the eval-kit dashboard — the auto-score flags
   candidates; the human verdict on golden truth and the calibration /
   explainability dimensions is the actual result.

## Reproduce

```bash
export ANTHROPIC_API_KEY=sk-ant-...
pnpm install --ignore-workspace   # or: npm install
pnpm run run                      # or: npx tsx run.ts
```

Run artifacts land in `runs/<date>-<model>.json` and are checked in after
scoring so the writeup is verifiable.

Cost: the distractor subset is a handful of 1–2 step tasks per suite —
a full three-model run is well under $1.

## Results

_To be filled in after the run + human scoring. The writeup lives at
`content/research/001-distractor-pushback.mdx` and links back here._

## Notes / caveats

- `distraction_caught` is a heuristic (hedge-phrase regex). Treat it as triage,
  not the finding — the human-scored run is the citable number.
- The published `@eval-kit/seed-suite@0.1.1` only exports
  `researchAgentV1Path`; the coding and support suite paths are resolved as
  siblings of that file. Worth exporting all three paths in the next
  seed-suite release.
- Single run per model (no repeated sampling), so small differences between
  tiers are noise; only large gaps are worth reporting.
