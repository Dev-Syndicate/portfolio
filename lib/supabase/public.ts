import { createClient } from "@supabase/supabase-js";

/**
 * A cookieless anon Supabase client for reading PUBLIC data (published posts)
 * from contexts that have no HTTP request — `generateStaticParams`, the
 * sitemap, and OG-image generation at build time.
 *
 * It carries no auth session (RLS still limits it to published rows), so it is
 * safe to use anywhere a request-bound cookie store isn't available.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
