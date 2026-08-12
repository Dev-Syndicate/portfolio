import { cn } from "@/lib/utils";

/**
 * The board the page is built on — copper routing, plated vias, and solder
 * pads, drawn as a full-bleed field behind a section's content.
 *
 * WHY IT LOOKS LIKE THIS
 *
 * The site's whole vernacular is already an engineered sheet: chamfered cards
 * with a routed corner, a 4px node at that corner, mono instrument labels,
 * hairline rules. What it never had was the sheet those parts sit on. This is
 * that layer. The hero's mark stops floating in void and becomes the component
 * the traces run out of.
 *
 * TWO DELIBERATE RESTRAINTS
 *
 * 1. The field does not move. The mark already draws itself on, sweeps a chrome
 *    gradient, and runs light packets down its outline forever. Animating the
 *    board too would flatten that hierarchy — an inert board with one live
 *    component reads as engineered; everything twinkling reads as a screensaver.
 *    It also costs nothing to render.
 *
 * 2. Routing is masked to fall off with distance from the energy source, so the
 *    density is highest where the eye already is and dissolves before it
 *    reaches running text. Nothing is drawn at full strength behind a paragraph.
 *
 * IDS MUST BE UNIQUE. SVG ids are document-global, so two fields on one page
 * with the same gradient id will silently share (and fight over) one mask.
 * Every instance takes an explicit `id` and namespaces its defs with it — this
 * is why there is no `useId()` here, which would force the whole thing to
 * become a client component for a static drawing.
 */

type Props = {
  /** Unique per instance on a page — namespaces this field's SVG defs. */
  id: string;
  /**
   * `hero` — dense routing radiating out of the mark on the right, sized for a
   * full-viewport section. `band` — a quieter horizontal run for the shorter
   * content sections, so the board reads as continuing between them.
   */
  variant?: "hero" | "band";
  /** Mirror the routing. Alternate it down the page so no two bands match. */
  flip?: boolean;
  className?: string;
};

export function CircuitField({
  id,
  variant = "hero",
  flip = false,
  className,
}: Props) {
  const isHero = variant === "hero";
  const maskId = `${id}-mask`;
  const rampId = `${id}-ramp`;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        // Vertical dissolve, so the board never collides with the fixed header
        // above or hard-edges into the next section below.
        isHero
          ? "[mask-image:linear-gradient(180deg,transparent_0,#000_16%,#000_82%,transparent_100%)]"
          : "[mask-image:linear-gradient(180deg,transparent_0,#000_26%,#000_74%,transparent_100%)]",
        className,
      )}
    >
      <svg
        viewBox={isHero ? "0 0 1440 900" : "0 0 1440 420"}
        preserveAspectRatio="xMidYMid slice"
        className={cn("h-full w-full", flip && "-scale-x-100")}
        focusable="false"
      >
        <defs>
          {isHero ? (
            /* Energy falls off radially from the mark's optical centre. */
            <radialGradient id={rampId} cx="0.78" cy="0.48" r="0.72">
              <stop offset="0" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.45" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          ) : (
            /* Bands have no component to radiate from, so the falloff runs
               along the trace direction instead. */
            <linearGradient id={rampId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.3" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          )}

          <mask id={maskId}>
            <rect
              width={1440}
              height={isHero ? 900 : 420}
              fill={`url(#${rampId})`}
            />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {isHero ? <HeroRouting /> : <BandRouting />}
        </g>
      </svg>
    </div>
  );
}

/* Routing runs in 90° and 45° segments only — the two angles a real autorouter
   is allowed. Traces leave the mark on the right and terminate in vias at the
   left, stepping around where the headline sits. */
function HeroRouting() {
  return (
    <>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        className="text-primary/50"
      >
        <path d="M1120 150 H620 L560 210 H150" />
        <path d="M1080 250 H760 L700 190 H300 L250 240 H60" />
        <path d="M1060 350 H880 L820 410 H420 L370 360 H90" />
        <path d="M1075 470 H900 L850 470 L790 530 H460 L400 470 H120" />
        <path d="M1090 600 H700 L640 660 H240" />
        <path d="M1110 720 H820 L770 670 H520 L470 720 H170" />
        <path d="M560 210 V330" />
        <path d="M820 410 V540" />
        <path d="M640 660 V760 H900" />
        <path d="M370 360 V470" />
      </g>

      {/* Vias — the plated holes a trace drops through to the other layer. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        className="text-primary/70"
      >
        <circle cx={150} cy={210} r={4} />
        <circle cx={60} cy={240} r={4} />
        <circle cx={90} cy={360} r={4} />
        <circle cx={120} cy={470} r={4} />
        <circle cx={240} cy={660} r={4} />
        <circle cx={170} cy={720} r={4} />
        <circle cx={560} cy={330} r={4} />
        <circle cx={820} cy={540} r={4} />
        <circle cx={900} cy={760} r={4} />
        <circle cx={370} cy={470} r={4} />
      </g>

      {/* Pads — the square landings a component solders down onto. */}
      <g fill="currentColor" className="text-primary/40">
        <rect x={616} y={146} width={8} height={8} />
        <rect x={756} y={246} width={8} height={8} />
        <rect x={876} y={346} width={8} height={8} />
        <rect x={896} y={466} width={8} height={8} />
        <rect x={696} y={596} width={8} height={8} />
        <rect x={816} y={716} width={8} height={8} />
      </g>
    </>
  );
}

/* The band: fewer traces, longer runs, entering and leaving the section edges
   so the board reads as passing through rather than starting and stopping. */
function BandRouting() {
  return (
    <>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        className="text-primary/45"
      >
        <path d="M0 80 H320 L370 130 H760 L810 80 H1200" />
        <path d="M0 180 H180 L230 230 H620 L670 180 H1080 L1130 230 H1440" />
        <path d="M0 300 H420 L470 250 H900 L950 300 H1440" />
        <path d="M370 130 V230" />
        <path d="M810 80 V30 H1240" />
        <path d="M670 180 V110" />
      </g>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        className="text-primary/65"
      >
        <circle cx={1200} cy={80} r={4} />
        <circle cx={1240} cy={30} r={4} />
        <circle cx={670} cy={110} r={4} />
        <circle cx={230} cy={230} r={4} />
        <circle cx={950} cy={300} r={4} />
      </g>

      <g fill="currentColor" className="text-primary/35">
        <rect x={316} y={76} width={8} height={8} />
        <rect x={616} y={176} width={8} height={8} />
        <rect x={896} y={296} width={8} height={8} />
      </g>
    </>
  );
}
