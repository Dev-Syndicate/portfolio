import { cn } from "@/lib/utils";

/**
 * The three depth zones a section can sit in. Every page composes from these,
 * so a wave divider anywhere on the site always joins two known colours and
 * the transitions stay consistent between pages.
 *
 * `shallow` is inlined rather than referencing a token because `tone-sky`
 * computes its background the same way; the two must match exactly or the
 * divider shows a seam.
 */
export const ZONE = {
  deep: "var(--ref-deep)",
  shallow: "color-mix(in oklab, var(--ref-sky) 62%, var(--ref-white))",
  surface: "var(--ref-white)",
} as const;

/**
 * Layered wave boundary between two sections.
 *
 * Three offset crests at increasing opacity, which reads as water depth
 * rather than a single cut-out shape — the back layers blend the outgoing
 * colour into the incoming one, so the transition has thickness instead of
 * being a hard edge. This is the palette's oceanic character made structural
 * rather than just a colour choice.
 *
 * `preserveAspectRatio="none"` lets the crest stretch to any viewport width
 * while keeping the height fixed, so the shape never scales the divider out
 * of proportion on wide screens.
 *
 * Purely decorative: `aria-hidden`, and it carries no content or meaning that
 * is not already in the sections either side.
 */
export function WaveDivider({
  /** Colour of the section above — painted as the SVG's own background. */
  from = "var(--background)",
  /** Colour of the section below — what the crests are filled with. */
  to = "var(--background)",
  flip = false,
  className,
}: {
  from?: string;
  to?: string;
  /** Mirror horizontally so consecutive dividers don't repeat the same crest. */
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative -mb-px block leading-[0]", className)}
      style={{ backgroundColor: from }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={cn(
          "block h-14 w-full sm:h-20 lg:h-28",
          // Horizontal only — a vertical flip would move the fill to the top
          // and invert which section the divider belongs to.
          flip && "-scale-x-100",
        )}
      >
        {/* Back swell */}
        <path
          d="M0,92 C280,52 520,116 820,92 C1060,72 1260,104 1440,80 L1440,120 L0,120 Z"
          fill={to}
          opacity="0.3"
        />
        {/* Mid swell */}
        <path
          d="M0,84 C200,36 460,104 760,72 C1040,42 1250,96 1440,58 L1440,120 L0,120 Z"
          fill={to}
          opacity="0.55"
        />
        {/* Breaking crest */}
        <path
          d="M0,66 C240,118 480,10 720,50 C960,90 1200,26 1440,74 L1440,120 L0,120 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
