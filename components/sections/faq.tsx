import { Plus } from "lucide-react";

import { faq } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CircuitField } from "@/components/artwork/circuit-field";

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
    <Section
      id="faq"
      tone="sky"
      aria-labelledby="faq-heading"
      field={<CircuitField id="faq-board" variant="band" />}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SectionHeader
        id="faq-heading"
        eyebrow="FAQ"
        heading={faq.heading}
        intro={faq.intro}
      />

      {/* One bordered panel; items share dividers rather than floating apart.
          Native <details> keeps it keyboard/SR-accessible with zero JS. */}
      <Reveal className="mt-9 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--elevation-1)] divide-y divide-border">
        {faq.items.map((item, i) => (
          <details
            key={item.q}
            className="group [&[open]]:bg-surface-subtle/60"
          >
            {/* The disclosure marker is hidden globally in the base layer's
                NATIVE CONTROLS block (Firefox + Safari), so it isn't repeated
                here. */}
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 text-left font-medium transition-colors hover:text-primary sm:p-6">
              {/* Mono index — FAQ questions are enumerable, so this is honest
                  structure, and it anchors the answer's left padding below. */}
              <span className="font-mono text-[0.75rem] tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item.q}</span>
              {/* Bordered square reads as a control, matching the site's
                  mono-square idiom; Plus rotates to × on open. */}
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors group-open:text-primary">
                <Plus
                  aria-hidden
                  className="size-4 transition-transform duration-[var(--duration-base)] ease-out-soft group-open:rotate-45"
                />
              </span>
            </summary>
            {/* Left padding aligns the answer under the question, past the index. */}
            <div className="px-5 pb-5 pl-[3.75rem] sm:px-6 sm:pb-6 sm:pl-[4.25rem]">
              <p className="max-w-2xl leading-relaxed text-brand-100/90">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
