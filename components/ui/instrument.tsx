import { cn } from "@/lib/utils";

/**
 * The mono "instrument label" — the studio's eyebrow primitive, used on every
 * section header in place of a sans pill: a filled pad + a trace stub + the
 * uppercase label. The pad-and-stub grammar carries down the page so the whole
 * site reads as one engineered sheet.
 */
export function InstrumentLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase tabular-nums",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 bg-primary" />
      <span aria-hidden className="h-px w-6 shrink-0 bg-border-strong" />
      {children}
    </span>
  );
}

/**
 * Diagonal corner brackets that imply a framed drawing view around a section,
 * without a full rectangle (which would re-introduce density). Two L-marks on
 * the requested corners — the same device as the hero frame, at section scale.
 *
 * Purely decorative; pointer-events-none and aria-hidden.
 */
export function SectionFrame({
  corners = "tl-br",
  className,
}: {
  /** Which diagonal pair to bracket. */
  corners?: "tl-br" | "tr-bl";
  className?: string;
}) {
  const marks =
    corners === "tl-br"
      ? ["top-0 left-0 border-t border-l", "bottom-0 right-0 border-b border-r"]
      : ["top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l"];

  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {marks.map((pos, i) => (
        <span
          key={i}
          className={cn("absolute size-5 border-border-strong/70", pos)}
        />
      ))}
    </span>
  );
}
