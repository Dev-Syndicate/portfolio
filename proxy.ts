import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (Next 16's renamed middleware). Jobs:
 *   1. Refresh the Supabase auth session on every request so the admin's login
 *      stays valid across navigations.
 *   2. Guard /admin — no valid session → bounced to login (server-side, can't
 *      be bypassed from the client).
 *   3. Lock the admin in: while signed in, visiting any PUBLIC page redirects
 *      back to /admin. The admin experience is contained until sign-out.
 *
 * Trade-off of (3): a signed-in admin cannot view the public site or the live
 * blog — sign out (or use a private window) to preview it.
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

  // getUser() revalidates the token with Supabase (getSession only reads the
  // cookie and can be spoofed). Use getUser for the auth gate.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdmin = pathname.startsWith("/admin");

  // Admin responses must never be cached, or the back/forward cache can show a
  // stale admin page after sign-out. Public pages keep their normal caching.
  const noStore = (res: NextResponse) => {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  };

  // --- Not signed in, reaching a protected admin page → login ---
  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return noStore(NextResponse.redirect(url));
  }

  // --- Signed in, on the login page → straight to the dashboard ---
  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return noStore(NextResponse.redirect(url));
  }

  // --- Signed in, on a PUBLIC page → lock back into admin ---
  // (Everything that isn't /admin is public here — the matcher already
  //  excludes static assets, images, OG, sitemap, robots, etc.)
  if (user && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return noStore(NextResponse.redirect(url));
  }

  // Admin pages get no-store; public pages keep their normal caching.
  return isAdmin ? noStore(response) : response;
}

export const config = {
  // Run on everything EXCEPT Next internals and static assets, so the admin
  // lock can apply to public routes without ever blocking CSS/JS/images/fonts
  // or the SEO files. Anything with a file extension is skipped.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|webmanifest)$).*)",
  ],
};
