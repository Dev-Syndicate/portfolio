import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { footerServices, hero, nav, seo, site } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import { WordmarkReveal } from "@/components/ui/wordmark-reveal";

const instagramUrl =
  seo.sameAs.find((u) => u.includes("instagram.com")) ??
  "https://www.instagram.com/dev.syndicate/";

const linkedinUrl =
  seo.sameAs.find((u) => u.includes("linkedin.com")) ??
  "https://www.linkedin.com/in/devsyndicate/";

/* Resolved from `seo.sameAs` rather than typed out, so the schema graph and the
   footer can never claim different profiles. Set as WORDS, not icons — see the
   note on `.footer-social` in globals.css.

   GitHub is deliberately absent from this list but still present in
   `seo.sameAs`, and the split is intentional: `sameAs` is the machine-readable
   claim that these profiles are all the same organisation, which is what ties
   the brand entity together for search, and dropping the account from there to
   tidy a footer column would weaken that for nothing. It is only the visible
   row that goes. */
const socials = [
  { label: "LinkedIn", href: linkedinUrl },
  { label: "Instagram", href: instagramUrl },
];

/* Home and Contact are pulled from the footer's route list on purpose, and
   neither becomes unreachable by it: the header lockup is the link home on
   every page, and Contact has the "Start a project" pill directly above this
   column plus the address in the rail below it. Printing them here as well
   would be a third and fourth route to the same two places inside one footer.

   Filtered rather than hand-listed, so a route added to `nav` still appears. */
const pages = nav.filter(
  (item) => item.href !== "/" && item.href !== "/contact",
);

/**
 * The flat hairline pill. Two of them, and the pair is the whole call to
 * action — one route in, one address.
 */
function Pill({
  href,
  external,
  children,
  glyph,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  glyph: React.ReactNode;
}) {
  const inner = (
    <>
      <span>{children}</span>
      {glyph}
    </>
  );

  return external ? (
    <a href={href} className="footer-pill">
      {inner}
    </a>
  ) : (
    <Link href={href} className="footer-pill">
      {inner}
    </Link>
  );
}

/**
 * Footer — the closing panel.
 *
 * A composition, not a sitemap. A tall empty field, the site's claim set at
 * display size with two pills under it, three short link columns opposite, and
 * the name set solid at container width, rising letter by letter as you reach
 * it. The emptiness above the mark is doing as much work as anything printed
 * in it.
 *
 * WHAT CHANGED AND WHY. This used to be a three-column link matrix under
 * tracked-out mono labels, printed over the name at 8% opacity. Every element
 * in it was quiet, so nothing was the ending — you finished a grid of nineteen
 * links and the page simply stopped. Here the name is promoted from watermark
 * to object and takes the whole bottom of the frame, and the link count comes
 * down to eight to pay for the space.
 *
 * WHAT IS DELIBERATELY NOT HERE. Home and Contact (both reachable twice over
 * from this same footer — see the note on `pages`), the three services the
 * groupings do not name, and the GitHub row (kept in `seo.sameAs`, where it
 * still does its work — see the note on `socials`). Everything that remains is
 * generated from content.ts rather than hand-listed, so a route or a service
 * cannot quietly fall out of step with the rest of the site.
 *
 * No bloom, no glow, no gradient ground. Flat black is what lets the mark
 * land; a wash under this composition would put it back in competition with
 * the thing it is supposed to be the backdrop for.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-24 overflow-hidden">
      {/* ── The empty field ────────────────────────────────────────────────
          `justify-end` against an svh floor: the content sits at the bottom of
          a tall box and the space above it is the composition, not a padding
          value that happens to be large. */}
      <div className="container-page flex min-h-[64svh] flex-col justify-end pt-32 sm:min-h-[72svh]">
        {/* `xl`, not `sm`. The link group is three columns wide now, one of
            them carrying a 31-character label — beside a display statement at
            up to 84px there is not room for both on one line until the
            container is genuinely wide. Below that they stack, which is the
            same arrangement the phone gets. */}
        <div className="flex flex-col gap-y-14 xl:flex-row xl:items-start xl:justify-between xl:gap-x-12">
          <div className="flex flex-col items-start">
            <Reveal>
              {/* One <h2> carrying both authored lines. Split across two
                  headings it would announce as two separate sections to a
                  screen reader; split with a <br> it would lose the line box
                  the type needs.

                  This is `hero.headline` — literally the same object the home
                  page opens on, not a copy of its words. The site's claim now
                  bookends every page: it is the first thing you read and the
                  last. Reusing the object rather than retyping the string is
                  what stops the two drifting apart, which is the whole reason
                  the phrase lives in content.ts. */}
              <h2 className="footer-statement text-pretty">
                <span>{hero.headline.lead}</span>
                <span>{hero.headline.lit}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Pill
                  href="/contact"
                  glyph={<ArrowRight className="size-4" aria-hidden />}
                >
                  Start a project
                </Pill>
                {/* The @ is the glyph, the way the reference sets it — it
                    names the medium without spelling out the address, which
                    the rail below already carries in full. */}
                <Pill
                  href={`mailto:${site.email}`}
                  external
                  glyph={
                    <span aria-hidden className="text-base leading-none">
                      @
                    </span>
                  }
                >
                  Email us
                </Pill>
              </div>
            </Reveal>
          </div>

          {/* ── The three link columns ───────────────────────────────────
              Pages, then what we build, then where else to find us. Set
              identically, and ordered so the middle column expands the
              "Services" link immediately to its left.

              They sit level with the STATEMENT, not with the pills below it.
              Bottom-aligned to the pills the group read as a footnote to the
              buttons — it sat in the lowest band of the field with the whole
              headline empty to its left. Level with the first line of
              "Technology for Purpose." the two halves of the row start
              together, and the empty space collects underneath them where it
              belongs, between the content and the mark.

              The columns are three, three and three items, so they also share
              a bottom edge for free; `items-start` is what fixes the top, and
              the optical nudge below is what makes "About" and "Technology"
              actually look level rather than merely measure level.

              No column headings. Three stacks reading "About / Services /
              Blog", "Digital products / …" and "LinkedIn / Instagram" are
              legible as what they are, and a label over each would be the only
              chrome in a composition that has otherwise earned its quiet. The
              names screen readers need are on the <nav> elements instead, where
              they cost the design nothing.

              RIGHT-ALIGNED, and only from `xl`. The middle column carries a
              31-character label; at `sm` three columns of this size and the
              statement cannot share a line without one crushing the other, so
              below `xl` the whole group drops beneath the statement and sets
              flush left, where there is nothing to align against anyway.
              `flex-wrap` is the backstop for the widths in between. */}
          <Reveal delay={0.16}>
            <div className="footer-links flex flex-wrap items-start gap-x-10 gap-y-8 sm:gap-x-14">
              <nav aria-label="Site">
                <ul className="footer-social flex flex-col gap-1 xl:text-right">
                  {pages.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="What we build">
                <ul className="footer-social flex flex-col gap-1 xl:text-right">
                  {footerServices.map((service) => (
                    <li key={service.slug}>
                      <Link href={`/services#${service.slug}`}>
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* The platforms, then the ask. `.footer-social` moves to the
                  wrapper so both are set in the column's one voice, and the
                  <nav> keeps only what is actually navigation — "Start a
                  project" is an action, not a profile, so it sits outside the
                  landmark rather than being announced as a third platform.

                  The underline is the only thing separating them, and that is
                  the point: it is the web's oldest signal for "this does
                  something", so it marks the action without needing a colour,
                  a weight or a glyph the other two columns do not have. */}
              <div className="footer-social flex flex-col gap-1 xl:text-right">
                <nav aria-label="Dev Syndicate on other platforms">
                  <ul className="flex flex-col gap-1">
                    {socials.map((social) => (
                      <li key={social.href}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <Link href="/contact" className="footer-action">
                  Start a project
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── The name ───────────────────────────────────────────────────────
          Set solid, at container width, with no word space — at this scale the
          gap between "Dev" and "Syndicate" opens into a hole wide enough to
          read as two words rather than one mark. Derived from `site.name` so a
          rename flows through, and "DevSyndicate" is already a declared brand
          variant (see `seo.alternateNames`) rather than something invented here.

          It rises letter by letter as the footer is scrolled to — the last beat
          of the footer's single entrance, after the statement, the pills and
          the links. See `WordmarkReveal` for why it is a per-letter mask rather
          than the shared fade-and-slide everything above it uses.

          `aria-hidden`: the accessible brand name is in the rail below, so this
          never reaches assistive tech twice — and it is what keeps the split
          letters from being announced one at a time. */}
      <div className="container-page mt-16 sm:mt-24">
        <div aria-hidden className="wordmark wordmark-solid">
          <WordmarkReveal text={site.name.replace(/\s+/g, "")} />
        </div>
      </div>

      {/* ── The rail ───────────────────────────────────────────────────────
          One row, and no divider above it. A rule here would be the third
          horizontal band in six inches of page — the wordmark's own baseline
          already draws a harder line than any hairline could, and a second one
          under it just reads as a box edge. Space separates them instead.

          Two facts, nothing else. The routes used to sit here as well; they are
          set properly in the column above now, and leaving a duplicate set down
          here would make the same five links appear twice in one footer. */}
      <div className="container-page">
        <div className="flex flex-col gap-3 pt-10 pb-8 text-[0.75rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular-nums">
            © {year} {site.name}
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
