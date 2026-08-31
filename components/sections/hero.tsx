import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { hero } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { SignalField } from "@/components/artwork/signal-field";

/**
 * The opening: type on a lattice, and a signal crossing it.
 *
 * The headline sits in the quiet centre of a dot field (see
 * components/artwork/signal-field.tsx), and every few seconds one wavefront
 * leaves the copy and travels out through every dot on the screen. That is the
 * page's whole argument in one gesture — change the system at one point and the
 * effect reaches all of it — and it is the reason the field is here rather than
 * a texture: it is the claim, not decoration behind the claim.
 *
 * The type is unchanged and still carries the composition: one face, regular
 * weight, large, tightly tracked, with the setup line muted and the payoff at
 * full contrast (see the `.display` block in globals.css). Nothing here is
 * bold — the presence comes from scale and the per-character entrance below,
 * not from mass. The field is deliberately low-contrast underneath it; white
 * type at full brightness over a 9%-white dot loses nothing.
 *
 * Server component, and the words do not wait on the field. The entrance is
 * CSS-only — each element carries `animate-rise-in` with its own
 * `--rise-delay`, so the stagger costs no JavaScript and runs before
 * hydration. The canvas is additive: it fades in over the first 1.4s and the
 * hero is complete and readable without it.
 */
/* Delays for the payoff line's per-character entrance, in ms. */
const CHAR_START = 220;
const CHAR_STEP = 38;

/**
 * Split a line into per-character spans for the `char-in` entrance.
 *
 * Two structural rules make this safe rather than clever:
 *
 * 1. WORDS WRAP, CHARACTERS DO NOT. A character has to be `inline-block` to
 *    take a transform, and a bare run of inline-blocks will break anywhere —
 *    including mid-word. So characters are grouped into an inline-block word,
 *    and only the real spaces between words are breaking opportunities. The
 *    headline still reflows correctly at every width.
 *
 * 2. THE SPLIT IS INVISIBLE TO ASSISTIVE TECH. A screen reader handed 19
 *    separate spans may announce them as 19 letters, and the split text can
 *    also land in the clipboard one glyph per line. The animated glyphs are
 *    therefore `aria-hidden`, with the real sentence carried alongside in an
 *    `sr-only` span. Selection and the accessibility tree both see one string.
 *
 * Runs at render time on the server: the browser receives finished markup with
 * an inline `--char-delay` per glyph, so the sequence costs no JavaScript and
 * starts at first paint.
 */
function splitChars(line: string) {
  let index = 0;

  return line.split(" ").map((word, wordIndex) => (
    <Fragment key={wordIndex}>
      {/* A real space between words — the only place the line may break. */}
      {wordIndex > 0 ? " " : null}
      <span className="inline-block">
        {Array.from(word).map((char, charIndex) => (
          <span
            key={charIndex}
            className="animate-char-in"
            style={
              {
                "--char-delay": `${CHAR_START + index++ * CHAR_STEP}ms`,
              } as React.CSSProperties
            }
          >
            {char}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* The field reads the section for its own geometry: it measures
          `[data-hero-copy]` below to place the wave origin and the calm band,
          and it listens for the pointer across the whole section. Both depend
          on the canvas being a direct child here — not wrapped. */}
      <SignalField className="signal-field" />

      <div className="relative z-10 container-page">
        {/* The first screen is the claim and the two actions, and nothing
            else. `min-h-svh` is what makes that true rather than approximately
            true: it holds this block to a full viewport at every window height,
            so the promise row below can never creep up into the opening view on
            a tall monitor. `svh` rather than `vh` because mobile browser chrome
            collapses on scroll, and `vh` would let the row peek out from under
            it before settling.

            The top padding is the header's own height. The copy is centred in
            the space BELOW the nav rather than in the raw viewport, which is
            where the eye reads the centre to be. */}
        <div className="flex min-h-svh flex-col items-center justify-center pt-20 pb-16 text-center">
          {/* Everything the field has to stay quiet behind, in one box. It is
              a flex item in a centred column, so its measured width is the
              widest line of type rather than the full container — which is
              what keeps the calm band the shape of the headline instead of the
              shape of the page. */}
          <div data-hero-copy className="flex flex-col items-center">
            {/* The headline in two voices — one face, split by contrast alone:
                a muted setup line over a full-contrast payoff. See the
                `.display` block in globals.css.

                Three words now, so the measure is a formality: the block is a
                flex item in a centred column and sizes to its own longest line
                (~700px at full display size), nowhere near the cap. The cap
                only stops an enormous viewport from setting it wider than a
                comfortable read. Neither line can rag — there is nothing to
                break. */}
            <h1 className="display display-xl max-w-4xl">
              {/* The setup line rises as one block — the same entrance every
                  other element on the page uses. Only the payoff gets the
                  per-character treatment, so the effect stays an emphasis
                  rather than a house style. */}
              <span
                className="lead animate-rise-in"
                style={{ "--rise-delay": "100ms" } as React.CSSProperties}
              >
                {hero.headline.lead}
              </span>

              <span className="lit">
                {/* `select-none` matters as much as `sr-only` here. Without it a
                    reader who selects the headline copies BOTH this span and the
                    visible glyphs, and the clipboard gets the line twice. Opted
                    out of selection, this span serves assistive tech only, and
                    the visible characters — real text nodes with real spaces
                    between the words — are what the clipboard picks up. */}
                <span className="sr-only select-none">{hero.headline.lit}</span>
                <span aria-hidden>{splitChars(hero.headline.lit)}</span>
              </span>
            </h1>

            {/* Plain `balance` at every width now. The old copy needed a
                `pretty`-below-`sm` exception because it ran to seven lines on a
                phone, and Chrome only balances blocks of six or fewer — past
                that the rule silently does nothing. This paragraph is four
                lines at 390px, so balance applies everywhere and the exception
                is gone with the sentence that needed it. */}
            <p
              className="animate-rise-in mt-7 max-w-2xl text-[1.0625rem] leading-[1.7] text-balance text-muted-foreground sm:text-lg"
              style={{ "--rise-delay": "600ms" } as React.CSSProperties}
            >
              {hero.supporting}
            </p>

            <div
              className="animate-rise-in mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ "--rise-delay": "720ms" } as React.CSSProperties}
            >
              <Link
                href={hero.primaryCta.href}
                className={buttonVariants({ size: "lg" })}
              >
                {hero.primaryCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* ── The statement ───────────────────────────────────────────────
            The hero's second beat: the headline above makes a claim, this
            answers what the studio actually builds. It reveals on scroll,
            below the fold, like every other band on the page.

            An ASYMMETRIC split, and the empty gutter between the two columns is
            the design rather than a leftover. Headline takes columns 1–5, body
            takes 8–12, and 6–7 stay empty — roughly a sixth of the width held
            open on a site whose whole language is void and light. A tight
            two-column split of "big heading, paragraph beside it" is the most
            templated band on the web; the space is what stops this being that.

            The heading is `display-lg`, the same size every other section head
            on the site uses. Setting it at hero scale would put two display
            headlines within one screen of each other, and the second would win
            on novelty while the first is the one that matters. */}
        <Reveal className="border-t border-border/60 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <h2 className="display display-lg lg:col-span-5">
              <span className="lead">{hero.statement.headline.lead}</span>
              <span className="lit">{hero.statement.headline.lit}</span>
            </h2>

            {/* Nudged down a touch so its first line reads level with the
                headline's cap rather than with the top of its line box, which
                sits noticeably higher at display size. */}
            <p className="max-w-[54ch] text-[1.0625rem] leading-[1.75] text-muted-foreground sm:text-lg lg:col-span-5 lg:col-start-8 lg:pt-2.5">
              {hero.statement.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
