import { ArrowRight } from "lucide-react";

import { technology } from "@/lib/content";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Home-page version of Technology: the six areas by name, in one shared-border
 * panel (3×2), with the heading above it. The stack lists and impact write-ups
 * live on /insights — naming them once here and linking across keeps the site
 * from printing the same framework list three times.
 */
export function TechnologyStrip() {
  return (
    <Section id="technology" aria-labelledby="technology-strip-heading">
      <SectionHeader
        id="technology-strip-heading"
        eyebrow="Technology"
        heading={technology.strip.heading}
        intro={technology.strip.intro}
      />

      {/* Mobile: a compact 2-col grid of on-brand cards (chamfer + node), each
          carrying an icon, the area, and a short business-outcome line — value,
          not framework names. Two-up rather than full-width slabs so it reads
          as a considered layout, not a tall stack of identical boxes. */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:hidden">
        {technology.groups.map((group) => (
          <div
            key={group.id}
            className="surface-card flex flex-col gap-3 p-4"
          >
            <span aria-hidden className="card-node" />
            <IconTile name={group.icon as IconName} />
            <div className="flex flex-col gap-1">
              <span className="text-sm leading-snug font-semibold tracking-[-0.01em]">
                {group.title}
              </span>
              <span className="text-[0.8125rem] leading-snug text-muted-foreground">
                {group.outcome}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* sm+: unchanged — the shared-border 3×2 spec-sheet panel. */}
      <DividedGrid
        className="mt-9 hidden sm:grid"
        cols="sm:grid-cols-2 lg:grid-cols-3"
      >
        {technology.groups.map((group) => (
          <GridCell key={group.id} className="flex-row items-center gap-4 py-6">
            <IconTile name={group.icon as IconName} className="size-10" />
            <span className="text-[0.9375rem] font-medium">{group.title}</span>
          </GridCell>
        ))}
      </DividedGrid>

      <Reveal delay={0.2}>
        <div className="mt-7">
          <Button href={technology.strip.cta.href} variant="outline" size="lg">
            {technology.strip.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
