import { cn } from "@/lib/utils";

/**
 * The eyebrow pill — this design's section announcer.
 *
 * It replaces the old `InstrumentLabel` (mono, pad-and-stub) on every
 * redesigned surface. The reference opens each section with exactly this: a
 * small uppercase word floating in a barely-there capsule, set apart from the
 * headline by space rather than by a rule.
 *
 * `InstrumentLabel` is deliberately left in place for the pages that have not
 * been rebuilt yet — the two never appear on the same screen.
 */
export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("chip", className)}>{children}</span>;
}

/**
 * A chip with a lit dot — used in the hero's promise row, where each item is a
 * claim rather than a label and the dot reads as a checked-off state.
 */
export function DotChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("chip tracking-normal normal-case", className)}>
      <span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--bloom-core)]"
      />
      {children}
    </span>
  );
}
