import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { InstrumentLabel } from "@/components/ui/instrument";

/**
 * Section shell — vertical rhythm and the page container, transparent.
 *
 * There is no section-level background: every section sits on the one
 * continuous liquid ground, so the motion breathes across the whole page.
 * Separation comes from the bordered content panels (`DividedGrid`) and
 * spacing, not from tinting the background. `tone` only re-points the semantic
 * tokens so a raised section's cards/borders lift a step — the ground stays
 * the same everywhere.
 */
export function Section({
  id,
  children,
  className,
  tone = "default",
  "aria-labelledby": ariaLabelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "subtle" | "sky" | "light";
  "aria-labelledby"?: string;
}) {
  const scope =
    tone === "sky" ? "tone-sky" : tone === "light" ? "tone-light" : undefined;

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn("section-y relative isolate", scope, className)}
      style={id ? { scrollMarginTop: "5.5rem" } : undefined}
    >
      <div className="relative container-page">{children}</div>
    </section>
  );
}

/**
 * Eyebrow + heading + intro, sharing one reveal so the block animates as a
 * unit. `align="start"` is the default now — a left-locked header reads as
 * structured; centred headers are what made sections feel like loose slides.
 */
export function SectionHeader({
  id,
  eyebrow,
  heading,
  intro,
  align = "start",
  className,
}: {
  id?: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <InstrumentLabel>{eyebrow}</InstrumentLabel> : null}

      <h2
        id={id}
        className="text-[clamp(1.875rem,3.4vw,3.5rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
      >
        {heading}
      </h2>

      {intro ? (
        <p className="max-w-2xl text-[1.0625rem] leading-[1.7] text-muted-foreground sm:text-lg 2xl:max-w-3xl 2xl:text-xl">
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}

/**
 * A shared-border grid: cells sit flush against one another separated by a
 * single hairline, framed by an outer border — the "spec sheet" structure.
 * This is what stops cards floating: everything locks to one grid, no gaps, no
 * raw void between them.
 *
 * Implemented with a 1px background showing through 1px gaps (the classic
 * `gap` + `bg-border` trick), so every internal and outer rule is exactly one
 * pixel and always aligned.
 */
export function DividedGrid({
  children,
  className,
  cols = "sm:grid-cols-2 lg:grid-cols-3",
  mobileCards = false,
}: {
  children: ReactNode;
  className?: string;
  /** Responsive column classes. */
  cols?: string;
  /**
   * On mobile, render as a gap-separated stack of standalone cards instead of
   * the flush shared-border panel. The panel collapses to one column below
   * `sm` anyway, and a stack of identical flush boxes reads as monotonous on a
   * phone; separate on-brand cards give each item its own surface. Pair with
   * `<GridCell mobileCard>` so the cells pick up the card styling to match.
   * The flush spec-sheet returns unchanged at `sm`+.
   */
  mobileCards?: boolean;
}) {
  return (
    <div
      className={cn(
        mobileCards
          ? // Mobile: standalone cards. sm+: the flush shared-border panel.
            "flex flex-col gap-3 sm:grid sm:gap-px sm:overflow-hidden sm:rounded-xl sm:border sm:border-border sm:bg-border"
          : "grid gap-px overflow-hidden rounded-xl border border-border bg-border",
        cols,
        className,
      )}
    >
      {children}
    </div>
  );
}
