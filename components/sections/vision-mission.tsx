import { about } from "@/lib/content";
import { Section } from "@/components/ui/section";
import { Bloom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";

/**
 * VISION + MISSION — the far thing and the near thing, stacked.
 *
 * The label carries the display type here, not the statement. That is the
 * opposite of how the rest of the site sets a block, and it is the right call
 * for these two specifically: "Our Vision" and "Our Mission" are the only
 * headings on the site a reader might be actively LOOKING for, because they
 * are the two things every about page is expected to have. Making them
 * findable at a glance is worth more than making them elegant, and the
 * statement underneath is still the first full-contrast sentence you read.
 *
 * Stacked rather than side by side. A vision and a mission are not a
 * comparison — you do not read one against the other — so putting them in two
 * columns invites a scan that has nothing to find. Read in sequence, the far
 * thing settles into the near thing, which is the actual relationship.
 *
 * The pair is still differentiated, just not by position:
 *
 *   LIGHT    Vision is lit from the top-left, a source far outside the frame.
 *            Mission is lit from the bottom-right, close and from underneath,
 *            the way something present and grounded is lit. That is the
 *            `Bloom` primitive's whole API used for what it is for.
 *   DENSITY  Vision is the expansive one — more padding, a longer measure,
 *            two paragraphs of room. Mission is tighter and shorter. Far
 *            things get air; near things get focus.
 *
 * NOTHING IS DRAWN HERE. The temptation on a vision statement is an abstract
 * diagram — an orbit, a horizon, a network. But this copy is about restraint
 * ("avoiding unnecessary complexity and digital waste"), and answering it with
 * ornament would be the page contradicting itself in the same breath. Type,
 * light and space only. The same refusal components/artwork/value-diagrams.tsx
 * documents: do not draw a claim the words have not made.
 */

const LABEL = "display display-md";
const STATEMENT =
  "mt-5 max-w-[24ch] text-[1.25rem] leading-[1.4] font-medium tracking-tight text-balance text-foreground sm:text-[1.375rem]";

export function VisionMission() {
  return (
    <Section>
      <div className="flex flex-col gap-3">
        {/* ── Vision: the far thing ──────────────────────────────────── */}
        <Reveal>
          <Bloom
            from="tl"
            soft={false}
            as="article"
            className="p-8 sm:p-12 lg:p-16"
          >
            <h2 className={LABEL}>
              <span className="lit">{about.vision.label}</span>
            </h2>

            <p className={STATEMENT}>{about.vision.statement}</p>

            <div className="mt-7 flex max-w-[62ch] flex-col gap-4">
              {about.vision.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-[1.75] text-muted-foreground text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Bloom>
        </Reveal>

        {/* ── Mission: the near thing ────────────────────────────────── */}
        <Reveal delay={0.08}>
          <Bloom
            from="br"
            soft={false}
            as="article"
            className="p-8 sm:p-10 lg:p-12"
          >
            <h2 className={LABEL}>
              <span className="lit">{about.mission.label}</span>
            </h2>

            <p className={STATEMENT}>{about.mission.statement}</p>

            <div className="mt-7 flex max-w-[62ch] flex-col gap-4">
              {about.mission.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-[1.75] text-muted-foreground text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Bloom>
        </Reveal>
      </div>
    </Section>
  );
}
