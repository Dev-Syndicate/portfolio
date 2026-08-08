import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

/**
 * Home-page Services — the catalogue as a row of numbered technical cards. Each
 * service is a framed "drawing" (a line-art illustration in a viewport) tagged
 * with a catalogue index, so the five read as an engineered set rather than
 * loose text. The first card is "lit" (accent border + glow), the reference's
 * one-bright-among-quiet rhythm. Detail lives on /services.
 */

/* Illustration per service, keyed by its icon. */
const art: Record<string, LineArtName> = {
  globe: "layers", // Website Development — the stack
  "app-window": "nodes", // Web Applications
  "tablet-smartphone": "globe", // Mobile — both stores / reach
  plug: "chip", // APIs & Integrations
  sparkles: "wave", // AI & Automation
};

export function ServicesOverview() {
  return (
    <Section id="services" aria-labelledby="services-overview-heading">
      <SectionHeader
        id="services-overview-heading"
        eyebrow="Services"
        heading={services.overview.heading}
        intro={services.overview.intro}
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {services.items.map((service, i) => {
          const Art = lineArt[art[service.icon] ?? "nodes"];
          const lit = i === 0;
          return (
            <Reveal key={service.title} delay={0.04 + i * 0.05}>
              <Link
                href={services.overview.cta.href}
                aria-label={`${service.title} — see what it involves`}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1",
                  lit
                    ? "ring-glow border-primary/30 shadow-[var(--elevation-2)]"
                    : "border-border hover:border-border-strong",
                )}
              >
                {/* Catalogue index — a real position in the set, not decoration. */}
                <span
                  className={cn(
                    "font-mono text-[0.625rem] tracking-[0.14em] tabular-nums",
                    lit ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {String(i + 1).padStart(2, "0")} / 05
                </span>

                {/* Framed illustration viewport */}
                <div className="relative mt-3 h-28 overflow-hidden rounded-lg border border-border bg-brand-950/40">
                  {lit ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-lg blur-[50px]"
                      style={{ background: "var(--glow-a)" }}
                    />
                  ) : null}
                  <div
                    className={cn(
                      "relative flex h-full items-center justify-center p-3 transition-opacity duration-[var(--duration-slow)]",
                      lit
                        ? "text-primary/80"
                        : "text-muted-foreground/50 group-hover:text-muted-foreground/80",
                    )}
                  >
                    <Art className="max-h-full" />
                  </div>
                  {/* corner brackets — the instrument frame */}
                  <span aria-hidden className="absolute top-1.5 left-1.5 size-2 border-t border-l border-border-strong" />
                  <span aria-hidden className="absolute right-1.5 bottom-1.5 size-2 border-r border-b border-border-strong" />
                </div>

                <div className="mt-4 flex items-center gap-2.5">
                  <IconTile name={service.icon as IconName} className="size-9 rounded-lg" />
                  <h3 className="text-[0.9375rem] leading-tight font-semibold">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-[0.875rem] leading-[1.55] text-brand-100/90">
                  {service.summary}
                </p>

                <span
                  className={cn(
                    "mt-auto flex items-center gap-1.5 pt-4 text-[0.8125rem] font-medium",
                    lit ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
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
        <div className="mt-8">
          <Button href={services.overview.cta.href} variant="outline" size="lg">
            {services.overview.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
