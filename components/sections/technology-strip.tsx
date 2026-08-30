import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { technology } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";

/**
 * Technology — the constellation module.
 *
 * The reference scatters rounded tiles at varying heights across a wide
 * elliptical glow, so the row reads as a field of connected things rather than
 * a logo strip. The arc is the whole effect: tiles near the middle sit high,
 * tiles at the ends sit low, and the light behind them peaks in the centre.
 *
 * Each tile is one of the six technology areas. Hovering a tile lifts it and
 * reveals what that area is *for* — the outcome line, never the stack list,
 * because the promise this section makes is that technology gets explained as
 * business impact.
 */

/* Vertical lift per tile, in rem, forming a shallow dome.
   The row is `items-end`, so every tile hangs from a shared baseline and a
   BOTTOM margin raises it. The centre pair therefore needs the LARGEST values
   to sit highest — the outer tiles get none. (Reversed once already: giving the
   outer tiles the big numbers produced a valley, not a dome.)
   Applied only from `sm` up; below that the tiles wrap to a grid and an offset
   would just read as broken alignment. */
const ARC = [0, 1.25, 2.5, 2.5, 1.25, 0];

export function TechnologyStrip() {
  return (
    <section
      aria-labelledby="technology-heading"
      className="section-y relative isolate overflow-hidden"
    >
      {/* The wide elliptical bloom the tiles sit in front of. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[34rem] w-[76rem] max-w-[150vw] -translate-x-1/2 -translate-y-[42%] rounded-[50%] bg-[radial-gradient(closest-side,var(--bloom-core),var(--bloom-mid)_42%,var(--bloom-none)_74%)] opacity-40 blur-2xl" />
      </div>

      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2 id="technology-heading" className="display display-lg lit">
            {technology.strip.heading}
          </h2>
          <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty sm:text-lg">
            {technology.strip.intro}
          </p>
        </Reveal>

        {/* ── The field ───────────────────────────────────────────────────
            `items-end` plus the per-tile bottom margin in ARC is what produces
            the dome: every tile hangs from the same baseline, and the centre
            pair is lifted off it. */}
        <ul className="mt-16 flex flex-wrap items-end justify-center gap-3 sm:gap-4">
          {technology.groups.map((group, i) => (
            <li
              key={group.id}
              style={{ "--arc": `${ARC[i]}rem` } as React.CSSProperties}
              className="sm:mb-[var(--arc)]"
            >
              <Reveal delay={i * 0.07}>
                <div
                  className={cn(
                    "group relative flex h-full w-[9.5rem] flex-col items-center gap-3 rounded-2xl p-5 text-center sm:w-[10.5rem] sm:p-6",
                    // Equal heights keep the dome a clean curve; without it the
                    // longer outcome lines make neighbouring tiles ragged.
                    "sm:min-h-[14.5rem]",
                    "border border-hairline bg-wash backdrop-blur-sm",
                    "transition-[transform,border-color,background-color] duration-[var(--duration-base)] ease-out-soft",
                    "hover:-translate-y-1.5 hover:border-hairline-strong hover:bg-wash-strong",
                    "motion-reduce:hover:translate-y-0",
                  )}
                >
                  {/* The lit disc — the reference's icon treatment. */}
                  <Icon
                    name={group.icon}
                    className={cn(
                      "size-12 rounded-full p-3 text-foreground",
                      "bg-[radial-gradient(70%_70%_at_30%_22%,color-mix(in_oklab,var(--ref-white)_38%,transparent),color-mix(in_oklab,var(--ref-navy)_88%,transparent))]",
                      "shadow-[inset_0_1px_0_var(--highlight-strong),0_6px_20px_-8px_var(--bloom-mid)]",
                    )}
                  />

                  <span className="text-sm leading-snug font-medium">
                    {group.title}
                  </span>

                  <span className="text-xs leading-[1.5] text-muted-foreground">
                    {group.outcome}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-14 flex justify-center">
          <Link
            href={technology.strip.cta.href}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            {technology.strip.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
