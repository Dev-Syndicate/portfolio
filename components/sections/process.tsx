import { process } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * Full Process timeline for /services — a detailed vertical sequence.
 *
 * Distinct from the home strip (a five-across horizontal row): here each stage
 * is a full "station" read top to bottom, with a connecting spine on the left
 * threading the numbered markers into one line. Alongside the text, every
 * station carries a big framed line-art illustration — the signature that turns
 * flat copy into something worth reading — sitting opposite the text on lg and
 * alternating sides so the column has rhythm without ever breaking the spine.
 */

/* One distinct illustration per stage, position-indexed so each of the five is
   unique and reads for its step. Deliberately not the strip's set — brackets
   for scoping the discovery, chip for the systems being built — so the two
   Process surfaces don't look like the same component twice. */
const stepArt: readonly LineArtName[] = [
  "brackets", // Discover — scoping the partnership
  "layers", // Design — the narrative stack of each page
  "chip", // Build — the system taking shape
  "shield", // Verify — audited against the standard
  "growth", // Support — keeping pace as the business grows
];

export function Process() {
  return (
    <Section id="process" aria-labelledby="process-heading">
      <SectionHeader
        id="process-heading"
        eyebrow="Process"
        heading={process.heading}
        intro={process.intro}
      />

      <ol className="relative mt-14 flex flex-col gap-12 sm:gap-16">
        {/* Timeline spine — decorative, threads the numbered markers into one
            sequence. Fades toward the end so the eye follows the process
            forward. */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[1.4375rem] w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:left-[1.6875rem]"
        />

        {process.steps.map((step, i) => {
          const Art = lineArt[stepArt[i]];
          // First station is lit — it's where the process begins.
          const active = i === 0;
          // Alternate the illustration side on lg for rhythm; the text column
          // (and the spine it sits against) always leads on the left.
          const artFirst = i % 2 === 1;

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

                {/* Station body: text + a big framed illustration. On lg it's a
                    two-column station; below lg the text carries it and the
                    illustration is dropped to keep the phone layout tight. */}
                <div className="min-w-0 flex-1 pt-1.5 sm:pt-2.5 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
                  <div
                    className={`flex flex-col gap-2 ${
                      artFirst ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <h3 className="text-xl font-semibold sm:text-2xl">
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

                  {/* Framed illustration viewport — the per-step signature.
                      Hidden on mobile so the page doesn't grow over-tall. */}
                  <div
                    className={`ring-glow group relative hidden h-40 overflow-hidden rounded-xl border border-border bg-brand-950/40 p-6 shadow-[var(--elevation-1)] transition-colors duration-[var(--duration-base)] ease-out-soft lg:flex lg:items-center lg:justify-center ${
                      artFirst ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {/* Corner glow, warmer on the active first station. */}
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -top-8 -right-8 size-28 blur-[80px] ${
                        active ? "opacity-90" : "opacity-40"
                      }`}
                      style={{ background: "var(--glow-a)" }}
                    />
                    <Art className="relative h-full w-auto text-primary" />
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
