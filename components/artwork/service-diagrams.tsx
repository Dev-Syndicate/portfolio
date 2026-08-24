import { cn } from "@/lib/utils";

/**
 * Abstract diagrams for the five service cards.
 *
 * The reference fills its feature panels with fintech product UI — balances,
 * currency pickers, a Mastercard. Copying that shape here would mean drawing an
 * interface we don't sell, so each card instead gets a drawing of the *shape*
 * of the engagement: a public surface, a portal behind a login, a device, a
 * mesh of connected systems, a loop that runs unattended.
 *
 * Rules they all follow, so the set reads as one hand:
 *   - stroke only, no fills except the faintest wash
 *   - `currentColor` throughout, so they pick up the card's text colour
 *   - a single lit accent element per drawing, the piece the service is about
 *   - viewBox 320×200, so they scale identically in narrow and wide cards
 *
 * All are decorative: `aria-hidden` sits on the shared wrapper.
 */

function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 200"
      fill="none"
      className={cn("h-auto w-full text-foreground/70", className)}
    >
      {children}
    </svg>
  );
}

/* Shared stroke weights — kept identical so no drawing looks heavier than the
   others when they sit side by side down the page. */
const HAIR = { stroke: "currentColor", strokeWidth: 1, opacity: 0.28 };
const LINE = { stroke: "currentColor", strokeWidth: 1.25, opacity: 0.5 };
const LIT = {
  stroke: "var(--primary)",
  strokeWidth: 1.5,
  opacity: 0.95,
} as const;

/* ── 1. Website Development — the public surface ─────────────────────────
   A browser frame seen slightly from above, with the content blocks of a
   landing page stacked inside it and the top block lit. */
export function SurfaceDiagram() {
  return (
    <Frame>
      <rect x="34" y="26" width="252" height="148" rx="10" {...LINE} />
      <path d="M34 48h252" {...HAIR} />
      {[46, 58, 70].map((cx) => (
        <circle key={cx} cx={cx} cy="37" r="2.5" {...HAIR} />
      ))}

      {/* Hero block — the lit one: this is the part the service is about. */}
      <rect x="52" y="62" width="120" height="9" rx="4.5" {...LIT} />
      <rect x="52" y="78" width="86" height="7" rx="3.5" {...LINE} />
      <rect x="52" y="96" width="52" height="16" rx="8" {...LIT} opacity={0.5} />

      {/* Content grid below the fold. */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={52 + i * 62}
          y="126"
          width="50"
          height="34"
          rx="6"
          {...HAIR}
        />
      ))}

      {/* Ground shadow, so the frame sits on something. */}
      <ellipse cx="160" cy="182" rx="96" ry="4" fill="currentColor" opacity="0.06" />
    </Frame>
  );
}

/* ── 2. Web Applications — the portal behind the login ───────────────────
   An app shell: sidebar, toolbar, and a data region with a lit row — the
   "lived in every day" surface. */
export function PortalDiagram() {
  return (
    <Frame>
      <rect x="26" y="24" width="268" height="152" rx="10" {...LINE} />
      <path d="M92 24v152" {...HAIR} />
      <path d="M92 52h202" {...HAIR} />

      {/* Sidebar nav, one item active. */}
      {[66, 84, 102, 120].map((y, i) => (
        <rect
          key={y}
          x="42"
          y={y}
          width="34"
          height="6"
          rx="3"
          {...(i === 1 ? LIT : HAIR)}
        />
      ))}

      {/* Toolbar. */}
      <rect x="108" y="34" width="46" height="8" rx="4" {...LINE} />
      <rect x="246" y="33" width="34" height="10" rx="5" {...LIT} opacity={0.5} />

      {/* Data rows — the second lit, as though selected. */}
      {[70, 92, 114, 136].map((y, i) => (
        <g key={y}>
          <rect
            x="108"
            y={y}
            width="172"
            height="14"
            rx="4"
            {...(i === 1 ? { ...LIT, opacity: 0.35 } : HAIR)}
          />
          <rect
            x="116"
            y={y + 4}
            width={i === 1 ? 74 : 54}
            height="6"
            rx="3"
            {...(i === 1 ? LIT : LINE)}
          />
        </g>
      ))}
    </Frame>
  );
}

/* ── 3. Mobile Applications — one source, two devices ────────────────────
   Two handsets side by side fed by a single lit spine above them: the whole
   argument for one codebase, drawn. */
export function DeviceDiagram() {
  return (
    <Frame>
      {/* The shared codebase, and the split down to each platform. */}
      <rect x="136" y="16" width="48" height="16" rx="8" {...LIT} />
      <path d="M160 32v14" {...LIT} opacity={0.55} />
      <path
        d="M160 46h-52a8 8 0 0 0-8 8v8M160 46h52a8 8 0 0 1 8 8v8"
        {...LIT}
        opacity={0.55}
      />

      {[64, 156].map((x, i) => (
        <g key={x}>
          <rect x={x} y="68" width="100" height="112" rx="14" {...LINE} />
          <rect x={x + 34} y="76" width="32" height="4" rx="2" {...HAIR} />
          <rect
            x={x + 12}
            y="90"
            width={i === 0 ? 56 : 48}
            height="7"
            rx="3.5"
            {...LIT}
            opacity={0.8}
          />
          {[104, 118, 132].map((y) => (
            <rect
              key={y}
              x={x + 12}
              y={y}
              width="76"
              height="6"
              rx="3"
              {...HAIR}
            />
          ))}
          <rect x={x + 12} y="150" width="76" height="18" rx="9" {...HAIR} />
        </g>
      ))}
    </Frame>
  );
}

/* ── 4. APIs & Integrations — the mesh ───────────────────────────────────
   Outer systems each wired to a lit hub. The point of the drawing is that
   every line passes through the middle: one source of truth, not six
   point-to-point hacks. */
export function MeshDiagram() {
  /* Six satellites on an ellipse. Precomputed rather than generated so the
     markup stays inspectable and the positions never shift. */
  const nodes = [
    { x: 52, y: 54 },
    { x: 160, y: 34 },
    { x: 268, y: 54 },
    { x: 52, y: 148 },
    { x: 160, y: 168 },
    { x: 268, y: 148 },
  ];

  return (
    <Frame>
      {nodes.map((n) => (
        <path
          key={`${n.x}-${n.y}`}
          d={`M${n.x} ${n.y}L160 101`}
          {...LIT}
          opacity={0.22}
        />
      ))}

      {nodes.map((n) => (
        <g key={`node-${n.x}-${n.y}`}>
          <rect
            x={n.x - 22}
            y={n.y - 13}
            width="44"
            height="26"
            rx="7"
            {...LINE}
          />
          <rect
            x={n.x - 11}
            y={n.y - 3}
            width="22"
            height="5"
            rx="2.5"
            {...HAIR}
          />
        </g>
      ))}

      {/* The hub. */}
      <circle cx="160" cy="101" r="27" {...LIT} opacity={0.35} />
      <circle cx="160" cy="101" r="17" {...LIT} />
      <circle cx="160" cy="101" r="5" fill="var(--primary)" opacity="0.9" />
    </Frame>
  );
}

/* ── 5. AI & Automation — the loop that runs unattended ──────────────────
   A closed circuit with stages around it, one lit and travelling. The gap in
   the ring is where a human stays in the loop — which the copy promises. */
export function LoopDiagram() {
  return (
    <Frame>
      {/* The circuit. Dashed on the return leg to read as "runs continuously"
          rather than as a static ring. */}
      <path
        d="M74 100a86 52 0 0 1 172 0a86 52 0 0 1-172 0"
        {...LINE}
        strokeDasharray="4 7"
      />

      {/* The travelled arc — the part that has already run. */}
      <path d="M74 100a86 52 0 0 1 86-52a86 52 0 0 1 74 42" {...LIT} />

      {/* Stages. */}
      {[
        { x: 74, y: 100, lit: false },
        { x: 160, y: 48, lit: true },
        { x: 246, y: 100, lit: false },
        { x: 160, y: 152, lit: false },
      ].map((s) => (
        <g key={`${s.x}-${s.y}`}>
          <circle
            cx={s.x}
            cy={s.y}
            r="13"
            {...(s.lit ? LIT : LINE)}
            fill="var(--card)"
          />
          {s.lit ? (
            <circle cx={s.x} cy={s.y} r="4.5" fill="var(--primary)" />
          ) : (
            <circle cx={s.x} cy={s.y} r="3.5" {...HAIR} />
          )}
        </g>
      ))}

      {/* The human check — a small square off the ring, wired in. */}
      <path d="M160 152v20" {...HAIR} />
      <rect x="139" y="172" width="42" height="18" rx="6" {...LINE} />
      <path d="M150 181l5 5 9-10" {...LIT} strokeWidth={1.6} />
    </Frame>
  );
}
