import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getPublishedPosts, type Post } from "@/lib/posts";
import { pageMetadata, webPageSchema, breadcrumbSchema, abs } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CoverArt } from "@/components/blog/cover-art";
import { PageHeader } from "@/components/ui/page-header";
import { Bloom, type BloomFrom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const description =
  "The Dev Syndicate blog — practical writing on software, AI, and automation: choosing a stack, performance, and the decisions behind building for the web.";

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

/* ---------------------------------------------------------------------------
   BLOG INDEX — a lead story over a quiet grid.

   The layout is driven by how many posts exist, not by a fixed template:
   nothing → an invitation, one post → the lead alone with no empty grid beneath
   it, many → the lead plus the rest. All three states are reachable today.

   Titles stay in Newsreader, the reading serif. It is already loaded for the
   article body and spent nowhere else, so the index previews the article's own
   voice — the headline you scan is the headline you land on. It is the one
   place on the site that isn't Outfit, and that is the point.
   --------------------------------------------------------------------------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** The mono meta line: when it ran / what it's about / how long it takes. */
function Meta({ post, className }: { post: Post; className?: string }) {
  const parts = [
    formatDate(post.publishedAt ?? post.createdAt),
    post.category,
    `${post.readingMinutes} min read`,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] tracking-[0.12em] tabular-nums uppercase",
        className,
      )}
    >
      {parts.map((part, i) => (
        <span key={part} className="flex items-center gap-2.5">
          {i > 0 ? (
            <span aria-hidden className="text-border-strong">
              /
            </span>
          ) : null}
          {part}
        </span>
      ))}
    </div>
  );
}

/* Light alternates down the grid so no two neighbouring cards are lit alike. */
const FROM: BloomFrom[] = ["tl", "tr", "br", "bl"];

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [lead, ...rest] = posts;

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
          webPageSchema({
            path: "/blog",
            name: "Blog — Dev Syndicate",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogSchema,
        ]}
      />

      <PageHeader
        eyebrow="Blog"
        title={{ lead: "Notes from", lit: "the build." }}
        intro="Practical writing on software, AI, and automation — what we've learned shipping systems that have to keep running after we leave."
      />

      <div className="container-page pt-14 pb-24">
        {posts.length === 0 ? (
          /* ── Empty ─────────────────────────────────────────────────────── */
          <Reveal>
            <Bloom from="b" soft={false} className="px-6 py-20 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center gap-5">
                <h2 className="text-2xl font-medium tracking-tight">
                  Nothing published yet.
                </h2>
                <p className="text-[0.9375rem] leading-[1.7] text-muted-foreground">
                  The first piece is being written. In the meantime, the fastest
                  way to get our thinking is to ask us directly.
                </p>
                <Link
                  href="/contact"
                  className={buttonVariants({ size: "lg", className: "mt-2" })}
                >
                  Ask us something
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </Bloom>
          </Reveal>
        ) : (
          <>
            {/* ── Lead story ──────────────────────────────────────────────
                A wide panel with the cover beside the copy. Only ever one, so
                the page opens on a single clear recommendation. */}
            <Reveal>
              <Bloom from="tr" soft={false} as="article" className="group/lead">
                <Link
                  href={`/blog/${lead.slug}`}
                  className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:p-10"
                >
                  <div className="flex flex-col items-start">
                    <span className="chip mb-6">Latest</span>

                    <Meta post={lead} className="text-muted-foreground" />

                    <h2 className="mt-4 font-reading text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.12] font-medium tracking-[-0.02em] text-pretty">
                      {lead.title}
                    </h2>

                    {lead.excerpt ? (
                      <p className="mt-4 max-w-xl text-[1.0625rem] leading-[1.7] text-muted-foreground text-pretty">
                        {lead.excerpt}
                      </p>
                    ) : null}

                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/lead:translate-x-1 motion-reduce:group-hover/lead:translate-x-0">
                      Read the article
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hairline">
                    {lead.coverUrl ? (
                      <Image
                        src={lead.coverUrl}
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[var(--duration-slow)] ease-out-soft group-hover/lead:scale-[1.03] motion-reduce:group-hover/lead:scale-100"
                      />
                    ) : (
                      <CoverArt
                        slug={lead.slug}
                        title={lead.title}
                        className="h-full w-full"
                      />
                    )}
                  </div>
                </Link>
              </Bloom>
            </Reveal>

            {/* ── The rest ────────────────────────────────────────────────
                Rendered only when there is a second post, so a one-post blog
                never shows an empty grid under its lead. */}
            {rest.length > 0 ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={(i % 3) * 0.06} className="flex">
                    <Bloom
                      from={FROM[i % FROM.length]}
                      as="article"
                      className="group/card w-full"
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex h-full flex-col p-5"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-hairline">
                          {post.coverUrl ? (
                            <Image
                              src={post.coverUrl}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-[var(--duration-slow)] ease-out-soft group-hover/card:scale-[1.04] motion-reduce:group-hover/card:scale-100"
                            />
                          ) : (
                            <CoverArt
                              slug={post.slug}
                              title={post.title}
                              className="h-full w-full"
                            />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col pt-5">
                          <Meta post={post} className="text-muted-foreground" />

                          <h2 className="mt-3 font-reading text-xl leading-snug font-medium tracking-[-0.01em] text-pretty">
                            {post.title}
                          </h2>

                          {post.excerpt ? (
                            <p className="mt-2.5 line-clamp-3 text-[0.9375rem] leading-[1.65] text-muted-foreground">
                              {post.excerpt}
                            </p>
                          ) : null}

                          <span className="mt-5 inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-primary transition-transform duration-[var(--duration-base)] ease-out-soft group-hover/card:translate-x-1 motion-reduce:group-hover/card:translate-x-0">
                            Read
                            <ArrowUpRight className="size-3.5" aria-hidden />
                          </span>
                        </div>
                      </Link>
                    </Bloom>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
