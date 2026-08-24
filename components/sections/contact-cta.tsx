import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { closingCta, site } from "@/lib/content";
import { MarkLockup } from "@/components/ui/mark";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";

/**
 * The closing panel — the page's brightest moment, placed exactly where the
 * click is being asked for.
 *
 * The reference builds this as a single large rounded card with light rising
 * from below the bottom edge, the brand lockup centred above the headline. The
 * light coming from *under* the card is the detail that matters: it makes the
 * panel read as sitting on a lit surface, which is a different and warmer
 * gesture than a glow behind it.
 *
 * `heading` accepts either the two-part display form (home) or a plain string
 * (the per-page variants used by /services and /about), so one component
 * serves every close on the site.
 */

type SplitHeading = { lead: string; lit: string };

export function ContactCta({
  heading = closingCta.heading,
  body = closingCta.body,
}: {
  heading?: SplitHeading | string;
  body?: string;
} = {}) {
  const split = typeof heading === "string" ? null : heading;

  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="section-y"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <div className="container-page">
        <Reveal>
          <div className="bloom bloom-b relative isolate overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-24">
            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
              <MarkLockup
                name={site.name}
                size={40}
                nameClassName="text-lg tracking-tight"
              />

              <h2 id="cta-heading" className="display display-md mt-8">
                {split ? (
                  <>
                    <span className="lead">{split.lead}</span>
                    <span className="lit">{split.lit}</span>
                  </>
                ) : (
                  <span className="lit">{heading as string}</span>
                )}
              </h2>

              <p className="mt-6 text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty sm:text-lg">
                {body}
              </p>

              <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
                <Link
                  href={closingCta.button.href}
                  className={buttonVariants({ size: "lg" })}
                >
                  {closingCta.button.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>

                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  <Mail className="size-4" aria-hidden />
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
