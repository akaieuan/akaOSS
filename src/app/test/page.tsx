import { notFound } from "next/navigation";
import TestPageClient from "./TestPageClient";

export const metadata = {
  title: "Registry health · HITL Kit (dev)",
  robots: { index: false, follow: false },
};

/**
 * Dev-only gate. `process.env.NODE_ENV` is resolved at build time for
 * server components, so on a Vercel production build this branch runs
 * and Next statically marks /test as 404. In `pnpm dev` the other branch
 * runs and the page is accessible.
 */
export default function TestPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <TestPageClient />;
}
