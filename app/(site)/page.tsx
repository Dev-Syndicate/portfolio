import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { ServicesOverview } from "@/components/sections/services-overview";
import { TechnologyStrip } from "@/components/sections/technology-strip";
import { ProcessStrip } from "@/components/sections/process-strip";
import { Faq } from "@/components/sections/faq";
import { ContactCta } from "@/components/sections/contact-cta";

/* ---------------------------------------------------------------------------
   Home is the overview. It touches every topic in the PRD's information
   architecture, but it owns the detail for only two of them — Trust and the
   FAQ. Services, Technology, and Process appear here in condensed form and
   link to the page that carries them in full:

     Services   → /services      Technology → /services
     Process    → /services      Why Us     → /about

   Each condensed block is also a different shape from its full version — a
   card grid vs. a detail list, a horizontal band vs. tabs, a stepper vs. a
   timeline — so the two never read as the same block pasted twice.

   Depth now comes from the fixed animated background and each section's
   elevation rung, not from carved-in dividers — so the page reads as one
   continuous lit space that the sections float over.
   --------------------------------------------------------------------------- */
export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <ServicesOverview />
      <TechnologyStrip />
      <ProcessStrip />
      <Faq />
      <ContactCta />
    </>
  );
}
