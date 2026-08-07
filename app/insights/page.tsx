import { ArrowRight } from "lucide-react";

import { articles } from "@/lib/articles";
import { pageMetadata, webPageSchema, breadcrumbSchema, abs } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader, DividedGrid } from "@/components/ui/section";
import { GridCell } from "@/components/ui/grid-cell";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Technology } from "@/components/sections/technology-section";
import { DecisionGraph } from "@/components/artwork/decision-graph";

/** Blog/ItemList schema tying the articles to the site. */
const articleListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Insights — Dev Syndicate",
  url: abs("/insights"),
  blogPost: articles.map((a) => ({
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    url: abs(`/insights/${a.slug}`),
    datePublished: a.published,
    dateModified: a.updated,
  })),
};

const description =
  "How we think about the technology choices behind a project — frontend, mobile, backend, databases, cloud, and automation — and what each one means for your business.";

export const metadata = pageMetadata({
  title: "Insights",
  description,
  path: "/insights",
  keywords: [
    "technology stack",
    "Next.js",
    "React",
    "Flutter",
    "cloud deployment",
    "web development insights",
  ],
});

/**
 * The Insights hub: real articles (lib/articles.ts, rendered at
 * app/insights/[slug]) plus the single home for the technology-stack
 * reasoning. The stack write-ups used to also appear on the home and services
 * pages — the same framework names printed three times — and now live here
 * only; the other pages name the six areas at most and link across.
 */
export default function InsightsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/insights", name: "Insights — Dev Syndicate", description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
          ]),
          articleListSchema,
        ]}
      />
      <PageHeader
        eyebrow="Insights"
        title="The thinking behind the technology."
        intro="Every tool on a project is a decision with a business consequence. Here is how we explain each of ours — the same way we would explain it on a call."
        visual={<DecisionGraph />}
      />

      {/* Articles — the real content hub. */}
      <Section aria-labelledby="articles-heading">
        <SectionHeader
          id="articles-heading"
          eyebrow="Articles"
          heading="Field notes on building for the web"
          intro="Practical writing on the decisions behind a project — stacks, performance, and platforms — the same way we would explain them on a call."
        />
        <DividedGrid className="mt-9" cols="md:grid-cols-3">
          {articles.map((article) => (
            <GridCell
              key={article.slug}
              href={`/insights/${article.slug}`}
              aria-label={`Read: ${article.title}`}
              className="gap-3"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-muted-foreground uppercase">
                {article.readingMinutes} min read
              </span>
              <h3 className="text-lg font-semibold leading-snug">
                {article.title}
              </h3>
              <p className="text-[0.9375rem] leading-[1.6] text-muted-foreground">
                {article.excerpt}
              </p>
              <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-medium text-primary">
                Read article
                <ArrowRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/cell:translate-x-0.5"
                />
              </span>
            </GridCell>
          ))}
        </DividedGrid>
      </Section>

      <Technology />

      <section className="section-glow section-y relative isolate overflow-hidden">
        <Reveal>
          <div className="container-page mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
              Want this applied to your project?
            </h2>
            <p className="max-w-xl text-[1.0625rem] leading-[1.7] text-muted-foreground">
              Tell us what you&rsquo;re building and we&rsquo;ll walk you through
              which of these choices actually matter for it — and which ones you
              can safely ignore.
            </p>
            <Button href="/contact" size="lg" className="mt-2">
              Start the conversation
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
