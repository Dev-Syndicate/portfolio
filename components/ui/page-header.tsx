"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { InstrumentLabel } from "@/components/ui/instrument";

/**
 * Interior-page hero.
 *
 * Shares the home hero's language: the mono instrument label, oversized
 * editorial type, an asymmetric composition, and scroll-linked parallax on the
 * copy and artwork. It paints no background of its own — the site-wide liquid
 * ground shows straight through, so every hero sits in the same lit space.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  visual,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
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

  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  // Artwork counter-moves against the copy, the same arrangement the home hero
  // uses.
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const words = title.split(" ");

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
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
            <InstrumentLabel>{eyebrow}</InstrumentLabel>
          </Rise>

          <h1
            aria-label={title}
            // Height-aware, same as the home hero: a short laptop viewport
            // should not push the intro copy below the fold.
            className="text-[clamp(2rem,min(4.8vw,7vh),4.75rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
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
            <p className="max-w-2xl text-[1.0625rem] leading-[1.75] text-muted-foreground sm:text-lg 2xl:max-w-3xl 2xl:text-xl">
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
