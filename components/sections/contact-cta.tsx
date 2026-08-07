import { ArrowRight, Mail } from "lucide-react";

import { closingCta, site } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { Pattern } from "@/components/ui/pattern";

export function ContactCta({
  heading = closingCta.heading,
  body = closingCta.body,
}: {
  heading?: string;
  body?: string;
} = {}) {
  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="section-y"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <div className="container-page">
        <Reveal>
          {/* The panel inverts to near-white against the deep navy close —
              the single highest-contrast moment on the page, placed exactly
              where we are asking for the click. */}
          <div className="tone-light relative isolate overflow-hidden rounded-3xl border border-border px-6 py-16 text-center shadow-[var(--elevation-3)] sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div
                className="absolute -top-1/2 left-1/2 size-[46rem] -translate-x-1/2 rounded-full blur-[130px] motion-safe:animate-aurora"
                style={{ background: "var(--glow-a)" }}
              />
              <div
                className="absolute -right-24 -bottom-1/2 size-[34rem] rounded-full blur-[130px] motion-safe:animate-aurora"
                style={{ background: "var(--glow-b)", animationDelay: "-18s" }}
              />
            </div>
            <Pattern variant="waves" tone="text-accent/[0.18]" />

            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2
                id="cta-heading"
                className="text-[clamp(1.875rem,4vw,3rem)] leading-[1.06] font-semibold tracking-[-0.03em]"
              >
                {heading}
              </h2>
              <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground sm:text-lg">
                {body}
              </p>

              <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                <Magnetic>
                  <Button href={closingCta.button.href} size="lg">
                    {closingCta.button.label}
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                </Magnetic>
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
