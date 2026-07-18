/**
 * Experiment 001 — Does pushback scale with model tier?
 *
 * Runs ONLY the distractor tasks (`is_distraction: true`) from all three
 * eval-kit seed suites (research, coding, support) against three Anthropic
 * model tiers, and reports the tier-1 auto-score `distraction_caught` rate.
 *
 * Distractor tasks are pass-when-the-agent-pushes-back: future-dated papers,
 * unverifiable claims, out-of-scope asks. A "caught" distraction means the
 * agent hedged/refused instead of fabricating a plausible answer.
 *
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   pnpm install --ignore-workspace
 *   pnpm run run            # or: npx tsx run.ts
 *
 * Output: runs/<date>-<model>.json per model (open in the eval-kit dashboard
 * to human-score), plus a summary table on stdout.
 *
 * Cost: distractor tasks are a small subset of each suite (1 per suite,
 * 1-2 steps each), so a full three-model run is well under a dollar.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createAnthropicAdapter, runSuite } from "@eval-kit/core";
import { loadSuite } from "@eval-kit/core/loader";
import { researchAgentV1Path } from "@eval-kit/seed-suite";

// The published seed-suite only exports the research suite's path, but all
// three YAMLs ship in the package — resolve the siblings from the export.
const suitesDir = dirname(researchAgentV1Path);
const SUITE_PATHS = [
  researchAgentV1Path,
  join(suitesDir, "coding-agent-v1.yaml"),
  join(suitesDir, "support-agent-v1.yaml"),
];

// The three current Anthropic tiers under comparison.
const MODELS = ["claude-haiku-4-5", "claude-sonnet-5", "claude-opus-4-8"];

interface ModelSummary {
  model: string;
  caught: number;
  total: number;
  outPath: string;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "ANTHROPIC_API_KEY is not set. Export it first:\n" +
        "  export ANTHROPIC_API_KEY=sk-ant-...",
    );
    process.exit(1);
  }

  // Load every suite, keep only distractor tasks, and merge them into one
  // synthetic "distractors-v1" suite so each model produces a single run file.
  const suites = await Promise.all(SUITE_PATHS.map((p) => loadSuite(p)));
  const base = suites[0];
  const distractorSuite = {
    ...base,
    suite: {
      ...base.suite,
      id: "distractors-v1",
      description:
        "Distractor tasks (is_distraction: true) pooled from the three eval-kit seed suites. Pass = the agent pushes back instead of fabricating.",
      tasks: suites.flatMap((s) =>
        s.suite.tasks.filter((t) => t.is_distraction),
      ),
    },
  };

  console.log(
    `Pooled ${distractorSuite.suite.tasks.length} distractor tasks from ${suites.length} suites:`,
  );
  for (const t of distractorSuite.suite.tasks) console.log(`  - ${t.id}`);

  const outDir = resolve(process.cwd(), "runs");
  await mkdir(outDir, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);

  const summaries: ModelSummary[] = [];
  for (const model of MODELS) {
    const adapter = createAnthropicAdapter({ model });
    console.log(`\nRunning distractors-v1 against ${model}…`);
    const run = await runSuite(distractorSuite, { adapter });

    const outPath = join(outDir, `${date}-${model}.json`);
    await writeFile(outPath, JSON.stringify(run, null, 2));

    let caught = 0;
    let total = 0;
    for (const task of run.task_results) {
      for (const step of task.step_results) {
        if (step.auto_score?.distraction_caught != null) {
          total += 1;
          if (step.auto_score.distraction_caught) caught += 1;
        }
      }
    }
    summaries.push({ model, caught, total, outPath });
    console.log(`  distraction_caught: ${caught}/${total} → ${outPath}`);
  }

  console.log("\n=== Summary: distraction_caught by tier ===");
  for (const s of summaries) {
    const pct = s.total > 0 ? Math.round((100 * s.caught) / s.total) : 0;
    console.log(`  ${s.model.padEnd(20)} ${s.caught}/${s.total}  (${pct}%)`);
  }
  console.log(
    "\nNext: human-score each run in the eval-kit dashboard (the auto-score is\n" +
      "a hedge-phrase heuristic — the human verdict is the real result):\n" +
      "  git clone https://github.com/akaieuan/eval-kit && cd eval-kit\n" +
      "  pnpm install && pnpm --filter @eval-kit/dashboard dev\n" +
      "then copy the run JSONs from ./runs into eval-kit's runs/ directory.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
