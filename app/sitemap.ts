import type { MetadataRoute } from "next";

const BASE = "https://www.akaoss.dev";

const ROUTES = [
  "/",
  "/projects",
  "/projects/hitl-kit",
  "/projects/eval-kit",
  "/projects/tag-kit",
  "/projects/collapse",
  "/projects/hologram",
  "/research",
  "/paper",
  "/registry",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));
}
