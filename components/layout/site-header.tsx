"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { Menu, X } from "lucide-react";

import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";

/** Distance scrolled before the bar picks up its blurred background. */
const BLUR_AFTER = 24;
/** Ignore jitter below this delta so the bar doesn't flicker. */
const HIDE_THRESHOLD = 8;

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();

  // Spring-smoothed so the bar glides instead of tracking every wheel tick.
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation. Adjusting state during render rather
  // than in an effect: React re-runs this component before committing, so the
  // menu never paints open on the new route. An effect would flash it.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  // PRD nav motion: blur on scroll, hide while scrolling down, reveal on up.
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;

    setScrolled(current > BLUR_AFTER);

    if (menuOpen || Math.abs(delta) < HIDE_THRESHOLD) return;
    setHidden(delta > 0 && current > 120);
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
    <motion.header
      animate={hidden ? "hidden" : "visible"}
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-base)] ease-out-soft",
        scrolled || menuOpen
          ? "border-b border-border/70 bg-background/70 shadow-[0_1px_0_var(--highlight)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="container-page flex h-18 items-center justify-between gap-6"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-base font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform duration-[var(--duration-base)] ease-spring group-hover:rotate-6"
          >
            <svg viewBox="0 0 24 24" className="size-4.5" fill="none">
              <path
                d="M4 7 9 12l-5 5M12 17h8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {site.name}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
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
                    "relative rounded-full px-3.5 py-2 text-sm font-medium",
                    "transition-colors duration-[var(--duration-fast)]",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Magnetic strength={0.25}>
            <Button href="/contact" size="sm">
              Start Your Project
            </Button>
          </Magnetic>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-lg text-foreground transition-colors hover:bg-secondary md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Reading-progress hairline. Decorative, so it is hidden from
          assistive tech — the scrollbar already conveys this natively. */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="h-px origin-left bg-gradient-to-r from-primary via-accent to-primary opacity-70"
      />

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Button href="/contact" className="w-full" size="lg">
                  Start Your Project
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
