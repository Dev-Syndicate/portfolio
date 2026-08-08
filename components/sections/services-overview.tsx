import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Home-page Services — quiet, type-led cards (the reference's "our service"
 * rhythm). No illustrations: a single icon tile, the title, a one-line summary
 * and a "Learn more" affordance. Calm and spacious — the impact comes from the
 * type and the room around it, not from a drawing in every card. The first card
 * is lit (accent border + glow), the one-bright-among-quiet tell. Detail lives
 * on /services.
 */

export function ServicesOverview() {
  return (
    <Section
      id="services"
      tone="light"
      aria-labelledby="services-overview-heading"
    >
      <SectionHeader
        id="services-overview-heading"
        eyebrow="Services"
        heading={services.overview.heading}
        intro={services.overview.intro}
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.items.map((service, i) => {
          const lit = i === 0;
          return (
            <Reveal key={service.title} delay={0.04 + i * 0.05} className="flex">
              <Link
                href={services.overview.cta.href}
                aria-label={`${service.title} — see what it involves`}
                className={cn(
                  "group relative flex w-full flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-7 transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1 sm:p-8",
                  lit
                    ? "ring-glow border-primary/30 shadow-[var(--elevation-2)]"
                    : "border-border hover:border-border-strong",
                )}
              >
                {lit ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-[80px]"
                    style={{ background: "var(--glow-a)" }}
                  />
                ) : null}

                <IconTile
                  name={service.icon as IconName}
                  className={cn(
                    "size-12 rounded-xl",
                    lit && "border-primary/30 text-primary",
                  )}
                />

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">
                    {service.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-[1.65] text-brand-100/90">
                    {service.summary}
                  </p>
                </div>

                <span
                  className={cn(
                    "mt-auto flex items-center gap-1.5 pt-2 text-[0.8125rem] font-medium",
                    lit
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  Learn more
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10">
          <Button href={services.overview.cta.href} variant="outline" size="lg">
            {services.overview.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
