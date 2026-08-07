import type { MetadataRoute } from "next";

import { nav, site } from "@/lib/content";
import { articles } from "@/lib/articles";

/**
 * XML sitemap. Static pages carry the deploy date (accurate for a site whose
 * content updates on deploy); articles carry their own real `updated` date so
 * crawlers see genuine per-post freshness rather than one shared timestamp.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const deployDate = new Date();

  const pages: MetadataRoute.Sitemap = nav.map((item) => ({
    url: new URL(item.href, site.url).toString(),
    lastModified: deployDate,
    changeFrequency: item.href === "/insights" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: new URL(`/insights/${article.slug}`, site.url).toString(),
    lastModified: new Date(article.updated),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
