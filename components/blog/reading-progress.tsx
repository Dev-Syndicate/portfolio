"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * A thin reading-progress bar fixed to the top of the viewport that fills as
 * the visitor scrolls through the article. Spring-smoothed so it glides.
 * Decorative — aria-hidden — and it simply doesn't animate under reduced
 * motion (the spring resolves instantly).
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary"
    />
  );
}
