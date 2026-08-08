import { ArrowRight } from "lucide-react";

import { process } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * Home-page version of Process: a numbered five-station sequence.
 *
 * The stages are a real ordered process, so the number markers (01–05) stay
 * and a connecting spine threads them into one line — desktop reads left to
 * right, mobile top to bottom. Each station carries a distinct line-art
 * illustration so the row isn't five identical boxes; the drawing is the
 * signature that turns flat text into something worth reading.
 *
 * The description of what actually happens at each stage lives on /services.
 */

/* One distinct illustration per stage, position-indexed so each of the five
   is unique and reads for its step: discover→scan, design→layers, build→wiring,
   verify→shield, support→growth. */
const stepArt: readonly LineArtName[] = [
  "radar",
  "layers",
  "circuit",
  "shield",
  "growth",
];

export function ProcessStrip() {
  return (
    <Section id="process" aria-labelledby="process-strip-heading">
      <SectionHeader
        id="process-strip-heading"
        eyebrow="Process"
        heading={process.strip.heading}
        intro={process.strip.intro}
      />

      {/* Mobile (below lg): a numbered vertical timeline. A connecting spine
          threads the five stages into one sequence — a distinct rhythm from the
          card grids above and below. Illustrations are dropped here to keep the
          phone layout tight; the number + question carry the step. */}
      <ol className="mt-8 flex flex-col lg:hidden">
        {process.steps.map((step, i) => {
          const last = i === process.steps.length - 1;
          return (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 0.05}
              direction="left"
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {/* Spine segment behind the marker, drawn for all but the last. */}
              {!last && (
                <span
                  aria-hidden
                  className="absolute top-9 left-[0.9375rem] h-[calc(100%-1.5rem)] w-px bg-border"
                />
              )}
              {/* First marker is lit — it's where the process begins. */}
              <span
                aria-hidden
                className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-[0.75rem] font-semibold tabular-nums ${
                  i === 0
                    ? "border-primary/40 text-primary"
                    : "border-border text-primary"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1 pt-1">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-[0.9375rem] leading-[1.5] text-primary">
                  {step.question}
                </p>
                <p className="mt-1 text-[0.875rem] leading-[1.6] text-brand-100/90">
                  {step.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>

      {/* Desktop (lg+): a five-across row of station cards. A hairline spine sits
          behind the number markers, fading left→right so the eye follows the
          sequence forward. Each station stacks illustration → marker → title →
          question → body. */}
      <div className="relative mt-12 hidden lg:block">
        {/* The spine, aligned to the vertical centre of the marker row that sits
            below the illustration frame. Inset by half a column each side so it
            starts and ends under the first/last markers, not the card edges. */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-[calc(9.5rem+1.5rem)] right-[10%] left-[10%] h-px bg-gradient-to-r from-primary/50 via-border to-transparent"
        />

        <ol className="grid grid-cols-5 gap-4">
          {process.steps.map((step, i) => {
            const Art = lineArt[stepArt[i]];
            const active = i === 0;
            return (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 0.08}
                direction="up"
                className="group relative flex flex-col items-center text-center"
              >
                {/* Framed illustration — the per-step signature. */}
                <div className="relative flex h-[9.5rem] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-6 shadow-[var(--elevation-1)] transition-colors duration-[var(--duration-base)] ease-out-soft group-hover:border-border-strong">
                  {/* Corner glow, warmer on the active first station. */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -top-8 -right-8 size-24 blur-[80px] ${
                      active ? "opacity-90" : "opacity-40"
                    }`}
                    style={{ background: "var(--glow-a)" }}
                  />
                  <Art className="relative h-full w-auto text-primary" />
                </div>

                {/* Number marker — sits over the spine to thread the stations. */}
                <span
                  aria-hidden
                  className={`relative z-10 mt-6 flex size-12 items-center justify-center rounded-full border bg-card font-mono text-[0.875rem] font-semibold tabular-nums shadow-[var(--elevation-1)] ${
                    active
                      ? "conic-sweep border-primary/40 text-primary"
                      : "border-border text-primary"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-[1.5] text-primary">
                  {step.question}
                </p>
                <p className="mt-2 text-[0.875rem] leading-[1.6] text-brand-100/90">
                  {step.body}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12">
          <Button href={process.strip.cta.href} variant="outline" size="lg">
            {process.strip.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
