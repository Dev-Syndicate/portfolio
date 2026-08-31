"use client";

import { useEffect, useRef } from "react";

/**
 * SIGNAL FIELD — the hero's signature.
 *
 * THE LATTICE IS INVISIBLE UNTIL THE SIGNAL REACHES IT. The hero is empty void.
 * Every few seconds a wavefront leaves the headline and travels outward, and
 * the dots exist only where it is passing — lighting, swelling, and going dark
 * again behind it. Nothing is drawn at rest.
 *
 * That is the whole idea, and it is a sharper version of the studio's claim
 * than a permanent grid with a bright ring travelling over it. A business does
 * not show you its structure. You only see the shape of a system when a change
 * moves through it, and you only see it where the change has reached. Here the
 * headline is the source, and the lattice is the evidence.
 *
 * Three rules keep it from being wallpaper:
 *
 * 1. THE LATTICE IS SQUARE, THE PHYSICS ARE RADIAL. Positions sit on a plain
 *    grid, so what the front reveals reads as cells in a system rather than as
 *    a dartboard. Everything that VARIES — the front, the vignette at the rim,
 *    the fade at the foot — is a function of distance from the copy, so the
 *    motion is genuinely radial without the polar layout's spokes.
 *
 * 2. THE TYPE SITS IN A CALM, NOT IN A HOLE. Where the front crosses the copy
 *    it is damped rather than cut: cutting a hole punches a visible rectangle
 *    through the middle of a travelling band and announces the trick, while
 *    damping keeps the front continuous underneath the words. The calm is
 *    measured from the real copy block, so it tracks the headline at every
 *    width.
 *
 * 3. THERE IS A DARK BEAT. A front takes 3.2s to cross and the next leaves at
 *    4.2s, so about a second of every cycle is pure void. That beat is load-
 *    bearing: it is what makes each arrival an event rather than an ambience,
 *    and it is the reason nothing here needs to shimmer to feel alive.
 *
 * The origin is the centre of the copy, not the centre of the viewport — the
 * light comes out of the headline. The first front departs at 500ms so it
 * crosses while the headline's per-character entrance is still resolving; the
 * two are one opening, not two effects that happen to overlap.
 *
 * Purely decorative and purely additive: the hero is server-rendered and fully
 * readable before this hydrates. `prefers-reduced-motion` draws NOTHING and
 * never starts a loop — the field is made entirely of motion, so with motion
 * removed there is honestly nothing left of it, and the hero falls back to type
 * on the void, which is a finished composition in its own right. The loop also
 * stops whenever the hero is off-screen or the tab is hidden.
 *
 * EVERYTHING BELOW IS IN DEVICE PIXELS, not CSS pixels, and the canvas carries
 * no scale transform. That is not a micro-optimisation: with a CSS-pixel
 * transform the lattice lands on fractional device pixels, every column picks
 * up a slightly different antialiasing phase, and the field develops hard
 * vertical banding that looks like a rendering bug. Integer origins and integer
 * sizes make every dot identical and dead crisp. Tunables stay in CSS px and
 * are scaled once, at build.
 */

/* ── Lattice ─────────────────────────────────────────────────────────────── */
/* The pitch is a COUNT OF COLUMNS, not a fixed size. A 20px pitch draws 72
   columns across a desktop and reads as texture; the same 20px draws 19 columns
   across a phone and reads as polka dots, which is most of what was wrong with
   this on mobile. Dividing the viewport instead holds the density roughly
   constant, and the clamps stop it going coarse on a 5K or moiré-fine on a
   watch. Desktop lands on 20 either way, so nothing changes there. */
const PITCH_DIVISOR = 70; // target columns across the frame
const PITCH_MIN = 12; // CSS px
const PITCH_MAX = 20; // CSS px
const MAX_DOTS = 7200; // ceiling; pitch relaxes rather than frames dropping

/* Ceiling on the backing store, in device pixels. A full-bleed hero at 2x on a
   1920 viewport is 6.9 MILLION pixels, and the compositor has to move that
   whole surface every single frame — which costs multiples of what the drawing
   costs, and drops the page to half frame rate. Past this budget the field
   renders at 1x and the browser scales it. The dots are flat squares at low
   alpha, so the upscale is invisible; the dropped frames were not.

   The choice is deliberately between 1 and 2, never a fraction: a fractional
   backing scale puts the lattice back on fractional device pixels, which is the
   banding this file goes to some trouble to avoid. */
const MAX_PIXELS = 3_000_000;
/* Base edge of a lit dot, and how much energy grows one, as a FRACTION OF THE
   PITCH. Absolute sizes were the other half of the mobile problem: a 2px dot is
   a tenth of a 20px desktop pitch and looks like grain, but a sixth of a 12px
   mobile pitch and looks like a bead. Tying the two together makes the dot-to-
   gap ratio the constant, which is what the eye actually reads. Rounded to
   whole device pixels at build, so the squares stay crisp. */
const DOT_RATIO = 0.1;
const DOT_GAIN_RATIO = 0.1;

/* ── Envelope ────────────────────────────────────────────────────────────── */
/* How much of the front any given dot is allowed to show, in fractions of the
   distance to the furthest corner. There is no resting brightness — this only
   ever scales the front and the pointer.

   RIM_IN is late and RIM_OUT is past 1 on purpose: the front should reach the
   left and right edges of the frame and only give out in the CORNERS. Pulling
   the rim in far enough to close a disc inside the viewport also strangles it
   either side of the headline. A wide viewport wants a vignette, not a circle. */
const RING_IN = 0.02; // the envelope rises from here…
const RING_FULL = 0.2; // …to full here
const RIM_IN = 0.8; // and falls away from here…
const RIM_OUT = 1.22; // …to nothing here

/* The calm behind the type, in multiples of the copy block's own box.
   Measured as a SUPERELLIPSE, not an ellipse. The copy is a rectangle and the
   headline runs nearly to its corners, so an ellipse wide enough to cover the
   outer words is also tall enough to swallow the whole middle of the field —
   the design collapses into two horizontal bands. A superellipse hugs the
   rectangle instead: it covers the type tightly and then gets out of the way,
   which hands back the sides and, more importantly, the four corners. That is
   what keeps the front reading as a field rather than as a bar.

   A quarter is the balance point: damp the front less and bright dots ride
   across the glyphs as it passes; damp it more and a dark rectangle the shape
   of the copy opens up inside a travelling band, which is far more conspicuous
   than it was back when a resting lattice filled that space. */
const CALM_POWER = 3.5; // 2 is an ellipse; higher is squarer
const CALM_IN = 0.72; // fully calmed inside here…
const CALM_OUT = 1.22; // …and back to full strength out here

/* How far down the lights go behind the copy — and it CANNOT be one number,
   because the calm damps BY POSITION and position is exactly what a radial is
   made of. Every unit of calm bends the ring out of shape.

   On a desktop that is affordable: the copy is an island covering about
   two-thirds of the width, so a firm calm carves a quiet patch out of a ring
   that is mostly elsewhere, and the ring still reads as a ring. On a phone the
   copy covers ninety per cent of the width AND sits over the origin, so a firm
   calm does not carve a patch out of the ring — it deletes the entire first
   half of the ring's life. The front becomes invisible until it clears the copy
   and then appears out of the top and bottom edges, which is the opposite of
   expanding from the centre.

   So narrow frames damp by AMPLITUDE instead (see PULSE_GAIN below) and keep
   the calm shallow. The ring stays a ring, drawn faintly, all the way out from
   the middle. Legibility is bought by making every dot dimmer rather than by
   cutting a hole where the reader is looking. */
const CALM_FLOOR_ROOMY = 0.26; // a firm calm, when the ring is mostly elsewhere
const CALM_FLOOR_TIGHT = 0.55; // barely a calm, when the ring is right here
const ROOM_TIGHT = 0.08; // fraction of the width left free…
const ROOM_ROOMY = 0.3; // …at which the field has room to breathe

/* The fade at the foot of the section, as a fraction of its height. The promise
   row sits down there behind a hairline rule, and dots crossing that rule make
   it read as a texture seam rather than as a division — so the lattice retires
   just above it. Baked in here rather than applied as a CSS mask: see the
   `.signal-field` note in globals.css for what that cost. */
const FOOT_IN = 0.66;
const FOOT_OUT = 0.86;

/* There is no fade at the head. There was one — narrow frames used to clear
   their top band, because the front ran straight through the logo and the
   wordmark. The header is now a pane of frosted glass (see
   components/layout/site-header.tsx), and 62%-opaque glass with a 16px backdrop
   blur protects the brand far better than deleting the artwork did. The two
   systems cooperate instead of one compensating for the other: the front passes
   UNDER the nav and you see it smeared through the glass, which is the entire
   reason the header is shaped the way it is. */

const CULL = 0.012; // below this a dot is not worth a draw call

/* ── The pulse ───────────────────────────────────────────────────────────── */
/* The front is now the entire design, so it is BROADER and SLOWER than it was
   when it only had to read as a highlight over a standing lattice: a narrow
   band sweeping an empty frame reads as a scanner bar, while a wide one reads
   as a region of the system coming into view. TRAVEL and PERIOD are set about a
   second apart, which is the dark beat between passes. */
const PULSE_PERIOD = 4200; // ms between departures
const PULSE_TRAVEL = 3200; // ms for one front to cross the field
const PULSE_FIRST = 500; // ms before the first departs
const PULSE_WIDTH = 0.15; // front thickness as a fraction of the radius

/* Peak brightness of the front, and the OTHER half of the narrow-frame answer.
   A phone gets a dimmer front rather than a hole punched through the middle of
   it: amplitude is the one control that quiets the field without touching its
   geometry, so the ring keeps expanding cleanly from the origin to the edges
   and simply does so more faintly. Same shape, less ink. */
const PULSE_GAIN_ROOMY = 0.8;
const PULSE_GAIN_TIGHT = 0.46;

/* ── Pointer ─────────────────────────────────────────────────────────────── */
/* The second light, and the only one the reader controls: a patch of lattice
   resolves under the cursor. With nothing drawn at rest this does real work —
   it covers the dark beat for anyone with a mouse, and it makes the hero answer
   the reader rather than merely play at them. */
const POINTER_RADIUS = 148; // px
const POINTER_GAIN = 0.6;
const POINTER_EASE = 0.11; // the light trails the cursor rather than snapping

/* There is deliberately no ambient scintillation and no entrance fade. Both
   existed to give a STANDING lattice something to do, and a standing lattice is
   exactly what this no longer has: an idle shimmer needs something to shimmer,
   and a fade-in needs something to fade in. The front's own rise and fall does
   both jobs, and every dot the design does not draw is a draw call saved. */

/** Hermite ramp from 0 at `a` to 1 at `b`. */
function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

type Lattice = {
  x: Float32Array;
  y: Float32Array;
  /** Vignette + foot fade, 0–1. Constant until the next resize. */
  ring: Float32Array;
  /** The calm behind the copy, CALM_FLOOR–1. Constant until the next resize. */
  calm: Float32Array;
  /** Distance from the origin in device px. The wavefront reads this. */
  dist: Float32Array;
  count: number;
  maxR: number;
};

export function SignalField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const host = canvas.parentElement;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lattice: Lattice | null = null;
    let deviceW = 0;
    let deviceH = 0;
    let scale = 1; // device pixels per CSS pixel
    // Dot geometry, in device px. Derived from the pitch in build().
    let dotMin = 2;
    let dotGain = 2;
    // Peak brightness of the front. Derived from the frame's proportions.
    let pulseGain = PULSE_GAIN_ROOMY;
    let frame = 0;
    let start = 0;
    let running = false;

    // Pointer state in DEVICE px. `px/py` is where the cursor is; `sx/sy` is
    // where the light has got to. Easing the light rather than the reading is
    // what gives the field weight instead of a cursor-shaped hole.
    let px = -99999;
    let py = -99999;
    let sx = -99999;
    let sy = -99999;
    let pointerOn = false;

    /* ── Build ────────────────────────────────────────────────────────────── */

    function build() {
      const rect = host!.getBoundingClientRect();
      const cssW = Math.max(1, Math.round(rect.width));
      const cssH = Math.max(1, Math.round(rect.height));

      scale = Math.min(2, Math.round(window.devicePixelRatio || 1));
      if (cssW * cssH * scale * scale > MAX_PIXELS) scale = 1;
      deviceW = Math.round(cssW * scale);
      deviceH = Math.round(cssH * scale);
      canvas!.width = deviceW;
      canvas!.height = deviceH;
      canvas!.style.width = `${cssW}px`;
      canvas!.style.height = `${cssH}px`;
      // No transform: the whole field is drawn in device pixels.
      ctx!.setTransform(1, 0, 0, 1, 0, 0);

      // Pitch from the frame's own width, so the lattice holds its density from
      // a phone to a 5K, then relaxed further if the dot count would run away.
      const pitchCss = Math.min(
        PITCH_MAX,
        Math.max(PITCH_MIN, cssW / PITCH_DIVISOR),
      );
      let pitch = Math.max(2, Math.round(pitchCss * scale));
      while ((deviceW / pitch) * (deviceH / pitch) > MAX_DOTS) {
        pitch += Math.max(1, Math.round(2 * scale));
      }
      // Dot size follows the pitch, so the dot-to-gap ratio is what stays put.
      dotMin = Math.max(1, Math.round(pitch * DOT_RATIO));
      dotGain = pitch * DOT_GAIN_RATIO;

      const cols = Math.ceil(deviceW / pitch) + 1;
      const rows = Math.ceil(deviceH / pitch) + 1;
      // Centre the lattice so it never looks anchored to the top-left corner.
      const offX = Math.round((deviceW - (cols - 1) * pitch) / 2);
      const offY = Math.round((deviceH - (rows - 1) * pitch) / 2);

      // Origin and calm are both measured from the real copy block, so the
      // light comes out of the headline and the quiet band tracks it through
      // every breakpoint — rather than a hardcoded ellipse that only fits one
      // width. Falls back to proportions if the hero renders without it.
      const copy = host!.querySelector<HTMLElement>("[data-hero-copy]");
      let cx: number;
      let cy: number;
      let calmX: number;
      let calmY: number;
      // How much of the frame's width the copy leaves free. Drives how hard the
      // calm has to work — see the CALM_FLOOR notes above.
      let room: number;

      if (copy) {
        const c = copy.getBoundingClientRect();
        cx = (c.left - rect.left + c.width / 2) * scale;
        cy = (c.top - rect.top + c.height / 2) * scale;
        // The copy's own box plus a small margin. The superellipse does the
        // rest of the work — this does not need to be generous.
        calmX = (c.width / 2 + 34) * scale;
        calmY = (c.height / 2 + 18) * scale;
        room = 1 - c.width / cssW;
      } else {
        cx = deviceW / 2;
        cy = deviceH * 0.44;
        calmX = deviceW * 0.36;
        calmY = deviceH * 0.27;
        room = 0.28;
      }

      // A wide frame lets the front wash over the words; a narrow one, where
      // the copy runs nearly edge to edge, has to clear them instead.
      const roomy = smoothstep(ROOM_TIGHT, ROOM_ROOMY, room);
      const calmFloor =
        CALM_FLOOR_TIGHT + (CALM_FLOOR_ROOMY - CALM_FLOOR_TIGHT) * roomy;
      pulseGain =
        PULSE_GAIN_TIGHT + (PULSE_GAIN_ROOMY - PULSE_GAIN_TIGHT) * roomy;

      // Radius to the furthest corner: the front has to reach every dot, or it
      // visibly dies before the edge of the frame.
      const maxR = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(deviceW - cx, cy),
        Math.hypot(cx, deviceH - cy),
        Math.hypot(deviceW - cx, deviceH - cy),
      );

      const n = cols * rows;
      const xs = new Float32Array(n);
      const ys = new Float32Array(n);
      const rings = new Float32Array(n);
      const calms = new Float32Array(n);
      const dist = new Float32Array(n);

      let k = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offX + c * pitch;
          const y = offY + r * pitch;

          const dx = x - cx;
          const dy = y - cy;
          const d = Math.hypot(dx, dy);
          const rr = d / maxR;

          // The vignette: rises off the origin, holds, and gives out in the
          // corners. Measured on true distance, so what the front reveals is a
          // real disc. The foot fade rides along on the same factor.
          const ring =
            smoothstep(RING_IN, RING_FULL, rr) *
            (1 - smoothstep(RIM_IN, RIM_OUT, rr)) *
            (1 - smoothstep(FOOT_IN, FOOT_OUT, y / deviceH));

          // The calm behind the type, in the copy block's OWN superelliptical
          // space rather than in true distance — the headline is far wider than
          // it is tall, and a circular quiet band would either leave the outer
          // words lit or scrub the front away above and below them.
          const ex = Math.abs(dx) / calmX;
          const ey = Math.abs(dy) / calmY;
          const er = Math.pow(
            Math.pow(ex, CALM_POWER) + Math.pow(ey, CALM_POWER),
            1 / CALM_POWER,
          );
          const calm =
            calmFloor + (1 - calmFloor) * smoothstep(CALM_IN, CALM_OUT, er);

          if (ring <= 0.002) continue; // never allocate a dot that can't be seen

          xs[k] = x;
          ys[k] = y;
          rings[k] = ring;
          calms[k] = calm;
          dist[k] = d;
          k++;
        }
      }

      lattice = {
        x: xs,
        y: ys,
        ring: rings,
        calm: calms,
        dist,
        count: k,
        maxR,
      };
    }

    /* ── Draw ─────────────────────────────────────────────────────────────── */

    function draw(elapsed: number) {
      const L = lattice;
      if (!L) return;

      ctx!.clearRect(0, 0, deviceW, deviceH);
      ctx!.fillStyle = "#ffffff";

      // Where the front has got to, and how much of it is left. It fades in off
      // the origin and out at the rim, so it neither pops into existence nor
      // slams into the edge of the frame.
      let waveR = -1;
      let waveAmp = 0;
      if (elapsed > PULSE_FIRST) {
        const t = ((elapsed - PULSE_FIRST) % PULSE_PERIOD) / PULSE_TRAVEL;
        if (t <= 1) {
          waveR = t * L.maxR * 1.08;
          waveAmp = smoothstep(0, 0.12, t) * (1 - smoothstep(0.82, 1, t));
        }
      }

      const sigma = L.maxR * PULSE_WIDTH;
      const twoSigmaSq = 2 * sigma * sigma;
      const pRadius = POINTER_RADIUS * scale;
      const pSigmaSq = 2 * pRadius * pRadius;

      const usePointer = pointerOn;

      for (let i = 0; i < L.count; i++) {
        const calm = L.calm[i];

        let wave = 0;
        if (waveAmp > 0) {
          const dr = L.dist[i] - waveR;
          wave = Math.exp(-(dr * dr) / twoSigmaSq) * waveAmp * pulseGain;
        }

        let point = 0;
        if (usePointer) {
          const dx = L.x[i] - sx;
          const dy = L.y[i] - sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < pSigmaSq * 3) {
            point = Math.exp(-d2 / pSigmaSq) * POINTER_GAIN;
          }
        }

        // Both lights pay the same calm. They used to pay different rates,
        // back when a resting lattice also had to be damped and the front
        // needed protecting from being damped twice; with the resting field
        // gone there is one debt and one rate, and the second constant was
        // just a knob with nothing left to tune.
        const energy = (wave + point) * calm;

        const alpha = L.ring[i] * energy;
        if (alpha < CULL) continue;

        // Integer size, integer origin — see the note at the top of the file.
        // The swell is therefore discrete (2→3→4 device px at 1x); the alpha
        // ramp carries the smoothness, and crisp beats smooth for a 2px square.
        // Sized on the energy the dot actually shows, so a dot the calm has
        // damped does not swell as if it were at full brightness.
        const size = dotMin + Math.round(energy * dotGain);
        const half = size >> 1;

        ctx!.globalAlpha = alpha > 1 ? 1 : alpha;
        ctx!.fillRect(L.x[i] - half, L.y[i] - half, size, size);
      }

      ctx!.globalAlpha = 1;
    }

    /* ── Loop ─────────────────────────────────────────────────────────────── */

    function tick(now: number) {
      if (!start) start = now;
      if (pointerOn) {
        sx += (px - sx) * POINTER_EASE;
        sy += (py - sy) * POINTER_EASE;
      }
      draw(now - start);
      frame = requestAnimationFrame(tick);
    }

    function play() {
      if (running || reduced.matches) return;
      running = true;
      frame = requestAnimationFrame(tick);
    }

    function pause() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    }

    /* ── Wiring ───────────────────────────────────────────────────────────── */

    function rebuild() {
      build();
      if (reduced.matches) {
        // Nothing to draw. Every dot in this design is a dot the front is
        // currently touching, so with the front removed the honest static
        // frame is an empty one — and the hero is type on the void, which is
        // what it was before this component existed.
        pause();
        ctx!.clearRect(0, 0, deviceW, deviceH);
      } else if (!running) {
        // Off-screen or paused — keep the last state truthful after a resize.
        draw(start ? performance.now() - start : 0);
      }
    }

    rebuild();

    const ro = new ResizeObserver(rebuild);
    ro.observe(host);

    // Only run while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0 },
    );
    io.observe(host);

    function onPointerMove(e: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      px = (e.clientX - rect.left) * scale;
      py = (e.clientY - rect.top) * scale;
      if (!pointerOn) {
        // Land the light where the cursor entered instead of flying to it.
        sx = px;
        sy = py;
        pointerOn = true;
      }
    }

    function onPointerLeave() {
      pointerOn = false;
    }

    function onVisibility() {
      if (document.hidden) pause();
      else play();
    }

    // Fine pointers only: on touch the "cursor" would stick wherever the last
    // tap landed and leave a bright smudge in the field.
    const fine = window.matchMedia("(pointer: fine)");
    if (fine.matches) {
      host.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", rebuild);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", rebuild);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
