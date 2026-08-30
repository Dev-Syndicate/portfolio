"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Bloom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";

/**
 * What we build — the six layers, as a stack you can move through.
 *
 * The previous version listed all six statically. It was legible but inert, and
 * it printed every layer's audience line at once, which is six competing
 * sentences on one screen. This shows the index whole and one layer at a time in
 * full, so the depth ordering stays visible while the detail gets room.
 *
 * THE ONE MOVING THING IS A LIGHT DESCENDING THE STACK. A rule runs down the
 * index and a lit marker slides along it to whichever layer is open, carried by
 * a shared-element animation rather than by fading two bars in and out — so the
 * eye tracks a single object moving through the layers, which is precisely what
 * "every layer of your business" describes. Everything else on the panel
 * cross-fades quietly underneath it.
 *
 * It advances on its own because a section about layers should show you that
 * there are more than the one you are looking at. That is also the part with
 * accessibility obligations attached, so:
 *
 *   - it stops on hover, on focus, and while the section is off screen;
 *   - it never starts at all under `prefers-reduced-motion`, which lands on
 *     layer 01 and waits to be driven;
 *   - the dwell bar under the open row shows that a change is coming, rather
 *     than the layout silently swapping under a reader;
 *   - and every layer is reachable without waiting, by pointer or by keyboard.
 *
 * The rows are TABS, not links — arrow keys move between them, and the link out
 * to the full detail lives once, in the panel. Making each row a link that also
 * changes a panel would leave a keyboard user unable to read layer 04 without
 * navigating away from the page.
 */

/** Dwell per layer. Under five seconds so it never feels stalled. */
const DWELL = 4500;

export function ServicesOverview() {
  const items = services.items;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();

  const playing = inView && !hovering && !focused && !reduceMotion;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % items.length),
      DWELL,
    );
    return () => window.clearInterval(id);
  }, [playing, items.length]);

  /* Arrow keys move between layers and take the selection with them, which is
     what a tablist is expected to do. Home/End jump to the outermost and
     innermost layer — meaningful here, since the list is ordered by depth. */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const last = items.length - 1;
      let next: number | null = null;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        next = active === last ? 0 : active + 1;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        next = active === 0 ? last : active - 1;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = last;
      }

      if (next === null) return;
      event.preventDefault();
      setActive(next);
      listRef.current
        ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
        [next]?.focus();
    },
    [active, items.length],
  );

  const current = items[active];

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="section-y relative isolate"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <div className="container-page">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <h2
            id="services-heading"
            className="display text-[clamp(1.6rem,7.4vw,4.5rem)]"
          >
            {services.overview.heading}
          </h2>
          <p className="max-w-2xl text-[1.0625rem] leading-[1.75] text-balance text-muted-foreground sm:text-lg">
            {services.overview.intro}
          </p>
        </Reveal>

        <Reveal className="mt-14 lg:mt-20">
          <div
            className="grid gap-6 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] lg:gap-12"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={() => setFocused(false)}
          >
            {/* ── The index ──────────────────────────────────────────────── */}
            <div
              ref={listRef}
              role="tablist"
              aria-orientation="vertical"
              aria-label="What we build"
              onKeyDown={onKeyDown}
              className="relative flex flex-col"
            >
              {/* The rule the light travels down. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-px bg-border/70"
              />

              {items.map((service, i) => {
                const isActive = i === active;

                return (
                  <button
                    key={service.slug}
                    type="button"
                    role="tab"
                    id={`svc-tab-${service.slug}`}
                    aria-selected={isActive}
                    aria-controls={`svc-panel-${service.slug}`}
                    /* Roving tabindex: one stop for the whole list, then arrow
                       keys inside it. Six tab stops for six related choices is
                       exactly the pattern this avoids. */
                    tabIndex={isActive ? 0 : -1}
                    /* Click and keyboard select; HOVER DELIBERATELY DOES NOT.
                       Hover-to-select is tempting on a strip like this and it
                       was the first thing tried here, but it puts three inputs
                       — the timer, the pointer, and the arrow keys — in a fight
                       over one piece of state. A cursor left resting anywhere
                       over the list re-fires `mouseenter` on every re-render and
                       drags the selection back, so arrow keys stop working; and
                       sweeping the mouse across on the way to something else
                       rattles the panel through four layers. Hovering pauses,
                       which is the useful half of the idea, and leaves the panel
                       on whatever the reader was actually reading. */
                    onClick={() => setActive(i)}
                    className={cn(
                      "group/tab relative flex w-full cursor-pointer items-baseline gap-4 py-4 pr-3 pl-6 text-left transition-colors duration-[var(--duration-base)] sm:gap-5 sm:py-5",
                      "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="svc-marker"
                        aria-hidden
                        className="absolute top-0 bottom-0 -left-px w-px bg-primary"
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 340, damping: 34 }
                        }
                      />
                    ) : null}

                    <span className="font-mono text-xs tabular-nums tracking-[0.14em]">
                      {service.n}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-medium tracking-tight sm:text-xl">
                        {service.name}
                      </span>

                      {/* The dwell bar. It only exists on the open row and only
                          while something is actually counting down — a progress
                          bar that is not progressing is a lie about state. */}
                      {isActive && playing ? (
                        <motion.span
                          key={active}
                          aria-hidden
                          className="mt-2.5 block h-px origin-left bg-primary/50"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: DWELL / 1000, ease: "linear" }}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── The open layer ─────────────────────────────────────────── */}
            <Bloom from="tr" soft={false} className="min-h-[24rem]">
              {/* The tabpanel element is PERSISTENT and only its contents
                  cross-fade. With `role="tabpanel"` on the animated child,
                  `mode="wait"` unmounts the old panel before mounting the new
                  one, so for the ~320ms of the swap the `aria-controls` on the
                  selected tab points at an id that is not in the document.
                  Keeping the panel and animating inside it closes that gap. */}
              <div
                role="tabpanel"
                id={`svc-panel-${current.slug}`}
                aria-labelledby={`svc-tab-${current.slug}`}
                tabIndex={0}
                className="flex h-full flex-col p-8 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring sm:p-10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.slug}
                    className="flex h-full flex-col"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.32,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <h3 className="text-[1.5rem] leading-tight font-medium tracking-tight text-balance sm:text-[1.75rem]">
                      {current.title}
                    </h3>

                    <p className="mt-3 text-[1.0625rem] leading-[1.6] text-foreground text-pretty">
                      {current.audience}
                    </p>

                    <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted-foreground text-pretty">
                      {current.body}
                    </p>

                    {/* The scope, whole. This is the section's real payload —
                        "Integrations" means nothing until you can see that it
                        covers payment gateways and webhooks. */}
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {current.includes.map((item) => (
                        <li key={item} className="chip chip-plain">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services#${current.slug}`}
                      className="group/link mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      What {current.name} involves
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:group-hover/link:translate-x-0 motion-reduce:group-hover/link:translate-y-0"
                      />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Bloom>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
