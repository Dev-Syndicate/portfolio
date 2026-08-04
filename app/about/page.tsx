import type { Metadata } from "next";

import { brandVoice, closingCta, site } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { WhyUs } from "@/components/sections/why-us";
import { ContactCta } from "@/components/sections/contact-cta";
import { WaveDivider, ZONE } from "@/components/ui/wave-divider";
import { PrincipleOrbit } from "@/components/artwork/principle-orbit";

export const metadata: Metadata = {
  title: "About",
  description: site.promise,
};

const principles = [
  {
    title: "Clarity before creativity",
    body: "A clever interface that nobody understands is a failed interface. We earn the flourishes by getting the fundamentals right first.",
  },
  {
    title: "Motion with purpose",
    body: "Animation exists to explain a relationship, direct attention, or soften a transition. Anything that fails that test gets cut.",
  },
  {
    title: "Performance first",
    body: "Speed is a feature your visitors feel before they can name it. We hold every page to a budget and measure it before launch.",
  },
  {
    title: "Every section earns its place",
    body: "Each part of a page should answer a question a visitor is actually asking. If it doesn't, it is decoration taking up scroll.",
  },
  {
    title: "Technology framed as outcomes",
    body: "You should not need to know what a framework is to understand what we built you or why it was the right call.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A small team that treats your website as business infrastructure."
        intro={site.promise}
        visual={<PrincipleOrbit />}
      />

      <Section
        aria-labelledby="principles-heading"
        pattern="waves"
        patternTone="text-primary/[0.07]"
      >
        <SectionHeader
          id="principles-heading"
          eyebrow="Principles"
          heading="How We Make Decisions"
          intro="Five rules that settle most arguments before they start."
          align="start"
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, i) => (
            <Reveal as="li" key={principle.title} delay={i * 0.06}>
              <Card className="flex h-full flex-col gap-3 p-7">
                <span
                  aria-hidden
                  className="text-sm font-semibold tabular-nums text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold">{principle.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface-subtle p-6">
            <span className="text-sm font-medium text-muted-foreground">
              How we sound:
            </span>
            {brandVoice.map((word) => (
              <span
                key={word}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Process is not repeated here — /services carries it in full. */}
      <WaveDivider from={ZONE.deep} to={ZONE.surface} flip />
      <WhyUs />

      <WaveDivider from={ZONE.surface} to={ZONE.deep} />
      <ContactCta
        heading={closingCta.variants.about.heading}
        body={closingCta.variants.about.body}
      />
    </>
  );
}
