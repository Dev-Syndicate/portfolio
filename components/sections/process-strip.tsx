import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { process } from "@/lib/content";
import { Chip } from "@/components/ui/chip";
import { Bloom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";

/**
 * Process — the two-panel module from the reference: a narrow card carrying a
 * heading and the call to action, beside a wide card split into a description
 * and a checklist.
 *
 * The stages themselves are numbered rather than iconed. Numbers are the right
 * device here because the sequence is the content — you cannot do Verify before
 * Build — and an icon set would imply five parallel options instead of one
 * ordered path.
 */
export function ProcessStrip() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="section-y relative isolate"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <Chip>{process.strip.eyebrow}</Chip>
          <h2 id="process-heading" className="display display-lg lit">
            {process.strip.heading}
          </h2>
          <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty sm:text-lg">
            {process.strip.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* ── Left: the invitation ───────────────────────────────────── */}
          <Reveal className="lg:col-span-4">
            <Bloom from="tl" soft={false} className="h-full p-8 sm:p-9">
              <h3 className="text-2xl font-medium tracking-tight text-balance">
                Know where the project stands, always.
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-[1.7] text-muted-foreground">
                No status-update theatre and no black box. A live URL, a shared
                target, and work you can look at whenever you want to.
              </p>

              <Link
                href={process.strip.cta.href}
                className={buttonVariants({
                  size: "lg",
                  className: "mt-auto w-full",
                })}
              >
                {process.strip.cta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Bloom>
          </Reveal>

          {/* ── Right: the stages and the commitments ──────────────────── */}
          <Reveal delay={0.08} className="lg:col-span-8">
            <Bloom from="br" className="h-full p-8 sm:p-9">
              <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
                {/* Stages — numbered, in order. */}
                <ol className="flex flex-col gap-5">
                  {process.steps.map((step, i) => (
                    <li key={step.title} className="flex items-start gap-4">
                      <span
                        aria-hidden
                        className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-hairline bg-wash font-mono text-[0.6875rem] tabular-nums text-primary"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="font-medium">{step.title}</span>
                        <span className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
                          {step.question}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>

                {/* Commitments — the reference sets a feature list here, and
                    the specificity is what makes the panel land. Divider only
                    from `sm`, where the two columns actually sit side by side. */}
                <div className="flex flex-col gap-5 sm:border-l sm:border-border sm:pl-8">
                  <h4 className="text-lg font-medium tracking-tight">
                    What you get either way
                  </h4>
                  <ul className="flex flex-col gap-3.5">
                    {process.strip.promises.map((promise) => (
                      <li
                        key={promise}
                        className="flex items-start gap-3 text-[0.9375rem] leading-[1.55] text-muted-foreground"
                      >
                        <Check
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          strokeWidth={2}
                        />
                        {promise}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Bloom>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
