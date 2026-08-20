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
    // Strip the trailing slash the URL constructor adds to the root ("/" →
    // origin + "/"). Next serves and self-canonicalises every route WITHOUT a
    // trailing slash (its default trailingSlash: false), so the home entry has
    // to be slash-less too — otherwise the sitemap advertises a URL that
    // disagrees with the page's own canonical, which is what left the homepage
    // "Discovered but not crawled" in Bing. Interior paths are unaffected.
    url: new URL(item.href, site.url).toString().replace(/\/$/, ""),
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
