import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // hitlkit.dev is the legacy domain: send humans to the canonical
      // akaoss.dev, but keep serving /r/* directly — those are the shadcn
      // registry endpoints existing consumers have hardcoded, and they
      // should never bounce through a redirect.
      {
        source: "/:path((?!r/|r$).*)",
        has: [{ type: "host", value: "(www\\.)?hitlkit\\.dev" }],
        destination: "https://www.akaoss.dev/:path",
        permanent: true,
      },
      // The brand catalogue was /demo; it is /style now, the name fkayion
      // uses for the same page. Unlisted and noindex, so this is belt and
      // braces for anyone who bookmarked it.
      { source: "/demo", destination: "/style", permanent: true },
      { source: "/demo/:path*", destination: "/style/:path*", permanent: true },
      // The inertial exhibits used to have their own page; they now render
      // inline in the essay that earns them.
      { source: "/inertial", destination: "/research/006-signals-not-verdicts", permanent: true },
    ];
  },
};

export default nextConfig;
