import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/posts";

/**
 * Admin-side reads — include drafts. These use the request-bound server client
 * so the caller's authenticated session applies (the RLS "auth reads all"
 * policy lets a signed-in admin see everything; anon still can't).
 */

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

/** Every post (draft + published), newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToPost);
}

/** One post by id (for editing). */
export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToPost(data);
}
