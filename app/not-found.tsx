import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { nav } from "@/lib/content";
import { Chip } from "@/components/ui/chip";
import { Mark } from "@/components/ui/mark";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you’re looking for doesn’t exist or has moved.",
  // A 404 should never be indexed or waste crawl budget.
  robots: { index: false, follow: true },
};

/**
 * 404 — the light without the page.
 *
 * Uses the hero's horizon, but with the mark alone above an empty arc and no
 * content sitting in it. The composition is the message: this is the right
 * place, and there's nothing here. Then it hands over every route on the site
 * so the visitor never has to reach for the back button.
 *
 * This lives at the ROOT of `app/`, not inside `app/(site)/`, and that is
 * load-bearing: only the root `not-found` handles unmatched URLs *and*
 * `notFound()` thrown anywhere in the app. While it sat in the route group,
 * neither case reached it — a bad URL and a missing blog slug both fell through
 * to Next's built-in 404.
 *
 * Because the root layout is only the document shell, this page has to bring
 * the site chrome itself rather than inheriting it from `(site)/layout.tsx`.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <NotFoundView />
      </main>
      <SiteFooter />
      <div aria-hidden className="grain" />
    </>
  );
}

function NotFoundView() {
  return (
    <section className="relative isolate flex min-h-[82svh] flex-col items-center justify-center overflow-hidden py-28 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* The arc sits BELOW the copy, not behind it. At 46vh its bright rim
            ran straight through the intro paragraph and struck the line out. */}
        <div className="horizon horizon-halo animate-bloom-breathe top-[78vh]" />
        <div className="horizon horizon-rim top-[78vh]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_55%,transparent_30%,var(--background)_82%)]" />
      </div>

      <div className="container-page flex flex-col items-center gap-7">
        <Mark size={56} />

        <Chip>Error 404</Chip>

        <h1 className="display display-lg max-w-2xl">
          <span className="lead">This page</span>
          <span className="lit">went missing.</span>
        </h1>

        <p className="max-w-md text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty">
          The link may be out of date, or the page may have moved. Everything
          else is exactly where you left it.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Tell us what broke
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>

        {/* Every route, so a dead link never becomes a dead end. */}
        <nav aria-label="Site" className="mt-8 flex flex-wrap justify-center gap-2">
          {nav
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link key={item.href} href={item.href} className="chip">
                {item.label}
              </Link>
            ))}
        </nav>
      </div>
    </section>
  );
}
