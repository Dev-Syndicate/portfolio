import { process } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function Process() {
  return (
    <Section
      id="process"
      pattern="contour"
      patternTone="text-primary/[0.08]"
      aria-labelledby="process-heading"
    >
      <SectionHeader
        id="process-heading"
        eyebrow="Process"
        heading={process.heading}
        intro={process.intro}
      />

      <ol className="relative mt-14 flex flex-col gap-10 sm:gap-12">
        {/* Timeline spine — decorative, sits behind the numbered markers */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[1.4375rem] w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:left-[1.6875rem]"
        />

        {process.steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 0.06} direction="left">
            <div className="flex items-start gap-6">
              <span
                aria-hidden
                className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-border bg-card text-sm font-semibold tabular-nums sm:size-14"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-col gap-2 pt-1.5 sm:pt-2.5">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                {/* The question this stage exists to answer — PRD component
                    standard: every section answers a visitor's question. */}
                <p className="text-[0.9375rem] font-medium text-primary">
                  {step.question}
                </p>
                <p className="max-w-2xl leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
