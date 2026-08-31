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
import { Chip } from "@/components/ui/chip";
import { Bloom } from "@/components/ui/bloom";
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
    // Use the post headline verbatim as the <title>, WITHOUT the
    // "%s — Dev Syndicate" suffix the root template appends. Article headlines
    // are already long, and the suffix pushed them past Bing's 70-char title
    // limit; `absolute` opts this page out of the template. The brand is still
    // present via OG siteName and the Article schema's publisher.
    title: { absolute: post.title },
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

  // Render the body exactly as authored — headings (including H1) show as set.
  const articleBody = post.body;
  const toc = extractToc(articleBody);
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
        {/* The same dome that opens every interior page — light arriving from
            above the frame rather than the home page's horizon below it. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-bloom-breathe absolute -top-[26rem] left-1/2 h-[44rem] w-[80rem] max-w-[160vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,var(--bloom-core),var(--bloom-mid)_38%,var(--bloom-none)_70%)] opacity-50 blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_30%,var(--background)_82%)]" />
        </div>

        <div className="container-page">
          <Reveal className="flex max-w-5xl flex-col gap-5">
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All articles
            </Link>

            <Chip>{post.category || "Blog"}</Chip>

            {/* `text-pretty` (not balance) lets each line fill the available
                width — so the title runs wide instead of stacking into a narrow
                balanced block while space sits empty to the right. */}
            {/* Article titles stay in the reading serif — the same face the
                body is set in, and the one the index previews. */}
            <h1 className="font-reading text-[clamp(2.2rem,4.8vw,3.75rem)] leading-[1.08] font-medium tracking-[-0.02em] text-pretty">
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

      {/* Cover — the full uploaded image at its own aspect ratio, never cropped
          and with no surrounding card: just the image, centered, height-capped
          so a tall image doesn't dominate. A plain <img> is used on purpose:
          covers come from storage with unknown dimensions, and next/image needs
          known width/height (or `fill`, which crops) — a native img renders the
          true intrinsic ratio with no layout assumptions. When there is no cover
          we fall back to the generated CoverArt in its own framed panel. */}
      <div className="container-page">
        {post.coverUrl ? (
          <Reveal className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt={post.title}
              className="h-auto max-h-[75vh] w-auto max-w-full rounded-2xl"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Reveal>
        ) : (
          <Reveal className="relative aspect-[21/8] overflow-hidden rounded-2xl border border-border shadow-[var(--elevation-3)]">
            <CoverArt
              slug={post.slug}
              title={post.title}
              className="h-full w-full"
              monoClassName="text-[20rem]"
            />
          </Reveal>
        )}
      </div>

      {/* ── Two-column body: article + sticky sidebar ─────────────────── */}
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Article — left-aligned in its column so the body shares the same
              left edge as the title and cover above it (an editorial column,
              not a floating centred block). Measure capped for comfortable
              line-length. */}
          <article className="min-w-0">
            <div className="prose-blog max-w-[68ch]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
              >
                {articleBody}
              </ReactMarkdown>
            </div>

            {/* End CTA — shares the article's left edge and measure. */}
            <div className="mt-16 flex max-w-[68ch] flex-col items-start gap-4 border-t border-border pt-10">
              <h2 className="text-2xl font-medium tracking-tight">
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

              <Bloom from="tl" className="flex flex-col gap-3 p-5">
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
              </Bloom>

              <Link
                href="/contact"
                className="rounded-2xl border border-border bg-card p-5 text-sm transition-colors hover:border-border-strong"
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
        className="bloom bloom-soft group flex h-full flex-col transition-transform duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1 motion-reduce:hover:translate-y-0"
      >
        <div className="relative z-10 aspect-[16/10] overflow-hidden">
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
        <div className="relative z-10 flex flex-1 flex-col gap-2 p-5">
          <span className="font-mono text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase">
            {post.readingMinutes} min read
          </span>
          <h3 className="font-reading leading-snug font-medium tracking-[-0.01em]">
            {post.title}
          </h3>
        </div>
      </Link>
    </Reveal>
  );
}
