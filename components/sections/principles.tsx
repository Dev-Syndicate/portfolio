import { about } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * FIVE DECISIONS — a set, not a stack of cards.
 *
 * THE CARDS ARE GONE AND THAT IS THE DESIGN. Three of these five principles
 * argue against unnecessary complexity — "simplicity where it matters",
 * "responsible by design", "purpose before product". Delivering them in five
 * decorated boxes with borders, radii and shadows would have the section
 * contradicting its own copy in the same breath. So there is no chrome at all
 * at rest: type on void, and a hairline between one decision and the next.
 *
 * WHAT REPLACES THE CARD IS LIGHT ON A ROW. Every other surface on this site
 * lifts by being lit from an edge (see components/ui/bloom.tsx). Here the same
 * idea is applied to a ROW instead of a box: approach a decision and a wash
 * enters from the left and falls off across it. Nothing lifts, nothing gains a
 * border, and the page stays flat and quiet until you point at something.
 *
 * THE NUMBERS ARE AN INDEX, NOT A SEQUENCE. You do not do 01 and then 02 —
 * all five are held at once, which is what "decisions we don't compromise on"
 * means. So they are set small and mono in a fixed gutter, reading as a count
 * you can refer back to rather than as steps to work through. The pipeline on
 * the home page is the opposite case and is numbered like the sequence it is;
 * the two devices should not be confused for each other.
 *
 * 01 CARRIES THE LEAD TREATMENT because it is the page's own headline. The
 * hero asserts "Purpose before product" and gives you one sentence; this row
 * is where the claim is actually defined. Setting it at the same size as the
 * other four would make the page's thesis the first of five equals.
 *
 * The three-column split — index, decision, reasoning — is the spec-sheet
 * register the site already uses wherever it prints a set of facts (see the
 * footer's hairline-gutter columns). It collapses to a stack below `lg`, where
 * a 1.4fr reasoning column would be forty characters wide.
 */
export function Principles() {
  const items = about.principles.items;

  return (
    <Section aria-labelledby="principles-heading">
      <SectionHeader
        id="principles-heading"
        heading={about.principles.heading}
        intro={about.principles.intro}
      />

      <ol className="mt-14 flex flex-col sm:mt-16">
        {items.map((item, i) => {
          const lead = i === 0;

          return (
            <Reveal as="li" key={item.title} delay={i * 0.05}>
              <div
                className={cn(
                  "principle-row grid gap-x-8 gap-y-3 py-8 sm:py-10",
                  "lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.4fr)] lg:items-baseline",
                  lead && "lg:pt-4",
                )}
              >
                <span
                  aria-hidden
                  className="principle-index font-mono text-xs tracking-[0.08em] text-muted-foreground tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  className={cn(
                    "principle-title leading-snug font-medium tracking-tight text-balance",
                    lead
                      ? "text-[1.375rem] sm:text-[1.5rem]"
                      : "text-lg sm:text-xl",
                  )}
                >
                  {item.title}
                </h3>

                <p
                  className={cn(
                    "leading-[1.75] text-muted-foreground text-pretty",
                    lead
                      ? "text-[1rem] sm:text-[1.0625rem]"
                      : "text-[0.9375rem]",
                  )}
                >
                  {item.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
