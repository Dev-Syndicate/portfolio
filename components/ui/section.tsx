import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Pattern } from "@/components/ui/pattern";

/**
 * Standard section shell: vertical rhythm, page container, and an optional
 * one-step-off background for alternating bands.
 */
/**
 * `tone` picks which palette scope the section renders in:
 *   default — the deep navy canvas
 *   subtle  — one step up from it, for adjacent dark bands
 *   sky     — light blue scope (see `tone-sky` in globals.css)
 *   light   — near-white scope (see `tone-light`)
 *
 * The light tones re-point the semantic tokens, so every component inside
 * inverts automatically without knowing it happened.
 */
export function Section({
  id,
  children,
  className,
  tone = "default",
  pattern,
  patternTone,
  "aria-labelledby": ariaLabelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "subtle" | "sky" | "light";
  /** Decorative texture layer. See `components/ui/pattern.tsx`. */
  pattern?: "waves" | "scales" | "ripple" | "contour";
  patternTone?: string;
  "aria-labelledby"?: string;
}) {
  const isLight = tone === "sky" || tone === "light";
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "section-y relative isolate overflow-hidden",
        tone === "subtle" && "bg-surface-subtle",
        tone === "sky" && "tone-sky",
        tone === "light" && "tone-light",
        // Only the plain navy band gets the ambient wash — a run of identical
        // dark sections is what reads as empty canvas. The light tones carry
        // themselves.
        tone === "default" && "section-glow",
        className,
      )}
      // Anchor links land below the fixed header rather than under it
      style={id ? { scrollMarginTop: "5.5rem" } : undefined}
    >
      {pattern ? (
        <Pattern
          variant={pattern}
          tone={
            patternTone ?? (isLight ? "text-accent/12" : "text-primary/[0.07]")
          }
        />
      ) : null}
      <div className="relative container-page">{children}</div>
    </section>
  );
}

/**
 * Eyebrow + heading + intro, sharing one reveal so the block animates as a
 * unit instead of three separate slides.
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
  heading: string;
  intro?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" ? "mx-auto text-center items-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground shadow-[var(--elevation-1)] backdrop-blur-sm">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      ) : null}

      <h2
        id={id}
        className="text-[clamp(1.875rem,3.6vw,2.875rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
      >
        {heading}
      </h2>

      {intro ? (
        <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground sm:text-lg">
          {intro}
        </p>
      ) : null}

      <span
        aria-hidden
        className={cn(
          "rule-fade mt-2 w-24",
          align === "center" &&
            "bg-gradient-to-r from-transparent via-primary/50 to-transparent",
          align === "start" && "bg-gradient-to-r from-primary/60 to-transparent",
        )}
      />
    </Reveal>
  );
}
