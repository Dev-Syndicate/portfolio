"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Post management server actions. Every one of them RE-VERIFIES the caller's
 * admin session with `getUser()` before touching data — the proxy guard is the
 * first line, this is defence in depth, so even a direct action invocation
 * can't mutate posts without a valid session.
 *
 * Writes go through the service-role admin client, but only AFTER that check,
 * so RLS being bypassed is safe here.
 */

export type PostFormState = { error?: string; ok?: boolean };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const coverUrl = String(formData.get("cover_url") ?? "").trim() || null;
  const keywords = String(formData.get("keywords") ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  // Polaroid-wall card fields — both optional.
  const scrawl = String(formData.get("scrawl") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const status =
    String(formData.get("status") ?? "draft") === "published"
      ? "published"
      : "draft";
  // ~200 words per minute reading estimate.
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));

  return {
    title,
    slug,
    excerpt,
    description,
    body,
    coverUrl,
    keywords,
    scrawl,
    category,
    status,
    readingMinutes,
  };
}

/** Revalidate every surface a post appears on. */
function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

/**
 * Delete a cover image from storage given its public URL. The storage path is
 * everything after `/blog-covers/` in the URL. No-op on empty/malformed URLs.
 * Runs on the service-role admin client (bypasses RLS), so no extra bucket
 * DELETE policy is needed. Failures are swallowed — an orphaned file is a minor
 * cost, and we never want cleanup to break a save that already succeeded.
 */
async function deleteCoverByUrl(
  admin: ReturnType<typeof createAdminClient>,
  url: string | null | undefined,
) {
  if (!url) return;
  const marker = "/blog-covers/";
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length).split("?")[0];
  if (!path) return;
  try {
    await admin.storage.from("blog-covers").remove([path]);
  } catch {
    // ignore — orphaned file, not worth failing the request over
  }
}

/** Create a new post. */
export async function createPost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const f = readForm(formData);

  if (!f.title) return { error: "A title is required." };
  if (!f.slug) return { error: "A valid slug is required." };

  const admin = createAdminClient();
  const { error } = await admin.from("posts").insert({
    slug: f.slug,
    title: f.title,
    excerpt: f.excerpt,
    description: f.description,
    body: f.body,
    cover_url: f.coverUrl,
    keywords: f.keywords,
    scrawl: f.scrawl,
    category: f.category,
    reading_minutes: f.readingMinutes,
    status: f.status,
    published_at: f.status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "That slug is already taken — choose another."
          : "Could not save the post.",
    };
  }

  revalidateBlog(f.slug);
  redirect("/admin");
}

/** Update an existing post by id. */
export async function updatePost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing post id." };
  const f = readForm(formData);
  if (!f.title || !f.slug) return { error: "Title and slug are required." };

  const admin = createAdminClient();

  // Fetch the current row before writing: preserve published_at, and remember
  // the old cover so we can clean it up if it changed/was removed.
  const { data: existing } = await admin
    .from("posts")
    .select("published_at, status, cover_url")
    .eq("id", id)
    .maybeSingle();

  const oldCoverUrl: string | null = existing?.cover_url ?? null;

  let publishedAt = existing?.published_at ?? null;
  if (f.status === "published" && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  const { error } = await admin
    .from("posts")
    .update({
      slug: f.slug,
      title: f.title,
      excerpt: f.excerpt,
      description: f.description,
      body: f.body,
      cover_url: f.coverUrl,
      keywords: f.keywords,
      scrawl: f.scrawl,
      category: f.category,
      reading_minutes: f.readingMinutes,
      status: f.status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "That slug is already taken — choose another."
          : "Could not update the post.",
    };
  }

  // Save succeeded — now safe to delete the old cover if it changed or was
  // removed. Handles both replace (A→B: delete A) and remove (A→"": delete A).
  if (oldCoverUrl && oldCoverUrl !== f.coverUrl) {
    await deleteCoverByUrl(admin, oldCoverUrl);
  }

  revalidateBlog(f.slug);
  redirect("/admin");
}

/** Delete a post by id. */
export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!id) return;

  const admin = createAdminClient();

  // Grab the cover before deleting so we can clean it out of storage too.
  const { data: existing } = await admin
    .from("posts")
    .select("cover_url")
    .eq("id", id)
    .maybeSingle();

  await admin.from("posts").delete().eq("id", id);
  await deleteCoverByUrl(admin, existing?.cover_url ?? null);

  revalidateBlog(slug || undefined);
  redirect("/admin");
}
