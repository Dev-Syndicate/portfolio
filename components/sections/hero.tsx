import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { hero, trust } from "@/lib/content";
import { Chip, DotChip } from "@/components/ui/chip";
import { buttonVariants } from "@/components/ui/button";

/**
 * The opening: type on the void, and nothing else.
 *
 * There is no artwork behind this hero — no arc, no field, no framing marks,
 * no vignette. The page canvas is the background, and the only things in the
 * frame are the words. Everything that carries the composition is typographic:
 * the eyebrow, the two-voice headline, the supporting paragraph, the two
 * actions, and the promise row.
 *
 * That puts the whole weight on the headline, which is set the way the
 * reference sets it: one face, regular weight, large, and tightly tracked, with
 * the setup line muted and the payoff at full contrast (see the `.display`
 * block in globals.css). Nothing here is bold — the presence comes from scale
 * and the per-character entrance below, not from mass.
 *
 * Server component. The entrance is CSS-only — each element carries
 * `animate-rise-in` with its own `--rise-delay`, so the stagger costs no
 * JavaScript and runs before hydration. That matters here more than anywhere
 * else on the site: this is the first paint, and the PRD's performance target
 * leaves no room for the hero to wait on a bundle.
 */
/* Delays for the payoff line's per-character entrance, in ms. */
const CHAR_START = 320;
const CHAR_STEP = 28;

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
    <section className="relative isolate">
      <div className="container-page">
        <div className="flex flex-col items-center pt-32 pb-16 text-center sm:pt-40 lg:pt-44">
          <div
            className="animate-rise-in"
            style={{ "--rise-delay": "100ms" } as React.CSSProperties}
          >
            <Chip>{hero.eyebrow}</Chip>
          </div>

          {/* The headline in two voices: an italic serif setup line over the
              heavy sans payoff. See the `.display` block in globals.css.

              The measure is 7xl, not 5xl, and that is what fixes the rag: at
              5xl the payoff broke as "how you" / "actually work." — a pinched
              short line between two long ones. At 7xl it holds on one line
              down to ~640px, so the headline reads as two clean voices rather
              than three ragged ones. Below that it wraps, and `text-wrap:
              balance` on `.display` evens the two halves. */}
          <h1 className="display display-xl mt-7 max-w-7xl">
            {/* The setup line rises as one block — the same entrance every
                other element on the page uses. Only the payoff gets the
                per-character treatment, so the effect stays an emphasis
                rather than a house style. */}
            <span
              className="lead animate-rise-in"
              style={{ "--rise-delay": "200ms" } as React.CSSProperties}
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

          {/* `pretty` below sm, `balance` at sm and up, and the split is not
              arbitrary: Chrome only balances blocks of 6 lines or fewer. On a
              phone this paragraph runs to 7, so `balance` silently falls back
              to normal wrapping and leaves "firefighting." orphaned on its own
              line. `pretty` is the rule that actually protects the last line
              at that width; `balance` evens the whole rag once it fits. */}
          <p
            className="animate-rise-in mt-7 max-w-2xl text-[1.0625rem] leading-[1.7] text-pretty text-muted-foreground sm:text-lg sm:text-balance"
            style={{ "--rise-delay": "700ms" } as React.CSSProperties}
          >
            {hero.supporting}
          </p>

          <div
            className="animate-rise-in mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ "--rise-delay": "820ms" } as React.CSSProperties}
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

        {/* ── The promise row ──────────────────────────────────────────────
            Where the reference runs a strip of client logos. We have no client
            names to print and will not invent any, so the row carries the five
            operational promises instead — same rhythm, all of it verifiable. */}
        <div
          className="animate-rise-in border-t border-border/60 py-10"
          style={{ "--rise-delay": "940ms" } as React.CSSProperties}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <p className="max-w-xs shrink-0 text-sm leading-relaxed text-muted-foreground">
              {hero.proof.lead}{" "}
              <span className="text-foreground">{hero.proof.emphasis}</span>
            </p>

            <ul className="flex flex-wrap gap-2.5">
              {trust.points.map((point) => (
                <li key={point.title}>
                  <DotChip>{point.title}</DotChip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
