"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Gauge,
  Layers,
  MessageSquareQuote,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * About — the five design principles orbiting a core.
 *
 * The page is about how the studio decides things, so the artwork is those
 * decisions in motion around a single centre. Each ring turns at its own rate,
 * which is what keeps the composition from reading as one rigid dial.
 *
 * Every node counter-rotates at exactly its ring's duration, so labels stay
 * upright while the ring turns. Without that they tumble, which looks like a
 * bug rather than an orbit.
 */

type Node = {
  icon: LucideIcon;
  label: string;
  /** Ring radius as a percentage inset from the container edge. */
  inset: string;
  /** Seconds per revolution. */
  duration: number;
  /** Negative delay offsets the starting angle around the ring. */
  offset: number;
  reverse?: boolean;
};

const nodes: Node[] = [
  { icon: Target, label: "Clarity", inset: "18%", duration: 34, offset: 0 },
  { icon: Sparkles, label: "Purpose", inset: "18%", duration: 34, offset: -17 },
  { icon: Gauge, label: "Performance", inset: "4%", duration: 46, offset: -6, reverse: true },
  { icon: Layers, label: "Scale", inset: "4%", duration: 46, offset: -29, reverse: true },
  { icon: MessageSquareQuote, label: "Outcomes", inset: "4%", duration: 46, offset: -40, reverse: true },
];

export function PrincipleOrbit() {
  const reduceMotion = useReducedMotion();

  return (
    // Horizontal padding is required, not cosmetic: a node sitting at the
    // ring's 3 o'clock position extends half its own width past the ring
    // edge, and the parent section clips anything that escapes. The padding
    // reserves exactly that much room.
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[30rem] px-7 py-8 select-none sm:px-14 sm:py-10"
    >
      <div className="relative aspect-square w-full">
      {/* Pooled light behind the core */}
      <div
        className="absolute inset-[22%] rounded-full blur-[60px]"
        style={{ background: "var(--glow-a)" }}
      />

      {/* Orbit paths */}
      {["4%", "18%"].map((inset) => (
        <span
          key={inset}
          className="absolute rounded-full border border-border-strong/60"
          style={{ inset }}
        />
      ))}
      <span className="absolute inset-[32%] rounded-full border border-dashed border-border-strong/40" />

      {/* Core */}
      <motion.div
        initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass absolute inset-[36%] grid place-items-center rounded-full"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-5" fill="none">
              <path
                d="M4 7 9 12l-5 5M12 17h8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-[0.5625rem] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
            Principles
          </span>
        </div>
      </motion.div>

      {/* Orbiting nodes */}
      {nodes.map((node, i) => (
        <OrbitNode key={node.label} node={node} index={i} still={!!reduceMotion} />
      ))}
      </div>
    </div>
  );
}

function OrbitNode({
  node,
  index,
  still,
}: {
  node: Node;
  index: number;
  still: boolean;
}) {
  const { icon: Icon, label, inset, duration, offset, reverse } = node;

  return (
    <motion.div
      initial={still ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.25 + index * 0.09,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={cn(
        "absolute",
        !still &&
          (reverse
            ? "motion-safe:animate-orbit-reverse"
            : "motion-safe:animate-orbit"),
      )}
      style={{
        inset,
        animationDuration: `${duration}s`,
        animationDelay: `${offset}s`,
      }}
    >
      {/* Node sits on the ring's top edge, then counter-rotates so the label
          never turns upside down. */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          className={cn(
            "block",
            !still &&
              (reverse
                ? "motion-safe:animate-orbit"
                : "motion-safe:animate-orbit-reverse"),
          )}
          style={{
            animationDuration: `${duration}s`,
            animationDelay: `${offset}s`,
          }}
        >
          {/* Below `sm` the pill collapses to its icon. A full-width label on
              a small orbit both overflows and dwarfs the ring it sits on. */}
          <span className="glass flex items-center gap-1.5 rounded-full p-1.5 whitespace-nowrap sm:pr-3">
            <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-primary">
              <Icon className="size-3" strokeWidth={2.2} />
            </span>
            <span className="hidden text-[0.6875rem] font-medium sm:inline">
              {label}
            </span>
          </span>
        </span>
      </span>
    </motion.div>
  );
}
