import { cn } from "@/lib/utils";

/**
 * A kit of generated technical line-art illustrations — the signature that
 * turns flat text cards into something worth reading. All are pure SVG stroked
 * with `currentColor`, so a card sets hue + strength with one text utility and
 * the same drawing works on a dark card or a light one.
 *
 * Drawn in the studio's engineering vernacular: node graphs, chip lattices,
 * dot fields, coils, waveforms — the instruments the work is made from.
 *
 * Each takes a `className` for sizing/colour. They're decorative: aria-hidden.
 */

type ArtProps = { className?: string };

const base = "h-full w-full";

/** Connected node graph — data / architecture. */
export function ArtNodes({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.5">
        <path d="M40 96 L84 54 M84 54 L132 70 M132 70 L164 40 M84 54 L96 104 M96 104 L150 108 M132 70 L150 108 M40 96 L96 104" />
      </g>
      {[
        [40, 96],
        [84, 54],
        [132, 70],
        [164, 40],
        [96, 104],
        [150, 108],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x - 3}
          y={y - 3}
          width="6"
          height="6"
          fill="currentColor"
          opacity={i === 1 ? "0.9" : "0.55"}
        />
      ))}
    </svg>
  );
}

/** Chip / lattice — systems, integration. */
export function ArtChip({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.55">
        <rect x="74" y="44" width="52" height="52" rx="2" />
        <rect x="86" y="56" width="28" height="28" rx="1" opacity="0.8" />
        {/* pins */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={84 + i * 12} y1="44" x2={84 + i * 12} y2="30" />
            <line x1={84 + i * 12} y1="96" x2={84 + i * 12} y2="110" />
            <line x1="74" y1={56 + i * 12} x2="60" y2={56 + i * 12} />
            <line x1="126" y1={56 + i * 12} x2="140" y2={56 + i * 12} />
          </g>
        ))}
      </g>
      <rect x="94" y="64" width="12" height="12" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** Radial dot-burst — performance, acceleration. */
export function ArtBurst({ className }: ArtProps) {
  const cx = 100;
  const cy = 70;
  const rays = 40;
  const dots: [number, number, number][] = [];
  for (let r = 0; r < rays; r++) {
    const a = (r / rays) * Math.PI * 2;
    for (let d = 1; d <= 6; d++) {
      const rad = 8 + d * 8;
      dots.push([
        cx + Math.cos(a) * rad,
        cy + Math.sin(a) * rad,
        1.4 - d * 0.12,
      ]);
    }
  }
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      {dots.map(([x, y, rr], i) => (
        <circle key={i} cx={x} cy={y} r={Math.max(0.4, rr)} fill="currentColor" opacity="0.7" />
      ))}
    </svg>
  );
}

/** Concentric coil — reliability, scalable architecture. */
export function ArtCoil({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.6">
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx="100" cy={44 + i * 13} rx="42" ry="12" />
        ))}
        <line x1="58" y1="44" x2="58" y2="96" opacity="0.4" />
        <line x1="142" y1="44" x2="142" y2="96" opacity="0.4" />
      </g>
    </svg>
  );
}

/** Waveform / signal — automation, monitoring. */
export function ArtWave({ className }: ArtProps) {
  const bars = 34;
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.65">
        {Array.from({ length: bars }).map((_, i) => {
          const x = 20 + i * ((160) / (bars - 1));
          const h = 6 + Math.abs(Math.sin(i * 0.7)) * 40 * (0.5 + Math.abs(Math.sin(i * 0.28)));
          return <line key={i} x1={x} y1={70 - h / 2} x2={x} y2={70 + h / 2} />;
        })}
      </g>
    </svg>
  );
}

/** Layered planes — the stack, web/app layers. */
export function ArtLayers({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.6">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M100 ${34 + i * 26} L150 ${52 + i * 26} L100 ${70 + i * 26} L50 ${52 + i * 26} Z`}
            opacity={i === 0 ? "0.9" : 0.6 - i * 0.15}
          />
        ))}
      </g>
    </svg>
  );
}

/** Dotted globe — worldwide reach / responsive everywhere. */
export function ArtGlobe({ className }: ArtProps) {
  const cx = 100;
  const cy = 70;
  const R = 48;
  const dots: [number, number][] = [];
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = cy + (lat / 90) * R;
    const w = Math.cos((lat * Math.PI) / 180) * R;
    const count = Math.max(4, Math.round(w / 6));
    for (let i = 0; i <= count; i++) {
      const x = cx - w + (i / count) * w * 2;
      dots.push([x, y]);
    }
  }
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <circle cx={cx} cy={cy} r={R} stroke="currentColor" strokeWidth="1" opacity="0.25" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="currentColor" opacity="0.6" />
      ))}
    </svg>
  );
}

/** Orbit / satellite — reach, distribution, always-on. */
export function ArtOrbit({ className }: ArtProps) {
  const cx = 100;
  const cy = 70;
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.55">
        <circle cx={cx} cy={cy} r="16" opacity="0.9" />
        <ellipse cx={cx} cy={cy} rx="52" ry="20" />
        <ellipse cx={cx} cy={cy} rx="52" ry="20" transform={`rotate(58 ${cx} ${cy})`} />
        <ellipse cx={cx} cy={cy} rx="52" ry="20" transform={`rotate(-58 ${cx} ${cy})`} />
      </g>
      {/* satellites pinned on the rings */}
      {[
        [cx + 52, cy],
        [cx - 26, cy - 32],
        [cx + 22, cy + 34],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="currentColor" opacity="0.85" />
      ))}
    </svg>
  );
}

/** Routed circuit traces converging on a pad — integration, wiring. */
export function ArtCircuit({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="square">
        <path d="M20 40 H70 V64 H100" />
        <path d="M20 100 H52 V76 H100" />
        <path d="M180 34 H130 V70 H100" />
        <path d="M180 104 H140 V88 H112 V70" />
        <path d="M100 24 V52" />
      </g>
      {[
        [20, 40],
        [20, 100],
        [180, 34],
        [180, 104],
        [100, 24],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill="currentColor" opacity="0.5" />
      ))}
      <rect x="92" y="62" width="16" height="16" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** Stepped bar climb — growth, conversion lift. */
export function ArtGrowth({ className }: ArtProps) {
  const bars = [22, 34, 30, 48, 58, 74, 92];
  const bw = 16;
  const gap = 8;
  const x0 = 100 - (bars.length * (bw + gap) - gap) / 2;
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.6">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={x0 + i * (bw + gap)}
            y={116 - h}
            width={bw}
            height={h}
            opacity={i === bars.length - 1 ? "0.95" : 0.35 + i * 0.06}
          />
        ))}
      </g>
      {/* trend line riding the tops */}
      <polyline
        points={bars.map((h, i) => `${x0 + i * (bw + gap) + bw / 2},${116 - h}`).join(" ")}
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.85"
        fill="none"
      />
    </svg>
  );
}

/** Radar / target rings with a sweep tick — monitoring, discovery, audit. */
export function ArtRadar({ className }: ArtProps) {
  const cx = 100;
  const cy = 70;
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.5">
        {[14, 28, 42, 54].map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
        <line x1={cx} y1={cy} x2={cx + 54} y2={cy} />
        <line x1={cx} y1={cy} x2={cx} y2={cy - 54} />
        <line x1={cx} y1={cy} x2={cx + 38} y2={cy - 38} opacity="0.9" />
      </g>
      <circle cx={cx + 38} cy={cy - 38} r="3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/** Shielded lock lattice — security, reliability. */
export function ArtShield({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.6">
        <path d="M100 22 L142 38 V74 C142 98 122 112 100 120 C78 112 58 98 58 74 V38 Z" />
        <path d="M100 34 L130 46 V74 C130 91 116 101 100 108 C84 101 70 91 70 74 V46 Z" opacity="0.6" />
      </g>
      {/* dotted interior lattice */}
      {Array.from({ length: 5 }).flatMap((_, r) =>
        Array.from({ length: 5 }).map((__, c) => {
          const x = 82 + c * 9;
          const y = 54 + r * 9;
          return <circle key={`${r}-${c}`} cx={x} cy={y} r="1" fill="currentColor" opacity="0.4" />;
        }),
      )}
      <rect x="94" y="70" width="12" height="12" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** Handshake of two nested brackets around a node — partnership, scoping. */
export function ArtBrackets({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className={cn(base, className)}>
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeLinecap="round">
        <path d="M72 34 H52 V106 H72" />
        <path d="M128 34 H148 V106 H128" />
        <path d="M88 46 H62 M88 70 H62 M88 94 H62" opacity="0.4" strokeWidth="1" />
      </g>
      <circle cx="100" cy="70" r="12" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="100" cy="70" r="4" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/* Name → component, so data (content.ts) can reference an illustration by a
   string key without importing React. */
export const lineArt = {
  nodes: ArtNodes,
  chip: ArtChip,
  burst: ArtBurst,
  coil: ArtCoil,
  wave: ArtWave,
  layers: ArtLayers,
  globe: ArtGlobe,
  orbit: ArtOrbit,
  circuit: ArtCircuit,
  growth: ArtGrowth,
  radar: ArtRadar,
  shield: ArtShield,
  brackets: ArtBrackets,
} as const;

export type LineArtName = keyof typeof lineArt;
