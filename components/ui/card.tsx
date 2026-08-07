"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Maximum tilt in degrees — deliberately small; the PRD asks for "subtle". */
const MAX_TILT = 4;

/**
 * Card with the full PRD hover treatment: elevation, gradient border glow,
 * a cursor-tracking spotlight, and a spring-damped tilt.
 *
 * The spotlight is what sells the depth — tilt alone on a flat fill reads as
 * a gimmick, but tilt plus a light source that stays put makes the surface
 * feel like it has an actual orientation.
 *
 * Everything is mouse-only and skipped under `prefers-reduced-motion`; the
 * card degrades to a plain elevated surface.
 */
export function Card({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const enabled = interactive && !reduceMotion;

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !interactive || event.pointerType !== "mouse") return;

    const rect = el.getBoundingClientRect();

    // Spotlight position, in px relative to the card, read by the
    // `spotlight` utility in globals.css.
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);

    if (!enabled) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * MAX_TILT * 2);
    rotateX.set(-py * MAX_TILT * 2);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={enabled ? { transform } : undefined}
      className={cn(
        "surface-card h-full",
        interactive && [
          "spotlight ring-glow will-change-transform",
          "transition-[box-shadow,border-color] duration-[var(--duration-base)] ease-out-soft",
          "hover:border-border-strong hover:shadow-[var(--elevation-3)]",
        ],
        className,
      )}
    >
      {/* Pin-1 node at the routed (chamfered) top-right corner — the card's
          board-literacy tell, matching the hero panel. */}
      <span aria-hidden className="card-node" />
      {children}
    </motion.div>
  );
}
