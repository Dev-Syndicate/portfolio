import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";

/**
 * Interior-page header.
 *
 * The home hero opens on a horizon — a light source below the fold throwing an
 * arc up into the frame. An interior page shouldn't repeat that: it is a
 * chapter, not the cover. So the light here arrives from *above* instead, as a
 * soft dome pressing down onto the title. Same source, same palette, opposite
 * direction — which reads as a deliberate variation rather than a weaker copy.
 *
 * Now a server component. The old one was `"use client"` for scroll-linked
 * parallax on every interior page; the entrance is CSS-only staggered
 * `rise-in`, so five pages stopped shipping a motion bundle for their header.
 *
 * `title` takes the same two-part shape as the home headline — a muted lead and
 * a lit payoff — or a plain string when the page's title doesn't split well.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  align = "center",
  children,
}: {
  eyebrow: string;
  title: { lead: string; lit: string } | string;
  intro: string;
  /** Centre for narrative pages; start when a page's content is a left-locked list. */
  align?: "center" | "start";
  children?: ReactNode;
}) {
  const split = typeof title === "string" ? null : title;
  const centred = align === "center";

  return (
    <section className="relative isolate overflow-hidden">
      {/* The dome. Wider than the viewport and pulled above the top edge, so
          only its lower falloff lands on the type. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={cn(
            "animate-bloom-breathe absolute -top-[26rem] h-[44rem] w-[80rem] max-w-[160vw] rounded-[50%]",
            "bg-[radial-gradient(closest-side,var(--bloom-core),var(--bloom-mid)_38%,var(--bloom-none)_70%)]",
            "opacity-55 blur-2xl",
            centred ? "left-1/2 -translate-x-1/2" : "-left-40",
          )}
        />
        {/* Pulls the frame edges back to true black so the dome has somewhere
            dark to fall off into. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_30%,var(--background)_82%)]" />
      </div>

      <div className="container-page">
        <div
          className={cn(
            "flex flex-col gap-6 pt-32 pb-14 sm:pt-40 sm:pb-20",
            centred ? "items-center text-center" : "items-start",
          )}
        >
          <div
            className="animate-rise-in"
            style={{ "--rise-delay": "80ms" } as React.CSSProperties}
          >
            <Chip>{eyebrow}</Chip>
          </div>

          <h1
            className={cn(
              "display display-lg animate-rise-in max-w-4xl",
              !centred && "text-balance",
            )}
            style={{ "--rise-delay": "180ms" } as React.CSSProperties}
          >
            {split ? (
              <>
                <span className="lead">{split.lead}</span>
                <span className="lit">{split.lit}</span>
              </>
            ) : (
              <span className="lit">{title as string}</span>
            )}
          </h1>

          <p
            className="animate-rise-in max-w-2xl text-[1.0625rem] leading-[1.75] text-muted-foreground text-pretty sm:text-lg"
            style={{ "--rise-delay": "300ms" } as React.CSSProperties}
          >
            {intro}
          </p>

          {children ? (
            <div
              className="animate-rise-in mt-2"
              style={{ "--rise-delay": "420ms" } as React.CSSProperties}
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>

      <div className="container-page">
        <div className="rule-fade" />
      </div>
    </section>
  );
}
