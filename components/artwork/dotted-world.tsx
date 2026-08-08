import { cn } from "@/lib/utils";

/**
 * Halftone dotted-world motif — the signature ambient element (ref #3). A
 * generated dot field masked into a coarse world-map silhouette, stroked with
 * `currentColor` so it takes the surface's hue. A few dots ride brighter and
 * "pulse" on a staggered loop so the map reads as live telemetry, not wallpaper.
 *
 * The geometry is procedural: a grid of dots, kept only where a hand-tuned set
 * of landmass bands says there's land at that latitude/longitude. No external
 * image, no data file — one self-contained SVG that works on any dark surface.
 *
 * Decorative: aria-hidden. Motion is CSS-only (opacity), so reduced-motion
 * users get a still field via the global media query.
 */

/* Coarse landmass mask. Each entry is a horizontal band [yStart,yEnd] with the
   x-ranges (0–360, i.e. lon+180) that are "land" in that band. Tuned by eye to
   read as continents at a glance — it's an impression, not cartography. */
const LAND: { y: [number, number]; x: [number, number][] }[] = [
  { y: [18, 30], x: [[40, 95], [110, 165], [235, 300]] }, // N. Canada / Siberia / N. Europe-Asia
  { y: [30, 46], x: [[38, 92], [96, 175], [215, 250], [255, 305]] }, // US / Eurasia
  { y: [46, 60], x: [[52, 90], [100, 130], [150, 185], [235, 262]] }, // Mexico / Med / Mid-east / E-Asia
  { y: [60, 74], x: [[70, 96], [104, 128], [246, 268]] }, // C.America / Africa-N / SE-Asia
  { y: [74, 90], x: [[78, 100], [110, 132], [250, 276]] }, // Colombia / Africa-mid / Indonesia
  { y: [90, 104], x: [[84, 104], [112, 130]] }, // Brazil / Africa-S
  { y: [104, 118], x: [[88, 104], [116, 128], [258, 285]] }, // S.Brazil / S.Africa / Australia
  { y: [118, 130], x: [[92, 104], [262, 282]] }, // Argentina / Australia-S
];

const STEP = 4.4; // dot spacing in viewBox units

/* Build the dot list once at module load (deterministic — no Math.random). */
function buildDots() {
  const dots: { x: number; y: number; lit: boolean }[] = [];
  for (const band of LAND) {
    for (let y = band.y[0]; y < band.y[1]; y += STEP) {
      for (const [x0, x1] of band.x) {
        for (let x = x0; x < x1; x += STEP) {
          // deterministic "sparkle" pick from position, so a scattered few glow
          const lit = ((Math.round(x) * 31 + Math.round(y) * 17) % 47) === 0;
          dots.push({ x: x * (360 / 360), y, lit });
        }
      }
    }
  }
  return dots;
}

const DOTS = buildDots();

export function DottedWorld({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 150"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full", className)}
    >
      {DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.lit ? 1.5 : 1}
          fill="currentColor"
          opacity={d.lit ? 0.95 : 0.4}
          style={
            d.lit
              ? {
                  animation: "world-pulse 3.6s ease-in-out infinite",
                  // stagger by index so the lit dots don't blink in unison
                  animationDelay: `${(i % 13) * 0.28}s`,
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
