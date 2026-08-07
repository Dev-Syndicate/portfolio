import type { Metadata } from "next";

import { closingCta } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { ContactCta } from "@/components/sections/contact-cta";
import { LayerStack } from "@/components/artwork/layer-stack";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, web applications, integrations, and automation — engineered around the business outcome, not the tech stack.",
};

/**
 * Owns the full detail for Services and Process. The home page shows
 * condensed versions of both and links here; nothing on this page is
 * duplicated there.
 *
 * Technology deliberately does not appear — /insights carries it, and this
 * page used to print the same stack lists a second time.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Engineering scoped to the outcome you need."
        intro="Every engagement starts with the business result and works backward to the technology. That is why our proposals talk about conversion, load times, and maintenance cost before they talk about frameworks."
        visual={<LayerStack />}
      />

      <Services />
      <Process />

      <ContactCta
        heading={closingCta.variants.services.heading}
        body={closingCta.variants.services.body}
      />
    </>
  );
}
