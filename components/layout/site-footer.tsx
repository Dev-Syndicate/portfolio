import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { nav, seo, services, site } from "@/lib/content";
import { MarkLockup } from "@/components/ui/mark";

const instagramUrl =
  seo.sameAs.find((u) => u.includes("instagram.com")) ??
  "https://www.instagram.com/dev.syndicate/";

const linkedinUrl =
  seo.sameAs.find((u) => u.includes("linkedin.com")) ??
  "https://www.linkedin.com/in/devsyndicate/";

const githubUrl =
  seo.sameAs.find((u) => u.includes("github.com")) ??
  "https://github.com/Dev-Syndicate";

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

/** GitHub glyph — inline, same reason. */
function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

/** Envelope glyph, drawn to match the weight of the brand marks above. */
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 7 8.2 5.5a1.5 1.5 0 0 0 1.6 0L21 7" />
    </svg>
  );
}

/* The "What we build" column is generated from `services.items` rather than
   hand-listed, so it is always the real service list and each entry lands on
   that service's own card. */
const build = services.items.map((service) => ({
  label: service.short,
  href: `/services#${service.slug}`,
}));


/** A link in the footer matrix. Off-site rows carry a glyph; in-site ones don't. */
type FooterLink = {
  label: string;
  href: string;
  Icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
};

/* Three link columns, described as data so the markup below stays one loop and
   the hairline dividers can be placed by index rather than by hand. */
const columns: { id: string; label: string; links: readonly FooterLink[] }[] = [
  { id: "site", label: "Site", links: nav.map((n) => ({ ...n })) },
  { id: "build", label: "What we build", links: build },
  {
    id: "reach",
    /* Socials as text rather than a second "Start a project" — that CTA already
       has its own underlined link in the masthead immediately to the left, and
       printing it twice in one footer reads as a mistake. Four rows here also
       stops the third column looking starved beside two columns of five. */
    label: "Elsewhere",
    links: [
      { label: "Instagram", href: instagramUrl, Icon: InstagramIcon },
      { label: "LinkedIn", href: linkedinUrl, Icon: LinkedInIcon },
      { label: "GitHub", href: githubUrl, Icon: GitHubIcon },
      { label: site.email, href: `mailto:${site.email}`, Icon: MailIcon },
    ],
  },
];

/** Mono column heading — the site's technical register, used for labels that
 *  name a set rather than make a claim. */
function ColumnLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-mono text-[0.625rem] tracking-[0.16em] text-muted-foreground uppercase"
    >
      {children}
    </h2>
  );
}

/**
 * Footer — the colophon.
 *
 * A specimen sheet rather than a sitemap. The functional matrix is compressed
 * into a tight, mono-labelled grid with hairline gutters, and the space that
 * buys is spent on the one thing worth ending on: the name at full viewport
 * width, cropped by the bottom edge and fading into the void.
 *
 * The link content is unchanged — every route and every service still has its
 * own entry, generated from `nav` and `services.items` so neither column can
 * drift out of step with the site.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-28 overflow-hidden">
      {/* The wash. Two wide, low ellipses at the outer corners — the light the
          wordmark's gradient is nominally catching. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-32 -left-40 h-[32rem] w-[52rem] rounded-[50%] bg-[radial-gradient(closest-side,var(--bloom-core),var(--bloom-mid)_44%,var(--bloom-none)_74%)] opacity-70 blur-2xl" />
        <div className="absolute -right-40 -bottom-40 h-[30rem] w-[48rem] rounded-[50%] bg-[radial-gradient(closest-side,var(--bloom-core),var(--bloom-mid)_44%,var(--bloom-none)_74%)] opacity-50 blur-2xl" />
      </div>

      <div className="rule-fade" />

      <div className="container-page">
        {/* ── Masthead ─────────────────────────────────────────────────────
            The promise gets set at real size here rather than as the 13px grey
            aside it used to be. It is the studio's one sentence; the foot of
            the page is the last place it can land. */}
        <div className="grid gap-x-10 gap-y-12 pt-16 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:pt-20">
          <div className="flex max-w-md flex-col items-start gap-6">
            <Link href="/" aria-label={`${site.name} — home`} className="group">
              <MarkLockup
                name={site.name}
                size={36}
                nameClassName="text-[1.0625rem] tracking-tight"
              />
            </Link>

            <p className="text-[1.0625rem] leading-[1.6] text-pretty">
              <span className="text-foreground">
                We fix how organisations actually run
              </span>{" "}
              <span className="text-muted-foreground">
                — with software, AI, and automation.
              </span>
            </p>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border-b border-primary/40 pb-1 text-sm font-medium text-foreground transition-colors hover:border-primary"
            >
              Start a project
              <ArrowUpRight
                aria-hidden
                className="size-4 text-primary transition-transform duration-[var(--duration-base)] ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
              />
            </Link>
          </div>

          {/* ── The matrix ─────────────────────────────────────────────────
              Hairline gutters between columns rather than plain gaps — the
              spec-sheet register the rest of the site uses for anything that
              is a set of facts. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {columns.map((column, i) => (
              <nav
                key={column.id}
                aria-labelledby={`footer-${column.id}`}
                className={[
                  "flex flex-col gap-4",
                  // No rule before the first column; on `sm` the three sit in
                  // one row so every one after the first gets a left gutter.
                  i > 0 ? "sm:border-l sm:border-border sm:pl-8" : "",
                  // At two columns the third wraps to a new row and its rule
                  // would hang off nothing, so it is cleared below `sm`.
                  i === 2 ? "col-span-2 sm:col-span-1" : "",
                ].join(" ")}
              >
                <ColumnLabel id={`footer-${column.id}`}>
                  {column.label}
                </ColumnLabel>

                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => {
                    // mailto: and off-site URLs both need a plain anchor;
                    // only in-app routes go through <Link>.
                    const offSite = link.href.startsWith("http");
                    const isMail = link.href.startsWith("mailto:");
                    const { Icon } = link;
                    const cls =
                      "group/link inline-flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground";
                    const inner = (
                      <>
                        {Icon ? (
                          <Icon className="size-3.5 shrink-0 opacity-70 transition-opacity group-hover/link:opacity-100" />
                        ) : null}
                        {link.label}
                      </>
                    );

                    return (
                      <li key={link.href}>
                        {offSite || isMail ? (
                          <a
                            href={link.href}
                            className={cls}
                            {...(offSite
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {inner}
                          </a>
                        ) : (
                          <Link href={link.href} className={cls}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* ── Baseline readout ─────────────────────────────────────────
            Deliberately just the two facts. The social icon row that used to
            live here now duplicates the Elsewhere column three inches above it,
            so it is gone; a footer should not offer the same link twice. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border py-6 font-mono text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
          <span className="tabular-nums">© {year} {site.name}</span>
          <span aria-hidden className="text-muted-foreground/45">/</span>
          <span>Worldwide</span>
          <span aria-hidden className="text-muted-foreground/45">/</span>
          <a
            href={site.url}
            className="normal-case transition-colors hover:text-foreground"
          >
            {site.url.replace("https://", "")}
          </a>
        </div>
      </div>

      {/* ── The specimen ─────────────────────────────────────────────────
          Inside `container-page`, so the name's left and right edges land on
          exactly the same grid lines as the lockup and the social row above it.
          Decorative — the accessible brand name is the lockup. */}
      <div className="container-page">
        <div aria-hidden className="wordmark pt-10">
          <span>{site.name}</span>
        </div>
      </div>
    </footer>
  );
}
