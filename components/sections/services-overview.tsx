import { ArrowRight } from "lucide-react";

import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Home-page version of Services: name and one line each, in one shared-border
 * panel — three across the top row, two across the bottom — so the five read as
 * a single framed set rather than loose cards. Detail lives on /services.
 */
export function ServicesOverview() {
  return (
    <Section id="services" tone="subtle" aria-labelledby="services-overview-heading">
      <SectionHeader
        id="services-overview-heading"
        eyebrow="Services"
        heading={services.overview.heading}
        intro={services.overview.intro}
      />

      <DividedGrid className="mt-9" cols="sm:grid-cols-2 lg:grid-cols-6">
        {services.items.map((service, i) => (
          <GridCell
            key={service.title}
            href={services.overview.cta.href}
            aria-label={`${service.title} — see what it involves`}
            className={cn(
              "gap-4",
              i < 3 ? "lg:col-span-2" : "lg:col-span-3",
              i === services.items.length - 1 && "sm:col-span-2 lg:col-span-3",
            )}
          >
            <IconTile name={service.icon as IconName} />
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p className="text-[0.9375rem] leading-[1.65] text-muted-foreground">
              {service.summary}
            </p>
            <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-medium text-primary">
              Details
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/cell:translate-x-0.5"
              />
            </span>
          </GridCell>
        ))}
      </DividedGrid>

      <Reveal delay={0.2}>
        <div className="mt-7">
          <Button href={services.overview.cta.href} variant="outline" size="lg">
            {services.overview.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
