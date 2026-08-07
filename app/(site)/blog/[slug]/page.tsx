import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import {
  getPublishedPost,
  getPublishedPosts,
  getPublishedSlugs,
  type Post,
} from "@/lib/posts";
import { pageMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CoverArt } from "@/components/blog/cover-art";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ArticleToc, type TocItem } from "@/components/blog/article-toc";
import { Button } from "@/components/ui/button";
import { InstrumentLabel } from "@/components/ui/instrument";
import { Reveal } from "@/components/ui/reveal";

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

/* Match rehype-slug (github-slugger) closely enough to build TOC anchors from
   the H2 headings in the markdown body. */
function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractToc(body: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of body.split("\n")) {
    const m = /^##\s+(.+?)\s*$/.exec(line); // H2 only
    if (m) {
      const text = m[1].replace(/[*_`]/g, "").trim();
      items.push({ id: slugifyHeading(text), text });
    }
  }
  return items;
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

  const toc = extractToc(post.body);
  const more = (await getPublishedPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

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

      <ReadingProgress />

      {/* ── Full-bleed atmospheric header ─────────────────────────────── */}
      <header className="relative isolate overflow-hidden pt-28 pb-12 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -top-1/3 left-[35%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-[130px]"
            style={{ background: "var(--glow-a)" }}
          />
        </div>

        <div className="container-page">
          <Reveal className="flex max-w-4xl flex-col gap-5">
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All articles
            </Link>

            <InstrumentLabel>{post.category || "Blog"}</InstrumentLabel>

            <h1 className="text-[clamp(2.2rem,4.8vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="max-w-2xl text-[1.15rem] leading-[1.6] text-muted-foreground text-pretty sm:text-xl">
                {post.excerpt}
              </p>
            ) : null}

            <div className="mt-1 flex items-center gap-3 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">
              <time dateTime={publishedIso}>{dateLabel}</time>
              <span aria-hidden className="text-border-strong">
                /
              </span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Wide cover */}
      <div className="container-page">
        <Reveal className="relative aspect-[21/8] overflow-hidden rounded-2xl border border-border shadow-[var(--elevation-3)]">
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
              priority
            />
          ) : (
            <CoverArt
              slug={post.slug}
              title={post.title}
              className="h-full w-full"
              monoClassName="text-[20rem]"
            />
          )}
        </Reveal>
      </div>

      {/* ── Two-column body: article + sticky sidebar ─────────────────── */}
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Article */}
          <article className="min-w-0">
            <div className="prose-blog mx-auto max-w-3xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
              >
                {post.body}
              </ReactMarkdown>
            </div>

            {/* End CTA */}
            <div className="mx-auto mt-14 flex max-w-3xl flex-col items-start gap-4 border-t border-border pt-10">
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
            </div>
          </article>

          {/* Sticky sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-8">
              <ArticleToc items={toc} />

              <div className="flex flex-col gap-3 border-t border-border pt-6">
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase">
                  Article
                </span>
                <dl className="flex flex-col gap-2 text-sm">
                  {post.category ? (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Topic</dt>
                      <dd className="text-right font-medium">{post.category}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Published</dt>
                    <dd className="text-right font-medium">{dateLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Read</dt>
                    <dd className="text-right font-medium">
                      {post.readingMinutes} min
                    </dd>
                  </div>
                </dl>
              </div>

              <Link
                href="/contact"
                className="rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-border-strong"
              >
                <span className="font-medium">Have a project?</span>
                <span className="mt-1 flex items-center gap-1.5 text-primary">
                  Start the conversation
                  <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Keep reading ──────────────────────────────────────────────── */}
      {more.length > 0 ? (
        <section
          aria-labelledby="more-heading"
          className="border-t border-border"
        >
          <div className="container-page py-16">
            <Reveal>
              <div className="mb-8 flex items-end justify-between">
                <h2
                  id="more-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  Keep reading
                </h2>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                >
                  All articles
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p, i) => (
                <MoreCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function MoreCard({ post, index }: { post: Post; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1 hover:border-border-strong"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-[var(--duration-slow)] ease-out-soft group-hover:scale-[1.04]"
            />
          ) : (
            <CoverArt slug={post.slug} title={post.title} className="h-full w-full" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <span className="font-mono text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase">
            {post.readingMinutes} min read
          </span>
          <h3 className="leading-snug font-semibold tracking-[-0.01em]">
            {post.title}
          </h3>
        </div>
      </Link>
    </Reveal>
  );
}
