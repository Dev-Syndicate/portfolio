import { cn } from "@/lib/utils";

/**
 * A lit panel — the surface primitive this whole design is built from.
 *
 * Every card on the redesigned pages is one of these. The only decision per
 * card is `from`: which edge or corner the light arrives from. Varying that
 * across a grid is what stops a row of cards reading as a row of identical
 * boxes, and it is the single move the reference repeats most.
 *
 * The light itself is painted by the `.bloom` CSS in globals.css via a
 * pseudo-element, so a card costs one DOM node no matter how elaborate its
 * lighting is.
 */

export type BloomFrom = "tl" | "tr" | "bl" | "br" | "t" | "b" | "c";

const froms: Record<BloomFrom, string> = {
  tl: "bloom-tl",
  tr: "bloom-tr",
  bl: "bloom-bl",
  br: "bloom-br",
  t: "bloom-t",
  b: "bloom-b",
  c: "bloom-c",
};

export function Bloom({
  from = "tl",
  soft = true,
  className,
  children,
  id,
  as: Tag = "div",
}: {
  /** Which edge or corner the light comes from. */
  from?: BloomFrom;
  /**
   * Hold the light back until hover. On by default: a grid where every card
   * is lit at full strength becomes a wall of glare, and the brightening on
   * approach is what makes the surfaces feel responsive rather than painted.
   * Turn it off for a hero card that has to carry on its own.
   */
  soft?: boolean;
  className?: string;
  children: React.ReactNode;
  /** Anchor target — /services#<slug> deep links land on these panels. */
  id?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      id={id}
      className={cn("bloom", froms[from], soft && "bloom-soft", className)}
    >
      {/* Content sits above the ::before wash. Without the stacking context
          the light would paint over the text. */}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Tag>
  );
}
