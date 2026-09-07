"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The one IntersectionObserver behind every `[data-reveal]` on the public site.
 *
 * Mounted once in app/(site)/layout.tsx. It renders nothing — it exists so that
 * `Reveal` and every hand-tagged text block can stay SERVER components: they
 * emit an attribute, this watches for it, and the animation itself is a CSS
 * transition (see the SCROLL REVEAL block in globals.css).
 *
 * A single observer with many targets is the whole point. IntersectionObserver
 * is built to watch an arbitrary number of elements from one instance, and the
 * cost is per-instance far more than per-target, so this scales to the several
 * hundred text blocks on the site in a way that one observer per element does
 * not.
 *
 * Targets are unobserved the moment they reveal. The reveal is once-only —
 * text that re-animates every time it re-enters the viewport turns a scroll
 * back up the page into a light show, and makes the content feel unstable.
 */

/** Elements this far into the viewport start their reveal. */
const ROOT_MARGIN = "0px 0px -10% 0px";

/** Cap on the auto stagger, so a 30-item list doesn't finish two seconds late. */
const MAX_STAGGER_INDEX = 6;

/**
 * Content that should reveal but has no markup to tag.
 *
 * An article body is rendered from Markdown by react-markdown, so there is no
 * JSX to put `data-reveal` on — the alternative would be a rehype plugin that
 * rewrites every node just to add an attribute. These get adopted at scan time
 * instead: top-level children only, so a paragraph reveals as a paragraph and
 * not once per link inside it.
 */
const ADOPT = ".prose-blog > *";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );

    /**
     * Give an element its place in its group's stagger.
     *
     * The group is simply "the other revealing elements under the same parent",
     * which needs no extra markup and matches how the content is already
     * written: a section header's three parts share a wrapper, a grid's cards
     * share the grid. Elements that authored their own `--reveal-delay` are
     * left alone — an explicit order always beats an inferred one.
     */
    const assignStagger = (el: HTMLElement) => {
      if (el.dataset.revealDelay !== undefined) return;
      if (el.style.getPropertyValue("--reveal-i")) return;

      const parent = el.parentElement;
      if (!parent) return;

      const siblings = Array.from(parent.children).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement && child.dataset.reveal !== undefined,
      );
      // A lone element is not a group, and staggering it by its index would
      // just delay it for no reason.
      if (siblings.length < 2) return;

      const index = Math.min(siblings.indexOf(el), MAX_STAGGER_INDEX);
      el.style.setProperty("--reveal-i", String(index));
    };

    const scan = () => {
      // Adopt first, so the tagged pass below picks these up in the same sweep.
      for (const el of document.querySelectorAll<HTMLElement>(ADOPT)) {
        if (el.dataset.reveal !== undefined) continue;
        el.dataset.reveal = "";
        // Pinned to 0 so these never take part in the sibling stagger. A
        // stagger is for a group that enters TOGETHER — a section header's
        // three lines, a row of cards. An article's paragraphs are siblings
        // but arrive one at a time, minutes apart, so an inherited index would
        // just hang a fixed delay on every paragraph from the seventh down and
        // read as lag rather than as rhythm.
        el.style.setProperty("--reveal-i", "0");
      }

      const targets = document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not(.is-revealed)",
      );
      for (const el of targets) {
        assignStagger(el);
        observer.observe(el);
      }
    };

    scan();

    // Content that arrives after the first paint — a streamed segment, a list
    // that grew — still has to be picked up, or it stays invisible forever.
    // Re-observing an element already being watched is a no-op, so a broad
    // re-scan is both correct and cheap.
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
    // Re-run on navigation: a client-side route change swaps the tree, and the
    // observers above were watching elements that no longer exist.
  }, [pathname]);

  return null;
}
