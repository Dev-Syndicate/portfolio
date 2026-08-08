import { ArrowRight } from "lucide-react";

import { technology } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Home-page version of Technology: the six areas as dark "spec-sheet" cards,
 * each fronted by a BIG framed line-art illustration — the signature that turns
 * a list of area names into an instrument panel worth reading. Title + outcome
 * carry the value (business impact, not framework names); the stack lists and
 * full write-ups live on /services, so the site never prints the same framework
 * list twice.
 */

/* Each group gets its own drawing so no two cards repeat. Keyed by the group's
   icon name (stable in content.ts); the position fallback below guarantees six
   distinct illustrations even if an icon key ever drifts. */
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
  const total = technology.groups.length;

  return (
    <Section id="technology" aria-labelledby="technology-strip-heading">
      <SectionHeader
        id="technology-strip-heading"
        eyebrow="Technology"
        heading={technology.strip.heading}
        intro={technology.strip.intro}
      />

      {/* Spec-sheet cards, three-up on desktop, collapsing cleanly to one column
          on a phone. Each is a framed illustration over an icon + outcome. */}
      <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {technology.groups.map((group, i) => {
          // First card is "lit" — the anchor the eye lands on first.
          const lit = i === 0;
          const Art =
            lineArt[artByIcon[group.icon] ?? artByIndex[i] ?? "chip"];

          return (
            <Reveal key={group.id} as="li" delay={0.04 + i * 0.05} className="flex">
              <article
                className={cn(
                  "group relative flex w-full flex-col overflow-hidden rounded-2xl border p-5 transition-[border-color,transform] hover:-translate-y-1",
                  lit
                    ? "ring-glow border-primary/30 bg-card shadow-[var(--elevation-2)]"
                    : "border-border bg-card hover:border-border-strong",
                )}
              >
                {/* Corner glow behind the lit card — the same accent pattern used
                    across the site, kept off the plain cards so one reads first. */}
                {lit ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full blur-[80px]"
                    style={{ background: "var(--glow-a)" }}
                  />
                ) : null}

                {/* Framed instrument viewport holding the big illustration. */}
                <div className="relative h-28 rounded-lg border border-border bg-brand-950/40 sm:h-32">
                  {/* Mono catalogue index — reads the panel as an instrument. */}
                  <span className="absolute top-2 left-2 font-mono text-[0.625rem] tracking-[0.14em] tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>

                  {/* Corner brackets — the frame's registration marks. */}
                  <span
                    aria-hidden
                    className="absolute top-2 right-2 size-2 border-t border-r border-border-strong"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-2 left-2 size-2 border-b border-l border-border-strong"
                  />

                  <div className="flex h-full items-center justify-center px-6 py-4">
                    <Art
                      className={cn(
                        "h-full w-auto transition-colors duration-[var(--duration-base)] ease-out-soft",
                        lit
                          ? "text-primary/70"
                          : "text-muted-foreground/50 group-hover:text-muted-foreground/80",
                      )}
                    />
                  </div>
                </div>

                {/* Icon + title + outcome — the value, below the drawing. */}
                <div className="mt-4 flex items-start gap-3">
                  <IconTile name={group.icon as IconName} className="size-10 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[0.9375rem] leading-snug font-semibold tracking-[-0.01em]">
                      {group.title}
                    </h3>
                    <p className="text-[0.875rem] leading-[1.55] text-brand-100/90">
                      {group.outcome}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ul>

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
