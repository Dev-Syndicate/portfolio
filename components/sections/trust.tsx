import { trust } from "@/lib/content";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";

/**
 * First proof moment after the hero. The five outcomes sit in one shared-border
 * panel — the lead point spans the full top row, the other four fill a 2×2
 * beneath it — so the section reads as a single framed spec sheet rather than
 * cards scattered across the void.
 */
export function Trust() {
  const [lead, ...rest] = trust.points;

  return (
    <Section id="trust" aria-labelledby="trust-heading">
      <SectionHeader
        id="trust-heading"
        eyebrow="Outcomes first"
        heading={trust.heading}
        intro={trust.intro}
      />

      <DividedGrid className="mt-9" cols="sm:grid-cols-2">
        {/* Lead outcome spans the full top row. */}
        <GridCell className="gap-4 sm:col-span-2 sm:flex-row sm:items-start sm:gap-6 sm:p-9">
          <IconTile name={lead.icon as IconName} className="size-12" />
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xl font-semibold">{lead.title}</h3>
            <p className="leading-relaxed text-muted-foreground">{lead.body}</p>
          </div>
        </GridCell>

        {rest.map((point) => (
          <GridCell key={point.title} className="gap-4">
            <IconTile name={point.icon as IconName} />
            <h3 className="text-lg font-semibold">{point.title}</h3>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              {point.body}
            </p>
          </GridCell>
        ))}
      </DividedGrid>
    </Section>
  );
}
