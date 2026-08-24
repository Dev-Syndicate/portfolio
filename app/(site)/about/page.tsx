import { closingCta, site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Commitments } from "@/components/sections/commitments";
import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/ui/reveal";

const description =
  "Dev Syndicate (DS) is a software development company that builds software systems to solve operational problems for organisations — removing manual work, connecting disconnected tools, and streamlining how a business runs with software, AI, and automation.";

export const metadata = pageMetadata({
  title: "About",
  description,
  path: "/about",
  keywords: [
    "about Dev Syndicate",
    "software development company",
    "Developer Syndicate",
  ],
});

const principles = [
  {
    title: "Clarity before creativity",
    body: "A clever interface nobody understands is a failed interface. We earn the flourishes by getting the fundamentals right first.",
  },
  {
    title: "Motion with purpose",
    body: "Animation exists to explain a relationship, direct attention, or soften a transition. Anything that fails that test gets cut.",
  },
  {
    title: "Performance first",
    body: "Speed is a feature your visitors feel before they can name it. Every page gets a budget, and we measure it before launch.",
  },
  {
    title: "Every section earns its place",
    body: "Each part of a page should answer a question someone is actually asking. If it doesn’t, it’s decoration eating scroll.",
  },
  {
    title: "Technology framed as outcomes",
    body: "You shouldn’t need to know what a framework is to understand what we built you, or why it was the right call.",
  },
];

/* Five cards over a SIX-column grid: three of two columns, then two of three.
   Both rows fill exactly, which four columns cannot do with five items — that
   left a two-column hole beside the last row. The wider pair at the bottom also
   gives the two longest rules more room to breathe.
   On `sm` (two columns) the last card spans both so the odd item out fills its
   row instead of hanging half-width. Light alternates so no two neighbours are
   lit the same way. */
const LAYOUT: { span: string; from: BloomFrom }[] = [
  { span: "lg:col-span-2", from: "tl" },
  { span: "lg:col-span-2", from: "tr" },
  { span: "lg:col-span-2", from: "bl" },
  { span: "lg:col-span-3", from: "br" },
  { span: "sm:col-span-2 lg:col-span-3", from: "tl" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/about",
            name: "About — Dev Syndicate",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="About"
        title={{ lead: "A small team", lit: "that fixes big frictions." }}
        intro={site.promise}
      />

      <Section aria-labelledby="principles-heading">
        <SectionHeader
          id="principles-heading"
          eyebrow="Principles"
          heading={{ lead: "Five rules that settle", lit: "most arguments." }}
          intro="Not a manifesto — just the decisions we've already made, so we don't relitigate them on your budget."
        />

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {principles.map((principle, i) => (
            <Reveal
              key={principle.title}
              delay={i * 0.05}
              className={LAYOUT[i].span}
            >
              <Bloom
                from={LAYOUT[i].from}
                as="article"
                className="h-full p-7 sm:p-8"
              >
                {/* These are rules, not an ordered sequence, so the index reads
                    as a quiet label rather than a step number. */}
                <span
                  aria-hidden
                  className="font-mono text-xs tabular-nums text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-4 text-lg leading-snug font-medium tracking-tight text-balance">
                  {principle.title}
                </h3>

                <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-muted-foreground">
                  {principle.body}
                </p>
              </Bloom>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The operational commitments in full. Home shows only their titles, as
          chips under the hero; the four values live there instead. */}
      <Commitments />

      <ContactCta
        heading={closingCta.variants.about.heading}
        body={closingCta.variants.about.body}
      />
    </>
  );
}
