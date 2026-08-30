import { services } from "@/lib/content";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";

/**
 * Services in full — the six layers the home page lists and links into.
 *
 * Each panel is one stratum: the number, the layer, what it actually consists
 * of, who it is for, a paragraph, and the scope. The scope list is the part a
 * prospect actually reads — it is the difference between "we do integrations"
 * and "we do payment gateways and webhooks" — so it gets half the panel rather
 * than a footnote at the end of the copy.
 *
 * NO DIAGRAM ON THESE PANELS, which is a change. The previous five-service
 * version paired every panel with a drawing from
 * components/artwork/service-diagrams.tsx. That set was drawn for the old
 * taxonomy and only four of the five map onto the new six — and more decisively,
 * each panel now carries a ten-item scope list, which is both the substance and
 * the texture. A drawing beside it would be competing with the one thing on the
 * panel a buyer came to read. The diagrams remain in the repo, unused.
 *
 * Each panel carries the service's `slug` as its element id. Those are public
 * URLs (`/services#digital-products`), linked from the home list and the
 * footer, so they are permanent — renaming one breaks inbound links.
 */

/* Light enters from alternating sides down the page, so six stacked panels
   read as a sequence rather than as one long repeated block. */
const FROM: BloomFrom[] = ["tl", "tr", "tl", "tr", "tl", "tr"];

export function Services() {
  return (
    <section
      aria-labelledby="services-detail-heading"
      className="section-y relative isolate"
    >
      <div className="container-page">
        <h2 id="services-detail-heading" className="sr-only">
          What we build
        </h2>

        <div className="flex flex-col gap-4">
          {services.items.map((service, i) => (
            <Reveal key={service.slug} delay={0.04}>
              <Bloom
                from={FROM[i]}
                as="article"
                id={service.slug}
                className="scroll-mt-28"
              >
                <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16 lg:p-12">
                  {/* ── The layer ─────────────────────────────────────────── */}
                  <div className="flex flex-col items-start">
                    {/* Number and layer name on one line, the number set as a
                        label rather than a heading — it indexes the stratum,
                        it is not part of the title. */}
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground tabular-nums">
                        {service.n}
                      </span>
                      <span
                        aria-hidden
                        className="h-px w-6 shrink-0 bg-border-strong"
                      />
                      <span className="text-sm font-medium tracking-tight">
                        {service.name}
                      </span>
                    </div>

                    <h3 className="mt-6 text-[1.625rem] leading-tight font-medium tracking-tight text-balance sm:text-[1.875rem]">
                      {service.title}
                    </h3>

                    {/* The audience line, at full contrast. It is the sentence
                        that tells a visitor whether the next paragraph is
                        addressed to them, so it outranks the paragraph. */}
                    <p className="mt-4 text-[1.0625rem] leading-[1.6] text-foreground text-pretty">
                      {service.audience}
                    </p>

                    <p className="mt-4 text-[1.0625rem] leading-[1.75] text-muted-foreground text-pretty">
                      {service.body}
                    </p>
                  </div>

                  {/* ── The scope ─────────────────────────────────────────── */}
                  <div className="lg:pt-1">
                    <h4 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
                      Includes
                    </h4>

                    {/* Two columns from `sm` up. Ten items in one column runs
                        to a 500px-tall ladder next to a 300px block of copy;
                        two columns keep the panel balanced and let the whole
                        scope be taken in at a glance, which is the point of
                        printing it. */}
                    <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {service.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-3 border-b border-hairline py-2.5 text-[0.9375rem] leading-snug text-muted-foreground last:border-b-0 sm:last:border-b"
                        >
                          <span
                            aria-hidden
                            className="size-1 shrink-0 translate-y-[-0.15em] rounded-full bg-primary/70"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Bloom>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
