import { closingCta, site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { WhyUs } from "@/components/sections/why-us";
import { ContactCta } from "@/components/sections/contact-cta";
import { PrincipleOrbit } from "@/components/artwork/principle-orbit";
import { Reveal } from "@/components/ui/reveal";

const description =
  "Dev Syndicate (DS) is a software development company that treats your website as business infrastructure — building high-performance digital experiences that help businesses grow.";

export const metadata = pageMetadata({
  title: "About",
  description,
  path: "/about",
  keywords: ["about Dev Syndicate", "software development company", "Developer Syndicate"],
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

        {/* Quiet, type-led cards — a mono index, the rule, and its reasoning.
            First card is lightly lifted as a focal point; the rest stay calm.
            No illustrations: five short rules read best as clean type. */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, i) => {
            const lead = i === 0; // first rule gets the accent lift
            return (
              <Reveal key={principle.title} delay={i * 0.05} className="flex">
                <article
                  className={
                    lead
                      ? "ring-glow group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-primary/25 bg-card p-7 shadow-[var(--elevation-2)] transition-transform duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1"
                      : "group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-7 transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1 hover:border-border-strong"
                  }
                >
                  {/* Corner glow on the focal card only. */}
                  {lead && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-1/4 right-0 h-56 w-56 rounded-full blur-[80px]"
                      style={{ background: "var(--glow-a)" }}
                    />
                  )}

                  {/* Mono index — these are rules, not an ordered sequence, so it
                      reads as a light label rather than a step number. */}
                  <span
                    aria-hidden
                    className={`relative font-mono text-[0.8125rem] tabular-nums ${
                      lead ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative text-lg font-semibold tracking-[-0.01em]">
                    {principle.title}
                  </h3>
                  <p className="relative text-[0.9375rem] leading-relaxed text-brand-100/90">
                    {principle.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
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
