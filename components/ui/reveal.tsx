"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

type Tag = "div" | "section" | "li" | "span" | "p";

/**
 * Fade + slide a block into view once, the first time it is scrolled to.
 *
 * `viewport.once` matters for perf: without it the observer keeps firing on
 * every scroll pass.
 *
 * REDUCED MOTION IS HANDLED IN THE TRANSITION, NOT IN THE MARKUP, and that
 * distinction is load-bearing. This component used to branch on
 * `useReducedMotion()` at render time and return a plain element instead of a
 * motion one. `useReducedMotion` cannot know the user's setting on the server,
 * so it returned false there and true in the browser: the server sent
 * `style="opacity:0;transform:translateY(24px)"` and the client rendered no
 * style at all. React reported the mismatch and — as it warns — did not patch
 * it up, so the server's `opacity:0` stayed on the element, and nothing was
 * left to animate it away. Every section wrapped in a Reveal was PERMANENTLY
 * INVISIBLE to anyone browsing with reduced motion on: Values, Services, FAQ,
 * the closing panel.
 *
 * Branching only the `transition` fixes it because a transition is never
 * serialised into HTML. Server and client now emit identical markup, and a
 * reduced-motion user gets the same reveal with a zero-length duration — the
 * content simply appears when scrolled to, which is what "no animation" should
 * mean rather than "no content".
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: Tag;
}) {
  const reduceMotion = useReducedMotion();
  const offset = offsets[direction];
  const Animated = motion[as];

  return (
    <Animated
      // Constant across server and client — anything that varies here lands in
      // the HTML and reintroduces the mismatch described above.
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
      }
      className={className}
    >
      {children}
    </Animated>
  );
}
