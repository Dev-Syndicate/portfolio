import { process } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Full Process timeline for /services — a detailed vertical sequence.
 *
 * Distinct from the home strip (a five-across horizontal row): here each stage
 * is read top to bottom, with a connecting spine on the left threading the
 * numbered markers into one line. Text-led — the numbered marker, the stage
 * name, the visitor question it answers, and what actually happens. No
 * screen-filling illustrations: the sequence itself is the structure, and the
 * words are the information.
 */

export function Process() {
  return (
    <Section id="process" aria-labelledby="process-heading">
      <SectionHeader
        id="process-heading"
        eyebrow="Process"
        heading={process.heading}
        intro={process.intro}
      />

      <ol className="relative mt-14 flex flex-col gap-10 sm:gap-12">
        {/* Timeline spine — threads the numbered markers into one sequence,
            fading toward the end so the eye follows the process forward. */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[1.4375rem] w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:left-[1.6875rem]"
        />

        {process.steps.map((step, i) => {
          // First station is lit — it's where the process begins.
          const active = i === 0;

          return (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 0.06}
              direction="left"
              className="relative"
            >
              <div className="flex items-start gap-6">
                {/* Number marker — sits over the spine. Active one gets a lit
                    border + always-on conic sweep. */}
                <span
                  aria-hidden
                  className={`relative z-10 grid size-12 shrink-0 place-items-center rounded-full border bg-card font-mono text-sm font-semibold tabular-nums shadow-[var(--elevation-1)] sm:size-14 ${
                    active
                      ? "conic-sweep border-primary/40 text-primary"
                      : "border-border text-primary"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1.5 sm:pt-2.5">
                  <h3 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">
                    {step.title}
                  </h3>
                  {/* The visitor question this stage exists to answer. */}
                  <p className="text-[0.9375rem] font-medium text-primary">
                    {step.question}
                  </p>
                  {/* Body lifted to bright brand ink — the muted grey read as
                      unreadable on the dark ground. */}
                  <p className="max-w-2xl leading-relaxed text-brand-100/90">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
