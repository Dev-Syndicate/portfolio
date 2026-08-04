import { Plus } from "lucide-react";

import { faq } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

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
      pattern="waves"
      patternTone="text-accent/[0.16]"
      aria-labelledby="faq-heading"
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

      {/* Native <details> keeps this keyboard- and screen-reader-accessible
          with zero JavaScript. */}
      <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-3">
        {faq.items.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.05}>
            <details className="group surface-card overflow-hidden [&[open]]:border-border-strong">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left font-medium transition-colors hover:text-primary sm:p-6 [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  aria-hidden
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-base)] ease-out-soft group-open:rotate-45 group-open:text-primary"
                />
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="border-t border-border pt-4 leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
