import type { MetadataRoute } from "next";

import { nav, site } from "@/lib/content";
import { getPublishedPosts } from "@/lib/posts";

/**
 * XML sitemap. Static pages carry the deploy date; blog posts are pulled live
 * from Supabase and carry their own real published/updated dates so crawlers
 * see genuine per-post freshness.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deployDate = new Date();

  const pages: MetadataRoute.Sitemap = nav.map((item) => ({
    url: new URL(item.href, site.url).toString(),
    lastModified: deployDate,
    changeFrequency: item.href === "/blog" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

  const posts = await getPublishedPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: new URL(`/blog/${post.slug}`, site.url).toString(),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...postEntries];
}
