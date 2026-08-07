import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { articles, getArticle } from "@/lib/articles";
import { pageMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { InstrumentLabel } from "@/components/ui/instrument";
import { Reveal } from "@/components/ui/reveal";

/** Prerender every article at build time. */
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const meta = pageMetadata({
    title: article.title,
    description: article.description,
    path: `/insights/${article.slug}`,
    keywords: article.keywords,
  });

  // Mark it as an article for Open Graph and stamp real dates.
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: article.published,
      modifiedTime: article.updated,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const dateLabel = new Date(article.published).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd
        data={[
          articleSchema(article),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path: `/insights/${article.slug}` },
          ]),
        ]}
      />

      <article className="section-y">
        <div className="container-page mx-auto max-w-3xl">
          <Reveal className="flex flex-col gap-5">
            <Link
              href="/insights"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All insights
            </Link>

            <InstrumentLabel>Insights</InstrumentLabel>

            <h1 className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
              {article.title}
            </h1>

            <p className="text-lg leading-[1.7] text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-3 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
              <time dateTime={article.published}>{dateLabel}</time>
              <span aria-hidden>·</span>
              <span>{article.readingMinutes} min read</span>
            </div>

            <span aria-hidden className="rule-fade mt-2 w-full" />
          </Reveal>

          {/* Body */}
          <Reveal className="mt-10 flex flex-col gap-6">
            {article.body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={i}
                    className="mt-4 text-2xl font-semibold tracking-[-0.02em]"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="flex flex-col gap-2.5 pl-1">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-[1.75]">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 bg-primary"
                        />
                        <span className="text-[1.0625rem] text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={i}
                  className="text-[1.0625rem] leading-[1.8] text-muted-foreground"
                >
                  {block.text}
                </p>
              );
            })}
          </Reveal>

          {/* CTA — internal link to contact, keeps link equity flowing. */}
          <Reveal className="mt-14 flex flex-col items-start gap-4 border-t border-border pt-10">
            <h2 className="text-xl font-semibold">
              Want this thinking applied to your project?
            </h2>
            <p className="text-muted-foreground">
              Tell us what you&rsquo;re building and we&rsquo;ll give you an
              honest view of the right approach — including the parts you can
              skip.
            </p>
            <Button href="/contact" size="lg">
              Start the conversation
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Reveal>
        </div>
      </article>
    </>
  );
}
