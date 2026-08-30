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
    label: "Connect with us",
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
      {/* ── The watermark ────────────────────────────────────────────────
          The name at maximum scale, BEHIND the footer rather than beneath it.

          It used to be a band in the flow below the baseline readout, which
          made it a second thing the page ended with — you finished the footer,
          then met a slab with the name on it. As a watermark it stops being an
          event and becomes the surface the footer is printed on, which is what
          a brand mark at this scale is actually for.

          Bottom-anchored and bleeding off the edge, cropped by the footer's own
          `overflow-hidden`. FULL-BLEED rather than inside `container-page`: the
          mark now runs the true width of the viewport, edge to edge, so it
          reads as the surface the page is printed on rather than as a graphic
          sitting inside the same column as the links. It no longer shares the
          content grid, which is the deliberate trade — a watermark that lines
          up with the columns is still a layout element; one that ignores them
          is a ground.

          Decorative: the accessible brand name is the lockup at the top of the
          footer, so this never reaches assistive tech twice. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
      >
        <div className="wordmark wordmark-watermark">
          {/* Set solid, with no word space. At this scale the gap between
              "Dev" and "Syndicate" opens into a hole wide enough to read as
              two words rather than one mark. Derived from `site.name` rather
              than typed out, so a rename still flows through — and
              "DevSyndicate" is already a declared brand variant (see
              `seo.alternateNames`), not something invented here. */}
          <span>{site.name.replace(/\s+/g, "")}</span>
        </div>
      </div>


      <div className="container-page">
        {/* ── Masthead ─────────────────────────────────────────────────────
            The promise gets set at real size here rather than as the 13px grey
            aside it used to be — the foot of the page is the last place it can
            land, so it lands properly.

            Two parts, and the split is the point: the line names what the
            studio is FOR, the paragraph says what it actually does. Contrast
            carries the hierarchy the same way the display type does elsewhere
            on the site — full-contrast claim, muted support — rather than a
            size jump doing all the work. */}
        <div className="grid gap-x-10 gap-y-12 pt-16 pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:pt-20">
          <div className="flex max-w-md flex-col items-start gap-6">
            <Link href="/" aria-label={`${site.name} — home`} className="group">
              <MarkLockup
                name={site.name}
                size={36}
                nameClassName="text-[1.0625rem] tracking-tight"
              />
            </Link>

            <div className="flex flex-col gap-3">
              <p className="text-[1.1875rem] leading-[1.4] font-semibold tracking-tight text-balance text-foreground">
                Technology for Purpose.
              </p>
              <p className="text-[0.9375rem] leading-[1.65] text-pretty text-muted-foreground">
                We engineer software, AI, and automation that solve business
                problems, improve how teams work, and create lasting value.
              </p>
            </div>

            {/* ── Baseline readout ─────────────────────────────────────
                Moved up under the paragraph it belongs to. It used to be a
                full-width strip across the foot of the footer, which gave the
                page two endings — the columns finished, then a lone line of
                facts ran underneath them. Sat here it closes the masthead
                block, and the watermark gets the bottom of the frame to
                itself. Deliberately just the three facts. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
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

          {/* ── The matrix ─────────────────────────────────────────────────
              Three equal columns on one plain gutter. The hairline rules that
              used to separate them are gone: they were doing the job spacing
              already does, and because only columns 2 and 3 carried a rule
              plus its `pl-8`, the three columns were not actually the same
              width — the gaps read as 341px and 302px against each other.
              Equal tracks and one gap value line them up by construction. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {columns.map((column, i) => (
              <div key={column.id} className="flex flex-col items-start gap-8">
                <nav
                  aria-labelledby={`footer-${column.id}`}
                  className="flex flex-col gap-4"
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

                {/* ── The ask ─────────────────────────────────────────────
                    Inside the last column's cell, not as its own grid item.
                    Placed as a grid child it landed in the second row, whose
                    top is set by the TALLEST column — so it floated a hundred
                    pixels below the links it belongs to. Sitting in the cell it
                    hangs off the bottom of "Connect with us" at a fixed gap,
                    which is where it was asked to be: those links are ways to
                    reach the studio and this is the fourth. */}
                {i === columns.length - 1 ? (
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
                ) : null}
              </div>
            ))}
          </div>
        </div>

      </div>

    </footer>
  );
}
