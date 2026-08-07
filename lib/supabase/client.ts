import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components (the admin dashboard UI).
 * Uses the public anon key — safe in the browser; Row Level Security on the
 * database is what actually protects the data.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
