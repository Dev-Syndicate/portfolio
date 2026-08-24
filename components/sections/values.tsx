import { whyUs } from "@/lib/content";
import { Chip } from "@/components/ui/chip";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";

/**
 * Values — the asymmetric split the reference uses for its "strategic choice"
 * module: type held to the left third, a 2×2 of cards filling the right.
 *
 * The detail worth preserving from the reference is the lighting. Each of the
 * four cards is lit from the corner that faces the middle of the grid, so the
 * four washes meet in the gap and draw a cross of light between them. It reads
 * as one source sitting behind the grid rather than four separate cards — and
 * it only works because the corners are assigned deliberately, so the mapping
 * below is load-bearing, not decoration.
 */

/* Index → the corner facing the centre of a 2×2. */
const FACING_CENTRE: BloomFrom[] = ["br", "bl", "tr", "tl"];

export function Values() {
  return (
    <section
      aria-labelledby="values-heading"
      className="section-y relative isolate"
    >
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          {/* ── Left: the claim ─────────────────────────────────────────── */}
          <Reveal className="flex flex-col items-start gap-6">
            <Chip>{whyUs.eyebrow}</Chip>

            <h2 id="values-heading" className="display display-lg">
              <span className="lead">{whyUs.heading.lead}</span>
              <span className="lit">{whyUs.heading.lit}</span>
            </h2>

            <p className="max-w-md text-[1.0625rem] leading-[1.75] text-muted-foreground text-pretty">
              {whyUs.intro}
            </p>
          </Reveal>

          {/* ── Right: the cross-lit grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {whyUs.reasons.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 0.08}>
                <Bloom
                  from={FACING_CENTRE[i]}
                  className="h-full p-7 sm:p-8"
                  as="article"
                >
                  <Icon
                    name={reason.icon}
                    className="mb-6 size-11 rounded-full border border-hairline bg-wash p-2.5 text-foreground backdrop-blur-sm"
                  />

                  <h3 className="text-xl font-medium tracking-tight">
                    {reason.title}
                  </h3>

                  <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-muted-foreground">
                    {reason.body}
                  </p>
                </Bloom>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
