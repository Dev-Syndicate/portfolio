import { trust } from "@/lib/content";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";

/**
 * The operational commitments, in full.
 *
 * These five used to live on the home page as a card grid. Home now shows only
 * their titles, as chips under the hero, and the four *values* occupy the
 * cross-lit grid instead — so this page owns the bodies and the two pages no
 * longer print the same five paragraphs.
 *
 * Shape: a sticky left column against a right-hand stack of rows separated by
 * hairlines. Deliberately not another card grid — the About page already has
 * one for the principles, and two grids of five in sequence read as the same
 * block twice.
 */
export function Commitments() {
  return (
    <section
      aria-labelledby="commitments-heading"
      className="section-y relative isolate"
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          {/* Sticky claim */}
          <Reveal className="flex flex-col items-start gap-5 lg:sticky lg:top-32 lg:self-start">
            <Chip>What you get</Chip>
            <h2 id="commitments-heading" className="display display-md">
              <span className="lead">Judged on</span>
              <span className="lit">one thing.</span>
            </h2>
            <p className="max-w-md text-[1.0625rem] leading-[1.75] text-muted-foreground text-pretty">
              {trust.intro}
            </p>
          </Reveal>

          {/* The rows */}
          <ul className="flex flex-col">
            {trust.points.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.06} as="li" className="block">
                <div
                  className={[
                    "group flex items-start gap-5 py-7 sm:gap-7",
                    // Hairline between rows only — no top rule on the first,
                    // no bottom rule on the last, so the stack reads as a list
                    // rather than a boxed table.
                    i > 0 ? "border-t border-border" : "",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-12 shrink-0 place-items-center rounded-full border border-hairline bg-wash text-foreground transition-colors duration-[var(--duration-base)] ease-out-soft group-hover:border-hairline-strong group-hover:bg-wash-strong"
                  >
                    <Icon name={point.icon} className="size-5" />
                  </span>

                  <div className="flex min-w-0 flex-col gap-2">
                    <h3 className="text-xl font-medium tracking-tight">
                      {point.title}
                    </h3>
                    <p className="text-[0.9375rem] leading-[1.75] text-muted-foreground text-pretty">
                      {point.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
