import { ArrowRight, Check } from "lucide-react";

import { services } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * The detailed Services section: one lit flagship band above a tidy 2×2 of the
 * other four. Type-led and spacious — the flagship carries a single restrained
 * line-art drawing as background texture (the page's one deliberate illustration
 * moment), while the four quiet cards stay clean: icon, title, body, and a
 * `benefits` checklist that earns each card its keep. Spec-sheet, not teaser.
 *
 *   ┌───────────────────────────────┐
 *   │  copy  │  ✓ benefits           │   ← lit flagship (items[0])
 *   ├───────────────┬───────────────┤
 *   │       2       │       3       │
 *   ├───────────────┼───────────────┤
 *   │       4       │       5       │
 *   └───────────────┴───────────────┘
 */

/* The flagship's faint background drawing, keyed by icon so content stays a
   plain data module. Only the flagship carries one; the rest stay clean. */
const art: Record<string, LineArtName> = {
  globe: "globe", // Website Development
  "app-window": "layers", // Web Applications
  "tablet-smartphone": "orbit", // Mobile Applications
  plug: "circuit", // APIs & Integrations
  sparkles: "wave", // AI & Automation
};

export function Services() {
  const [featured, ...rest] = services.items;
  const FeaturedArt = lineArt[art[featured.icon] ?? "globe"];

  return (
    <Section id="services" tone="sky" aria-labelledby="services-heading">
      <SectionHeader
        id="services-heading"
        eyebrow="Services"
        heading={services.heading}
        intro={services.intro}
      />

      <div className="mt-12 grid gap-4">
        {/* Featured — the one lit card, full width. Copy and benefits sit side
            by side on lg so the band reads wide, not tall. A faint drawing sits
            top-right as texture. */}
        <Reveal>
          <article
            id={featured.slug}
            className="ring-glow target-card group relative overflow-hidden rounded-2xl border border-primary/25 bg-card p-7 shadow-[var(--elevation-2)] sm:p-9"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-1/3 right-0 h-72 w-72 rounded-full blur-[80px]"
              style={{ background: "var(--glow-a)" }}
            />
            {/* Line-art as quiet background texture, not a boxed viewport. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 hidden h-48 w-64 text-primary/15 sm:block"
            >
              <FeaturedArt />
            </div>

            <div className="relative grid gap-7 lg:grid-cols-[1fr_minmax(0,18rem)] lg:items-start lg:gap-12">
              {/* Copy. */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <IconTile
                    name={featured.icon as IconName}
                    className="size-12 border-primary/30 text-primary"
                  />
                  <h3 className="text-2xl font-semibold tracking-[-0.01em] sm:text-[1.75rem]">
                    {featured.title}
                  </h3>
                </div>
                <p className="max-w-xl text-[1.0625rem] leading-[1.75] text-brand-100">
                  {featured.body}
                </p>
              </div>

              {/* Benefits — divided off with a rule that flips from top (stacked)
                  to left (side by side) at lg. */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
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

        {/* The other four — a tidy 2×2 of quiet, type-led cards with benefits
            pinned to the foot so they align regardless of body length. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((service, i) => (
            <Reveal key={service.title} delay={0.06 + i * 0.05} className="flex">
              <article
                id={service.slug}
                className="target-card group relative flex w-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-7 transition-colors duration-[var(--duration-base)] ease-out-soft hover:border-border-strong"
              >
                <div className="flex items-center gap-3">
                  <IconTile name={service.icon as IconName} className="size-11" />
                  <h3 className="text-xl font-semibold tracking-[-0.01em]">
                    {service.title}
                  </h3>
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
          ))}
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
