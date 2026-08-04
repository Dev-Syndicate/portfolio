import { ArrowRight, Check } from "lucide-react";

import { services } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Layout follows the content, not the other way round.
 *
 * The previous version forced the featured service into a 3×2 block. Its copy
 * only filled the top third, so `mt-auto` pushed the benefits to the floor and
 * left a dead void through the middle — a big card wrapped around small
 * contents.
 *
 * What the content actually looks like: one service with a longer description
 * and five benefits, then three with short descriptions and three benefits
 * each. So the first gets a full-width band that runs its copy and benefits
 * side by side (wide, not tall — nothing has to stretch), and the other three
 * split a row evenly, where their near-identical volume means the grid's
 * equal heights cost nothing.
 *
 *   ┌───────────────────────┐
 *   │  1   copy  │ benefits │
 *   ├───────┬───────┬───────┤
 *   │   2   │   3   │   4   │
 *   └───────┴───────┴───────┘
 */
export function Services() {
  const [featured, ...rest] = services.items;

  return (
    <Section
      id="services"
      tone="sky"
      pattern="scales"
      patternTone="text-accent/[0.18]"
      aria-labelledby="services-heading"
    >
      <SectionHeader
        id="services-heading"
        eyebrow="Services"
        heading={services.heading}
        intro={services.intro}
      />

      <div className="mt-14 flex flex-col gap-4">
        <Reveal>
          <Card className="group flex flex-col gap-8 p-7 sm:p-9 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex flex-col gap-4 lg:flex-1">
              <div className="flex items-center gap-4">
                <IconTile name={featured.icon as IconName} className="size-12" />
                <h3 className="text-2xl font-semibold sm:text-[1.75rem]">
                  {featured.title}
                </h3>
              </div>
              <p className="max-w-xl text-[1.0625rem] leading-[1.75] text-muted-foreground">
                {featured.body}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-7 lg:w-[22rem] lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <h4 className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                Client benefits
              </h4>
              <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {featured.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2.5 text-[0.9375rem] text-foreground/90"
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
          </Card>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-3">
          {rest.map((service, i) => (
            <Reveal as="li" key={service.title} delay={0.08 + i * 0.07}>
              <Card className="group flex h-full flex-col gap-4 p-7">
                <IconTile name={service.icon as IconName} />
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-[0.9375rem] leading-[1.7] text-muted-foreground">
                  {service.body}
                </p>

                <ul className="mt-auto flex flex-col gap-2.5 border-t border-border pt-5">
                  {service.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-[0.875rem] text-foreground/90"
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
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>

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
