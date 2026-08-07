import { ArrowRight } from "lucide-react";

import { process } from "@/lib/content";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Home-page version of Process: stage names and the question each answers.
 *
 * The description of what actually happens at each stage lives on /services.
 * Laid out as a horizontal stepper rather than the vertical timeline used
 * there, so the two never look like the same block pasted twice.
 */
export function ProcessStrip() {
  return (
    <Section
      id="process"
      aria-labelledby="process-strip-heading"
    >
      <SectionHeader
        id="process-strip-heading"
        eyebrow="Process"
        heading={process.strip.heading}
        intro={process.strip.intro}
      />

      {/* Mobile: a numbered vertical timeline. A connecting spine threads the
          five stages into one sequence — a distinct rhythm from the card grids
          above and below, so the scroll has texture instead of repeating one
          shape. Reads as "a process," which is the point of the section. */}
      <ol className="mt-8 flex flex-col sm:hidden">
        {process.steps.map((step, i) => {
          const last = i === process.steps.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Spine segment behind the marker, drawn for all but the last. */}
              {!last && (
                <span
                  aria-hidden
                  className="absolute top-9 left-[0.9375rem] h-[calc(100%-1.5rem)] w-px bg-border"
                />
              )}
              <span
                aria-hidden
                className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-[0.75rem] font-semibold tabular-nums text-primary"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1 pt-1">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-[0.875rem] leading-[1.6] text-muted-foreground">
                  {step.question}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* sm+: unchanged — the shared-border horizontal stepper. */}
      <DividedGrid
        className="mt-9 hidden sm:grid"
        cols="sm:grid-cols-2 lg:grid-cols-5"
      >
        {process.steps.map((step, i) => (
          <GridCell key={step.title} className="gap-3">
            <span
              aria-hidden
              className="font-mono text-[0.8125rem] font-semibold tabular-nums text-primary"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-base font-semibold">{step.title}</h3>
            <p className="text-[0.875rem] leading-[1.6] text-muted-foreground">
              {step.question}
            </p>
          </GridCell>
        ))}
      </DividedGrid>

      <Reveal delay={0.2}>
        <div className="mt-7">
          <Button href={process.strip.cta.href} variant="outline" size="lg">
            {process.strip.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
