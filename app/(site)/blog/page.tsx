import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getPublishedPosts, type Post } from "@/lib/posts";
import { pageMetadata, webPageSchema, breadcrumbSchema, abs } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CoverArt } from "@/components/blog/cover-art";
import { InstrumentLabel } from "@/components/ui/instrument";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
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

   WHY IT IS SHAPED LIKE THIS

   1. Titles are set in Newsreader, the reading serif. It was already loaded
      for `prose-blog` and spent nowhere else, so the index now previews the
      article's own voice — the headline you scan is the headline you land on.
      The serif appears on this page and no other; everywhere else is Geist.

   2. Covers are cropped with `routed`, the site's 45° chamfer. The layout this
      was drawn from notches a rectangle out of each image corner; the chamfer
      is this system's version of that cut, so the photography joins the board
      language instead of sitting on top of it.

   3. The lead panel inverts (`tone-invert`) and overlaps its cover. One white
      block on a black page, pointed at the one thing this page wants clicked.

   4. Cards carry no border, no rule, and no "Read more". The whole card is the
      link; the cover lifts and the title goes to full white on hover. The grid
      stays type-led so it reads as a contents page, not another card wall.

   5. Post count drives the layout, not a fixed template: nothing → an invited
      action, one post → the lead alone with no empty grid under it, many → the
      lead plus the rest. All three are real states here today.
   --------------------------------------------------------------------------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** The mono meta line: when it ran / what it's about / how long it takes.
 *  Slash-separated to match the footer's baseline readout strip. */
function Meta({ post, className }: { post: Post; className?: string }) {
  const parts = [
    formatDate(post.publishedAt ?? post.createdAt),
    post.category,
    `${post.readingMinutes} min read`,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] tracking-[0.12em] uppercase tabular-nums",
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

      <div className="board-bg relative">
        <div className="container-page pt-28 pb-28 sm:pt-32">
          {/* ── Masthead ─────────────────────────────────────────────── */}
          <Reveal className="flex max-w-2xl flex-col gap-4">
            <InstrumentLabel>Dev Syndicate / Journal</InstrumentLabel>
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.035em]">
              Practical writing on the decisions behind a project.
            </h1>
            <p className="max-w-lg text-[1.0625rem] leading-[1.65] text-muted-foreground">
              The same way we&rsquo;d explain them on a call — written as we go,
              not polished into case studies.
            </p>
          </Reveal>

          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <LeadStory post={lead} />

              {rest.length > 0 ? (
                <section
                  aria-labelledby="more-articles"
                  className="mt-24 sm:mt-32"
                >
                  <Reveal className="flex flex-col gap-3">
                    <InstrumentLabel>
                      {rest.length} more{" "}
                      {rest.length === 1 ? "article" : "articles"}
                    </InstrumentLabel>
                    <h2
                      id="more-articles"
                      className="text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.1] font-semibold tracking-[-0.03em]"
                    >
                      Everything else in the journal
                    </h2>
                  </Reveal>

                  <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
                    {rest.map((post, i) => (
                      <StoryCard key={post.slug} post={post} index={i} />
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * The lead story. Cover on the right, inverted panel overlapping it on the
 * left — the two plates of the reference layout, cut with this site's chamfer.
 *
 * At `lg` both children sit in row 1 of a 12-column grid and genuinely overlap
 * (cover spans 4–12, panel spans 1–6). Below that they stack, with the panel
 * pulled up over the cover's foot so the overlap survives on a phone.
 */
function LeadStory({ post }: { post: Post }) {
  const href = `/blog/${post.slug}`;

  return (
    <Reveal delay={0.08}>
      <article className="relative mt-14 sm:mt-16 lg:mt-20 lg:grid lg:grid-cols-12 lg:items-center">
        {/* Cover */}
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className="routed group relative block aspect-[16/10] overflow-hidden bg-black sm:aspect-[16/9] lg:col-span-9 lg:col-start-4 lg:row-start-1"
        >
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover transition-transform duration-[700ms] ease-out-soft group-hover:scale-[1.03]"
            />
          ) : (
            <CoverArt
              slug={post.slug}
              title={post.title}
              className="h-full w-full transition-transform duration-[700ms] ease-out-soft group-hover:scale-[1.03]"
              monoClassName="text-[16rem]"
            />
          )}
          {/* Darkens the left third so the panel never sits on a busy crop. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.6),transparent_55%)]"
          />
        </Link>

        {/* Panel — the page's one light surface. */}
        <div
          className={cn(
            "tone-invert routed relative z-10 mx-4 -mt-16 bg-card p-7 sm:mx-8 sm:-mt-20 sm:p-9",
            "lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-0 lg:p-10 2xl:p-12",
          )}
        >
          <span aria-hidden className="card-node" />

          <Meta post={post} className="text-muted-foreground" />

          {/* The studio's own note on the lead story, in the reading serif's
              italic. Authored per post; absent on most, so it renders only
              when there is one. */}
          {post.scrawl ? (
            <p className="mt-5 font-[family-name:var(--font-reading)] text-[1.0625rem] leading-[1.5] text-muted-foreground italic">
              {post.scrawl}
            </p>
          ) : null}

          <h2
            className={cn(
              "mt-4 font-[family-name:var(--font-reading)] font-medium tracking-[-0.02em] text-balance",
              "text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.1]",
            )}
          >
            <Link
              href={href}
              className="rounded-sm transition-colors duration-[var(--duration-base)] ease-out-soft hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? (
            <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-foreground/70">
              {post.excerpt}
            </p>
          ) : null}

          <Button href={href} className="mt-7" size="md">
            Read the article
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </article>
    </Reveal>
  );
}

/**
 * A grid entry: chamfered cover, mono meta, serif title, excerpt. No border and
 * no read-more — the card is one link, and the cover lift plus the title going
 * to full white carry the affordance.
 */
function StoryCard({ post, index }: { post: Post; index: number }) {
  return (
    <li>
      <Reveal delay={0.04 + (index % 3) * 0.06}>
        <Link
          href={`/blog/${post.slug}`}
          aria-label={`Read: ${post.title}`}
          className="group flex flex-col rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <div className="routed relative aspect-[4/3] overflow-hidden bg-black">
            {post.coverUrl ? (
              <Image
                src={post.coverUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[600ms] ease-out-soft group-hover:scale-[1.05]"
              />
            ) : (
              <CoverArt
                slug={post.slug}
                title={post.title}
                className="h-full w-full transition-transform duration-[600ms] ease-out-soft group-hover:scale-[1.05]"
              />
            )}
          </div>

          <Meta post={post} className="mt-5 text-muted-foreground" />

          <h3 className="mt-3 font-[family-name:var(--font-reading)] text-[1.375rem] leading-[1.25] font-medium tracking-[-0.015em] text-foreground/90 transition-colors duration-[var(--duration-base)] ease-out-soft group-hover:text-foreground">
            {post.title}
          </h3>

          {post.excerpt ? (
            <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-foreground/60">
              {post.excerpt}
            </p>
          ) : null}
        </Link>
      </Reveal>
    </li>
  );
}

/** Nothing published yet. An empty page is a place to send someone, not a
 *  dead end — so it points at the work instead of asking them to come back. */
function EmptyState() {
  return (
    <Reveal delay={0.08}>
      <div className="routed mt-14 border border-border bg-card p-8 sm:mt-16 sm:p-12">
        <h2 className="font-[family-name:var(--font-reading)] text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.15] font-medium tracking-[-0.02em]">
          The first article is still being written.
        </h2>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-[1.7] text-foreground/70">
          Nothing is published here yet. In the meantime, the services pages
          cover how we work in the same detail these articles will.
        </p>
        <Button href="/services" variant="outline" className="mt-7" size="md">
          See what we build
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </Reveal>
  );
}
