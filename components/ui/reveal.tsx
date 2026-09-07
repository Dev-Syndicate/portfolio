import type { CSSProperties, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

/** Where the block travels FROM, as x/y offsets fed to the CSS transform. */
const offsets: Record<Direction, { x: string; y: string }> = {
  up: { x: "0", y: "1.5rem" },
  down: { x: "0", y: "-1.5rem" },
  left: { x: "1.5rem", y: "0" },
  right: { x: "-1.5rem", y: "0" },
  none: { x: "0", y: "0" },
};

type Tag =
  | "div"
  | "section"
  | "li"
  | "span"
  | "p"
  | "article"
  | "ul"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

/**
 * Fade + travel a block into view the first time it is scrolled to.
 *
 * NO LONGER A CLIENT COMPONENT, and that is the point of the rewrite. This used
 * to be a `motion` element with its own `whileInView` observer, which meant
 * every heading that wanted an entrance pulled its whole page into the client
 * bundle and added another IntersectionObserver to the document. It now emits
 * `data-reveal` and two custom properties; one observer for the entire site
 * (components/ui/reveal-observer.tsx) adds `.is-revealed`, and a CSS transition
 * does the work. Same API, same look, none of the per-element cost.
 *
 * REDUCED MOTION AND NO-JS ARE HANDLED IN CSS, NOT HERE, and that distinction
 * is load-bearing — it is the bug this component used to have, in a new form.
 * The old version branched its markup on `useReducedMotion()`, which the server
 * cannot know, so the server sent `opacity: 0` and the client rendered
 * something else; React refused to patch the mismatch and the text stayed
 * invisible for anyone browsing with reduced motion on. Nothing here varies
 * between server and client at all: the hidden state lives entirely in a
 * stylesheet, inside a `prefers-reduced-motion: no-preference` query and behind
 * a `.reveal-ready` class that only appears once IntersectionObserver is
 * confirmed. Whatever fails, the text is visible.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
  style,
  id,
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode;
  direction?: Direction;
  /** Seconds, matching the old motion API so existing call sites are unchanged. */
  delay?: number;
  className?: string;
  as?: Tag;
  style?: CSSProperties;
  /** Headings passed through `as` still need to be referenceable by aria. */
  id?: string;
  "aria-labelledby"?: string;
}) {
  const Tag = as;
  const offset = offsets[direction];

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      data-reveal=""
      // Only set when authored. Its presence is also the signal the observer
      // reads to leave this element out of its parent's automatic stagger —
      // a call site that numbered its own children has already decided the
      // order, and a second one layered on top would fight it.
      {...(delay > 0 ? { "data-reveal-delay": "" } : {})}
      style={
        {
          "--reveal-x": offset.x,
          "--reveal-y": offset.y,
          ...(delay > 0 ? { "--reveal-delay": `${Math.round(delay * 1000)}ms` } : {}),
          ...style,
        } as CSSProperties
      }
      className={className}
    >
      {children}
    </Tag>
  );
}
