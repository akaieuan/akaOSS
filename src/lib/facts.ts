/**
 * Derived facts about the sibling repos, read from the committed `facts.json`.
 *
 * Nothing in here is hand-written. `scripts/facts.ts` regenerates the file from
 * npm and PyPI, and `pnpm facts:check` fails CI if the committed copy has moved.
 * Do not type a version number into `projects.ts`; put the package name there
 * and let the registry answer for the version.
 *
 * Reading the JSON at module scope keeps the site build hermetic: the network
 * is touched by `facts:build`, never by `next build`.
 */
import factsJson from "../../facts.json" with { type: "json" };

export interface Facts {
  /** ISO timestamp of the last successful `pnpm facts:build`. */
  generatedAt: string;
  /** npm package name to latest published version. */
  npm: Record<string, string>;
  /** PyPI package name to latest published version. */
  pypi: Record<string, string>;
}

export const FACTS: Facts = factsJson as Facts;

/**
 * Latest published version, or null when the package is absent from the
 * generated file. Callers render nothing rather than a placeholder: an
 * unlabelled gap is honest, "v?" is not.
 */
export function npmVersion(pkg: string): string | null {
  return FACTS.npm[pkg] ?? null;
}

export function pypiVersion(pkg: string): string | null {
  return FACTS.pypi[pkg] ?? null;
}
