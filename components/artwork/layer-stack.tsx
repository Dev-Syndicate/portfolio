"use client";

import { motion, useReducedMotion } from "motion/react";
import { Cloud, Database, Server, Monitor, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Services — an exploded view of the stack we build.
 *
 * The page is about what gets built, so the artwork is a system taken apart:
 * four planes in isometric perspective, the interface on top and the
 * infrastructure at the bottom, connected by a spine. It maps one-to-one onto
 * the technology groups in `lib/content.ts`.
 *
 * The planes are real DOM elements under a shared 3D transform rather than a
 * flat illustration, so they re-skin with the palette and stay crisp at any
 * density.
 */

type Layer = {
  icon: LucideIcon;
  label: string;
  detail: string;
};

/* Top to bottom, matching how the stack is usually drawn.
   Each `detail` says what the layer is *for*, not which tools sit in it. */
const layers: Layer[] = [
  { icon: Monitor, label: "Interface", detail: "What your customers see and touch" },
  { icon: Server, label: "Application", detail: "Business rules and integrations" },
  { icon: Database, label: "Data", detail: "What you store, and how safely" },
  { icon: Cloud, label: "Infrastructure", detail: "How it ships and stays up" },
];

/** Vertical gap between planes, in px. */
const SPACING = 74;

export function LayerStack() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[24rem] select-none"
      style={{ height: `${SPACING * layers.length + 90}px` }}
    >
      <div
        className="absolute inset-x-0 top-1/4 bottom-1/4 rounded-full blur-[70px]"
        style={{ background: "var(--glow-a)" }}
      />

      <div
        className="absolute inset-0"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 40%" }}
      >
        {layers.map((layer, i) => (
          <Plane
            key={layer.label}
            layer={layer}
            index={i}
            still={!!reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

function Plane({
  layer,
  index,
  still,
}: {
  layer: Layer;
  index: number;
  still: boolean;
}) {
  const { icon: Icon, label, detail } = layer;

  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 40, rotateX: 34 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.9,
        // Planes settle top-down, so the stack reads as assembling rather
        // than appearing all at once.
        delay: 0.25 + index * 0.13,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="absolute inset-x-0"
      style={{ top: `${index * SPACING}px` }}
    >
      <div
        className={cn(
          "glass relative flex items-center gap-3.5 rounded-xl px-4 py-3.5",
          !still && "motion-safe:animate-float",
        )}
        style={{
          // Shared isometric tilt. A single rotate on the parent would skew
          // the text; applying it per-plane keeps each label readable.
          transform: "rotateX(14deg) rotateZ(-3deg)",
          transformStyle: "preserve-3d",
          animationDuration: `${7 + index * 0.6}s`,
          animationDelay: `${index * 0.45}s`,
        }}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4.5" strokeWidth={1.9} />
        </span>

        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold">{label}</span>
          <span className="truncate text-[0.6875rem] text-muted-foreground">
            {detail}
          </span>
        </div>

        {/* Spine connecting this plane to the one below */}
        {index < layers.length - 1 ? (
          <span
            className="absolute left-8 h-[26px] w-px bg-gradient-to-b from-primary/50 to-transparent"
            style={{ top: "100%" }}
          />
        ) : null}
      </div>
    </motion.div>
  );
}
