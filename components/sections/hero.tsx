"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { hero } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { HeroVisual } from "@/components/sections/hero-visual";

const words = hero.headline.split(" ");

/* The four promises the supporting copy makes, as a mono spec-strip. Kept in
   the copy column, not soldered to the board — separation of concerns is
   itself the engineering signal. */
const SPEC = ["PERF", "TRUST", "LEADS", "GROWTH"] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Blur-in rise, reused by the label / headline words / paragraph / CTAs.
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
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden pt-24 pb-16 sm:pt-28 lg:pb-20"
    >
      <div className="container-page relative grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <motion.div
          style={reduceMotion ? undefined : { y: copyY, opacity: fade }}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.04 }}
          className="flex flex-col items-start gap-6 lg:col-span-7 lg:translate-y-[4%]"
        >
          {/* Instrument label row — mono, with a pad + trace stub, and the
              status token at the right. */}
          <motion.div
            variants={rise}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full max-w-lg flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
              <span aria-hidden className="size-1.5 bg-primary" />
              <span aria-hidden className="h-px w-6 bg-border-strong" />
              {hero.eyebrow}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
              <span aria-hidden className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Status · Available
            </span>
          </motion.div>

          <h1
            id="hero-heading"
            aria-label={hero.headline}
            className="text-[clamp(2.25rem,min(5.8vw,8vh),5.75rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
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
            className="max-w-lg text-base leading-[1.7] text-muted-foreground sm:text-[1.0625rem] 2xl:max-w-xl 2xl:text-lg"
          >
            {hero.supporting}
          </motion.p>

          <motion.div
            variants={rise}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
          >
            <Magnetic strength={0.18}>
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/btn:translate-x-0.5"
                  aria-hidden
                />
              </Button>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Button href={hero.secondaryCta.href} size="lg" variant="outline">
                {hero.secondaryCta.label}
              </Button>
            </Magnetic>
          </motion.div>

          {/* Spec-strip: the copy's four promises as a mono, hairline-divided
              readout. */}
          <motion.dl
            variants={rise}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1 flex w-full max-w-lg items-center divide-x divide-border border-t border-border pt-4 font-mono text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase"
          >
            {SPEC.map((spec) => (
              <dt key={spec} className="flex-1 text-center first:pl-0">
                {spec}
              </dt>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          style={reduceMotion ? undefined : { y: visualY, opacity: fade }}
          className="relative w-full max-w-lg justify-self-center lg:col-span-5 lg:max-w-none lg:justify-self-end"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

