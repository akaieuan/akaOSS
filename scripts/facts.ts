/**
 * Regenerates `facts.json` from the registries that actually serve the
 * packages: npm for the JS family, PyPI for hologram.
 *
 * The site used to state these versions in hand-written prose, which drifted
 * four separate times. Anything a registry can answer belongs here; anything
 * editorial stays in `projects.ts`.
 *
 * Fetch is all-or-nothing on purpose. A partial write would leave `facts.json`
 * half-true with a fresh timestamp, which is worse than a stale file that
 * honestly reports when it was generated.
 *
 *   pnpm facts:build   regenerate
 *   pnpm facts:check   regenerate and fail if the committed copy moved
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { PROJECTS } from "../src/lib/projects.js";
import type { Facts } from "../src/lib/facts.js";

const NPM_REGISTRY = "https://registry.npmjs.org";
const PYPI = "https://pypi.org/pypi";
const TIMEOUT_MS = 15_000;

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

/** Latest published version, via the dist-tag rather than the version list. */
async function npmVersion(pkg: string): Promise<string> {
  const body = (await getJson(`${NPM_REGISTRY}/${pkg}`)) as {
    "dist-tags"?: Record<string, string>;
  };
  const latest = body["dist-tags"]?.latest;
  if (!latest) throw new Error(`no dist-tags.latest for ${pkg}`);
  return latest;
}

async function pypiVersion(pkg: string): Promise<string> {
  const body = (await getJson(`${PYPI}/${pkg}/json`)) as {
    info?: { version?: string };
  };
  const version = body.info?.version;
  if (!version) throw new Error(`no info.version for ${pkg}`);
  return version;
}

/** Sorted so the generated file has a stable diff, not registry ordering. */
function sortKeys(entries: [string, string][]): Record<string, string> {
  return Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
}

async function main() {
  const npmPackages = PROJECTS.flatMap((p) => p.packages);
  const pypiPackages = PROJECTS.flatMap((p) => (p.pypi ? [p.pypi] : []));

  console.log(
    `Fetching ${npmPackages.length} npm + ${pypiPackages.length} PyPI packages...`,
  );

  // Promise.all rejects on the first failure, which is the intent: one
  // unreachable registry must not produce a partially-refreshed file.
  const [npmEntries, pypiEntries] = await Promise.all([
    Promise.all(
      npmPackages.map(async (p): Promise<[string, string]> => [
        p,
        await npmVersion(p),
      ]),
    ),
    Promise.all(
      pypiPackages.map(async (p): Promise<[string, string]> => [
        p,
        await pypiVersion(p),
      ]),
    ),
  ]);

  const facts: Facts = {
    generatedAt: new Date().toISOString(),
    npm: sortKeys(npmEntries),
    pypi: sortKeys(pypiEntries),
  };

  const out = join(process.cwd(), "facts.json");
  writeFileSync(out, `${JSON.stringify(facts, null, 2)}\n`, "utf8");

  for (const [pkg, version] of [...npmEntries, ...pypiEntries]) {
    console.log(`  ${pkg}  ${version}`);
  }
  console.log(`\nWrote ${out}`);
}

main().catch((err: unknown) => {
  console.error(
    "\nfacts:build failed, facts.json left untouched:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
