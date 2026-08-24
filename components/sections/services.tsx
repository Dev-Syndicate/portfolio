import { Check } from "lucide-react";

import { services } from "@/lib/content";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import {
  SurfaceDiagram,
  PortalDiagram,
  DeviceDiagram,
  MeshDiagram,
  LoopDiagram,
} from "@/components/artwork/service-diagrams";

/**
 * Services in full — the page the home bento links into.
 *
 * Home shows five compact cards; this shows the same five as full-width panels
 * with the body copy and the benefit list, alternating which side the diagram
 * sits on so the eye zig-zags down the page instead of scanning one gutter.
 *
 * Each panel carries the service's `slug` as its element id. Those are public
 * URLs (`/services#web-applications`) linked from the home bento and the
 * footer, so they are permanent — renaming one breaks inbound links.
 */

const DIAGRAMS = [
  SurfaceDiagram,
  PortalDiagram,
  DeviceDiagram,
  MeshDiagram,
  LoopDiagram,
] as const;

/* Light enters from the side the diagram is on, so each panel is lit from
   whichever half carries the artwork. Alternating both together is what makes
   the zig-zag legible rather than arbitrary. */
const FROM: BloomFrom[] = ["tr", "tl", "tr", "tl", "tr"];

export function Services() {
  return (
    <Section aria-labelledby="services-detail-heading">
      <SectionHeader
        id="services-detail-heading"
        eyebrow="What we build"
        heading={{ lead: "Five engagements.", lit: "One standard." }}
        intro={services.intro}
      />

      <div className="mt-14 flex flex-col gap-4">
        {services.items.map((service, i) => {
          const Diagram = DIAGRAMS[i];
          // Alternate which column the artwork occupies.
          const flip = i % 2 === 1;

          return (
            <Reveal key={service.slug} delay={0.04}>
              <Bloom
                from={FROM[i]}
                as="article"
                // The anchor target for /services#slug deep links.
                id={service.slug}
                className="scroll-mt-28"
              >
                <div
                  className={[
                    "grid items-center gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12",
                    flip ? "lg:[&>*:first-child]:order-2" : "",
                  ].join(" ")}
                >
                  {/* Copy */}
                  <div className="flex flex-col items-start">
                    <span className="chip mb-6">{service.where}</span>

                    <div className="flex items-start gap-4">
                      <Icon
                        name={service.icon}
                        className="mt-1 size-11 shrink-0 rounded-full border border-hairline bg-wash p-2.5 text-foreground"
                      />
                      <h3 className="text-[1.75rem] leading-tight font-medium tracking-tight text-balance sm:text-3xl">
                        {service.title}
                      </h3>
                    </div>

                    <p className="mt-5 text-[1.0625rem] leading-[1.75] text-muted-foreground text-pretty">
                      {service.body}
                    </p>

                    <ul className="mt-7 flex flex-col gap-3">
                      {service.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-muted-foreground"
                        >
                          <Check
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            strokeWidth={2}
                          />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diagram — decorative; the copy already carries the meaning. */}
                  <div className="pointer-events-none mx-auto w-full max-w-md select-none">
                    <Diagram />
                  </div>
                </div>
              </Bloom>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
