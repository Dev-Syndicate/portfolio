import { ArrowRight } from "lucide-react";

import { technology } from "@/lib/content";
import { Section } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Home-page version of Technology: the six areas by name, and nothing else.
 *
 * The stack lists and business-impact write-ups live on /insights. They used
 * to appear on the home page and the services page as well — the same
 * framework names printed three times, which makes a site look padded rather
 * than capable.
 *
 * Laid out as a single horizontal band rather than another card grid, so it
 * does not read as a repeat of the Services block above it.
 */
export function TechnologyStrip() {
  return (
    <Section id="technology" aria-labelledby="technology-strip-heading">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <Reveal className="flex max-w-md flex-col items-start gap-4">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            Technology
          </span>
          <h2
            id="technology-strip-heading"
            className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.03em]"
          >
            {technology.strip.heading}
          </h2>
          <p className="leading-[1.7] text-muted-foreground">
            {technology.strip.intro}
          </p>
          <Button
            href={technology.strip.cta.href}
            variant="outline"
            className="mt-2"
          >
            {technology.strip.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Reveal>

        <ul className="grid flex-1 gap-3 sm:grid-cols-2 lg:max-w-lg">
          {technology.groups.map((group, i) => (
            <Reveal as="li" key={group.id} delay={i * 0.06}>
              <div className="group flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3.5 transition-colors duration-[var(--duration-base)] ease-out-soft hover:border-border-strong">
                <IconTile
                  name={group.icon as IconName}
                  className="size-9 rounded-lg"
                />
                <span className="text-[0.9375rem] font-medium">
                  {group.title}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
