import { trust } from "@/lib/content";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * First proof moment after the hero — the five outcomes as a bento grid of lit
 * cards, each carrying a technical line-art illustration so the section reads
 * as engineered evidence rather than a wall of text. The lead outcome is the
 * one "lit" card (accent tint + larger illustration), the rest quiet — the
 * reference's one-bright-card-among-many rhythm.
 */

/* Which illustration each outcome carries. Keyed by the icon so content stays
   a plain data module. */
const art: Record<string, LineArtName> = {
  gauge: "burst",
  layers: "coil",
  search: "nodes",
  shield: "chip",
  smartphone: "globe",
};

export function Trust() {
  const [lead, ...rest] = trust.points;
  const LeadArt = lineArt[art[lead.icon] ?? "nodes"];

  return (
    <Section id="trust" aria-labelledby="trust-heading">
      <SectionHeader
        id="trust-heading"
        eyebrow="Outcomes first"
        heading={trust.heading}
        intro={trust.intro}
      />

      {/* Designed for exactly five: a tall lit lead card on the left, and a
          balanced 2×2 of the other four on the right — same height, no empty
          cell. Stacks to lead-on-top then a 2×2 on mobile. */}
      <div className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_1.35fr] lg:items-stretch">
        {/* Lead — the lit card. */}
        <Reveal className="flex">
          <article className="ring-glow group relative flex w-full flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card p-7 shadow-[var(--elevation-2)] sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-1/4 right-0 h-64 w-64 rounded-full blur-[80px]"
              style={{ background: "var(--glow-a)" }}
            />
            <div className="relative mb-6 flex-1 text-primary/70">
              <LeadArt className="h-full max-h-56 min-h-36 w-full opacity-90" />
            </div>
            <div className="relative flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <IconTile name={lead.icon as IconName} className="size-11" />
                <h3 className="text-xl font-semibold">{lead.title}</h3>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-brand-100">
                {lead.body}
              </p>
            </div>
          </article>
        </Reveal>

        {/* The other four — a tidy 2×2 filling the right column, no gaps. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((point, i) => {
            const Art = lineArt[art[point.icon] ?? "nodes"];
            return (
              <Reveal key={point.title} delay={0.06 + i * 0.05} className="flex">
                <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-[var(--duration-base)] ease-out-soft hover:border-border-strong">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-3 -right-3 h-20 w-28 text-muted-foreground/40 transition-opacity duration-[var(--duration-slow)] group-hover:opacity-100 sm:opacity-70"
                  >
                    <Art />
                  </div>
                  <IconTile name={point.icon as IconName} />
                  <h3 className="mt-4 text-lg font-semibold">{point.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-brand-100/90">
                    {point.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
