import { trust } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Pattern } from "@/components/ui/pattern";

/**
 * First proof moment after the hero, so it uses an asymmetric editorial
 * layout rather than another centred card grid — the shift in rhythm is what
 * stops the page reading as one repeated template.
 *
 * The heading column sticks on large screens so the claim stays on screen
 * while the visitor reads the evidence for it.
 */
export function Trust() {
  const [lead, ...rest] = trust.points;

  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="section-glow section-y relative isolate overflow-hidden"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <Pattern variant="waves" tone="text-primary/[0.06]" />
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col items-start gap-5">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              Outcomes first
            </span>

            <h2
              id="trust-heading"
              className="text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
            >
              {trust.heading}
            </h2>

            <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground">
              {trust.intro}
            </p>

            <span
              aria-hidden
              className="rule-fade mt-1 w-24 bg-gradient-to-r from-primary/60 to-transparent"
            />
          </div>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2">
          {/* The lead point spans both columns and inverts to the near-white
              scope. A single light card in a navy section is what stops this
              stretch reading as one flat block, and it puts the palette's
              light end on screen well before the first wave. */}
          <Reveal as="li" className="sm:col-span-2">
            <Card className="tone-light group relative flex h-full flex-col gap-4 overflow-hidden p-7 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
              <Pattern
                variant="scales"
                tone="text-accent/20"
                className="-z-0 opacity-70"
              />
              <IconTile
                name={lead.icon as IconName}
                className="relative size-12"
              />
              <div className="relative flex flex-col gap-2.5">
                <h3 className="text-xl font-semibold">{lead.title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {lead.body}
                </p>
              </div>
            </Card>
          </Reveal>

          {rest.map((point, i) => (
            <Reveal as="li" key={point.title} delay={(i + 1) * 0.06}>
              <Card className="group flex h-full flex-col gap-4 p-7">
                <IconTile name={point.icon as IconName} />
                <h3 className="text-lg font-semibold">{point.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {point.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
