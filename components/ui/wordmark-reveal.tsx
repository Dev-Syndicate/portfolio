"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The wordmark, rising letter by letter out of a mask the first time it is
 * scrolled to.
 *
 * WHY NOT `<Reveal>`. Everything else in the footer enters on the shared
 * fade-and-slide, and the obvious move was to wrap this in the same component.
 * At this scale it does not read: the mark is ~250px tall, and sliding a block
 * that size by 24px is a movement of a tenth of its own height — invisible as
 * an entrance, and on a full-bleed element it reads as the page jolting rather
 * than as something arriving. The distance has to be proportional to the thing
 * moving, which for a letter means its own height.
 *
 * So each letter gets its own overflow-hidden box and starts fully below it,
 * then rises into place on a left-to-right stagger. Same easing and roughly the
 * same duration as `Reveal`, so it belongs to the footer's one entrance rather
 * than being a second, unrelated effect.
 *
 * SPLITTING THE STRING HAS A TYPOGRAPHIC COST worth stating: inline-block
 * letters kern against nothing, so pairs the face would normally tighten (VS,
 * AT, TE in this string) sit at their default advance and the word runs wider
 * than the same text set as one run. `--wordmark-size` is measured against THIS
 * markup for that reason — see the note in globals.css.
 *
 * THE TRIGGER LIVES ON THE PARENT, AND IT HAS TO. The obvious build puts
 * `whileInView` on each letter, and it deadlocks: a letter starts translated
 * fully below its own `overflow: hidden` mask, an IntersectionObserver's
 * intersection rect is clipped by every ancestor's overflow, so the observer
 * measures zero visible area, decides the letter is not in view, and never
 * fires the animation that would bring it into view. The mark stays invisible
 * forever, and nothing errors. So the observed element is the unclipped
 * container, and it hands the state down through variants.
 *
 * REDUCED MOTION IS HANDLED IN THE TRANSITION, NOT THE MARKUP, for exactly the
 * reason documented at length on `Reveal`: `useReducedMotion()` cannot know the
 * setting on the server, so branching the returned elements on it ships one
 * tree from the server and a different one from the client, React declines to
 * patch up the mismatch, and whatever the server said wins — which for an
 * entrance animation means the content can stay hidden forever. Only the
 * `transition` objects vary here, and a transition is never serialised into
 * HTML.
 */
export function WordmarkReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  // `Array.from` rather than `.split("")` so a surrogate pair is one letter and
  // not two broken halves. The current string is ASCII, but the value comes
  // from `site.name` and a rename should not be able to mangle it.
  const letters = Array.from(text);

  return (
    <motion.span
      className={className}
      // Named states, not inline objects — the letters are clipped and cannot
      // observe themselves, so the container observes and they follow it.
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: {},
        shown: {
          transition: {
            // 12 letters at 40ms is a ~480ms sweep — long enough to read as
            // left-to-right, short enough that the last letter is not still
            // arriving after the eye has moved on.
            staggerChildren: reduceMotion ? 0 : 0.04,
          },
        },
      }}
    >
      {letters.map((letter, i) => (
        <span key={`${letter}-${i}`} className="wordmark-letter">
          <motion.span
            // Constant across server and client. Anything varying here lands in
            // the HTML and reintroduces the mismatch described above.
            variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
            }
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
