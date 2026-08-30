"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Check } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { process } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

/**
 * THE PIPELINE — five stages as one continuous line you travel along.
 *
 * The old version of this section was two panels: a list of five stages beside
 * a checklist. It was legible and it was inert, and a vertical list of five
 * items says nothing about the fact that they are ORDERED. You cannot Verify
 * before you Build, and a bulleted column does not know that.
 *
 * THE SIGNATURE IS THAT THE LINE SETTLES.
 *
 * The trace arrives at the left edge already swinging, throws its biggest
 * excursion at Discover, and is flat by the time it leaves at Support. The
 * amplitude decays 52 → 40 → 30 → 22 → 15 across the five nodes and lands
 * within two units of the centreline at the right edge.
 *
 * That decay is the section's argument, drawn rather than asserted. The
 * heading is "Five stages. No surprises." — a project genuinely IS uncertain
 * at Discover, and the whole promise is that the uncertainty comes out of it
 * as the stages run. A line that oscillates and then levels off says exactly
 * that. A sine wave — which is what this kind of reference usually is — says
 * the opposite: perpetual undulation, surprises forever. The wave had to decay
 * or it would have been fighting the copy.
 *
 * The decay also earns the alternating layout. Nodes sit at the crest and
 * trough of each swing, so labels land above / below / above / below / above
 * without anyone deciding to alternate them — the curve puts them there, and
 * the vertical gaps close as the line settles.
 *
 * ONE MOVING LIGHT, AND IT MEANS PROGRESS. Hovering or focusing a stage fills
 * the trace with light from the left edge up to that node. That is the only
 * animated light in the section: no ambient pulse travelling the line on a
 * loop. The hero already owns "a signal moves through a system" (see
 * components/artwork/signal-field.tsx), and a second one here would be the
 * same idea told twice, more loudly. What this section is actually about is
 * how far along you are, so the light measures that and nothing else.
 *
 * NO HUE. The visual reference for this layout carries an acid-green accent.
 * The palette in globals.css is five pure greys with one documented rule —
 * "no hue can enter the system through any mix of them" — and the accent on
 * this site has always been LIGHT rather than colour. So the lit node and the
 * filled trace are --primary (pure white) against --hairline, and the contrast
 * is luminance. Importing the green would have broken the one constraint the
 * palette actually has, to land on the most-seen accent on the internet.
 *
 * ---------------------------------------------------------------------------
 * BEHAVIOUR
 *
 * Horizontal travel is SCROLL-LINKED BUT NEVER SCROLL-JACKING. The rail is
 * wider than the viewport, and as the section crosses the screen the track
 * translates so you traverse Discover → Support. The section is not pinned:
 * pinning steals the scrollbar, breaks the page's sense of length, and is the
 * first thing that goes wrong for anyone driving by keyboard or trackpad
 * momentum. Below `lg`, and whenever `prefers-reduced-motion` is set, the
 * transform is not applied at all and the rail is a plain native horizontally
 * scrollable region with snap points — swipe or arrow-key it.
 *
 * The pin carries no progress readout. There was one — an eyebrow and a rule
 * that filled across the run — on the reasoning that taking the scrollbar away
 * obliges you to say how long the section is. It was cut: on a near-empty void
 * it read as a stray horizontal line above the artwork, and the traverse is
 * short enough (about one viewport of scrolling) that the pipeline's own
 * left-to-right progress answers the question by itself.
 *
 * NOTHING MOVES ON HOVER. Every card reserves the space its detail will
 * occupy, and the detail expands AWAY from the trace — upward for the cards
 * above the line, downward for the ones below. So the reveal is opacity and a
 * few pixels of travel over reserved space, and hovering across the five
 * stages never reflows the row. Layout shift under the cursor is the single
 * most common tell of a hover interaction that was not finished.
 *
 * The detail text is ALWAYS IN THE DOM, only visually collapsed. Search
 * engines and screen readers get all five stage descriptions with no
 * interaction, which is the whole reason the reveal is CSS on
 * `:hover`/`:focus-within` rather than conditional rendering.
 */

/* ── Geometry ─────────────────────────────────────────────────────────────
   ONE SOURCE OF TRUTH FOR THE LINE AND THE LABELS. The SVG path and the
   absolutely-positioned HTML cards are both generated from this array, so a
   node can never drift off its own trace.

   Coordinates are in the SVG's own 1000 × 300 space. The <svg> is stretched
   over the rail with `preserveAspectRatio="none"`, and percentages taken from
   these numbers (x/1000, y/300) resolve against the same box — which is what
   lets HTML cards land exactly on SVG nodes at every width without measuring
   anything at runtime.

   `y` is the decaying oscillation described above; 150 is the centreline.
   `side` is not an independent choice — it is simply which side of 150 the
   curve put the node on.

   THE FIRST NODE STARTS AT 30%, NOT AT THE LEFT EDGE. That opening third of
   the track is the room the opening paragraph occupies while the pipeline is
   still at rest, and it is the reason Discover's card does not sit underneath
   that text at the moment the section pins. Nothing is drawn in it — the line
   itself starts at Discover — so the paragraph sits on empty void rather than
   on artwork. */
const MID = 150;

const NODES = [
  { x: 300, y: MID - 52, side: "above" },
  { x: 445, y: MID + 40, side: "below" },
  { x: 590, y: MID - 30, side: "above" },
  { x: 735, y: MID + 22, side: "below" },
  { x: 880, y: MID - 15, side: "above" },
] as const;

type Pt = { x: number; y: number };

/**
 * Catmull-Rom through the nodes, converted to cubic Béziers.
 *
 * Catmull-Rom is the right spline here because it passes THROUGH every control
 * point. A plain quadratic or a hand-tuned `C` chain would put the curve near
 * the nodes and leave the dots sitting a few pixels off their own line at some
 * widths — the kind of flaw that is invisible in a mock and obvious on a 4K
 * display.
 *
 * THE LINE BEGINS AT DISCOVER AND ENDS AT SUPPORT. It used to run off both
 * edges of the frame, on the reasoning that a line stopping mid-screen reads
 * as a diagram of itself. That was wrong for this content: the run-in implied
 * the process was already underway before stage one, and it put a diagonal
 * through the opening paragraph on its way in. The process has a first stage,
 * so the line has a first point. Both ends are round-capped, so they read as
 * deliberate terminals rather than as something that got cut off.
 *
 * (Support is the one stage with an argument for a run-out — "the work does
 * not end at launch" — but a line that starts hard and trails off soft reads
 * as an error, not as a point. Say it in the copy, not the geometry.)
 *
 * The tangent at each point is (next - previous) / 6, the standard uniform
 * Catmull-Rom basis. Endpoints are duplicated so the first and last segments
 * have a neighbour to read a tangent from.
 */
function catmullRom(points: Pt[]): Pt[][] {
  const p = [points[0], ...points, points[points.length - 1]];
  const segments: Pt[][] = [];

  for (let i = 1; i < p.length - 2; i++) {
    segments.push([
      p[i],
      {
        x: p[i].x + (p[i + 1].x - p[i - 1].x) / 6,
        y: p[i].y + (p[i + 1].y - p[i - 1].y) / 6,
      },
      {
        x: p[i + 1].x - (p[i + 2].x - p[i].x) / 6,
        y: p[i + 1].y - (p[i + 2].y - p[i].y) / 6,
      },
      p[i + 1],
    ]);
  }

  return segments;
}

const SEGMENTS = catmullRom(NODES.map((n) => ({ x: n.x, y: n.y })));

const TRACE = SEGMENTS.reduce(
  (d, [, c1, c2, end]) =>
    `${d} C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${end.x} ${end.y}`,
  `M ${SEGMENTS[0][0].x} ${SEGMENTS[0][0].y}`,
);

/** Flattened length of one cubic segment. 64 steps is far past the point where
 *  more changes the fourth decimal on a curve this gentle. */
function segmentLength([p0, p1, p2, p3]: Pt[], steps = 64): number {
  let length = 0;
  let px = p0.x;
  let py = p0.y;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x =
      u * u * u * p0.x +
      3 * u * u * t * p1.x +
      3 * u * t * t * p2.x +
      t * t * t * p3.x;
    const y =
      u * u * u * p0.y +
      3 * u * u * t * p1.y +
      3 * u * t * t * p2.y +
      t * t * t * p3.y;
    length += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }

  return length;
}

/* How far along the trace each node sits, as a fraction, for the lit fill.
   MEASURED, not approximated by the node's x. It used to be the x fraction,
   which was defensible while the line spanned the full frame and only rippled
   gently — arc length ran about 3% over horizontal extent. Now that the line
   covers only Discover→Support, the same oscillation is packed into 58% of the
   width and the segments run up to 18% longer than their horizontal span. At
   that error the light visibly misses the dot it is supposed to arrive at.

   Flattening the Béziers here costs a few hundred microseconds once, at module
   load, and needs no DOM — `getTotalLength()` would mean a layout read on
   mount and another on every resize to learn something that never changes. */
const CUMULATIVE = SEGMENTS.reduce<number[]>(
  (acc, segment) => [...acc, acc[acc.length - 1] + segmentLength(segment)],
  [0],
);

const FILL_AT = CUMULATIVE.map((d) => d / CUMULATIVE[CUMULATIVE.length - 1]);

/* A still beat at each end of the pinned run, as a fraction of it. Without
   these the pipeline is already sliding the instant the section locks and is
   still sliding as it lets go, which reads as an overshoot rather than as a
   deliberate start and finish. Discover holds for a moment, the traverse runs,
   Support holds for a moment, and only then does the page continue. */
const DWELL = 0.08;

/* NOTE: the pacing multiplier that turns travel distance into runway height
   lives in the CSS (`.pipe-runway`), not here, so the section reserves the
   right height before any JS runs. It is 1.6: a straight 1:1 would send a
   five-stage journey by in about half a screen, and only (1 - 2·DWELL) of the
   run is moving at all. 1.3 puts the full traverse at roughly one viewport
   height of scrolling on a 1080p screen — it was 1.6 before the lead-in made
   the track longer, at which point the run crept toward two full screens.
   Change it there and here together. */

/**
 * Media query as a subscription rather than as state written from an effect.
 *
 * `useSyncExternalStore` is the right tool because a media query IS an external
 * store: it has a current value and it emits changes. Reading it into state
 * inside a `useEffect` costs an extra render on every mount, and React 19's
 * lint rightly objects. The server snapshot is `false`, so the first paint is
 * always the un-driven layout and hydration cannot mismatch.
 */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function ProcessStrip() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  /** Which stage is lit. `null` is the resting state — no fill on the trace. */
  const [active, setActive] = useState<number | null>(null);
  /** Horizontal overflow in px: how far the track has to travel. */
  const [travel, setTravel] = useState(0);

  const reduceMotion = useReducedMotion();
  /* Same 64rem breakpoint the layout uses. Below it the rail is a native
     scroller and the transform has to stay off, or the two fight for the same
     axis. */
  /* MUST MATCH THE CSS EXACTLY. The stylesheet unpins on short viewports as
     well as narrow ones (see the `height < 40rem` block), and this flag only
     tested the width — so on a short desktop window the section was unpinned
     while JS carried on applying scroll-driven transforms to a rail that was
     no longer stuck to anything. Two sources of truth for one layout decision;
     they have to be written as one condition. */
  const wide = useMediaQuery("(min-width: 64rem) and (min-height: 40rem)");
  const driven = wide && !reduceMotion;

  /* Measure the overflow rather than deriving it from the CSS width, so the
     traverse is exact whatever the container padding and scrollbar do. */
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () =>
      setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  /* THE RUNWAY IS THE SCROLL BUDGET FOR THE PIN.
     `start start` → `end end` is the exact span over which a `position: sticky`
     child is stuck: progress is 0 the moment the runway's top meets the top of
     the viewport (the pin engages) and 1 when its bottom does (the pin lets
     go). Measuring the SECTION instead would have counted the heading and the
     footer row, and the traverse would finish early and then sit still. */
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  /* Function form rather than an input/output range pair: `travel` is measured
     after mount and again on resize, and the closure picks up the new value on
     the render that follows. */
  const rawX = useTransform(scrollYProgress, (p) => {
    const t = (p - DWELL) / (1 - DWELL * 2);
    return -travel * Math.min(1, Math.max(0, t));
  });

  /* Softens the coupling so a flicked trackpad does not make the rail feel
     nailed to the scrollbar. Low mass, high damping: it lags by a few frames
     and never overshoots into a bounce. */
  const x = useSpring(rawX, { stiffness: 90, damping: 26, mass: 0.35 });

  /* THE LIGHT IS THE SCROLL POSITION. It used to be driven by whichever card
     you happened to be hovering, which made the brightest thing in the section
     jump around under the cursor and told you nothing — the light was
     arbitrary. Tying it to the traverse instead gives it one job: it is how
     far through the process you are. The lit tip leaves the left edge as the
     pin engages and reaches Support on the frame the pin releases.

     `pathLength={1}` on the path means this is a plain 0–1 fraction; 1 is
     unlit, 0 is fully drawn. */
  const traceOffset = useTransform(scrollYProgress, (p) => {
    // Nothing traverses under reduced motion, so there is no progress to
    // report — show the line whole rather than permanently unfinished.
    if (reduceMotion) return 0;
    const t = (p - DWELL) / (1 - DWELL * 2);
    return 1 - Math.min(1, Math.max(0, t));
  });

  /* The opening paragraph clears out as the pipeline starts to move. It goes
     LEFT rather than simply fading, so it reads as being carried off by the
     same movement that brings the stages in — one gesture, not a dissolve and
     a slide that happen to coincide. Gone by 0.14, which is just after the
     traverse begins at DWELL. */
  const leadOpacity = useTransform(scrollYProgress, [0.02, 0.12], [1, 0]);
  const leadX = useTransform(scrollYProgress, [0.02, 0.12], [0, -72]);

  /* Which stages the light has already passed. Derived from the same fraction
     as the trace, so a stage can never open before the line reaches it.

     THIS NOW OPENS THE CARD, not just the dot. The detail used to be a hover
     reward, which meant the whole point of the section was invisible to anyone
     who simply scrolled. Tying it to the light makes the traverse do the
     reading: the line arrives at a stage, the stage explains itself. Passed
     stages STAY open — the trace behind the light stays lit, so the cards
     behaving any differently would have the section erasing itself as it goes.

     Updated from a motion event rather than by re-rendering on every scroll
     frame: this changes five times across the whole run. */
  const [reached, setReached] = useState(-1);
  /* Opacity alone leaves the paragraph in the accessibility tree and in the
     hit-testing layer — a screen reader still reads it out over the stages,
     and an invisible 24rem block still sits on top of the pipeline. Past the
     fade it gets `visibility: hidden`, which takes it out of both. */
  const [leadGone, setLeadGone] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setLeadGone(p > 0.13);
    if (reduceMotion) {
      setReached(NODES.length - 1);
      return;
    }
    const t = Math.min(1, Math.max(0, (p - DWELL) / (1 - DWELL * 2)));
    /* `t > 0` guards the first stage. Discover sits at fraction 0 now that the
       line starts on it, so a plain `<=` test would report it reached while
       the section is still at rest and pop its card open before anyone has
       scrolled. The light has to have left the dot for the dot to count. */
    let next = -1;
    if (t > 0) {
      for (let i = 0; i < FILL_AT.length; i++) if (FILL_AT[i] <= t) next = i;
    }
    setReached((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="section-y relative isolate overflow-x-clip"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2 id="process-heading" className="display display-lg">
            {/* Setup muted, payoff at full contrast. The old markup declared
                this pattern and then did not get it: `lit` sat on the <h2>
                itself, and the rule is `.display .lit` — a descendant selector
                — so it matched nothing and the whole heading rendered at one
                weight. */}
            <span className="lead">{process.strip.heading.lead}</span>
            <span className="lit">{process.strip.heading.lit}</span>
          </h2>
          <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty sm:text-lg">
            {process.strip.intro}
          </p>
        </Reveal>
      </div>

      {/* ── The runway ────────────────────────────────────────────────────
          Vertical scroll budget for the pin, and nothing else. Its height is
          one viewport (what the pinned rail occupies) plus the horizontal
          distance the track has to cover — so the page grows by exactly the
          amount of scrolling the traverse consumes, and the section below
          arrives the moment Support does.

          Height is only set once `travel` has been measured; before that, and
          on every layout that is not pinned, this is an ordinary block that
          adds nothing. */}
      <div ref={runwayRef} className="pipe-runway">
        <div className="pipe-pin">
          {/* The opening statement. It occupies the track's lead-in — the
              first 30%, before Discover — so at rest it sits beside a pipeline
              that has not started yet, and it is carried off to the left as
              the traverse begins. Below lg (and under reduced motion) it is an
              ordinary paragraph above the rail that never moves. */}
          <motion.div
            className="pipe-lead"
            data-gone={(driven && leadGone) || undefined}
            style={driven ? { opacity: leadOpacity, x: leadX } : undefined}
          >
            <p>{process.strip.lead}</p>
          </motion.div>

          {/* ── The rail ──────────────────────────────────────────────────
              Full-bleed on purpose: the pipeline is the one element on the
              page allowed to run past the container, because a line that stops
              short of both edges stops reading as continuous. */}
          <div
            ref={viewportRef}
            role="group"
            aria-label="The five stages, in order"
            tabIndex={0}
            /* THE SCROLLABLE REGION IS THE TAB STOP, NOT THE FIVE CARDS.
               Making each card focusable would have added five stops that go
               nowhere, and while pinned the track is translated rather than
               scrolled — so the browser's "scroll the focused thing into
               view" would have fought the transform and left focus somewhere
               off the side. One stop on the region is also simply what a
               horizontally scrollable region is supposed to expose: tab to
               it, arrow through it. Focusing it opens every stage at once
               (see the CSS), so the keyboard path shows strictly more than
               the pointer path. */
            onFocus={(e) => {
              if (e.target === e.currentTarget) setActive(NODES.length - 1);
            }}
            onBlur={(e) => {
              if (e.target === e.currentTarget) setActive(null);
            }}
            /* Native scroller below lg and under reduced motion; the CSS
               swaps it to `clip` at lg, where the track is transform-driven
               instead. Gating that from here would have made it a
               post-hydration change. */
            className="pipe-viewport relative overflow-x-auto"
          >
            <motion.ol
              ref={trackRef}
              style={driven ? { x } : undefined}
              className="pipe-track relative"
              onMouseLeave={() => setActive(null)}
            >
              {/* The trace. Decorative — every stage is spelled out in the cards,
              so the line carries no information of its own. */}
              <svg
                aria-hidden
                viewBox="0 0 1000 300"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                {/* `vector-effect` keeps the hairline a hairline. Without it the
                non-uniform stretch above scales stroke width on each axis and
                the line thickens through the steep parts of the curve. */}
                <path
                  d={TRACE}
                  className="pipe-line"
                  vectorEffect="non-scaling-stroke"
                />
                <motion.path
                  d={TRACE}
                  className="pipe-line-lit"
                  pathLength={1}
                  style={{ strokeDashoffset: traceOffset }}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {process.steps.map((step, i) => {
                const node = NODES[i];
                const left = `${(node.x / 1000) * 100}%`;
                const top = `${(node.y / 300) * 100}%`;

                return (
                  <li
                    key={step.title}
                    className="pipe-stage"
                    style={{ left, top }}
                    data-side={node.side}
                    data-reached={i <= reached || undefined}
                    data-active={active === i || undefined}
                    onMouseEnter={() => setActive(i)}
                  >
                    {/* The node itself sits exactly on the trace. HTML rather than
                    an SVG <circle>, which the `preserveAspectRatio="none"`
                    stretch would render as an ellipse. */}
                    <span aria-hidden className="pipe-node" />

                    <div className="pipe-card">
                      <div className="pipe-card-head">
                        <span className="pipe-index" aria-hidden>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="pipe-title">
                          <span className="sr-only">
                            Stage {i + 1} of {process.steps.length}:{" "}
                          </span>
                          {step.title}
                        </h3>
                      </div>

                      <p className="pipe-question">{step.question}</p>

                      {/* Collapsed with grid-template-rows 0fr → 1fr, so the
                      detail animates to its own natural height with no
                      max-height guess and no measurement. */}
                      <div className="pipe-detail">
                        <p>{step.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </motion.ol>
          </div>
        </div>
      </div>

      {/* ── What holds true whichever stage you are at ─────────────────── */}
      <div className="container-page">
        <Reveal className="mt-16 sm:mt-20">
          <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase">
            {process.strip.promises.heading}
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.strip.promises.items.map((promise) => (
              <li
                key={promise}
                className="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-muted-foreground"
              >
                <Check
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  strokeWidth={2}
                />
                {promise}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
