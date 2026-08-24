import { technology } from "@/lib/content";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Technology in full — six areas, each with what it does for the business and
 * the tools we actually reach for.
 *
 * This block exists because the home constellation's "How we choose" link
 * points at /services, and until now that page carried no technology content at
 * all — the link promised an explanation the destination never gave. This is
 * that explanation.
 *
 * The stack list is deliberately secondary: the impact paragraph comes first
 * and the tool names sit beneath it as quiet chips. The site's standing promise
 * is that technology gets described by what it does for you, and putting the
 * framework names above the outcome would invert exactly that.
 */

/* Light alternates across the grid so no two adjacent cards are lit the same
   way — the same rule the home bento follows. */
const FROM: BloomFrom[] = ["tl", "tr", "tl", "tr", "tl", "tr"];

export function TechnologySection() {
  return (
    <Section id="technology" aria-labelledby="technology-detail-heading">
      <SectionHeader
        id="technology-detail-heading"
        eyebrow="How we choose"
        heading={{ lead: "Six areas,", lit: "and why each matters." }}
        intro={technology.intro}
      />

      <div className="mt-14 grid gap-3 md:grid-cols-2">
        {technology.groups.map((group, i) => (
          <Reveal key={group.id} delay={(i % 2) * 0.06} className="flex">
            <Bloom
              from={FROM[i]}
              as="article"
              className="w-full scroll-mt-28 p-8 sm:p-9"
              id={group.id}
            >
              <div className="flex items-start gap-4">
                <Icon
                  name={group.icon}
                  className="mt-0.5 size-11 shrink-0 rounded-full border border-hairline bg-wash p-2.5 text-foreground"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="text-xl font-medium tracking-tight">
                    {group.title}
                  </h3>
                  <p className="text-sm text-primary">{group.outcome}</p>
                </div>
              </div>

              <p className="mt-5 text-[0.9375rem] leading-[1.75] text-muted-foreground text-pretty">
                {group.impact}
              </p>

              {/* The tools, last and quietest. */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.stack.map((tool) => (
                  <li key={tool}>
                    <span className="chip tracking-normal normal-case">
                      {tool}
                    </span>
                  </li>
                ))}
              </ul>
            </Bloom>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
