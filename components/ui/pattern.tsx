import { cn } from "@/lib/utils";

type PatternVariant = "waves" | "scales" | "ripple" | "contour";

const variants: Record<PatternVariant, string> = {
  waves: "pattern-waves",
  scales: "pattern-scales",
  ripple: "pattern-ripple",
  contour: "pattern-contour",
};

/**
 * Absolutely-positioned decorative texture layer.
 *
 * Sits behind a section's content and takes its colour from `currentColor`,
 * so `tone` is just a text utility (`text-accent/15`) and the pattern follows
 * whichever palette scope it lands in — a wave field in a navy section and
 * the same wave field in a near-white one need no separate definitions.
 *
 * Always `aria-hidden`; nothing here carries meaning.
 */
export function Pattern({
  variant,
  tone = "text-accent/15",
  className,
}: {
  variant: PatternVariant;
  /** Text-colour utility controlling hue and strength. */
  tone?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 block",
        variants[variant],
        tone,
        className,
      )}
    />
  );
}
