import { whyUs } from "@/lib/content";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";
import {
  OutcomeDiagram,
  LastDiagram,
  MeasuredDiagram,
  KeepDiagram,
} from "@/components/artwork/value-diagrams";

/**
 * Values — the asymmetric split the reference uses for its "strategic choice"
 * module: type held to the left third, a 2×2 of cards filling the right.
 *
 * The detail worth preserving from the reference is the lighting. Each of the
 * four cards is lit from the corner that faces the middle of the grid, so the
 * four washes meet in the gap and draw a cross of light between them. It reads
 * as one source sitting behind the grid rather than four separate cards — and
 * it only works because the corners are assigned deliberately, so the mapping
 * below is load-bearing, not decoration.
 */

/* Index → the corner facing the centre of a 2×2. */
const FACING_CENTRE: BloomFrom[] = ["br", "bl", "tr", "tl"];

/* Index → the drawing. Parallel to `whyUs.reasons`, same as the service grid
   does it: the copy stays in content.ts and the artwork stays in the artwork
   folder, and this is the one line that marries them. */
const DIAGRAMS = [
  OutcomeDiagram,
  LastDiagram,
  MeasuredDiagram,
  KeepDiagram,
] as const;

export function Values() {
  return (
    <section
      aria-labelledby="values-heading"
      className="section-y relative isolate"
    >
      <div className="container-page">
        {/* ── The claim, on the page's centre line ─────────────────────────
            The same centred header every other section on this page opens
            with, so Values stops being the one band with its type shoved into
            a left column.

            No `lit` class on the heading. The site sets several section heads
            as `display display-lg lit`, and on a single element that class does
            nothing at all — `.display .lit` is a DESCENDANT selector, so it
            only matches a span inside. Those heads render at full contrast
            because `.display` sets no colour and they inherit it, not because
            of the class. Copying the pattern would just carry the confusion
            forward. */}
        <Reveal className="flex flex-col items-center gap-5 text-center">
          {/* MEASURE-FIRST-TUNED. The cap moved off this block and onto the
              paragraph, because a `max-w-2xl` around both was what broke the
              headline over two lines.

              `.display` without `display-lg`, then a fluid size: the site's
              display steps are unlayered CSS, so a Tailwind size utility would
              silently lose to `.display-lg` — the same specificity trap the
              capsule hit. `.display` itself sets no font-size, so the utility
              applies cleanly. The vw term is tuned to the actual measured width
              of this exact string, so it holds one line from 360px up. */}
          <h2
            id="values-heading"
            className="display text-[clamp(1.4rem,8vw,4.5rem)]"
          >
            {whyUs.heading}
          </h2>

          <p className="max-w-2xl text-[1.0625rem] leading-[1.75] text-balance text-muted-foreground sm:text-lg">
            {whyUs.intro}
          </p>
        </Reveal>

        {/* ── The cross-lit grid ───────────────────────────────────────────
            Held to 5xl and centred, so the cross of light where the four
            washes meet lands on the same axis the header is centred on. That
            alignment is the reason this stayed a 2×2 rather than becoming a
            row of four: a single row has no middle for the corners to face,
            and the cross — the one thing that makes these read as four faces
            of one light rather than four cards — would have no place to
            form. */}
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-20">
            {whyUs.reasons.map((reason, i) => {
              const Diagram = DIAGRAMS[i];

              return (
                <Reveal key={reason.title} delay={i * 0.08}>
                  {/* `overflow-hidden` is what lets the drawing run to the
                      panel's edges and still be cut by its rounded corners.
                      Safe on these cards specifically because nothing inside
                      them is focusable — on a card that wrapped a link it
                      would clip the focus ring. */}
                  <Bloom
                    from={FACING_CENTRE[i]}
                    className="h-full overflow-hidden"
                    as="article"
                  >
                    {/* Held to the width the drawings were designed at, so a
                        1px hairline renders as 1px. Let them stretch to a
                        470px card and every weight scales with it — the set
                        stops matching the service diagrams, and the card grows
                        a 290px-tall picture for a two-line idea. */}
                    <div className="value-art mx-auto w-full max-w-[340px] pt-7">
                      <Diagram />
                    </div>

                    <div className="px-7 pb-7 sm:px-8 sm:pb-8">
                      <h3 className="text-xl font-medium tracking-tight">
                        {reason.title}
                      </h3>

                      <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-muted-foreground">
                        {reason.body}
                      </p>
                    </div>
                  </Bloom>
                </Reveal>
              );
            })}
        </div>
      </div>
    </section>
  );
}
