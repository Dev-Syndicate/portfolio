"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

/**
 * A single cell inside a `DividedGrid`. It has no border of its own — the grid
 * supplies the shared hairlines — so cells sit flush together as one framed
 * surface. On hover it lifts to the raised background and runs the cursor
 * spotlight, which is what makes a locked grid still feel alive without any
 * card floating on void.
 *
 * The surface is filled (`bg-card`) so the grid reads as a solid divided panel
 * rather than transparent boxes on black.
 */
export function GridCell({
  children,
  className,
  interactive = true,
  href,
  mobileCard = false,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  /** Render the whole cell as a link. */
  href?: string;
  /**
   * On mobile, render as a standalone on-brand card (chamfer + node + border +
   * elevation) instead of a flush filled cell. Use inside a
   * `<DividedGrid mobileCards>`. Reverts to the flush cell at `sm`+.
   */
  mobileCard?: boolean;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  function handleMove(e: React.PointerEvent<HTMLElement>) {
    if (!interactive || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const classes = cn(
    "group/cell relative flex flex-col bg-card p-7 2xl:p-9",
    // Mobile card mode: standalone rounded, bordered, elevated surface with its
    // own padding; at sm+ every one of those traits is reset so it becomes a
    // flush filled cell inside the shared-border grid again.
    mobileCard && [
      "rounded-xl border border-border p-6 shadow-[var(--elevation-1)]",
      "sm:rounded-none sm:border-0 sm:p-7 sm:shadow-none 2xl:p-9",
    ],
    interactive && [
      "spotlight isolate",
      "transition-colors duration-[var(--duration-base)] ease-out-soft",
      "hover:bg-surface-subtle",
    ],
    href && "focus-visible:outline-none focus-visible:bg-surface-subtle",
    className,
  );

  const anim = {
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -12% 0px" },
    transition: reduceMotion
      ? undefined
      : { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  if (href) {
    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        onPointerMove={handleMove}
        className={classes}
        {...anim}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      onPointerMove={handleMove}
      className={classes}
      {...anim}
    >
      {children}
    </motion.div>
  );
}
