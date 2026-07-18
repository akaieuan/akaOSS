"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, Loader2, Copy, RotateCw, AlertTriangle } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { cn } from "@/lib/utils";
import { REGISTRY_ITEMS, type RegistryItem } from "@/lib/registry-items";

type EndpointStatus =
  | "pending"
  | "ok"
  | "http-fail"
  | "parse-fail"
  | "schema-fail";

interface Result {
  item: RegistryItem;
  url: string;
  status: EndpointStatus;
  httpStatus?: number;
  bytes?: number;
  ms?: number;
  payload?: {
    files?: Array<{ path?: string; target?: string; type?: string }>;
    registryDependencies?: string[];
    dependencies?: string[];
  };
  error?: string;
}

const STATUS_META: Record<
  EndpointStatus,
  { icon: React.ElementType; color: string; label: string }
> = {
  pending: { icon: Loader2, color: "text-muted-foreground", label: "Checking…" },
  ok: { icon: Check, color: "text-[color:var(--accent-emerald)]", label: "OK" },
  "http-fail": { icon: X, color: "text-[color:var(--accent-rose)]", label: "Unreachable" },
  "parse-fail": { icon: X, color: "text-[color:var(--accent-rose)]", label: "Bad JSON" },
  "schema-fail": { icon: AlertTriangle, color: "text-[color:var(--accent-amber)]", label: "Schema warning" },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Copy"
    >
      {copied ? (
        <Check className="h-3 w-3 text-[color:var(--accent-emerald)]" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

export default function TestPageClient() {
  const [results, setResults] = useState<Result[]>([]);
  const [base, setBase] = useState<"local" | "prod">("local");
  const [running, setRunning] = useState(false);
  const [displayBaseUrl, setDisplayBaseUrl] = useState<string | null>(null);

  // Fetch target: same-origin for "local", absolute for "prod".
  // Relative URLs work for fetch and avoid any SSR/CSR origin mismatch.
  const getBaseUrl = useCallback(() => {
    if (base === "prod") return "https://www.hitlkit.dev/r";
    return "/r";
  }, [base]);

  // Display URL is computed after mount so the server can render a
  // stable placeholder and the client can populate the full origin.
  useEffect(() => {
    if (base === "prod") {
      setDisplayBaseUrl("https://www.hitlkit.dev/r");
    } else {
      setDisplayBaseUrl(`${window.location.origin}/r`);
    }
  }, [base]);

  const test = useCallback(async () => {
    setRunning(true);
    const baseUrl = getBaseUrl();
    setResults(
      REGISTRY_ITEMS.map((item) => ({
        item,
        url: `${baseUrl}/${item.name}.json`,
        status: "pending" as const,
      })),
    );

    const promises = REGISTRY_ITEMS.map(async (item): Promise<Result> => {
      const url = `${baseUrl}/${item.name}.json`;
      const start = performance.now();

      try {
        const res = await fetch(url, { cache: "no-store" });
        const ms = Math.round(performance.now() - start);

        if (!res.ok) {
          return {
            item,
            url,
            status: "http-fail",
            httpStatus: res.status,
            ms,
          };
        }

        const text = await res.text();
        const bytes = new Blob([text]).size;

        let payload: Result["payload"];
        try {
          payload = JSON.parse(text);
        } catch (e) {
          return {
            item,
            url,
            status: "parse-fail",
            httpStatus: 200,
            bytes,
            error: e instanceof Error ? e.message : String(e),
            ms,
          };
        }

        const issues: string[] = [];
        if (!payload?.files || !Array.isArray(payload.files)) {
          issues.push("missing files[]");
        }
        if (payload?.registryDependencies?.length) {
          const bare = payload.registryDependencies.filter(
            (d) => !d.startsWith("http"),
          );
          if (bare.length) {
            issues.push(`bare-name deps: ${bare.join(", ")}`);
          }
        }

        if (issues.length) {
          return {
            item,
            url,
            status: "schema-fail",
            httpStatus: 200,
            bytes,
            payload,
            error: issues.join("; "),
            ms,
          };
        }

        return {
          item,
          url,
          status: "ok",
          httpStatus: 200,
          bytes,
          payload,
          ms,
        };
      } catch (e) {
        const ms = Math.round(performance.now() - start);
        return {
          item,
          url,
          status: "http-fail",
          ms,
          error: e instanceof Error ? e.message : String(e),
        };
      }
    });

    const settled = await Promise.all(promises);
    setResults(settled);
    setRunning(false);
  }, [getBaseUrl]);

  useEffect(() => {
    test();
  }, [test]);

  const counts = {
    ok: results.filter((r) => r.status === "ok").length,
    pending: results.filter((r) => r.status === "pending").length,
    fail: results.filter(
      (r) =>
        r.status === "http-fail" ||
        r.status === "parse-fail" ||
        r.status === "schema-fail",
    ).length,
    total: REGISTRY_ITEMS.length,
  };

  const allOk = counts.ok === counts.total && counts.total > 0;
  const overallColor = running
    ? "text-muted-foreground"
    : allOk
      ? "text-[color:var(--accent-emerald)]"
      : counts.fail > 0
        ? "text-[color:var(--accent-rose)]"
        : "text-muted-foreground";

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-6xl px-6 pt-10">
        {/* Dev-only banner */}
        <section className="pt-6">
          <div className="flex items-center gap-2 rounded-lg border border-[color:var(--accent-amber)]/30 bg-[color:var(--accent-amber)]/[0.06] px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 text-[color:var(--accent-amber)]" />
            <p className="text-[11px] leading-relaxed text-foreground">
              <span className="font-medium">Dev-only page.</span>{" "}
              <span className="text-muted-foreground">
                Returns 404 on the production deploy. Use this to verify the
                registry locally before pushing.
              </span>
            </p>
          </div>
        </section>

        {/* Hero */}
        <section className="pt-8 pb-10">
          <p className="label mb-4">Registry health · live</p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Is the registry{" "}
            <span className={cn("tracking-tight", overallColor)}>
              {running ? "checking…" : allOk ? "live and clean" : `${counts.fail} failing`}
            </span>
            ?
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This page hits every registry endpoint from your browser, validates
            the JSON payload, and confirms transitive dependencies use full
            URLs. If something here is red, an external{" "}
            <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]">
              npx shadcn add
            </code>{" "}
            will fail.
          </p>
        </section>

        {/* Controls */}
        <section className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/40 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="label">Source</span>
            <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
              {(["local", "prod"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBase(b)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    base === b
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {b === "local" ? "Same origin" : "hitlkit.dev"}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10.5px] text-muted-foreground">
              {displayBaseUrl ?? "…"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="label">
              <span className="text-[color:var(--accent-emerald)]">{counts.ok}</span>
              <span className="text-muted-foreground/60"> / {counts.total} OK</span>
              {counts.fail > 0 && (
                <>
                  <span className="text-muted-foreground/60"> · </span>
                  <span className="text-[color:var(--accent-rose)]">{counts.fail} failing</span>
                </>
              )}
            </span>
            <button
              onClick={test}
              disabled={running}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <RotateCw
                className={cn("h-3 w-3", running && "animate-spin")}
              />
              {running ? "Checking…" : "Re-run"}
            </button>
          </div>
        </section>

        {/* Results */}
        <section className="pb-24">
          <div className="overflow-hidden rounded-xl border border-border">
            {results.map((r, i) => {
              const meta = STATUS_META[r.status];
              const Icon = meta.icon;
              const installCommand = `npx shadcn@latest add ${r.url}`;
              const targetPaths =
                r.payload?.files
                  ?.map((f) => f.target ?? f.path ?? "?")
                  .filter(Boolean) ?? [];

              return (
                <div
                  key={r.item.name}
                  className={cn(
                    "px-5 py-5 transition-colors",
                    i !== results.length - 1 && "border-b border-border",
                    r.status === "schema-fail" && "bg-[color:var(--accent-amber)]/[0.04]",
                    (r.status === "http-fail" || r.status === "parse-fail") &&
                      "bg-[color:var(--accent-rose)]/[0.04]",
                  )}
                >
                  {/* Top row: status + name + meta */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background/40",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-3 w-3",
                            meta.color,
                            r.status === "pending" && "animate-spin",
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-foreground">
                            {r.item.name}
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide",
                              r.item.type === "registry:ui"
                                ? "border-[color:var(--accent-blue)]/30 text-[color:var(--accent-blue)]"
                                : "border-border text-muted-foreground",
                            )}
                          >
                            {r.item.type === "registry:ui" ? "UI" : "Lib"}
                          </span>
                          <span className={cn("text-[11px] font-medium", meta.color)}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {r.item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-[10px] text-muted-foreground">
                      {r.httpStatus && (
                        <span>
                          HTTP <span className="text-foreground">{r.httpStatus}</span>
                        </span>
                      )}
                      {r.bytes !== undefined && (
                        <span>
                          <span className="text-foreground">{r.bytes}</span>B
                        </span>
                      )}
                      {r.ms !== undefined && (
                        <span>
                          <span className="text-foreground">{r.ms}</span>ms
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Error detail */}
                  {r.error && (
                    <p className="mt-2 ml-9 text-[11px] leading-relaxed text-[color:var(--accent-rose)]">
                      {r.error}
                    </p>
                  )}

                  {/* Install + landing paths + deps */}
                  {r.status === "ok" && (
                    <div className="mt-4 ml-9 space-y-2 text-[11px]">
                      <div className="flex items-center gap-2 rounded-md border border-border bg-background/40 px-2.5 py-1.5">
                        <pre className="flex-1 overflow-x-auto font-mono text-foreground">
                          <span className="text-muted-foreground">$</span>{" "}
                          {installCommand}
                        </pre>
                        <CopyBtn text={installCommand} />
                      </div>
                      {targetPaths.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="label">Lands at:</span>
                          {targetPaths.map((p) => (
                            <span
                              key={p}
                              className="rounded border border-border bg-background/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                      {r.payload?.registryDependencies?.length ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="label">Pulls in:</span>
                          {r.payload.registryDependencies.map((d) => {
                            const name =
                              d.split("/").pop()?.replace(".json", "") ?? d;
                            return (
                              <span
                                key={d}
                                className="rounded border border-[color:var(--accent-blue)]/30 bg-[color:var(--accent-blue)]/5 px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--accent-blue)]"
                              >
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      ) : null}
                      {r.payload?.dependencies?.length ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="label">npm deps:</span>
                          {r.payload.dependencies.map((d) => (
                            <span
                              key={d}
                              className="rounded border border-border bg-background/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/30 p-5">
              <p className="label mb-2">What this checks</p>
              <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-muted-foreground marker:text-muted-foreground/40">
                <li>HTTP reachability of every <code className="rounded bg-muted/60 px-1 font-mono">/r/*.json</code> endpoint</li>
                <li>Valid JSON payload</li>
                <li>Required fields present (<code className="rounded bg-muted/60 px-1 font-mono">files[]</code>)</li>
                <li>Every <code className="rounded bg-muted/60 px-1 font-mono">registryDependencies</code> entry is a full URL (bare names break third-party install)</li>
                <li>Latency per endpoint</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card/30 p-5">
              <p className="label mb-2">What it does NOT check</p>
              <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-muted-foreground marker:text-muted-foreground/40">
                <li>Whether the embedded source code compiles in a consumer project</li>
                <li>Whether <code className="rounded bg-muted/60 px-1 font-mono">npm dependencies</code> install correctly</li>
                <li>Runtime correctness of each primitive</li>
              </ul>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                For those, run{" "}
                <code className="rounded bg-muted/60 px-1 font-mono text-[10.5px]">
                  pnpm smoke-test
                </code>{" "}
                locally (CLI). See{" "}
                <a
                  href="https://github.com/akaieuan/HITL-KIT/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--accent-blue)] underline decoration-[color:var(--accent-blue)]/30 underline-offset-2 hover:decoration-[color:var(--accent-blue)]"
                >
                  CONTRIBUTING.md
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
