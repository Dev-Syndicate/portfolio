import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { nav, seo, site } from "@/lib/content";

const instagramUrl =
  seo.sameAs.find((u) => u.includes("instagram.com")) ??
  "https://www.instagram.com/dev.syndicate/";

const linkedinUrl =
  seo.sameAs.find((u) => u.includes("linkedin.com")) ??
  "https://www.linkedin.com/in/devsyndicate/";

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

/** LinkedIn glyph — inline for the same reason as Instagram. */
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** The angular DS monogram used through the site, as a large ghosted mark. */
function DsMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4 7 9 12l-5 5M12 17h8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The site's mono "instrument label": filled pad + trace stub + caption. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] text-muted-foreground uppercase">
      <span aria-hidden className="size-1.5 shrink-0 bg-primary" />
      <span aria-hidden className="h-px w-5 shrink-0 bg-border-strong" />
      {children}
    </span>
  );
}

/* The link matrix is the true information: two real groupings, each an honest
   set — the site's own pages, and what the studio builds (pointing at the one
   page that carries them in full). No decorative column headers. */
const build = [
  { label: "Websites", href: "/services" },
  { label: "Web & mobile apps", href: "/services" },
  { label: "APIs & automation", href: "/services" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-20 overflow-hidden border-t border-border-strong/60 bg-surface-subtle">
      {/* Oversized ghosted DS monogram — echoes the hero mark, bleeds off the
          right edge so the footer reads as the last view on the engineered
          sheet. Hidden from assistive tech; decorative only. */}
      <DsMark className="pointer-events-none absolute top-1/2 -right-10 -z-10 hidden h-[19rem] w-[19rem] -translate-y-1/2 text-foreground/[0.035] select-none sm:block lg:-right-4 lg:h-[22rem] lg:w-[22rem]" />

      <div className="container-page">
        {/* ── Main panel ─────────────────────────────────────────────── */}
        <div className="grid items-start gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand block */}
          <div className="flex max-w-sm flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="group flex w-fit items-center gap-2.5"
              aria-label="Dev Syndicate — home"
            >
              <Image
                src="/dev-syndicate-logo.png"
                alt=""
                aria-hidden
                width={36}
                height={36}
                className="size-8 transition-transform duration-[var(--duration-base)] ease-spring group-hover:rotate-6"
              />
              <span className="text-lg font-semibold tracking-tight">
                Dev Syndicate
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground">
              A software development company that solves complex problems with
              software, AI, and automation.
            </p>

            <Link
              href="/contact"
              className="group mt-0.5 inline-flex w-fit items-center gap-2 border-b border-primary/40 pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
            >
              Start a project
              <ArrowUpRight
                aria-hidden
                className="size-4 text-primary transition-transform duration-[var(--duration-base)] ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Navigate */}
          <nav aria-labelledby="footer-nav" className="flex flex-col gap-3.5">
            <span id="footer-nav">
              <Label>Navigate</Label>
            </span>
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

          {/* What we build */}
          <nav aria-labelledby="footer-build" className="flex flex-col gap-3.5">
            <span id="footer-build">
              <Label>What we build</Label>
            </span>
            <ul className="flex flex-col gap-2.5">
              {build.map((item) => (
                <li key={item.label}>
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
        </div>

        {/* ── Baseline readout strip — status · social · legal ───────── */}
        <div className="flex flex-col gap-4 border-t border-border py-5 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {/* <span className="flex items-center gap-2">
              <span aria-hidden className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Available
            </span>
            <span aria-hidden className="text-border-strong">
              /
            </span> */}
            <span>Worldwide</span>
            <span aria-hidden className="hidden text-border-strong sm:inline">
              /
            </span>
            <a
              href={`mailto:${site.email}`}
              className="normal-case transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dev Syndicate on Instagram"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <InstagramIcon className="size-4" />
              <span className="normal-case">@dev.syndicate</span>
            </a>
            <span aria-hidden className="hidden text-border-strong sm:inline">
              /
            </span>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dev Syndicate on LinkedIn"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <LinkedInIcon className="size-4" />
              <span className="normal-case">LinkedIn</span>
            </a>
            <span aria-hidden className="text-border-strong">
              /
            </span>
            <span className="tabular-nums">© {year} Dev Syndicate</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
