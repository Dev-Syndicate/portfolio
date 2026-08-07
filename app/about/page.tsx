import { closingCta, site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";
import { WhyUs } from "@/components/sections/why-us";
import { ContactCta } from "@/components/sections/contact-cta";
import { PrincipleOrbit } from "@/components/artwork/principle-orbit";

const description =
  "Dev Syndicate (DS) is a web engineering studio that treats your website as business infrastructure — building high-performance digital experiences that help businesses grow.";

export const metadata = pageMetadata({
  title: "About",
  description,
  path: "/about",
  keywords: ["about Dev Syndicate", "web engineering team", "Developer Syndicate"],
});

const principles = [
  {
    title: "Clarity before creativity",
    body: "A clever interface that nobody understands is a failed interface. We earn the flourishes by getting the fundamentals right first.",
  },
  {
    title: "Motion with purpose",
    body: "Animation exists to explain a relationship, direct attention, or soften a transition. Anything that fails that test gets cut.",
  },
  {
    title: "Performance first",
    body: "Speed is a feature your visitors feel before they can name it. We hold every page to a budget and measure it before launch.",
  },
  {
    title: "Every section earns its place",
    body: "Each part of a page should answer a question a visitor is actually asking. If it doesn't, it is decoration taking up scroll.",
  },
  {
    title: "Technology framed as outcomes",
    body: "You should not need to know what a framework is to understand what we built you or why it was the right call.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/about", name: "About — Dev Syndicate", description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="About"
        title="A small team that treats your website as business infrastructure."
        intro={site.promise}
        visual={<PrincipleOrbit />}
      />

      <Section
        aria-labelledby="principles-heading"
      >
        <SectionHeader
          id="principles-heading"
          eyebrow="Principles"
          heading="How We Make Decisions"
          intro="Five rules that settle most arguments before they start."
          align="start"
        />

        <DividedGrid className="mt-9" cols="sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, i) => (
            <GridCell key={principle.title} className="gap-3">
              <span
                aria-hidden
                className="font-mono text-[0.8125rem] font-semibold tabular-nums text-primary"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold">{principle.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
            </GridCell>
          ))}
        </DividedGrid>
      </Section>

      {/* Process is not repeated here — /services carries it in full. */}
      <WhyUs />

      <ContactCta
        heading={closingCta.variants.about.heading}
        body={closingCta.variants.about.body}
      />
    </>
  );
}
