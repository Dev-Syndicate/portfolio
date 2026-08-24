import { Plus } from "lucide-react";

import { faq } from "@/lib/content";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";

/**
 * FAQ — separated rows rather than one divided panel.
 *
 * The reference gives each question its own rounded card with a gap between
 * them, numbers them, and puts a +/− at the right edge. Splitting the rows
 * apart is what lets an open row visibly lift out of the stack, which a shared
 * divided panel can't do.
 *
 * Still a native `<details>`/`<summary>`: keyboard and screen-reader behaviour
 * comes free, it works before hydration, and there is no open/closed state for
 * JavaScript to get wrong. The first row is open by default so the section
 * never reads as a wall of closed bars.
 */
export function Faq() {
  // FAQPage structured data — part of the "SEO-ready foundations" claim.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="section-y relative isolate"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <Chip>{faq.eyebrow}</Chip>
          <h2 id="faq-heading" className="display display-lg lit">
            {faq.heading}
          </h2>
          <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty sm:text-lg">
            {faq.intro}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-2.5">
          {faq.items.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 0.05}>
              <details
                open={i === 0}
                className={[
                  "group rounded-2xl border border-border bg-card",
                  "transition-[border-color,background-color] duration-[var(--duration-base)] ease-out-soft",
                  "hover:border-border-strong",
                  "open:border-border-strong open:bg-[color-mix(in_oklab,var(--card)_84%,var(--ref-sky))]",
                ].join(" ")}
              >
                {/* The native marker is hidden globally in the base layer's
                    NATIVE CONTROLS block, so it isn't repeated here. */}
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 text-left sm:gap-5 sm:p-6">
                  <span
                    aria-hidden
                    className="font-mono text-xs tabular-nums text-muted-foreground transition-colors group-open:text-primary"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 text-[1.0625rem] font-medium tracking-tight text-pretty">
                    {item.q}
                  </span>

                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-hairline bg-wash text-muted-foreground transition-colors group-open:text-primary">
                    <Plus
                      aria-hidden
                      className="size-4 transition-transform duration-[var(--duration-base)] ease-out-soft group-open:rotate-45"
                    />
                  </span>
                </summary>

                {/* Answer indented to sit under the question, clear of the
                    number column. */}
                <div className="px-5 pb-6 pl-[3.25rem] sm:px-6 sm:pb-7 sm:pl-[4rem]">
                  <p className="max-w-2xl text-[0.9375rem] leading-[1.75] text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
