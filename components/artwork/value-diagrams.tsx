import { cn } from "@/lib/utils";

/**
 * Abstract diagrams for the four value cards.
 *
 * The reference for this section fills its feature panels with product UI —
 * chat transcripts, a competitor leaderboard, social platform logos. Drawing
 * that here would mean inventing screens of a product we do not sell, which is
 * the same trap components/artwork/service-diagrams.tsx already refused. Values
 * are not features and have no UI, so each card instead gets a drawing of the
 * SHAPE OF THE PRINCIPLE: the order work is thought about in, a structure with
 * room to grow, a reading taken against a threshold, a codebase laid open.
 *
 * They follow the same four rules as the service set, so the two read as one
 * hand rather than two illustrators:
 *   - stroke only, no fills except the faintest wash
 *   - `currentColor` throughout, so they pick up the card's text colour
 *   - a single lit accent element per drawing, the piece the value is about
 *   - viewBox 320×200, so they scale identically at every card width
 *
 * One rule of this set's own: NOTHING HERE ASSERTS A NUMBER. The obvious
 * drawing for "Measured, not claimed" is a row of Lighthouse gauges, and a
 * gauge with a needle on it is a claim about a score — precisely what
 * content.ts refuses to invent. It draws the instrument and the threshold and
 * lets the copy say the rest.
 *
 * All decorative: `aria-hidden` sits on the shared frame.
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

/* Identical weights to the service diagrams — a heavier line here would make
   this set look like a different pen on the same page. */
const HAIR = { stroke: "currentColor", strokeWidth: 1, opacity: 0.28 };
const LINE = { stroke: "currentColor", strokeWidth: 1.25, opacity: 0.5 };
/* Dimmer than the service set's lit stroke. There the accent competes with a
   detailed drawing around it; these are sparse, so at full strength the one lit
   element stops being an accent and becomes the whole picture. */
const LIT = {
  stroke: "var(--primary)",
  strokeWidth: 1.4,
  opacity: 0.72,
} as const;

/* ── 1. Outcomes first — the order the thinking runs in ───────────────────
   Four steps read left to right, the way a plan is normally drawn. The lit
   ring is the LAST of them, and the dashed return path runs back from it to
   the start: the sequence is built forwards, but it is decided backwards from
   the outcome. That reversal is the whole claim. */
export function OutcomeDiagram() {
  return (
    <Frame>
      {/* The forward track. */}
      <path d="M66 86h164" {...LINE} />
      {[66, 122, 178].map((cx) => (
        <circle key={cx} cx={cx} cy="86" r="5.5" {...HAIR} />
      ))}

      {/* The outcome: named first, reached last. It breathes, because it is
          the fixed point the rest of the drawing is reasoned from. */}
      <circle cx="244" cy="86" r="15" {...LIT} className="vd-pulse" />
      <circle cx="244" cy="86" r="4.5" fill="var(--primary)" opacity="0.72" />

      {/* …and the path back from it, which is where the work actually starts.
          Its dashes MARCH, from the outcome toward the beginning. That is the
          only literally moving thing on this card and it is moving the "wrong"
          way on purpose: the animation is the claim. */}
      <path
        d="M244 108c0 30-52 40-104 40H74"
        {...LINE}
        strokeDasharray="4 5"
        className="vd-flow"
      />
      <path d="M82 142l-9 6 9 6" {...LINE} />
    </Frame>
  );
}

/* ── 2. Built to last — a structure with the next piece already fitting ───
   Three slabs on one frame, drawn with their joints showing rather than as a
   seamless block: a system you can take apart is a system you can maintain.
   The lit element is the EMPTY slot above them — the claim is not that it is
   finished, it is that the next piece goes on without disturbing these. */
export function LastDiagram() {
  const slab = (y: number) => (
    <g key={y}>
      <rect x="98" y={y} width="124" height="24" rx="5" {...LINE} />
      <path d={`M112 ${y}v24`} {...HAIR} />
      <path d={`M208 ${y}v24`} {...HAIR} />
    </g>
  );

  return (
    <Frame>
      {/* The frame the slabs sit on — the part that carries the load. */}
      <path d="M90 46v112" {...HAIR} />
      <path d="M230 46v112" {...HAIR} />
      <path d="M84 158h152" {...LINE} />

      {/* …and the load itself, travelling down both uprights into the base.
          Nothing is added and nothing is taken away: the structure the pulse
          runs along is the same structure before, during and after. That is the
          point. The previous version dropped a slab into the slot and took it
          away again on a loop, which put a blinking rectangle next to the words
          "Built to last" — motion arguing against its own caption. */}
      <path d="M90 46v112" {...LINE} className="vd-load" />
      <path d="M230 46v112" {...LINE} className="vd-load" />

      {[128, 98, 68].map(slab)}

      {/* Room for what comes next, cut to the same joint. */}
      <rect
        x="98"
        y="38"
        width="124"
        height="24"
        rx="5"
        {...LIT}
        strokeDasharray="7 6"
      />

    </Frame>
  );
}

/* ── 3. Measured, not claimed — the instrument, not the reading ───────────
   A threshold and two runs of the same audit: the faint one earlier, the solid
   one now. The lit element is the THRESHOLD, because that is the part of this
   claim a visitor can hold us to — the bar is fixed and published, and the
   copy's promise is that you can re-run the measurement against it yourself.
   No axis numbers, no needle, no score: see the note at the top of the file. */
export function MeasuredDiagram() {
  return (
    <Frame>
      {/* Axes. */}
      <path d="M62 40v112h196" {...HAIR} />
      {[92, 136, 180, 224].map((x) => (
        <path key={x} d={`M${x} 152v6`} {...HAIR} />
      ))}

      {/* An earlier run. */}
      <path d="M62 130l30-14 44-10 44-16 44-12" {...HAIR} />

      {/* This run — and it runs, repeatedly. The loop is not decoration here:
          the copy's promise is numbers you can RE-RUN yourself, so the drawing
          re-runs. Line and marks share a group so they clear together, and the
          group's fade is what hides the dashoffset resetting. `--len` is the
          measured length of the polyline (34 + 46 + 47 + 46 ≈ 174), rounded up
          so the last pixel is certainly covered. */}
      <g
        className="vd-cycle"
        style={{ "--dur": "8.4s" } as React.CSSProperties}
      >
        <path
          d="M62 118l30-16 44-14 44-18 44-14"
          {...LINE}
          className="vd-trace"
          style={
            { "--len": 178, "--dur": "8.4s" } as React.CSSProperties
          }
        />
        {[
          [92, 102],
          [136, 88],
          [180, 70],
          [224, 56],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="3.5" {...LINE} />
        ))}
      </g>

      {/* The bar itself — fixed, published, and the only lit thing here. */}
      <path d="M62 62h196" {...LIT} strokeDasharray="6 5" />
    </Frame>
  );
}

/* ── 4. Yours to keep — the codebase laid open ────────────────────────────
   Indentation guides with the lines hung off them, because "cleanly
   structured" is a thing you can only see in the shape of the indentation, and
   a doc block above it. The lit line is a type signature: the one line that
   tells the next developer what a thing is without them having to ask. */
export function KeepDiagram() {
  /* [indent x, width, isLit] — the widths matter as much as the indents. Rows
     of equal length read as a bar chart; it is the ragged right edge that says
     "source". */
  const rows: Array<[number, number, boolean]> = [
    [104, 84, false],
    [104, 52, false],
    [118, 96, true],
    [132, 64, false],
    [132, 86, false],
    [118, 44, false],
  ];

  return (
    <Frame>
      {/* The line-number gutter and its rule. This is the whole reason the
          drawing reads as code at a glance: indentation alone is ambiguous —
          it could be a chart, which is exactly what the first version of this
          looked like — but a numbered gutter beside it can only be an editor. */}
      {/* The gutter ticks light in turn, top to bottom — a caret moving down
          the file, on a loop. Someone READING it, which is exactly the claim:
          the next developer picks it up without a handover call. The code
          itself never changes, because a file you are given does not rewrite
          itself while you look at it. */}
      {rows.map((_, i) => (
        <path
          key={i}
          d={`M84 ${72 + i * 15}h5`}
          {...HAIR}
          className="vd-caret"
          style={{ "--at": `${i * 0.6}s` } as React.CSSProperties}
        />
      ))}
      <path d="M95 62v96" {...HAIR} />

      {/* Every line is static and permanently drawn. The lit one is the type
          signature — it stays lit rather than redrawing, because "yours to
          keep" is a claim about something that is already finished and handed
          over, not about something still being typed. */}
      {rows.map(([x, w, lit], i) => (
        <path
          key={i}
          d={`M${x} ${72 + i * 15}h${w}`}
          {...(lit ? LIT : LINE)}
          strokeLinecap="round"
        />
      ))}
    </Frame>
  );
}
