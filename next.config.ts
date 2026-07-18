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
    ];
  },
};

export default nextConfig;
