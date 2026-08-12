import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { InstrumentLabel } from "@/components/ui/instrument";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { lineArt } from "@/components/artwork/line-art";

/**
 * Home-page Services — an asymmetric panel of five engagements, ordered by how
 * close the work sits to the people who use it.
 *
 * WHY IT IS SHAPED LIKE THIS
 *
 * 1. `where`, not `01 / 02 / 03`. Numbered markers only earn their place when
 *    order carries information, and five parallel engagements are not a
 *    sequence. Each card instead prints the place in the customer's world that
 *    the work occupies — "Public surface" through "Runs unattended" — and the
 *    grid runs down that axis, most visible to least. The intro names the axis
 *    so the five labels read as one scale. Reorder `services.items` and the
 *    device stops being true, so don't.
 *
 * 2. Copy anchors to different edges. The flagship pins its copy to the foot
 *    under a large field of air; the wide band pins to the head with the air
 *    beneath. That stagger is what stops a bento reading as a spreadsheet.
 *
 * 3. One inverted card, and it is the LAST one. This palette has no accent
 *    hue, so tonal inversion is the only available shout (see `tone-invert` in
 *    globals.css). It is spent on AI & Automation deliberately: the section
 *    argues that value runs from what everyone sees to what nobody watches,
 *    and making the invisible one the only lit surface is that argument in
 *    one move. Size marks importance, inversion marks the thing you would
 *    otherwise scroll past.
 *
 * 4. No icon tiles. Five generic glyphs said nothing the titles didn't, and a
 *    tinted-icon-per-card is the most templated thing a services grid can do.
 *    The section is type-led; the flagship's line-art is the only drawing.
 *
 *   ┌───────────┬───────────────────────────┐
 *   │           │  Web Applications         │
 *   │  Website  ├─────────────┬─────────────┤
 *   │  Dev      │  Mobile     │  APIs       │
 *   ├───────────┴─────────────┼─────────────┤
 *   │  AI & Automation  (lit) │  open air   │
 *   └─────────────────────────┴─────────────┘
 */

const FlagshipArt = lineArt.globe;

/**
 * Per-item placement. Parallel to `services.items`, so the content module stays
 * plain data and the composition stays here.
 *
 *   span   — column/row spans at each breakpoint
 *   anchor — which edge the copy sits against ("end" leaves the air above)
 *   size   — type scale and card treatment
 */
const layout = [
  { span: "sm:col-span-2 lg:col-span-2 lg:row-span-2", anchor: "end", size: "flagship" },
  { span: "sm:col-span-2 lg:col-span-4", anchor: "start", size: "wide" },
  { span: "lg:col-span-2", anchor: "end", size: "base" },
  { span: "lg:col-span-2", anchor: "end", size: "base" },
  { span: "sm:col-span-2 lg:col-span-4", anchor: "end", size: "invert" },
] as const;

/* The mono placement caption. Deliberately barer than `InstrumentLabel` (no
   pad, no trace stub) — the full instrument mark stays reserved for the
   section eyebrow, so the two never compete. */
function WhereLabel({ children, lit }: { children: string; lit?: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-[0.6875rem] tracking-[0.16em] uppercase",
        lit ? "text-foreground/70" : "text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function ServicesOverview() {
  return (
    <Section
      id="services"
      tone="light"
      aria-labelledby="services-overview-heading"
    >
      {/* Header — heading over a row that puts the intro left and the route to
          detail hard right, so the CTA is read with the section rather than
          orphaned at its foot. Set larger than the shared `SectionHeader`:
          this is the page's main event and the scale should say so. */}
      <Reveal className="flex flex-col gap-5">
        <InstrumentLabel>Services</InstrumentLabel>

        <h2
          id="services-overview-heading"
          className="max-w-[14ch] text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.04em]"
        >
          {services.overview.heading}
        </h2>

        <div className="mt-1 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <p className="max-w-xl text-[1.0625rem] leading-[1.7] text-muted-foreground sm:text-lg">
            {services.overview.intro}
          </p>
          <Button
            href={services.overview.cta.href}
            variant="outline"
            className="shrink-0 self-start md:self-auto"
          >
            {services.overview.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
        {services.items.map((service, i) => {
          const cell = layout[i];
          const flagship = cell.size === "flagship";
          const invert = cell.size === "invert";

          return (
            <Reveal
              key={service.title}
              delay={0.04 + i * 0.06}
              className={cn("flex", cell.span)}
            >
              <Link
                // Deep link to this service's own card on /services rather
                // than the page top, so five cards are five destinations
                // instead of five links to the same place.
                href={`${services.overview.cta.href}#${service.slug}`}
                aria-label={`${service.title} — see what this involves`}
                className={cn(
                  "surface-card group relative flex w-full flex-col p-6 sm:p-7 2xl:p-8",
                  "transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft",
                  "hover:border-border-strong hover:-translate-y-0.5",
                  "motion-reduce:hover:translate-y-0",
                  // `surface-card` clips to its chamfer, which would clip an
                  // outline away too — so the focus ring is drawn inset.
                  "focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]",
                  invert && "tone-invert",
                  flagship && "min-h-[19rem] lg:min-h-0",
                  cell.size === "wide" && "lg:min-h-[13.5rem]",
                  cell.size === "base" && "lg:min-h-[13.5rem]",
                )}
              >
                <span aria-hidden className="card-node" />

                {flagship ? (
                  <>
                    {/* Ambient light, then the section's one drawing. Both are
                        clipped by the card's chamfer. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full blur-[80px]"
                      style={{ background: "var(--glow-a)" }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-8 -right-8 hidden h-56 w-64 text-primary/15 sm:block"
                    >
                      <FlagshipArt />
                    </span>
                  </>
                ) : null}

                {/* Head — the placement label, always at the top edge. */}
                <span className="relative flex items-start justify-between gap-4">
                  <WhereLabel lit={flagship || invert}>{service.where}</WhereLabel>
                </span>

                {/* Body — anchored to the head or the foot per the layout. */}
                <div
                  className={cn(
                    "relative flex flex-col gap-3",
                    cell.anchor === "end" ? "mt-auto pt-16" : "mt-5",
                    invert &&
                      "lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pt-12",
                  )}
                >
                  <h3
                    className={cn(
                      "flex items-start gap-2.5 font-semibold tracking-[-0.03em] text-balance",
                      flagship && "text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1]",
                      cell.size === "wide" &&
                        "text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.15]",
                      cell.size === "base" && "text-xl leading-[1.2]",
                      invert &&
                        "text-[clamp(1.375rem,2.1vw,1.75rem)] leading-[1.1] lg:shrink-0",
                    )}
                  >
                    {service.title}
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={1.75}
                      className={cn(
                        "mt-[0.15em] shrink-0 opacity-45",
                        "transition-[opacity,transform] duration-[var(--duration-base)] ease-out-soft",
                        "group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                        "motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0",
                        flagship || invert ? "size-[0.85em]" : "size-4",
                      )}
                    />
                  </h3>

                  <p
                    className={cn(
                      "leading-[1.65] text-foreground/70",
                      flagship
                        ? "max-w-[34ch] text-[1.0625rem]"
                        : "text-[0.9375rem]",
                      cell.size === "wide" && "max-w-[46ch]",
                      invert && "lg:max-w-[38ch] lg:text-right",
                    )}
                  >
                    {service.summary}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}

        {/* The last cell is open ground, not a card — the panel breaks its own
            frame to close. It catches the visitor who can't place their problem
            on the scale above and would otherwise leave the section unserved. */}
        <Reveal
          delay={0.04 + services.items.length * 0.06}
          className="flex sm:col-span-2 lg:col-span-2"
        >
          <div className="flex w-full flex-col justify-end gap-4 px-1 pt-2 pb-1 sm:px-2 lg:pt-6">
            <p className="text-[0.9375rem] leading-[1.65] text-muted-foreground">
              Not sure which one fits? Describe the problem and we’ll tell you
              which of these it is.
            </p>
            <Link
              href="/contact"
              className={cn(
                "group/link inline-flex w-fit items-center gap-2 text-[0.9375rem] font-medium text-foreground",
                "transition-colors duration-[var(--duration-base)] ease-out-soft hover:text-primary",
              )}
            >
              Talk it through
              <ArrowRight
                aria-hidden
                className={cn(
                  "size-4 transition-transform duration-[var(--duration-base)] ease-out-soft",
                  "group-hover/link:translate-x-1 motion-reduce:group-hover/link:translate-x-0",
                )}
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
