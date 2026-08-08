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

      {/* One bordered panel; items share dividers rather than floating apart.
          Native <details> keeps it keyboard/SR-accessible with zero JS. */}
      <Reveal className="mt-9 overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
        {faq.items.map((item) => (
          <details
            key={item.q}
            className="group [&[open]]:bg-surface-subtle/60"
          >
            {/* The disclosure marker is hidden in the base layer's NATIVE
                CONTROLS block, for both Firefox and Safari, so it isn't
                repeated here. */}
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-left font-medium transition-colors hover:text-primary sm:p-6">
              {item.q}
              <Plus
                aria-hidden
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-base)] ease-out-soft group-open:rotate-45 group-open:text-primary"
              />
            </summary>
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
