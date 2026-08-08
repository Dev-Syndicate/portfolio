import { trust } from "@/lib/content";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * First proof moment after the hero — the five outcomes as a restrained bento:
 * a lit lead card on the left and a balanced 2×2 of the rest on the right.
 * Cards are type-led (icon, title, body), with a single line-art illustration
 * kept as a faint background texture on the lead card only — a whisper of the
 * engineering vernacular, not a drawing competing with the words. The lead is
 * the one "lit" card, the rest quiet: the one-bright-among-many rhythm.
 */

/* The lead card's faint background illustration, keyed by its icon so content
   stays a plain data module. Only the lead carries one; the rest stay clean. */
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
      <div className="mt-12 grid gap-4 lg:grid-cols-[1.05fr_1.35fr] lg:items-stretch">
        {/* Lead — the lit card. Illustration is a faint texture, top-right. */}
        <Reveal className="flex">
          <article className="ring-glow group relative flex w-full flex-col justify-end overflow-hidden rounded-2xl border border-primary/25 bg-card p-7 shadow-[var(--elevation-2)] sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-1/4 right-0 h-64 w-64 rounded-full blur-[80px]"
              style={{ background: "var(--glow-a)" }}
            />
            {/* Line-art as quiet background texture, not a centrepiece. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 h-40 w-52 text-primary/20"
            >
              <LeadArt />
            </div>
            <div className="relative flex flex-col gap-4">
              <IconTile
                name={lead.icon as IconName}
                className="size-12 border-primary/30 text-primary"
              />
              <h3 className="text-xl font-semibold tracking-[-0.01em]">
                {lead.title}
              </h3>
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-brand-100">
                {lead.body}
              </p>
            </div>
          </article>
        </Reveal>

        {/* The other four — a tidy 2×2 filling the right column, no gaps.
            Clean type-led cards, no illustrations competing with the copy. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((point, i) => (
            <Reveal key={point.title} delay={0.06 + i * 0.05} className="flex">
              <article className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-[var(--duration-base)] ease-out-soft hover:border-border-strong">
                <IconTile name={point.icon as IconName} />
                <h3 className="mt-1 text-lg font-semibold tracking-[-0.01em]">
                  {point.title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-brand-100/90">
                  {point.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
