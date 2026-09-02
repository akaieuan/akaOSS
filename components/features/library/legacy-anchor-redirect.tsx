"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LEGACY_ANCHORS } from "@/lib/library";

/**
 * Keeps every old `/components#<id>` deep link alive.
 *
 * The library used to be one long page with sixteen anchors on it; it is now an
 * overview plus five sub-pages. A fragment is never sent to the server, so no
 * redirect or rewrite can see it: the forwarding has to happen here, on the
 * client, once the overview has mounted.
 *
 * Unknown or absent hashes are left alone: the visitor stays on the overview,
 * which lists every specimen by name. That is also the no-JavaScript fallback:
* a stale link lands on a page that names its destination rather than on a 404.
 */
/**
 * A fragment may be percent-escaped, so it wants decoding: but a malformed
 * escape (`#50%`, `#c%3`) makes `decodeURIComponent` throw, and a throw inside
 * the mount effect below takes the whole overview page down with it. Every id
 * in `LEGACY_ANCHORS` is plain `[a-z-]+`, so the raw hash is a fine fallback:
 * worst case the lookup misses and the visitor stays on the overview, which is
 * already the documented behaviour for an unknown anchor.
 */
function safeDecode(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function LegacyAnchorRedirect() {
  const router = useRouter();

  useEffect(() => {
    const forward = () => {
      const id = safeDecode(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const destination = LEGACY_ANCHORS[id];
      if (destination) router.replace(destination);
    };

    forward();
    // Covers an in-page hash change, e.g. a stale link clicked from elsewhere
    // on the site while the overview is already open.
    window.addEventListener("hashchange", forward);
    return () => window.removeEventListener("hashchange", forward);
  }, [router]);

  return null;
}
