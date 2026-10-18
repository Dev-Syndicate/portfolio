import { cn } from "@/lib/utils";

/**
 * Diagrams for the four value cards.
 *
 * THIRD PASS. The first two were both too abstract to do the one job this
 * set has: a visitor should be able to look at the picture alone, before
 * reading a word of the card, and already know roughly what the claim is.
 * Pass one (a dotted sequence, floating slabs, an unlabelled chart,
 * indentation guides) needed the caption read first to mean anything. Pass
 * two fixed legibility but chased it into either a borrowed metaphor (brick
 * coursing for software architecture) or a still-too-abstract system diagram
 * (a node tree for "built to last," a commit graph for "yours to keep") —
 * recognisable as SOMETHING technical, but not specifically as the claim on
 * the card.
 *
 * This pass is deliberately literal, and breaks two rules the set held
 * itself to before: `MeasuredDiagram` now draws an actual gauge with a
 * needle (the earlier file argued a needle asserts a score, but an unlabelled
 * climbing line asserted nothing at all, including the claim), and the
 * shield and the key use a light fill, not just stroke, where a fill is what
 * makes a shape read instantly rather than as a loose rounded outline. The
 * shared discipline that remains: `currentColor` / `var(--primary)` only,
 * one lit accent per card, and the 320×200 frame.
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

/* ── 1. Outcomes first — scattered points, one resolved outcome ────────────
   Fourth attempt. A dotted sequence, then a target+arrow (twice, the second
   time fixing a genuine bug where shaft and arrowhead didn't connect) both
   argued the point without quite landing as a picture. This version draws
   the brief's own second line literally: "disorder becomes direction" — a
   loose scatter of dim points on the left, unsorted and at random heights,
   each one travelling into one lit point standing apart on the right (see
   `vd-converge` in globals.css). A dashed connecting line between the two
   halves was tried and cut: with the dots themselves already carrying the
   eye from scatter to outcome, a second static line drawing the same path
   was a redundant mark competing with the thing actually explaining the
   claim. The claim is the CONTRAST between the two halves, not either half
   alone: chaos on one side, one resolved point on the other — which is the
   sentence the card is making, read left to right the way the card itself
   is. */
export function OutcomeDiagram() {
  /* Fixed, not random — a server-rendered SVG with Math.random() would mark
     up differently on every request and mismatch on hydration. Hand-placed
     to look scattered without a seed. */
  const SCATTER: Array<[number, number]> = [
    [46, 74],
    [70, 112],
    [40, 132],
    [88, 60],
    [58, 150],
    [100, 96],
    [34, 100],
    [78, 140],
  ];
  const OUTCOME = { x: 246, y: 100 };

  return (
    <Frame>
      {/* The scatter, each dot travelling its own straight line into the
          outcome and looping — "disorder becomes direction" told as motion,
          not just as a static before/after. `--dx`/`--dy` are each dot's own
          displacement to the outcome point, read by `vd-converge` below, so
          one keyframe set drives eight different journeys. Staggered
          `--at` delays (0 to 0.9s across the eight) mean they don't arrive
          together — they resolve one after another, which is closer to what
          "becomes" describes than eight things snapping into place at once. */}
      {SCATTER.map(([x, y], i) => (
        <circle
          key={`${x}${y}`}
          cx={x}
          cy={y}
          r="4"
          {...LINE}
          fill="currentColor"
          fillOpacity={0.5}
          className="vd-converge"
          style={
            {
              "--dx": `${OUTCOME.x - x}px`,
              "--dy": `${OUTCOME.y - y}px`,
              "--at": `${i * 0.13}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* The resolved outcome — the one point that breathes, same device as
          every other card's single lit accent. */}
      <circle cx={OUTCOME.x} cy={OUTCOME.y} r="14" {...LIT} className="vd-pulse" />
      <circle cx={OUTCOME.x} cy={OUTCOME.y} r="5" fill="var(--primary)" opacity="0.85" />
    </Frame>
  );
}

/* ── 2. Built to last — a shield ────────────────────────────────────────────
   Two earlier passes (a brick wall, then a module tree) both needed a second
   of work to parse. `whyUs.reasons[1].icon` in content.ts has called this
   card "shield" from the start — a shield is the single most universally
   read symbol for "built to withstand things," and reaching for the literal
   version of the card's own icon name is more direct than any diagram this
   set tried to invent instead. The shield is drawn with a light fill, not
   just a stroke outline, because a stroke-only shield at this size reads as
   a rounded badge shape — it is the fill that makes it unmistakably a
   shield. A single checkmark inside is the lit element: solid, already
   proven, nothing left to verify. */
export function LastDiagram() {
  return (
    <Frame>
      <path
        d="M160 34l62 22v46c0 42-27 68-62 80-35-12-62-38-62-80V56z"
        {...LINE}
        fill="color-mix(in oklab, currentColor 6%, transparent)"
      />
      <path d="M134 100l18 18 36-40" {...LIT} strokeWidth={2.25} />
    </Frame>
  );
}

/* ── 3. Measured, not claimed — a gauge, needle in the lit zone ─────────────
   Two earlier passes (an unlabelled chart, then the same chart with a
   threshold and a checkmark) both argued the file's original rule — "no
   needle, that's a claim about a score" — right out of being useful: a line
   with no numbers on it reads as decoration, not as a measurement. A GAUGE
   IS WHAT AN AUDIT TOOL ACTUALLY LOOKS LIKE — Lighthouse's own report is a
   ring gauge with a needle-equivalent arc — so this is the one drawing in the
   set that breaks its own original constraint on purpose: the needle sits
   inside the lit arc, not past the end of it, so the claim stays "inside the
   standard we publish," not "a specific number," which is the actual
   distinction the copy is making. */
export function MeasuredDiagram() {
  const CX = 160;
  const CY = 136;
  const R = 78;
  /* Arc from -140° to -40°, roughly the sweep of a real speedometer face. */
  const arcPoint = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
  };
  const start = arcPoint(-150, R);
  const end = arcPoint(-30, R);
  const litStart = arcPoint(-60, R);

  return (
    <Frame>
      {/* The dim full sweep of the dial. */}
      <path
        d={`M${start.x} ${start.y}A${R} ${R} 0 0 1 ${end.x} ${end.y}`}
        {...HAIR}
      />
      {/* The published standard — the top end of the dial, lit, the zone a
          passing run has to land inside. */}
      <path
        d={`M${litStart.x} ${litStart.y}A${R} ${R} 0 0 1 ${end.x} ${end.y}`}
        {...LIT}
        strokeWidth={3}
      />

      {/* The needle, resting inside the lit zone — not a loop, because the
          claim is a reading already taken, not one still sweeping. */}
      <path
        d={`M${CX} ${CY}L${arcPoint(-48, R - 20).x} ${arcPoint(-48, R - 20).y}`}
        {...LINE}
        strokeWidth={2}
      />
      <circle cx={CX} cy={CY} r="6" fill="currentColor" opacity="0.5" />
    </Frame>
  );
}

/* ── 4. Yours to keep — a clean file tree ───────────────────────────────────
   Six attempts, and the first two (an editor window, then an indentation-only
   version even before that) were closer to this card's actual claim than any
   metaphor tried since — a key, a commit log, a folder mid hand-off, a sealed
   box. The copy is specifically about the CODE being organised and
   documented, not about an event of receiving it, and the picture that says
   that fastest is simply a well-kept file tree: folders that nest cleanly,
   one file visibly a README. This is not a repeat of the earlier editor-
   window version — that one drew a whole application chrome around six
   near-identical indentation lines, which was both cluttered and, without
   the window, ambiguous with a bar chart. This version has no window, no
   text lines standing in for code, and only real folder/file icons at three
   clean indent levels — six shapes total, not sixteen. The README is the lit
   element: the one file in the tree that exists specifically so the next
   person does not have to ask. */
export function KeepDiagram() {
  const folder = (x: number, y: number) => (
    <path
      key={`f${x}${y}`}
      d={`M${x} ${y}h14l4 5h20a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2h-38a2 2 0 0 1-2-2V${y + 2}a2 2 0 0 1 2-2Z`}
      {...LINE}
    />
  );
  const file = (x: number, y: number, lit = false) => (
    <path
      key={`d${x}${y}`}
      d={`M${x} ${y}h16l8 8v16h-24Z`}
      {...(lit ? LIT : LINE)}
      fill={lit ? "color-mix(in oklab, var(--primary) 10%, transparent)" : "none"}
    />
  );

  return (
    <Frame>
      {/* The guide lines a tree view draws from each parent down to its
          children — the thing that makes nesting legible as nesting. */}
      <path d="M76 70v60M76 100h20M76 130h20" {...HAIR} />

      {/* Root folder, two children folders, and the one lit file. */}
      {folder(56, 46)}
      {folder(96, 86)}
      {folder(96, 116)}
      {file(206, 90, true)}

      {/* The README label beside the lit file — short enough to read as a
          filename, not a sentence. */}
      <text
        x="206"
        y="130"
        fontSize="9"
        fontFamily="var(--font-mono)"
        fill="var(--primary)"
        opacity="0.85"
      >
        README
      </text>
    </Frame>
  );
}
