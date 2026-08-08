import { closingCta, site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader } from "@/components/ui/section";
import { WhyUs } from "@/components/sections/why-us";
import { ContactCta } from "@/components/sections/contact-cta";
import { PrincipleOrbit } from "@/components/artwork/principle-orbit";
import { Reveal } from "@/components/ui/reveal";
import { lineArt, type LineArtName } from "@/components/artwork/line-art";

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

/* One distinct illustration per principle, indexed by position so cards never
   repeat art — the drawing echoes each rule (brackets = clarity, wave = motion,
   burst = speed, layers = every section, radar = tech as measurable outcomes). */
const principleArt: readonly LineArtName[] = [
  "brackets",
  "wave",
  "burst",
  "layers",
  "radar",
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

        {/* Dark spec-sheet cards, each carrying a big framed line-art illustration —
            the engineered-evidence idiom from the home sections. First card is
            lightly lifted as a focal point; the rest stay quiet. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, i) => {
            const Art = lineArt[principleArt[i] ?? "nodes"];
            const lead = i === 0; // first rule gets the accent lift
            return (
              <Reveal key={principle.title} delay={i * 0.05} className="flex">
                <article
                  className={
                    lead
                      ? "ring-glow group relative flex w-full flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card p-6 shadow-[var(--elevation-2)] transition-colors duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1"
                      : "group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1 hover:border-border-strong"
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

                  {/* Framed viewport for the big illustration, with corner brackets. */}
                  <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border border-border bg-brand-950/40 sm:h-32">
                    <span
                      aria-hidden
                      className={
                        lead
                          ? "text-primary/70"
                          : "text-muted-foreground/50 transition-colors duration-[var(--duration-slow)] ease-out-soft group-hover:text-muted-foreground/80"
                      }
                    >
                      <Art className="h-24 w-40 sm:h-28 sm:w-48" />
                    </span>
                    {/* Small corner brackets to read as an instrument readout. */}
                    <span aria-hidden className="pointer-events-none absolute left-2 top-2 size-2.5 border-l border-t border-border-strong" />
                    <span aria-hidden className="pointer-events-none absolute right-2 top-2 size-2.5 border-r border-t border-border-strong" />
                    <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 size-2.5 border-b border-l border-border-strong" />
                    <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 size-2.5 border-b border-r border-border-strong" />
                  </div>

                  <div className="relative mt-5 flex flex-col gap-2">
                    {/* Light mono index — these are rules, not an ordered sequence. */}
                    <span
                      aria-hidden
                      className="font-mono text-[0.8125rem] tabular-nums text-muted-foreground"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold">{principle.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-brand-100/90">
                      {principle.body}
                    </p>
                  </div>
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
