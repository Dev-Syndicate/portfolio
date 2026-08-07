import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (Next 16's renamed middleware). Two jobs:
 *   1. Refresh the Supabase auth session on every matched request so the
 *      admin's login stays valid across navigations.
 *   2. Guard /admin — anyone without a valid session is bounced to the login
 *      page before the protected route ever renders. This is server-side, so
 *      it can't be bypassed by tampering with the client.
 *
 * The public site (/, /blog, etc.) is unaffected — the matcher scopes this to
 * /admin only (plus it excludes static assets).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() revalidates the token with Supabase (getSession only
  // reads the cookie and can be spoofed). Use getUser for the auth gate.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdmin = pathname.startsWith("/admin");

  // Admin responses must never be cached by the browser or a CDN — otherwise
  // the back/forward cache can show a stale admin page after sign-out. This
  // forces a fresh server round-trip (and this auth check) every time.
  const noStore = (res: NextResponse) => {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  };

  // Not signed in and trying to reach a protected admin page → send to login.
  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return noStore(NextResponse.redirect(url));
  }

  // Already signed in and hitting the login page → go straight to dashboard.
  // (The client also replace()s on login, so this only fires on a direct visit
  // to /admin/login while already authenticated.)
  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return noStore(NextResponse.redirect(url));
  }

  return noStore(response);
}

export const config = {
  // Run only on /admin routes. Everything else (public site, static assets,
  // image optimisation) is untouched, so the guard never blocks CSS/JS/images.
  matcher: ["/admin/:path*"],
};
