import { createPublicClient } from "@/lib/supabase/public";

/**
 * Data access for blog posts stored in Supabase. The public site reads through
 * these; only published posts come back (the anon key + RLS enforce that even
 * if a query asked for more).
 *
 * Uses the cookieless public client so these work in build-time contexts
 * (generateStaticParams, sitemap, OG images) as well as at request time.
 *
 * The shape mirrors the old hardcoded `Article` type so the blog pages render
 * the same way — body is markdown/plain text here rather than typed blocks.
 */

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  body: string;
  coverUrl: string | null;
  keywords: string[];
  scrawl: string;
  category: string;
  readingMinutes: number;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToPost(row: any): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    description: row.description ?? "",
    body: row.body ?? "",
    coverUrl: row.cover_url ?? null,
    keywords: row.keywords ?? [],
    scrawl: row.scrawl ?? "",
    category: row.category ?? "",
    readingMinutes: row.reading_minutes ?? 3,
    status: row.status,
    publishedAt: row.published_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** All published posts, newest first — for the /blog index. */
export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map(rowToPost);
}

/** One published post by slug — for /blog/[slug]. Returns null if not found. */
export async function getPublishedPost(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return rowToPost(data);
}

/** Just the slugs of published posts — for generateStaticParams / sitemap. */
export async function getPublishedSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error || !data) return [];
  return data.map((r) => r.slug as string);
}
