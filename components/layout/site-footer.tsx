import Link from "next/link";

import { nav, site } from "@/lib/content";
import { technology } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-subtle">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col gap-4">
          <Link
            href="/"
            className="flex w-fit items-center gap-2.5 text-base font-semibold tracking-tight"
          >
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"
            >
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none">
                <path
                  d="M4 7 9 12l-5 5M12 17h8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {site.name}
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {site.promise}
          </p>
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
                  // Technology lives on /insights now, not /services.
                  href="/insights#technology"
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
