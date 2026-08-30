import { closingCta } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { AboutHero } from "@/components/sections/about-hero";
import { VisionMission } from "@/components/sections/vision-mission";
import { Principles } from "@/components/sections/principles";
import { Commitments } from "@/components/sections/commitments";
import { ContactCta } from "@/components/sections/contact-cta";

const description =
  "Dev Syndicate (DS) is a software development company that builds software systems to solve operational problems for organisations — removing manual work, connecting disconnected tools, and streamlining how a business runs with software, AI, and automation.";

export const metadata = pageMetadata({
  title: "About",
  description,
  path: "/about",
  keywords: [
    "about Dev Syndicate",
    "software development company",
    "Developer Syndicate",
  ],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/about",
            name: "About — Dev Syndicate",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <AboutHero />

      {/* Straight after the hero, because "Purpose before product" is a claim
          and these two panels are the only place on the site that says what
          the purpose actually is. Everything below — the principles, the
          commitments — is how it gets kept. */}
      <VisionMission />

      <Principles />

      {/* The operational commitments in full. Home shows only their titles, as
          chips under the hero; the four values live there instead. */}
      <Commitments />

      <ContactCta
        heading={closingCta.variants.about.heading}
        body={closingCta.variants.about.body}
      />
    </>
  );
}
