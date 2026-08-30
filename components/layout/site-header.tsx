"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Menu, X } from "lucide-react";

import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Mark } from "@/components/ui/mark";

/**
 * The header is a piece of glass lying ON the hero, not a bar drawn over it.
 *
 * That is the whole idea, and it is only available to this site because of what
 * is underneath: the hero's signal field (components/artwork/signal-field.tsx)
 * sends a wavefront out through a dot lattice every few seconds. A full-bleed
 * bar would cover the top of that and cut the field in half. A detached capsule
 * with a backdrop blur instead SMEARS the lattice as the front travels beneath
 * it — so the nav reads as an object resting on the artwork, and the artwork
 * goes on existing behind it.
 *
 * The capsule itself is `.capsule` + `.capsule-bar` in globals.css, which was
 * written for exactly this ("a dark glass pill that sits ON the halftone rather
 * than beside it") and had, until now, no caller.
 *
 * The bar is pinned and never retreats. It used to slide away while you
 * scrolled down and return when you scrolled up, which is a reasonable trick
 * for a full-bleed bar eating the top of a tall page — but this one is a small
 * detached object that covers almost nothing, so hiding it bought no reading
 * room and cost a control that was, a moment earlier, right there.
 *
 * Scroll changes exactly one thing: the glass thickens. Over the hero it stays
 * thin and lets the signal through; over ordinary content it fills in so the
 * links keep their contrast. Everything else about the bar is deliberately
 * quiet — no new colour, no second typeface, no ornament. The glass is the one
 * bold move.
 *
 * Gone from the old header: the reading-progress hairline that ran underneath
 * it. Its own comment conceded the scrollbar already conveys that natively,
 * articles carry a real one (components/blog/reading-progress.tsx), and a
 * gradient progress line is the single most templated element on the web. A
 * detached capsule also has no full-width edge to hang it from.
 */

/** Distance scrolled before the glass thickens. */
const DENSE_AFTER = 24;

/**
 * "Contact" is deliberately absent from the bar's links: the action beside them
 * already goes there, and two controls to one destination in one bar is just
 * noise. `nav` itself is untouched, so the footer and sitemap still carry it.
 */
const BAR_LINKS = nav.filter((item) => item.href !== "/contact");

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [dense, setDense] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation. Adjusting state during render rather
  // than in an effect: React re-runs this component before committing, so the
  // menu never paints open on the new route. An effect would flash it.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  // The bar never leaves. The only thing scroll changes is the glass: thin over
  // the hero's field, thick over ordinary content.
  useMotionValueEvent(scrollY, "change", (current) => {
    setDense(current > DENSE_AFTER);
  });

  // Escape closes the menu; lock background scroll while it is open.
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      {/* Narrower than the page. A pill running the full 90rem reads as a bar
          with rounded ends; held in, it reads as an object sitting on top of
          the page — which is the entire point of detaching it. */}
      <div className="container-page">
        <nav
          aria-label="Main"
          className={cn(
            "capsule capsule-bar mx-auto max-w-5xl",
            "h-14 items-center justify-between pr-2 pl-2 sm:h-16 sm:pr-2.5 sm:pl-3",
            "transition-[background-color,border-color,box-shadow] duration-[var(--duration-base)] ease-out-soft",
            dense && "is-dense",
          )}
        >
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-full text-[0.9375rem] font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Mark
              size={36}
              priority
              className="transition-transform duration-[var(--duration-base)] ease-spring group-hover:scale-105 motion-reduce:group-hover:scale-100"
            />
            {/* The wordmark stays at every width. It is a real occurrence of
                the brand name in page copy, which the SEO notes in content.ts
                lean on, and it fits inside the capsule even at 360px. */}
            <span>{site.name}</span>
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {BAR_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-sm font-medium",
                      "transition-colors duration-[var(--duration-fast)]",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                    {active ? (
                      // Inside glass the old solid fill read as a second,
                      // brighter pane. A wash plus a hairline sits in the same
                      // material as the capsule instead of on top of it.
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full border border-hairline bg-wash"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden shrink-0 md:block">
            <Magnetic strength={0.25}>
              <Button href="/contact" size="sm" className="h-10 px-5">
                Start your project
              </Button>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      {/* The menu is a second pane of the same glass, floating under the first
          rather than a drawer welded to it — the capsule keeps its shape and
          the sheet keeps the language. */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="container-page mt-2 md:hidden"
          >
            <ul className="capsule capsule-sheet mx-auto max-w-5xl gap-1 p-3">
              {BAR_LINKS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-full px-4 py-3 text-base font-medium transition-colors",
                        active
                          ? "bg-wash text-foreground"
                          : "text-muted-foreground hover:bg-wash hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-1">
                <Button href="/contact" className="w-full" size="lg">
                  Start your project
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
