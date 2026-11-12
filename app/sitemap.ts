import type { MetadataRoute } from "next";
import { getResearchPosts } from "@/lib/research";

const BASE = "https://www.akaoss.dev";

/* The research surface: home, the paper, and every post, read from
   content/research so a new post is listed without touching this file. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getResearchPosts();
  const routes = ["/", "/paper", ...posts.map((p) => `/research/${p.slug}`)];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));
}
