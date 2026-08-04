"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { Pattern } from "@/components/ui/pattern";

/**
 * Interior-page hero.
 *
 * Carries the same three ingredients as the home hero so the pages read as
 * one site: oversized editorial type, an asymmetric composition, and
 * scroll-linked parallax between the ambient light and the copy.
 *
 * `kicker` is an oversized ghosted word set behind the title. It is the one
 * piece of pure decoration here — it gives the section a second layer of
 * depth and stops a short page title from floating alone in a large space.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  kicker,
  visual,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Ghosted background word. Defaults to the eyebrow. */
  kicker?: string;
  /** Page-specific artwork. See `components/artwork/`. */
  visual?: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const kickerX = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  // Artwork counter-moves against the copy, the same three-plane arrangement
  // the home hero uses.
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const words = title.split(" ");

  return (
    // No bottom border: a wave divider follows on every page that uses this,
    // and a hairline sitting directly above the crest reads as a seam.
    <section ref={ref} className="relative isolate overflow-hidden">
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: glowY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -top-2/3 left-1/4 size-[46rem] rounded-full blur-[130px] motion-safe:animate-aurora"
          style={{ background: "var(--glow-a)" }}
        />
        <div
          className="absolute -top-1/2 right-0 size-[34rem] rounded-full blur-[130px] motion-safe:animate-aurora"
          style={{ background: "var(--glow-b)", animationDelay: "-20s" }}
        />
        <div className="bg-noise absolute inset-0 opacity-40" />
      </motion.div>

      <Pattern variant="waves" tone="text-primary/[0.07]" />

      {/* Ghosted kicker, clipped by the right edge. Aria-hidden — it repeats
          the eyebrow and would only add noise to a screen reader. */}
      <motion.span
        aria-hidden
        style={reduceMotion ? undefined : { x: kickerX, opacity: fade }}
        className="pointer-events-none absolute -top-2 -right-8 -z-10 hidden text-[13vw] leading-none font-semibold tracking-[-0.05em] text-foreground/[0.035] select-none sm:block"
      >
        {kicker ?? eyebrow}
      </motion.span>

      <div
        className={cn(
          "container-page grid items-center gap-12 pt-32 pb-16 sm:pt-36 sm:pb-20",
          // Copy takes 7 of 12 when there is artwork, matching the home hero's
          // asymmetry. Without artwork it stays a single measured column.
          visual && "lg:grid-cols-12 lg:gap-8",
        )}
      >
        <motion.div
          style={reduceMotion ? undefined : { y: copyY, opacity: fade }}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.045 }}
          className={cn(
            "flex max-w-3xl flex-col items-start gap-6",
            visual && "lg:col-span-7",
          )}
        >
          <Rise reduceMotion={reduceMotion}>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              {eyebrow}
            </span>
          </Rise>

          <h1
            aria-label={title}
            // Height-aware, same as the home hero: a short laptop viewport
            // should not push the intro copy below the fold.
            className="text-[clamp(2rem,min(4.6vw,6.4vh),3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
          >
            {words.map((word, i) => (
              <Rise key={`${word}-${i}`} reduceMotion={reduceMotion} inline>
                <span
                  aria-hidden
                  className={cn(
                    "mr-[0.2em] inline-block",
                    // Emphasis on the closing third, matching the home hero.
                    i >= Math.ceil(words.length * 0.66) && "text-emphasis",
                  )}
                >
                  {word}
                </span>
              </Rise>
            ))}
          </h1>

          <Rise reduceMotion={reduceMotion}>
            <p className="max-w-2xl text-[1.0625rem] leading-[1.75] text-muted-foreground sm:text-lg">
              {intro}
            </p>
          </Rise>

          {children ? <Rise reduceMotion={reduceMotion}>{children}</Rise> : null}
        </motion.div>

        {visual ? (
          <motion.div
            style={reduceMotion ? undefined : { y: visualY, opacity: fade }}
            className="relative w-full max-w-md justify-self-center lg:col-span-5 lg:max-w-none lg:justify-self-end"
          >
            {visual}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

function Rise({
  children,
  reduceMotion,
  inline = false,
}: {
  children: ReactNode;
  reduceMotion: boolean | null;
  inline?: boolean;
}) {
  const variants = reduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };

  return (
    <motion.span
      variants={variants}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={inline ? "inline-block" : "block"}
    >
      {children}
    </motion.span>
  );
}
