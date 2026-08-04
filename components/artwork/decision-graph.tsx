"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Insights — a decision graph.
 *
 * The page explains why we pick the tools we pick, so the artwork is a
 * decision spreading out from a single question into the choices it implies,
 * with signals travelling the edges.
 *
 * Drawn in SVG at a fixed 320×300 viewBox and scaled by the container, so the
 * node positions below are plain coordinates rather than percentages —
 * far easier to adjust than nested absolute positioning.
 */

type GraphNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  /** The originating question. Rendered filled, with a pulsing halo. */
  primary?: boolean;
};

const NODES: GraphNode[] = [
  { id: "root", x: 46, y: 150, label: "Goal", primary: true },
  { id: "a", x: 168, y: 62, label: "Frontend" },
  { id: "b", x: 168, y: 150, label: "Backend" },
  { id: "c", x: 168, y: 238, label: "Data" },
  { id: "d", x: 276, y: 104, label: "Ship" },
  { id: "e", x: 276, y: 196, label: "Scale" },
];

const EDGES: { from: string; to: string; delay: number }[] = [
  { from: "root", to: "a", delay: 0 },
  { from: "root", to: "b", delay: 0.35 },
  { from: "root", to: "c", delay: 0.7 },
  { from: "a", to: "d", delay: 1.1 },
  { from: "b", to: "d", delay: 1.45 },
  { from: "b", to: "e", delay: 1.3 },
  { from: "c", to: "e", delay: 1.7 },
];

const byId: Record<string, GraphNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

export function DecisionGraph() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[26rem] select-none"
    >
      <div
        className="absolute inset-8 rounded-full blur-[70px]"
        style={{ background: "var(--glow-a)" }}
      />

      <svg viewBox="0 0 320 300" className="relative w-full">
        {/* Static edges */}
        {EDGES.map((edge) => {
          const a = byId[edge.from];
          const b = byId[edge.to];
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={curve(a.x, a.y, b.x, b.y)}
              fill="none"
              className="stroke-border-strong"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Travelling signals. A long dash against a long gap reads as a pulse
            moving along the wire, rather than a marching-ants border. */}
        {!reduceMotion &&
          EDGES.map((edge) => {
            const a = byId[edge.from];
            const b = byId[edge.to];
            return (
              <path
                key={`pulse-${edge.from}-${edge.to}`}
                d={curve(a.x, a.y, b.x, b.y)}
                fill="none"
                className="stroke-primary motion-safe:animate-trace"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="26 120"
                style={{ animationDelay: `${edge.delay}s` }}
              />
            );
          })}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <motion.g
            key={node.id}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.2 + i * 0.1,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.primary ? 17 : 13}
              className={cn(
                node.primary
                  ? "fill-primary stroke-primary"
                  : "fill-card stroke-border-strong",
              )}
              strokeWidth="1.5"
            />
            {node.primary ? (
              <circle
                cx={node.x}
                cy={node.y}
                r="17"
                className="fill-none stroke-primary/40"
                strokeWidth="1.5"
              >
                {!reduceMotion ? (
                  <>
                    <animate
                      attributeName="r"
                      values="17;30;17"
                      dur="3.2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.7;0;0.7"
                      dur="3.2s"
                      repeatCount="indefinite"
                    />
                  </>
                ) : null}
              </circle>
            ) : null}

            <text
              x={node.x}
              y={node.y + (node.primary ? 36 : 31)}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Horizontal cubic between two points. Control points sit halfway along x,
 * which produces the flat-shouldered curve used in node editors — a straight
 * line would make the graph look like a wireframe diagram.
 */
function curve(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}
