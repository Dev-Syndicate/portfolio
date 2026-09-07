"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Magnetic hover (PRD motion spec): the child drifts toward the cursor while
 * it is over the element, then springs back on exit.
 *
 * Disabled entirely for `prefers-reduced-motion` and for coarse pointers,
 * where there is no cursor to be magnetic toward.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius,
  className,
}: {
  children: React.ReactNode;
  /** Fraction of the cursor offset the element follows. */
  strength?: number;
  /**
   * Cap on how far, in px, the element may drift from its resting position.
   * Unbounded by default; set it where the element sits inside a fixed frame
   * (e.g. the header capsule) so magnetic drift can't carry it out of bounds.
   */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 260, damping: 18, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  function handleMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    let dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
    let dy = (event.clientY - (rect.top + rect.height / 2)) * strength;

    // Clamp the drift to `radius` so the element can nudge toward the cursor
    // without ever leaving the frame it sits in. Scale both axes by the same
    // factor so the pull still points at the cursor.
    if (radius !== undefined) {
      const distance = Math.hypot(dx, dy);
      if (distance > radius) {
        const scale = radius / distance;
        dx *= scale;
        dy *= scale;
      }
    }

    x.set(dx);
    y.set(dy);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}
