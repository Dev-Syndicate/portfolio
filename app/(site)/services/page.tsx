import { closingCta, services } from "@/lib/content";
import {
  pageMetadata,
  webPageSchema,
  breadcrumbSchema,
  servicesSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Services } from "@/components/sections/services";
import { TechnologySection } from "@/components/sections/technology";
import { Process } from "@/components/sections/process";
import { ContactCta } from "@/components/sections/contact-cta";

const description =
  "Digital products, business applications, ERP and CRM systems, integrations and APIs, AI systems, and automation — engineered around the business outcome, not the tech stack.";

export const metadata = pageMetadata({
  title: "Services",
  description,
  path: "/services",
  keywords: [
    "website development",
    "web application development",
    "mobile app development",
    "ERP development",
    "CRM development",
    "API integration services",
    "AI systems development",
    "workflow automation",
  ],
});

/**
 * Owns the full detail for Services, Technology, and Process. Home shows
 * condensed versions of all three and links here; nothing on this page is a
 * repeat of the home copy.
 *
 * Technology now lives here. The home constellation's "How we choose" link has
 * always pointed at /services, but the page carried no technology content —
 * the link promised an explanation the destination never delivered.
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/services",
            name: "Services — Dev Syndicate",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          servicesSchema(services.items),
        ]}
      />
      {/* The page header names the ordering rather than repeating the home
          page's line, so a visitor arriving here cold knows why the six are in
          this order before they start reading them. */}
      <PageHeader
        eyebrow="Services"
        title={{ lead: "Six layers,", lit: "one business." }}
        intro="Ordered from the surface your customers see to the work that runs with nobody watching. Most engagements touch two or three of them — this is how we talk about all six."
      />

      <Services />
      <TechnologySection />
      <Process />

      <ContactCta
        heading={closingCta.variants.services.heading}
        body={closingCta.variants.services.body}
      />
    </>
  );
}
