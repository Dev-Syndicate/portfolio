import { ArrowRight } from "lucide-react";

import { process } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
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
      pattern="contour"
      patternTone="text-primary/[0.08]"
      aria-labelledby="process-strip-heading"
    >
      <SectionHeader
        id="process-strip-heading"
        eyebrow="Process"
        heading={process.strip.heading}
        intro={process.strip.intro}
      />

      <ol className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        {/* Connecting rail, drawn only where the stepper is horizontal */}
        <span
          aria-hidden
          className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-primary/50 via-border to-transparent lg:block"
        />

        {process.steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 0.07}>
            <div className="relative flex flex-col gap-3">
              <span
                aria-hidden
                className="grid size-12 place-items-center rounded-full border border-border bg-card text-sm font-semibold tabular-nums shadow-[var(--elevation-1)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-[0.875rem] leading-[1.6] text-primary">
                {step.question}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.3}>
        <div className="mt-12 flex justify-center">
          <Button href={process.strip.cta.href} variant="outline" size="lg">
            {process.strip.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
