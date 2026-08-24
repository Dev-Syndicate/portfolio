import { process } from "@/lib/content";
import { Bloom } from "@/components/ui/bloom";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Process in full — the five stages with what actually happens in each.
 *
 * Drawn as a timeline rather than a grid, because the content is a sequence:
 * you cannot Verify before you Build. A rail runs down the left with a lit node
 * per stage, and the rail brightens through the first stage and fades out after
 * the last, so it reads as a path with a beginning and an end.
 *
 * Home carries the condensed version (names + questions only); this owns the
 * descriptions, so the two pages never print the same paragraph.
 */
export function Process() {
  return (
    <Section id="process" aria-labelledby="process-detail-heading">
      <SectionHeader
        id="process-detail-heading"
        eyebrow="The process"
        heading={{ lead: "How the work", lit: "actually runs." }}
        intro={process.intro}
      />

      <div className="relative mx-auto mt-14 max-w-3xl">
        {/* The rail. Sits behind the nodes, fading in and out at the ends so it
            doesn't terminate on a hard stub. Hidden on mobile, where the
            stacked cards already read as a sequence without it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 left-[1.4375rem] hidden w-px sm:block"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--border-strong) 8%, var(--border-strong) 92%, transparent 100%)",
          }}
        />

        <ol className="flex flex-col gap-4">
          {process.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06} as="li" className="block">
              <div className="flex gap-6">
                {/* Node */}
                <span
                  aria-hidden
                  className="relative z-10 hidden size-12 shrink-0 place-items-center rounded-full border border-hairline bg-card font-mono text-xs tabular-nums text-primary shadow-[0_0_0_6px_var(--background)] sm:grid"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <Bloom from="tl" className="min-w-0 flex-1 p-7 sm:p-8">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    {/* Mobile keeps the number inline, since the rail is hidden. */}
                    <span
                      aria-hidden
                      className="font-mono text-xs tabular-nums text-primary sm:hidden"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-medium tracking-tight">
                      {step.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {step.question}
                    </span>
                  </div>

                  <p className="mt-3 text-[0.9375rem] leading-[1.75] text-muted-foreground text-pretty">
                    {step.body}
                  </p>
                </Bloom>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
