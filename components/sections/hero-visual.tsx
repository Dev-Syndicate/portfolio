"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { DottedWorld } from "@/components/artwork/dotted-world";

/**
 * The hero's visual anchor: the Dev Syndicate mark as a powered component,
 * lit over a dotted world — the studio as a signal hub with worldwide reach.
 *
 * A faint halftone world map (ref #3) sits behind the mark as an ambient field,
 * drifting on its own parallax layer so the mark floats above it with depth.
 * The mark itself draws on once, then stays lit — silver signal packets flow
 * down its outline forever, the chrome gradient sweeps across the strokes, and
 * the whole board tilts gently with the cursor. Perpetual, subtle motion is the
 * point: a living instrument over a live map, not a one-shot load animation.
 *
 * The only soft elements are the world field and one tight glow behind the
 * mark, reading as lit silicon. Everything else is hard-edged linework.
 *
 * Motion is gated on `useReducedMotion`: those users get the final composed
 * still — mark drawn, world present but not pulsing, readout at target.
 */

/* The three sub-paths of the mark, in draw order. Fixed geometry — the source
   logo's, on a 0 0 624 600 viewBox. */
const STROKES = [
  {
    id: "mark-d",
    d: "M20.3,20 L20.3,555.3 L239.9,556.6 L471.5,349.4 L394.7,349.7 L233.6,494.4 L82.7,494.6 L82.2,85.8 L261,84.5 L83,83.8 L299.7,102.8 L299,40.3 Z",
  },
  {
    id: "mark-chevron",
    d: "M579.5,127 L462.1,22.6 L391.9,88.4 L331.2,51.2 L319,226.9 L463.2,97 L579,197.2 Z",
  },
  {
    id: "mark-s",
    d: "M285.9,202.2 L231,253.4 L230,318.2 L521.4,316.9 L522.5,430.4 L462.4,493.6 L341.4,494.4 L275,556.8 L470.4,555 L577.4,456.9 L579.2,263 L286.7,262.8 Z",
  },
] as const;

const STEP = 0.5;
const DRAW = 0.85;
const ENERGIZE_AT = 0.5;

export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  // Mouse-parallax: the board tilts a few degrees toward the cursor and the
  // mark drifts more than the frame, giving layered depth. Spring-smoothed so
  // it glides. Mouse-only, skipped under reduced motion.
  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const rotateY = useTransform(px, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateX = useTransform(py, [-0.5, 0.5], ["-7deg", "7deg"]);
  const markX = useTransform(px, [-0.5, 0.5], ["18px", "-18px"]);
  const markY = useTransform(py, [-0.5, 0.5], ["18px", "-18px"]);
  // World drifts opposite and further than the mark for layered depth.
  const worldX = useTransform(px, [-0.5, 0.5], ["-26px", "26px"]);
  const worldY = useTransform(py, [-0.5, 0.5], ["-14px", "14px"]);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[34rem] select-none lg:mx-0 lg:max-w-none lg:scale-110 lg:origin-right"
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative aspect-square w-full overflow-visible"
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        {/* Ambient world field — wider than the frame, sits furthest back on
            its own parallax layer, kept faint so the lit mark stays the hero. */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={
            reduceMotion
              ? undefined
              : { x: worldX, y: worldY, translateZ: "-60px" }
          }
        >
          <DottedWorld className="w-[135%] max-w-none text-brand-300/45 [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_82%)]" />
        </motion.div>

        <motion.svg
          viewBox="0 0 624 600"
          className="absolute inset-0 h-full w-full overflow-visible"
          style={reduceMotion ? undefined : { x: markX, y: markY }}
        >
          <defs>
            <linearGradient
              id="hv-chrome"
              x1="0"
              y1="0"
              x2="624"
              y2="600"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--ref-blue)" />
              <stop offset="0.5" stopColor="var(--ref-sky)" />
              <stop offset="1" stopColor="var(--ref-blue)" />
              {!reduceMotion && (
                <animate
                  attributeName="x1"
                  values="-624;624"
                  dur="6s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
          </defs>

          {/* The mark, drawn as plotted linework — drafting-pen weight, no glow.
              Each sub-path draws itself on in sequence, then holds while the
              chrome gradient sweeps across it forever. */}
          {STROKES.map((stroke, i) => (
            <motion.path
              key={stroke.id}
              d={stroke.d}
              fill="none"
              stroke="url(#hv-chrome)"
              strokeWidth={3.5}
              strokeLinejoin="miter"
              strokeLinecap="square"
              /* Rendered hidden as a real attribute so the pre-hydration paint
                 shows nothing — otherwise the full paths flash for a frame
                 before Motion applies `initial` and snaps them back to empty. */
              opacity={reduceMotion ? undefined : 0}
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      pathLength: {
                        duration: DRAW,
                        delay: ENERGIZE_AT + i * STEP,
                        ease: [0.16, 0.84, 0.44, 1],
                      },
                      opacity: { duration: 0.2, delay: ENERGIZE_AT + i * STEP },
                    }
              }
            />
          ))}

          {/* A bright energy packet that continuously travels each sub-path's
              outline after the draw completes — the mark stays alive, lit from
              within, no external glow. Seamless dash loop (period 40+560=600). */}
          {!reduceMotion &&
            STROKES.map((stroke, i) => (
              <path
                key={`pulse-${stroke.id}`}
                d={stroke.d}
                fill="none"
                stroke="var(--ref-white)"
                strokeWidth={3.5}
                strokeLinejoin="miter"
                strokeLinecap="square"
                pathLength={600}
                strokeDasharray="40 560"
                style={{
                  animation: "mark-pulse 5s linear infinite",
                  animationDelay: `${ENERGIZE_AT + 2 + i * 0.4}s`,
                  /* `backwards` holds the first keyframe (opacity 0) through the
                     delay, so the packet stays invisible until its path has
                     drawn — no stray dash flashing on first paint. */
                  animationFillMode: "backwards",
                  opacity: 0.9,
                }}
              />
            ))}
        </motion.svg>
      </motion.div>
    </div>
  );
}


