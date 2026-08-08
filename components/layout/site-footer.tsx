import Image from "next/image";
import Link from "next/link";

import { nav, seo, site } from "@/lib/content";
import { technology } from "@/lib/content";

const instagramUrl =
  seo.sameAs.find((u) => u.includes("instagram.com")) ??
  "https://www.instagram.com/dev.syndicate/";

/** Instagram glyph — lucide-react dropped its brand icons, so it's inline. */
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-subtle">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col gap-4">
          <Link
            href="/"
            className="flex w-fit items-center gap-2.5 text-base font-semibold tracking-tight"
          >
            <Image
              src="/dev-syndicate-logo.png"
              alt="Dev Syndicate logo"
              width={32}
              height={32}
              className="size-8"
            />
            {site.name}
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {site.promise}
          </p>
          {/* Natural on-page reinforcement of the brand's alternate names, so
              the Organization schema's alternateName isn't a schema-only claim
              — this is what helps the site rank for each spelling. */}
          <p className="text-xs leading-relaxed text-muted-foreground/70">
            Dev Syndicate — also known as DS, DevSyndicate, or Developer
            Syndicate — is a software development company building websites, web
            and mobile applications, and automation.
          </p>

          {/* Social */}
          <div className="mt-1 flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dev Syndicate on Instagram"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <InstagramIcon className="size-4.5" />
            </a>
          </div>
        </div>

        <nav aria-labelledby="footer-nav-heading" className="flex flex-col gap-3">
          <h2
            id="footer-nav-heading"
            className="text-xs font-semibold tracking-wider uppercase text-muted-foreground"
          >
            Company
          </h2>
          <ul className="flex flex-col gap-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Capabilities
          </h2>
          <ul className="flex flex-col gap-2.5">
            {technology.groups.map((group) => (
              <li key={group.id}>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {group.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="transition-colors hover:text-foreground"
          >
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
