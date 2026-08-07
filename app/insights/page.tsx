import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Technology } from "@/components/sections/technology-section";
import { WaveDivider, ZONE } from "@/components/ui/wave-divider";
import { DecisionGraph } from "@/components/artwork/decision-graph";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "How we think about the technology choices behind a project, and what each one means for your business.",
};

/**
 * The single home for the technology stack.
 *
 * The stack lists and business-impact write-ups used to appear here, on the
 * home page, and on /services — the same framework names printed three times.
 * They now live here only; the other two pages name the six areas at most
 * and link across.
 *
 * There are no articles yet and the content document does not define a model
 * for them. Rather than list titles that do not exist, the page does
 * something useful with what we do have: the reasoning behind each technology
 * choice, which is the same thinking a first article would contain. When the
 * content model is defined, add `app/insights/[slug]/page.tsx` alongside this.
 */
export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="The thinking behind the technology."
        intro="Every tool on a project is a decision with a business consequence. Here is how we explain each of ours — the same way we would explain it on a call."
        visual={<DecisionGraph />}
      />

      {/* Surfaces into near-white: a long reading section is the worst thing
          to put on the darkest background. */}
      <WaveDivider from={ZONE.deep} to={ZONE.surface} flip />
      <Technology />

      <WaveDivider from={ZONE.surface} to={ZONE.deep} />

      <section className="section-glow section-y relative isolate overflow-hidden">
        <Reveal>
          <div className="container-page mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
              Want this applied to your project?
            </h2>
            <p className="max-w-xl text-[1.0625rem] leading-[1.7] text-muted-foreground">
              Tell us what you&rsquo;re building and we&rsquo;ll walk you through
              which of these choices actually matter for it — and which ones you
              can safely ignore.
            </p>
            <Button href="/contact" size="lg" className="mt-2">
              Start the conversation
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
