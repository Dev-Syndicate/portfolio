import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { ServicesOverview } from "@/components/sections/services-overview";
import { TechnologyStrip } from "@/components/sections/technology-strip";
import { ProcessStrip } from "@/components/sections/process-strip";
import { Faq } from "@/components/sections/faq";
import { ContactCta } from "@/components/sections/contact-cta";
import { WaveDivider, ZONE } from "@/components/ui/wave-divider";

/* ---------------------------------------------------------------------------
   Home is the overview. It touches every topic in the PRD's information
   architecture, but it owns the detail for only two of them — Trust and the
   FAQ. Services, Technology, and Process appear here in condensed form and
   link to the page that carries them in full:

     Services   → /services      Technology → /insights
     Process    → /services      Why Us     → /about

   Each condensed block is also a different shape from its full version — a
   card grid vs. a detail list, a horizontal band vs. tabs, a stepper vs. a
   timeline — so the two never read as the same block pasted twice.

   Depth rhythm: the page starts deep, surfaces, sinks, and closes deep. Each
   wave divider carries one transition.
   --------------------------------------------------------------------------- */
const { deep: DEEP, shallow: SHALLOW } = ZONE;

export default function Home() {
  return (
    <>
      <Hero />
      <Trust />

      <WaveDivider from={DEEP} to={SHALLOW} />
      <ServicesOverview />

      <WaveDivider from={SHALLOW} to={DEEP} flip />
      <TechnologyStrip />

      <ProcessStrip />

      <WaveDivider from={DEEP} to={SHALLOW} flip />
      <Faq />

      {/* Close deep, so the final panel has the strongest contrast on the
          page behind it. */}
      <WaveDivider from={SHALLOW} to={DEEP} />
      <ContactCta />
    </>
  );
}
