"use client";

import { motion, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The hero's visual anchor.
 *
 * For a studio without a public portfolio yet, the honest proof of craft is
 * the craft itself — so this is a rendition of the work rather than a chart
 * of numbers we cannot substantiate. Deliberately no metrics, logos, or
 * result claims appear here.
 *
 * Built from real elements rather than a flat image so it re-skins with the
 * palette, stays crisp at any density, and ships no image weight.
 */
export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    // The padding is load-bearing: the phone and the floating labels are
    // absolutely positioned into it, so the whole composition stays within
    // its own box. Positioning them outside looked better until a narrow
    // viewport clipped their edges off.
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[25rem] px-2 pt-7 pb-16 select-none sm:px-4 lg:mx-0 lg:max-w-none"
    >
      {/* Light pooled behind the composition so it reads as lit, not pasted */}
      <div
        className="absolute inset-x-6 top-12 bottom-24 -z-10 rounded-[3rem] blur-[80px]"
        style={{ background: "var(--glow-a)" }}
      />

      {/* Desktop frame */}
      <motion.div
        {...enter(0.3)}
        className="glass overflow-hidden rounded-xl"
        style={{ transform: "perspective(1400px) rotateY(-7deg) rotateX(3deg)" }}
      >
        <BrowserChrome />
        <SitePreview />
      </motion.div>

      {/* Phone frame, overlapping the desktop's lower-left corner. The overlap
          is what creates depth — two separated rectangles would read flat. */}
      <motion.div
        {...enter(0.55)}
        className="glass absolute bottom-2 left-0 w-[7rem] overflow-hidden rounded-[1.25rem] p-1.5 sm:w-32"
        style={{ transform: "perspective(1000px) rotateY(9deg) rotateX(2deg)" }}
      >
        <div className="overflow-hidden rounded-[0.9rem] bg-background/60">
          <div className="flex justify-center py-1.5">
            <span className="h-1 w-8 rounded-full bg-foreground/15" />
          </div>
          <PhonePreview />
        </div>
      </motion.div>

      {/* Capability tags. Each names something in the stated stack — no
          performance or outcome claims. */}
      <motion.div
        {...enter(0.8)}
        className="glass absolute top-0 right-3 flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap sm:right-6"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
        Responsive by default
      </motion.div>

      <motion.div
        {...enter(0.95)}
        className="glass absolute right-0 bottom-8 flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap sm:right-2"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-accent" />
        Accessible &amp; SEO-ready
      </motion.div>
    </div>
  );
}

function BrowserChrome() {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-3.5 py-2.5">
      <div className="flex gap-1.5">
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
      </div>
      <div className="flex flex-1 items-center gap-1.5 rounded-md bg-foreground/[0.05] px-2 py-1 text-[0.625rem] text-muted-foreground">
        <Lock className="size-2.5" strokeWidth={2.5} />
        yourbusiness.com
      </div>
    </div>
  );
}

/** An abstracted page layout — the shape of good work, not a fake screenshot. */
function SitePreview() {
  return (
    <div className="flex flex-col gap-3.5 bg-background/40 p-4">
      {/* Nav row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-3.5 rounded bg-primary" />
          <Bar className="w-10" />
        </div>
        <div className="flex gap-2">
          <Bar className="w-6" tone="faint" />
          <Bar className="w-6" tone="faint" />
          <Bar className="w-6" tone="faint" />
        </div>
        <span className="h-4 w-12 rounded-full bg-primary/80" />
      </div>

      {/* Hero band */}
      <div className="flex flex-col gap-2 pt-2">
        <Bar className="h-2.5 w-4/5" tone="strong" />
        <Bar className="h-2.5 w-3/5" tone="strong" />
        <div className="flex flex-col gap-1.5 pt-1">
          <Bar className="w-full" tone="faint" />
          <Bar className="w-5/6" tone="faint" />
        </div>
        <div className="flex gap-2 pt-1.5">
          <span className="h-5 w-16 rounded-full bg-primary" />
          <span className="h-5 w-14 rounded-full border border-border" />
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-card/50 p-2"
          >
            <span
              className={cn(
                "size-4 rounded",
                i === 0 ? "bg-primary/70" : "bg-accent/50",
              )}
            />
            <Bar className="w-full" />
            <Bar className="w-2/3" tone="faint" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="flex flex-col gap-2 p-2.5">
      <div className="flex items-center justify-between">
        <span className="size-2.5 rounded bg-primary" />
        <div className="flex flex-col gap-[3px]">
          <span className="h-[2px] w-3 rounded-full bg-foreground/25" />
          <span className="h-[2px] w-3 rounded-full bg-foreground/25" />
        </div>
      </div>
      <Bar className="h-2 w-full" tone="strong" />
      <Bar className="h-2 w-2/3" tone="strong" />
      <Bar className="w-full" tone="faint" />
      <span className="mt-0.5 h-4 w-full rounded-full bg-primary" />
      <div className="flex flex-col gap-1.5 pt-1">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-md border border-border/70 bg-card/50 p-1.5"
          >
            <Bar className="w-3/4" />
            <Bar className="w-1/2" tone="faint" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Placeholder text run inside the mockups. */
function Bar({
  className,
  tone = "base",
}: {
  className?: string;
  tone?: "strong" | "base" | "faint";
}) {
  return (
    <span
      className={cn(
        "block h-1.5 rounded-full",
        tone === "strong" && "bg-foreground/45",
        tone === "base" && "bg-foreground/20",
        tone === "faint" && "bg-foreground/10",
        className,
      )}
    />
  );
}
