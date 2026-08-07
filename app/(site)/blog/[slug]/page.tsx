import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getPublishedPost, getPublishedSlugs } from "@/lib/posts";
import { pageMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { InstrumentLabel } from "@/components/ui/instrument";
import { Reveal } from "@/components/ui/reveal";

// Cached + rebuilt on publish/edit (revalidatePath in admin actions). New
// slugs not seen at build time still render on first request.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};

  const meta = pageMetadata({
    title: post.title,
    description: post.description || post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const publishedIso = post.publishedAt ?? post.createdAt;
  const dateLabel = new Date(publishedIso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            slug: post.slug,
            title: post.title,
            description: post.description || post.excerpt,
            published: publishedIso,
            updated: post.updatedAt,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="section-y">
        <div className="container-page mx-auto max-w-3xl">
          <Reveal className="flex flex-col gap-5">
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All articles
            </Link>

            <InstrumentLabel>Blog</InstrumentLabel>

            <h1 className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="text-lg leading-[1.7] text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}

            <div className="flex items-center gap-3 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
              <time dateTime={publishedIso}>{dateLabel}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>

            <span aria-hidden className="rule-fade mt-2 w-full" />
          </Reveal>

          {post.coverUrl ? (
            <Reveal className="mt-8 overflow-hidden rounded-xl border border-border">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          ) : null}

          {/* Body — markdown rendered with the site's prose styling. */}
          <Reveal className="prose-blog mt-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </Reveal>

          <Reveal className="mt-14 flex flex-col items-start gap-4 border-t border-border pt-10">
            <h2 className="text-xl font-semibold">
              Want this thinking applied to your project?
            </h2>
            <p className="text-muted-foreground">
              Tell us what you&rsquo;re building and we&rsquo;ll give you an
              honest view of the right approach.
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
