import { whyUs } from "@/lib/content";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";

export function WhyUs() {
  return (
    <Section id="why-us" tone="light" aria-labelledby="why-us-heading">
      <SectionHeader
        id="why-us-heading"
        eyebrow="Why us"
        heading={whyUs.heading}
        intro={whyUs.intro}
      />

      <DividedGrid className="mt-9" cols="md:grid-cols-2" mobileCards>
        {whyUs.reasons.map((reason, i) => (
          <GridCell key={reason.title} className="gap-4 sm:p-8" mobileCard>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-md border border-border bg-primary/10 text-[0.8125rem] font-semibold tabular-nums text-primary transition-colors duration-[var(--duration-base)] ease-out-soft group-hover/cell:bg-primary group-hover/cell:text-primary-foreground"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="rule-fade flex-1 opacity-0 transition-opacity duration-[var(--duration-slow)] group-hover/cell:opacity-100"
              />
            </div>

            <h3 className="text-lg font-semibold">{reason.title}</h3>
            <p className="leading-relaxed text-muted-foreground">{reason.body}</p>
          </GridCell>
        ))}
      </DividedGrid>
    </Section>
  );
}
