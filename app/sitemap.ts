import type { MetadataRoute } from "next";

import { nav, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return nav.map((item) => ({
    url: new URL(item.href, site.url).toString(),
    lastModified,
    changeFrequency: item.href === "/insights" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
