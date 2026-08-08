import { ArrowRight } from "lucide-react";

import { technology } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Home-page version of Technology: the six areas as quiet, type-led cards —
 * an icon tile, the area name, and a one-line business outcome (not framework
 * names). A single line-art drawing sits faint in the top-right corner of each
 * card as texture, never a centrepiece. The stack lists and full write-ups live
 * on /services, so the site never prints the same framework list twice.
 */

/* Each group gets its own faint corner drawing so no two cards repeat. Keyed by
   the group's icon name (stable in content.ts); the position fallback below
   guarantees six distinct illustrations even if an icon key ever drifts. */
const artByIcon: Record<string, LineArtName> = {
  monitor: "layers", // frontend / rendered layers
  "tablet-smartphone": "globe", // mobile / reaches every device
  server: "coil", // backend / scalable core
  database: "nodes", // data / connected records
  cloud: "orbit", // cloud delivery / always-on
  bot: "wave", // automation / signal
};

/* Position fallback — a distinct name per slot, so index i always resolves to
   its own drawing regardless of icon coverage. */
const artByIndex: LineArtName[] = [
  "layers",
  "globe",
  "coil",
  "nodes",
  "orbit",
  "wave",
];

export function TechnologyStrip() {
  return (
    <Section id="technology" aria-labelledby="technology-strip-heading">
      <SectionHeader
        id="technology-strip-heading"
        eyebrow="Technology"
        heading={technology.strip.heading}
        intro={technology.strip.intro}
      />

      {/* Quiet cards, three-up on desktop, collapsing cleanly to one column on a
          phone. Icon + name + outcome, with a faint corner drawing for texture. */}
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {technology.groups.map((group, i) => {
          // First card is "lit" — the anchor the eye lands on first.
          const lit = i === 0;
          const Art =
            lineArt[artByIcon[group.icon] ?? artByIndex[i] ?? "chip"];

          return (
            <Reveal key={group.id} as="li" delay={0.04 + i * 0.05} className="flex">
              <article
                className={cn(
                  "group relative flex w-full flex-col gap-4 overflow-hidden rounded-2xl border p-7 transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1",
                  lit
                    ? "ring-glow border-primary/30 bg-card shadow-[var(--elevation-2)]"
                    : "border-border bg-card hover:border-border-strong",
                )}
              >
                {lit ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full blur-[80px]"
                    style={{ background: "var(--glow-a)" }}
                  />
                ) : null}

                {/* Faint corner drawing — texture, not a centrepiece. */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-4 -right-4 h-24 w-32 transition-colors duration-[var(--duration-slow)]",
                    lit
                      ? "text-primary/25"
                      : "text-muted-foreground/20 group-hover:text-muted-foreground/35",
                  )}
                >
                  <Art />
                </div>

                <IconTile
                  name={group.icon as IconName}
                  className={cn(
                    "size-12 rounded-xl",
                    lit && "border-primary/30 text-primary",
                  )}
                />

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">
                    {group.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-[1.6] text-brand-100/90">
                    {group.outcome}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ul>

      <Reveal delay={0.2}>
        <div className="mt-10">
          <Button href={technology.strip.cta.href} variant="outline" size="lg">
            {technology.strip.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
