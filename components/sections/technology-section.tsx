import { technology } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/section";
import { TechnologyTabs } from "@/components/sections/technology";

export function Technology() {
  return (
    <Section
      id="technology"
      tone="light"
      aria-labelledby="technology-heading"
    >
      <SectionHeader
        id="technology-heading"
        eyebrow="Technology"
        heading={technology.heading}
        intro={technology.intro}
      />
      <TechnologyTabs />
    </Section>
  );
}
