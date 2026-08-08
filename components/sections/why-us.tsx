import { whyUs } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import { InstrumentLabel } from "@/components/ui/instrument";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * The "why us" band, held in the same dark language as the rest of the page —
 * but lifted: an elevated panel a shade above the void, edged with a hairline
 * highlight and a pooled glow, so it reads as a distinct, brighter surface
 * without breaking into a jarring white slab. The line-art and bright body
 * copy carry the readability; the contrast comes from elevation, not colour.
 */

const arts: LineArtName[] = ["burst", "wave", "nodes", "layers"];

export function WhyUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="section-y relative isolate"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      {/* Elevated dark panel — rounded, sitting a step above the ground with a
          top highlight and a soft glow so it lifts off the page. */}
      <div className="container-page">
        <div className="ring-glow relative overflow-hidden rounded-[2rem] border border-border-strong/70 bg-surface-subtle px-6 py-14 shadow-[var(--elevation-2)] sm:px-12 sm:py-16 lg:px-16">
          {/* pooled glow, top-left, so the panel reads as lit from within */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full blur-[90px]"
            style={{ background: "var(--glow-a)" }}
          />
          {/* faint grain to keep the flat surface alive */}
          <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03]" />

          <Reveal className="relative flex max-w-2xl flex-col gap-4">
            <InstrumentLabel>Why us</InstrumentLabel>
            <h2
              id="why-us-heading"
              className="text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
            >
              {whyUs.heading}
            </h2>
            <p className="text-[1.0625rem] leading-[1.7] text-brand-100">
              {whyUs.intro}
            </p>
          </Reveal>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-2">
            {whyUs.reasons.map((reason, i) => {
              const Art = lineArt[arts[i % arts.length]];
              return (
                <Reveal key={reason.title} delay={0.06 + i * 0.06} className="flex">
                  <article className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-[var(--duration-base)] ease-out-soft hover:border-border-strong sm:p-7">
                    {/* illustration, top-right */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-2 -right-2 h-20 w-28 text-muted-foreground/40 transition-colors duration-[var(--duration-slow)] group-hover:text-muted-foreground/70"
                    >
                      <Art />
                    </div>
                    <span
                      aria-hidden
                      className="grid size-9 place-items-center rounded-md border border-border font-mono text-[0.8125rem] font-semibold tabular-nums text-muted-foreground"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold">{reason.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-brand-100/90">
                      {reason.body}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
