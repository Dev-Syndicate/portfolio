import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getPublishedPosts, type Post } from "@/lib/posts";
import { pageMetadata, webPageSchema, breadcrumbSchema, abs } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CoverArt } from "@/components/blog/cover-art";
import { Reveal } from "@/components/ui/reveal";
import { InstrumentLabel } from "@/components/ui/instrument";

export const revalidate = 60;

const description =
  "The Dev Syndicate blog — practical writing on software, AI, and automation: choosing a stack, performance, platforms, and the decisions behind building for the web.";

export const metadata = pageMetadata({
  title: "Blog",
  description,
  path: "/blog",
  keywords: [
    "Dev Syndicate blog",
    "software development blog",
    "web development articles",
    "AI and automation",
  ],
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog — Dev Syndicate",
    url: abs("/blog"),
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: abs(`/blog/${p.slug}`),
      datePublished: p.publishedAt ?? p.createdAt,
      dateModified: p.updatedAt,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/blog", name: "Blog — Dev Syndicate", description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogSchema,
        ]}
      />

      <div className="container-page py-28 sm:py-32">
        {/* Header */}
        <Reveal className="flex max-w-2xl flex-col gap-4">
          <InstrumentLabel>Blog</InstrumentLabel>
          <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
            Field notes on software, AI, and automation.
          </h1>
          <p className="text-[1.0625rem] leading-[1.7] text-muted-foreground">
            Practical writing on the decisions behind a project — the same way
            we would explain them on a call.
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-16 text-muted-foreground">
            No articles yet — check back soon.
          </p>
        ) : (
          <div className="mt-14 flex flex-col gap-5">
            {featured ? <FeaturedCard post={featured} /> : null}

            {rest.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <ArticleCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

/* --- Featured (newest) — large split card --- */
function FeaturedCard({ post }: { post: Post }) {
  return (
    <Reveal>
      <Link
        href={`/blog/${post.slug}`}
        className="group/feat grid overflow-hidden rounded-[1.25rem] border border-border bg-card transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1 hover:border-border-strong lg:grid-cols-[1.15fr_1fr]"
      >
        <div className="relative min-h-[240px] overflow-hidden lg:min-h-[360px]">
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-[var(--duration-slow)] ease-out-soft group-hover/feat:scale-[1.03]"
              priority
            />
          ) : (
            <CoverArt
              slug={post.slug}
              title={post.title}
              className="h-full w-full"
              monoClassName="text-[13rem]"
            />
          )}
        </div>

        <div className="flex flex-col justify-center gap-4 p-8 sm:p-11">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border-strong px-3 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" />
            Latest
          </span>
          <h2 className="text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
            {post.title}
          </h2>
          <p className="leading-[1.65] text-muted-foreground">{post.excerpt}</p>
          <div className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground uppercase">
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <span className="mt-1 flex items-center gap-2 font-medium text-foreground">
            Read article
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/feat:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/* --- Grid card --- */
function ArticleCard({ post, index }: { post: Post; index: number }) {
  return (
    <Reveal delay={0.05 + index * 0.06}>
      <Link
        href={`/blog/${post.slug}`}
        className="sheen group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,transform] duration-[var(--duration-base)] ease-out-soft hover:-translate-y-1.5 hover:border-border-strong"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[var(--duration-slow)] ease-out-soft group-hover/card:scale-[1.04]"
            />
          ) : (
            <CoverArt
              slug={post.slug}
              title={post.title}
              className="h-full w-full"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-6">
          <span className="font-mono text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase">
            {post.readingMinutes} min read
          </span>
          <h3 className="text-lg leading-snug font-semibold tracking-[-0.02em]">
            {post.title}
          </h3>
          <p className="text-[0.9375rem] leading-[1.55] text-muted-foreground">
            {post.excerpt}
          </p>
          <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
            Read article
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/card:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
