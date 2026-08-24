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
  "Website development, web applications, mobile apps, API integrations, and automation — engineered around the business outcome, not the tech stack.";

export const metadata = pageMetadata({
  title: "Services",
  description,
  path: "/services",
  keywords: [
    "website development",
    "web application development",
    "mobile app development",
    "API integration services",
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
      <PageHeader
        eyebrow="Services"
        title={{ lead: "Engineering scoped to", lit: "the outcome you need." }}
        intro="Every engagement starts with the business result and works backward to the technology. That’s why our proposals talk about conversion, load times, and maintenance cost long before they mention a framework."
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
