import { about } from "@/lib/content";

/**
 * ABOUT HERO — the one page that is about the studio rather than the work.
 *
 * It does not use the shared `PageHeader`, and the reason is the type split.
 * Every other headline on the site runs a muted setup into a lit payoff — a
 * crescendo, bright half last. This headline is a statement of precedence:
 * purpose BEFORE product. The word that comes first is the word that matters
 * most, so the bright half has to be the first one, and setting "product"
 * bright would have the type arguing against the sentence. `PageHeader` can
 * only render lead-then-lit, and teaching it to flip would put a switch on
 * four other pages to serve one.
 *
 * NO EYEBROW. Every other page opens with a chip naming the section, because
 * on an interior page that chip is doing real work — it tells you where you
 * have landed. Here the page is three words long at display size and the nav
 * item that brought you here already said "About". A chip would be the page
 * introducing itself twice before saying anything.
 *
 * THE LIGHT ARRIVES FROM BOTH SIDES. The site has two established directions
 * and each means something: the home hero is lit from BELOW (a horizon,
 * something rising) and the interior `PageHeader` from ABOVE (a dome pressing
 * down on a chapter opener). A single off-centre source would fight centred
 * type, so this is a matched pair beyond the left and right edges, leaving the
 * middle of the frame as the darkest part of it. The statement sits in the
 * quiet between two sources rather than under a spotlight — which is the right
 * reading for a page whose whole argument is restraint.
 *
 * Server component. The entrance is the same CSS-only staggered `rise-in` the
 * interior headers use, so this page ships no motion bundle for its header.
 */

/* Shared by both sides so they can never drift out of symmetry. */
const BLOOM =
  "animate-bloom-breathe pointer-events-none absolute top-1/2 h-[46rem] max-h-[140vh] w-[38rem] max-w-[55vw] -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,var(--bloom-core),var(--bloom-mid)_40%,var(--bloom-none)_72%)] opacity-45 blur-2xl";

export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className={`${BLOOM} -left-[22rem]`} />
        <div className={`${BLOOM} -right-[22rem]`} />
        {/* Holds the middle of the frame at true black so the two sources read
            as edges rather than merging into one wash behind the type. */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_100%_at_50%_50%,var(--background)_18%,transparent_75%)]" />
      </div>

      <div className="container-page">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 pt-32 pb-14 text-center sm:pt-40 sm:pb-20">
          <h1
            className="display display-lg animate-rise-in"
            style={{ "--rise-delay": "80ms" } as React.CSSProperties}
          >
            {/* Bright half first — see the note above. Both halves are blocks,
                so the line breaks between them at every width and the
                precedence is spatial as well as tonal. */}
            <span className="lit">{about.hero.lit}</span>
            <span className="lead">{about.hero.lead}</span>
          </h1>

          <p
            className="animate-rise-in max-w-xl text-[1.0625rem] leading-[1.75] text-muted-foreground text-pretty sm:text-lg"
            style={{ "--rise-delay": "220ms" } as React.CSSProperties}
          >
            {about.hero.intro}
          </p>
        </div>
      </div>

      <div className="container-page">
        <div className="rule-fade" />
      </div>
    </section>
  );
}
