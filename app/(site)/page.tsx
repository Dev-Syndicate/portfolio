import { Hero } from "@/components/sections/hero";
import { Values } from "@/components/sections/values";
import { ServicesOverview } from "@/components/sections/services-overview";
import { TechnologyStrip } from "@/components/sections/technology-strip";
import { ProcessStrip } from "@/components/sections/process-strip";
import { Faq } from "@/components/sections/faq";
import { ContactCta } from "@/components/sections/contact-cta";

/* ---------------------------------------------------------------------------
   Home follows the reference's narrative order, which is a deliberate
   alternation of composition rather than a stack of similar bands:

     Hero            centred, lit from below      — the claim
     Values          asymmetric split, cross-lit  — why us
     Services        centred head + bento grid    — what we build
     Technology      centred, constellation field — what we build it with
     Process         centred head + two panels    — how it runs
     FAQ             centred, separated rows      — objections
     Close           one lit panel                — the ask

   No two adjacent sections share a shape. That alternation is what stops a
   long dark page reading as one undifferentiated scroll, and it is the thing
   the reference does most consistently.

   Every section owns its own light. There is no page-wide animated background
   underneath them any more — depth comes from each panel being lit from a
   direction that section chose.
   --------------------------------------------------------------------------- */
export default function Home() {
  return (
    <>
      <Hero />
      <Values />
      <ServicesOverview />
      <TechnologyStrip />
      <ProcessStrip />
      <Faq />
      <ContactCta />
    </>
  );
}
