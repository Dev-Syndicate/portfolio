import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase client using the service-role key. It BYPASSES Row Level
 * Security, so it must only ever run on the server AFTER the caller's admin
 * session has been verified (see the admin server actions).
 *
 * The `server-only` import makes the build fail if this file is ever imported
 * into client code — a hard guard so the service key can never reach the
 * browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
