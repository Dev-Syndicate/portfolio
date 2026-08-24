import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Chip } from "@/components/ui/chip";

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
  field,
  "aria-labelledby": ariaLabelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "subtle" | "sky" | "light";
  /**
   * Decorative full-bleed artwork painted behind the content (see
   * `CircuitField`). It is a sibling of the container rather than a child,
   * because the container is width-capped at `--container-max` — anything
   * absolutely positioned inside it would stop at that cap instead of running
   * edge to edge. Purely decorative; the field is responsible for its own
   * `aria-hidden` and pointer-events.
   */
  field?: ReactNode;
  "aria-labelledby"?: string;
}) {
  const scope =
    tone === "sky" ? "tone-sky" : tone === "light" ? "tone-light" : undefined;

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "section-y relative isolate",
        // Keep the board from bleeding past the section it belongs to.
        field && "overflow-hidden",
        scope,
        className,
      )}
      style={id ? { scrollMarginTop: "5.5rem" } : undefined}
    >
      {field}
      <div className="relative container-page">{children}</div>
    </section>
  );
}

/**
 * Eyebrow + heading + intro, sharing one reveal so the block animates as a
 * unit.
 *
 * Rebuilt in the bloom language: the chip replaces the mono instrument label,
 * and the heading takes the same optional two-part shape as the page and hero
 * headlines — a muted lead over a lit payoff. Passing a plain string still
 * works and simply renders lit, so a section with a one-line heading doesn't
 * have to invent a split.
 *
 * Centred is the default here now. The interior pages carry left-locked
 * content beneath their headers, and a centred header over a left-locked list
 * is the alternation the reference uses to keep a long page from reading as
 * one column.
 */
export function SectionHeader({
  id,
  eyebrow,
  heading,
  intro,
  align = "center",
  className,
}: {
  id?: string;
  eyebrow?: string;
  heading: { lead: string; lit: string } | string;
  intro?: string;
  align?: "center" | "start";
  className?: string;
}) {
  const split = typeof heading === "string" ? null : heading;

  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-5",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <Chip>{eyebrow}</Chip> : null}

      <h2 id={id} className="display display-md">
        {split ? (
          <>
            <span className="lead">{split.lead}</span>
            <span className="lit">{split.lit}</span>
          </>
        ) : (
          <span className="lit">{heading as string}</span>
        )}
      </h2>

      {intro ? (
        <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty sm:text-lg">
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
