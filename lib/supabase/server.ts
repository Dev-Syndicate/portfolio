import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components and Server Actions. It reads and writes
 * the auth session through Next's cookie store, so the signed-in admin's
 * session is available server-side. Still the anon key — RLS enforces access.
 *
 * In Next 16 `cookies()` is async, so this factory is async too.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` can be called from a Server Component where writing
            // cookies isn't allowed. Safe to ignore when middleware is
            // refreshing the session (which it is).
          }
        },
      },
    },
  );
}
