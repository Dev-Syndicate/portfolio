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

      <DividedGrid className="mt-9" cols="sm:grid-cols-2 lg:grid-cols-5">
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
