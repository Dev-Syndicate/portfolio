import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import {
  SurfaceDiagram,
  PortalDiagram,
  DeviceDiagram,
  MeshDiagram,
  LoopDiagram,
} from "@/components/artwork/service-diagrams";

/**
 * Services — the bento the reference uses for its feature module: cards of
 * unequal width alternating across rows so the eye moves diagonally instead of
 * scanning a uniform grid.
 *
 * Each card carries an abstract diagram rather than a product screenshot. The
 * reference fills these panels with fintech UI (balances, currency pickers,
 * cards); the equivalent here would be inventing an interface we don't sell.
 * The diagrams instead draw the *shape* of each engagement — a surface, a
 * portal, a device, a mesh, a loop — which is honest and, at this scale, reads
 * better than a shrunken screenshot would.
 *
 * The layout mapping below is deliberate: the widest cards go to the two
 * services with the most to explain, and the light in each row enters from the
 * outside edge so the row's centre stays dark and the two cards read as a pair.
 */

const DIAGRAMS = [
  SurfaceDiagram,
  PortalDiagram,
  DeviceDiagram,
  MeshDiagram,
  LoopDiagram,
] as const;

/* Per-card: grid span, which corner the light enters from, and whether the
   diagram sits beside the copy (wide) or beneath it (narrow). */
const LAYOUT: { span: string; from: BloomFrom; wide: boolean }[] = [
  { span: "lg:col-span-5", from: "tl", wide: false },
  { span: "lg:col-span-7", from: "tr", wide: true },
  { span: "lg:col-span-7", from: "bl", wide: true },
  { span: "lg:col-span-5", from: "br", wide: false },
  { span: "lg:col-span-12", from: "b", wide: true },
];

export function ServicesOverview() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-y relative isolate"
      style={{ scrollMarginTop: "5.5rem" }}
    >
      <div className="container-page">
        {/* Centred header — the reference centres its feature headings and
            left-aligns everything else, and the contrast is what marks this
            out as the page's main event. */}
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <Chip>{services.overview.eyebrow}</Chip>
          <h2 id="services-heading" className="display display-lg lit">
            {services.overview.heading}
          </h2>
          <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty sm:text-lg">
            {services.overview.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-start gap-3 lg:grid-cols-12">
          {services.items.map((service, i) => {
            const { span, from, wide } = LAYOUT[i];
            const Diagram = DIAGRAMS[i];

            return (
              <Reveal key={service.slug} delay={i * 0.06} className={span}>
                <Bloom from={from} className="group/card h-full" as="article">
                  <Link
                    href={`/services#${service.slug}`}
                    className={cn(
                      "flex h-full flex-col gap-6 p-8 sm:p-9",
                      wide && "lg:flex-row lg:items-center lg:gap-10",
                    )}
                  >
                    <div
                      className={cn(
                        "flex flex-col items-start",
                        wide && "lg:flex-1",
                      )}
                    >
                      <span className="chip mb-6">{service.where}</span>

                      <div className="flex items-start gap-4">
                        <Icon
                          name={service.icon}
                          className="mt-0.5 size-10 shrink-0 rounded-full border border-hairline bg-wash p-2.5 text-foreground"
                        />
                        <h3 className="text-2xl font-medium tracking-tight">
                          {service.title}
                        </h3>
                      </div>

                      <p className="mt-4 max-w-md text-[0.9375rem] leading-[1.7] text-muted-foreground">
                        {service.summary}
                      </p>

                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/card:translate-x-1 motion-reduce:group-hover/card:translate-x-0">
                        What this involves
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </div>

                    {/* The diagram. Decorative and hidden from assistive tech —
                        the heading and summary already carry the meaning. */}
                    <div
                      className={cn(
                        "pointer-events-none select-none",
                        // Narrow cards used `mt-auto` here, which pinned the
                        // diagram to the bottom of a card stretched to match
                        // its taller neighbour — leaving a void through the
                        // middle. Letting it sit directly under the copy keeps
                        // the card's content as one block.
                        wide
                          ? "lg:w-[42%] lg:shrink-0"
                          : "mx-auto w-full max-w-sm pt-2",
                      )}
                    >
                      <Diagram />
                    </div>
                  </Link>
                </Bloom>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href={services.overview.cta.href}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            {services.overview.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
