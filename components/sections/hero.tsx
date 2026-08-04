"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";

import { hero } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { HeroVisual } from "@/components/sections/hero-visual";

const words = hero.headline.split(" ");

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-linked parallax. Three planes moving at different rates is what
  // gives the section physical depth — the ambient light drifts slowest, the
  // copy rises with the scroll, and the device panel counter-moves. A single
  // plane scrolling as one block is what made this read as flat.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const plane = (y: typeof copyY) =>
    reduceMotion ? undefined : { y, opacity: fade };

  // Blur-in on top of the rise: the text resolves into focus rather than
  // merely sliding, which is most of the difference between a stock fade and
  // something that feels considered.
  const rise = reduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      // `min-h-svh` + centring means the hero fills the viewport but is never
      // taller than its content needs — on a short laptop screen everything
      // still lands above the fold, and on mobile the stacked layout is free
      // to grow past it. `svh` rather than `vh` so mobile browser chrome does
      // not push the CTAs off-screen.
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden pt-24 pb-16 sm:pt-28 lg:pb-20"
    >
      <HeroBackground y={reduceMotion ? undefined : glowY} />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Copy runs 7 of 12 columns rather than a even split — the asymmetry
            is what stops it reading as a template. */}
        <motion.div
          style={plane(copyY)}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.04 }}
          className="flex flex-col items-start gap-6 lg:col-span-7"
        >
          <motion.span
            variants={rise}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2 text-xs font-medium text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-primary">
              <span aria-hidden className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Available
            </span>
            <span className="tracking-[0.1em] uppercase">{hero.eyebrow}</span>
          </motion.span>

          {/* Oversized editorial headline. The full sentence is exposed to
              assistive tech as one string via aria-label, since the per-word
              spans would otherwise be read as fragments. */}
          <h1
            id="hero-heading"
            aria-label={hero.headline}
            // Sized against viewport *height* as well as width. A headline
            // scaled on vw alone stays huge on a short, wide laptop screen
            // and pushes the CTAs below the fold — which is what was
            // happening here. `min()` lets whichever axis is tighter win.
            className="text-[clamp(2.25rem,min(5.6vw,7.4vh),4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                aria-hidden
                variants={rise}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "mr-[0.2em] inline-block",
                  i >= hero.headlineAccentFrom && "text-emphasis",
                )}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg text-base leading-[1.7] text-muted-foreground sm:text-[1.0625rem]"
          >
            {hero.supporting}
          </motion.p>

          <motion.div
            variants={rise}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/btn:translate-x-0.5"
                  aria-hidden
                />
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button href={hero.secondaryCta.href} size="lg" variant="outline">
                {hero.secondaryCta.label}
              </Button>
            </Magnetic>
          </motion.div>

        </motion.div>

        {/* Stays inside the container. An earlier version bled past it with a
            negative right margin, which the section's `overflow-hidden` then
            clipped — taking the edges of the floating labels with it. */}
        <motion.div
          style={plane(visualY)}
          className="relative w-full max-w-md justify-self-center lg:col-span-5 lg:max-w-none lg:justify-self-end"
        >
          <HeroVisual />
        </motion.div>
      </div>

      <motion.a
        href="#trust"
        style={reduceMotion ? undefined : { opacity: fade }}
        className="group absolute inset-x-0 bottom-8 z-10 mx-auto hidden w-fit items-center gap-2.5 text-xs tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground lg:flex"
      >
        <span
          aria-hidden
          className="glass grid size-9 place-items-center rounded-full transition-transform duration-[var(--duration-base)] ease-out-soft group-hover:translate-y-0.5"
        >
          <ArrowDown className="size-3.5" />
        </span>
        Scroll
      </motion.a>
    </section>
  );
}

/**
 * Layered hero backdrop: two slow aurora washes, a swell texture, and grain.
 *
 * The whole plane is driven by the parallax `y` passed in, so the light
 * drifts more slowly than the copy above it. Only `transform` and `opacity`
 * animate, so it stays on the compositor.
 *
 * Colours come from the palette's `--glow-*` tokens, so it re-skins with
 * everything else.
 */
function HeroBackground({
  y,
}: {
  y?: ReturnType<typeof useTransform<number, string>>;
}) {
  return (
    <motion.div
      aria-hidden
      style={y ? { y } : undefined}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-[35%] left-[-15%] h-[75vh] w-[75vw] max-w-[1000px] rounded-full blur-[150px] motion-safe:animate-aurora"
        style={{ background: "var(--glow-a)" }}
      />
      <div
        className="absolute top-[-5%] right-[-20%] h-[60vh] w-[60vw] max-w-[820px] rounded-full blur-[160px] motion-safe:animate-aurora"
        style={{ background: "var(--glow-b)", animationDelay: "-12s" }}
      />

      {/* Swell texture, strongest toward the lower half where the aurora is
          weakest — the two layers cover for each other. */}
      <span className="pattern-waves absolute inset-x-0 top-1/4 bottom-0 text-primary/[0.08]" />

      {/* Grain kills the banding that large blurred gradients show on 8-bit
          displays — the main reason a soft wash can look cheap. */}
      <div className="bg-noise absolute inset-0 opacity-40" />

      {/* Resolve the wash into the page background at the section boundary */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
    </motion.div>
  );
}
