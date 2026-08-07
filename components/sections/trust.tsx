import { trust } from "@/lib/content";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";

/**
 * First proof moment after the hero.
 *
 * sm+ : the five outcomes sit in one shared-border panel — lead spans the top
 *       row, the other four fill a 2×2 beneath — a single framed spec sheet.
 * mobile: the panel would collapse to five identical stacked boxes, so instead
 *       the lead becomes a featured card (accent tint, larger) and the rest are
 *       clean on-brand cards — hierarchy the eye can follow, not a flat stack.
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

      {/* Mobile: consistent on-brand cards, one per outcome. */}
      <div className="mt-8 flex flex-col gap-3 sm:hidden">
        {trust.points.map((point) => (
          <div key={point.title} className="surface-card flex flex-col gap-2.5 p-5">
            <span aria-hidden className="card-node" />
            <IconTile name={point.icon as IconName} />
            <h3 className="text-base font-semibold">{point.title}</h3>
            <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
              {point.body}
            </p>
          </div>
        ))}
      </div>

      {/* sm+: unchanged — the shared-border spec sheet. */}
      <DividedGrid className="mt-9 hidden sm:grid" cols="sm:grid-cols-2">
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
