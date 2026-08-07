"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

import { technology } from "@/lib/content";
import { cn } from "@/lib/utils";
import { IconTile, type IconName } from "@/components/ui/icon";

const groups = technology.groups;

/** How long each group holds before the next one takes over. */
const DWELL_MS = 5200;

/**
 * Auto-advancing technology showcase.
 *
 * The visitor should not have to click to discover what we do — the section
 * plays itself, and each group gets its moment without being asked for.
 *
 * It still stops on hover and on keyboard focus. That is not just courtesy:
 * WCAG 2.2.2 requires any auto-updating content to be pausable, and content
 * that slides away mid-sentence is the fastest way to lose a reader. The
 * indicators stay operable for anyone who wants to jump ahead, and a manual
 * pick ends the rotation for good rather than yanking the panel away a few
 * seconds later.
 */
export function TechnologyTabs() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPicked, setUserPicked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  // Off-screen rotation would burn cycles and desync the progress bar from
  // what the visitor actually sees when they arrive.
  const inView = useInView(containerRef, { margin: "-15% 0px -15% 0px" });
  const reduceMotion = useReducedMotion();

  const running = inView && !paused && !userPicked && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setActive((i) => (i + 1) % groups.length),
      DWELL_MS,
    );
    return () => clearTimeout(timer);
  }, [running, active]);

  const pick = useCallback((index: number) => {
    setActive(index);
    setUserPicked(true);
  }, []);

  const current = groups[active];

  return (
    <>
      {/* Mobile: no tabs, no rotation. Every group is a full card — title,
          stack, and business impact all visible — so nothing hides behind a
          sideways swipe or slides away mid-read. The tabbed auto-showcase below
          is a lg-and-up experience where the horizontal space earns it. */}
      <div className="mt-10 flex flex-col gap-4 lg:hidden">
        {groups.map((group) => (
          <div key={group.id} className="surface-card flex flex-col gap-5 p-6">
            <span aria-hidden className="card-node" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <IconTile name={group.icon as IconName} className="size-10" />
                <h3 className="text-xl font-semibold">{group.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {group.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-[0.8125rem] font-medium text-secondary-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 border-t border-border pt-5">
              <h4 className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                Business impact
              </h4>
              <p className="text-[0.9375rem] leading-[1.7] text-muted-foreground">
                {group.impact}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* lg+: the auto-advancing tabbed showcase. */}
      <div
        ref={containerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="mt-14 hidden gap-8 lg:grid lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-12"
      >
        <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {groups.map((group, i) => {
            const selected = i === active;
            return (
              <li key={group.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-left",
                    "transition-colors duration-[var(--duration-base)] ease-out-soft",
                    selected
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="tech-tab-active"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-xl border border-border bg-card shadow-[var(--elevation-1)]"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 34,
                      }}
                    />
                  ) : null}

                  <IconTile
                    name={group.icon as IconName}
                    className={cn(
                      "size-9 rounded-lg",
                      selected && "bg-primary text-primary-foreground",
                    )}
                  />
                  <span className="text-[0.9375rem] font-medium whitespace-nowrap">
                    {group.title}
                  </span>

                  {/* Dwell timer. Keyed on `active` so it restarts cleanly each
                    time this item comes back around. */}
                  {selected && running ? (
                    <motion.span
                      key={active}
                      aria-hidden
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: DWELL_MS / 1000, ease: "linear" }}
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-primary to-accent"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {/* The panel is a live region so the rotation is announced rather than
          changing silently under a screen reader. */}
        <div aria-live="polite" aria-atomic="false">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="surface-card flex flex-col gap-6 p-7 sm:p-9"
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-semibold">{current.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {current.stack.map((tech, i) => (
                    <motion.li
                      key={tech}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.1 + i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-[0.8125rem] font-medium text-secondary-foreground"
                    >
                      {tech}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-6">
                <h4 className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                  Business impact
                </h4>
                <p className="text-base leading-[1.75] text-muted-foreground">
                  {current.impact}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
