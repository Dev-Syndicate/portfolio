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
            Two layouts, one markup.

            Mobile: a plain two-column grid. `items-stretch` (grid's default)
            plus `h-full` on each tile makes both cells in a row share the
            taller one's height, so a two-line title never leaves its neighbour
            short — that ragged, uneven look was fixed-width tiles sizing to
            their own content. No arc down here: it only reads as a dome once
            the six sit on one line.

            sm and up: back to the arc. `sm:flex` restores the single wrapping
            row, `items-end` hangs every tile from a shared baseline, and the
            per-tile ARC bottom-margin lifts the centre pair into the dome. */}
        <ul className="mt-16 grid grid-cols-2 items-stretch gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-center sm:gap-4">
          {technology.groups.map((group, i) => (
            <li
              key={group.id}
              style={{ "--arc": `${ARC[i]}rem` } as React.CSSProperties}
              className="flex sm:mb-[var(--arc)]"
            >
              <Reveal delay={i * 0.07} className="flex w-full">
                <div
                  className={cn(
                    "group relative flex h-full w-full flex-col items-center gap-3 rounded-2xl p-5 text-center sm:w-[10.5rem] sm:p-6",
                    // A shared floor on every tile so all six read as one set,
                    // not six content-sized boxes. Mobile gets its own (shorter,
                    // since two columns give the text more width and fewer wraps);
                    // sm+ keeps the taller floor the dome needs to stay a clean
                    // curve.
                    "min-h-[12.5rem] sm:min-h-[14.5rem]",
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
