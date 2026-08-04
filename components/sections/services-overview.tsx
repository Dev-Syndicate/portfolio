import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { services } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Home-page version of Services: name and one line each, nothing more.
 *
 * The full descriptions and client benefits live on /services. Printing both
 * would put the same four paragraphs on two pages, which reads as padding
 * rather than thoroughness.
 */
export function ServicesOverview() {
  return (
    <Section
      id="services"
      tone="sky"
      pattern="scales"
      patternTone="text-accent/[0.18]"
      aria-labelledby="services-overview-heading"
    >
      <SectionHeader
        id="services-overview-heading"
        eyebrow="Services"
        heading={services.overview.heading}
        intro={services.overview.intro}
      />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.items.map((service, i) => (
          <Reveal as="li" key={service.title} delay={i * 0.07}>
            <Link
              href={services.overview.cta.href}
              className="group block h-full rounded-xl focus-visible:outline-none"
            >
              <Card className="flex h-full flex-col gap-4 p-6">
                <IconTile name={service.icon as IconName} />
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-[0.9375rem] leading-[1.65] text-muted-foreground">
                  {service.summary}
                </p>
                <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                  Details
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover:translate-x-0.5"
                  />
                </span>
              </Card>
            </Link>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.3}>
        <div className="mt-10 flex justify-center">
          <Button href={services.overview.cta.href} variant="outline" size="lg">
            {services.overview.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
