import { ArrowRight, Check } from "lucide-react";

import { services } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * The detailed Services section: a bento that borrows the home Trust section's
 * idiom — one lit lead card among quiet ones, each carrying a big technical
 * line-art illustration — but here every card also has to earn its keep with a
 * `benefits` checklist, so this is spec-sheet, not teaser.
 *
 * The flagship (items[0]) has the longest body and most benefits, so it takes a
 * full-width LIT hero band. Its internals run side by side on lg — a big framed
 * illustration, the copy, and the benefits checklist — so it reads wide, not
 * tall, and nothing has to stretch to fill a column.
 *
 * The other four fill a 2×2 of quiet cards, each with its own framed
 * illustration up top and its benefits pinned to the foot (mt-auto + a border-t
 * rule) so all four line up regardless of body length.
 *
 *   ┌───────────────────────────────┐
 *   │  art │  copy  │  ✓ benefits    │   ← lit hero (items[0])
 *   ├───────────────┬───────────────┤
 *   │       2       │       3       │
 *   ├───────────────┼───────────────┤
 *   │       4       │       5       │
 *   └───────────────┴───────────────┘
 */

/* One distinct illustration per service, keyed by icon so content stays a plain
   data module. `fallback` guarantees five unique drawings even if a key is
   missing — position-indexed, never repeating. */
const art: Record<string, LineArtName> = {
  globe: "globe", // Website Development
  "app-window": "layers", // Web Applications
  "tablet-smartphone": "orbit", // Mobile Applications
  plug: "circuit", // APIs & Integrations
  sparkles: "wave", // AI & Automation
};
const fallback: LineArtName[] = ["globe", "layers", "orbit", "circuit", "wave"];

function artFor(icon: string, index: number): LineArtName {
  return art[icon] ?? fallback[index % fallback.length];
}

export function Services() {
  const [featured, ...rest] = services.items;
  const FeaturedArt = lineArt[artFor(featured.icon, 0)];

  return (
    <Section id="services" tone="sky" aria-labelledby="services-heading">
      <SectionHeader
        id="services-heading"
        eyebrow="Services"
        heading={services.heading}
        intro={services.intro}
      />

      <div className="mt-9 grid gap-4">
        {/* Featured — the one lit card, full width. Illustration | copy |
            benefits sit side by side on lg so the band reads wide. */}
        <Reveal>
          <article className="ring-glow group relative overflow-hidden rounded-2xl border border-primary/25 bg-card p-7 shadow-[var(--elevation-2)] sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-1/3 right-0 h-72 w-72 rounded-full blur-[80px]"
              style={{ background: "var(--glow-a)" }}
            />

            <div className="relative grid gap-7 lg:grid-cols-[minmax(0,15rem)_1fr_minmax(0,17rem)] lg:items-center lg:gap-10">
              {/* Big framed illustration — the visual anchor. */}
              <div className="flex items-center justify-center rounded-xl border border-border bg-brand-950/40 p-5 text-primary/70">
                <FeaturedArt className="h-32 w-full opacity-90 sm:h-40 lg:h-48" />
              </div>

              {/* Copy. */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <IconTile name={featured.icon as IconName} className="size-12" />
                  <h3 className="text-2xl font-semibold sm:text-[1.75rem]">
                    {featured.title}
                  </h3>
                </div>
                <p className="max-w-xl text-[1.0625rem] leading-[1.75] text-brand-100">
                  {featured.body}
                </p>
              </div>

              {/* Benefits — divided off with a rule that flips from top (stacked)
                  to left (side by side) at lg. */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                <h4 className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                  Client benefits
                </h4>
                <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                  {featured.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-[0.9375rem] text-brand-100/90"
                    >
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </Reveal>

        {/* The other four — a tidy 2×2 of quiet cards, each with its own framed
            illustration and benefits pinned to the foot so they align. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((service, i) => {
            const Art = lineArt[artFor(service.icon, i + 1)];
            return (
              <Reveal key={service.title} delay={0.06 + i * 0.05} className="flex">
                <article className="group flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors duration-[var(--duration-base)] ease-out-soft hover:border-border-strong">
                  {/* Framed illustration — big, per the brief. */}
                  <div className="flex items-center justify-center rounded-lg border border-border bg-brand-950/40 p-4 text-muted-foreground/60 transition-colors duration-[var(--duration-slow)] group-hover:text-primary/70">
                    <Art className="h-20 w-full opacity-90 sm:h-24" />
                  </div>

                  <div className="flex items-center gap-3">
                    <IconTile name={service.icon as IconName} />
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed text-brand-100/90">
                    {service.body}
                  </p>

                  <ul className="mt-auto flex flex-col gap-2.5 border-t border-border pt-5">
                    {service.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2.5 text-[0.875rem] text-brand-100/90"
                      >
                        <Check
                          aria-hidden
                          className="mt-0.5 size-3.5 shrink-0 text-primary"
                          strokeWidth={2.5}
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Closing CTA — kept as-is. */}
      <Reveal delay={0.3}>
        <div className="mt-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <p className="text-muted-foreground">
            Not sure which of these you need?
          </p>
          <Button href="/contact" variant="outline">
            Talk it through with us
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
