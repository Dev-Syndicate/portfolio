"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ShieldCheck } from "lucide-react";

import { standards } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import { Pattern } from "@/components/ui/pattern";

/**
 * The trust anchor of the page.
 *
 * A studio with no public case studies cannot borrow credibility from client
 * logos, so this borrows it from a standard the visitor can verify on the
 * spot — including against this page. The invitation in the footnote is the
 * point: a claim someone is encouraged to check reads very differently from
 * one they are asked to take on faith.
 */
export function Standards() {
  return (
    <section
      aria-labelledby="standards-heading"
      // Deep water. The four dials are the only luminous thing on this
      // screen, which is the whole point — light blue rings glowing on navy
      // carry more weight than the same numbers printed on white.
      className="relative isolate overflow-hidden"
    >
      {/* Ripple centred on the dial row rather than the section, so the rings
          read as radiating from the numbers. */}
      <Pattern
        variant="ripple"
        tone="text-primary/[0.09]"
        className="[--ripple-y:64%]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full opacity-80 blur-[150px]"
        style={{ background: "var(--glow-a)" }}
      />

      <div className="container-page section-y">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden />
            Audited before every launch
          </span>
          <h2
            id="standards-heading"
            className="text-[clamp(1.875rem,3.6vw,2.875rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
          >
            {standards.heading}
          </h2>
          <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground sm:text-lg">
            {standards.intro}
          </p>
        </Reveal>

        <dl className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {standards.metrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.09}>
              <div className="flex flex-col items-center gap-2 text-center">
                <ScoreDial value={metric.value} suffix={metric.suffix} />
                <dt className="mt-2 text-base font-semibold">{metric.label}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">
                  {metric.note}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-14 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            {standards.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Ring that sweeps to the score while the number counts up alongside it. */
function ScoreDial({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  const progress = value / 100;

  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 110 110" className="size-28 -rotate-90" aria-hidden>
        <circle
          cx="55"
          cy="55"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          className="stroke-foreground/[0.08]"
        />
        <motion.circle
          cx="55"
          cy="55"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          // The glow is what makes the dial read as lit rather than drawn.
          className="stroke-primary [filter:drop-shadow(0_0_6px_var(--glow-c))]"
          strokeDasharray={CIRCUMFERENCE}
          initial={
            reduceMotion ? undefined : { strokeDashoffset: CIRCUMFERENCE }
          }
          animate={
            inView || reduceMotion
              ? { strokeDashoffset: CIRCUMFERENCE * (1 - progress) }
              : undefined
          }
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums tracking-tight">
          {display}
          <span className="text-primary">{suffix}</span>
        </span>
      </div>
    </div>
  );
}
