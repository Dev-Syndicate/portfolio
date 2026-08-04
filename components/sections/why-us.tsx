import { whyUs } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

export function WhyUs() {
  return (
    <Section
      id="why-us"
      tone="light"
      pattern="contour"
      patternTone="text-accent/[0.14]"
      aria-labelledby="why-us-heading"
    >
      <SectionHeader
        id="why-us-heading"
        eyebrow="Why us"
        heading={whyUs.heading}
        intro={whyUs.intro}
      />

      <ul className="mt-14 grid gap-5 md:grid-cols-2">
        {whyUs.reasons.map((reason, i) => (
          <Reveal as="li" key={reason.title} delay={i * 0.07}>
            <Card className="group flex h-full flex-col gap-4 p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-lg bg-primary/10 text-[0.8125rem] font-semibold tabular-nums text-primary transition-colors duration-[var(--duration-base)] ease-out-soft group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="rule-fade flex-1 opacity-0 transition-opacity duration-[var(--duration-slow)] group-hover:opacity-100"
                />
              </div>

              <h3 className="text-lg font-semibold">{reason.title}</h3>
              <p className="leading-relaxed text-muted-foreground">
                {reason.body}
              </p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
