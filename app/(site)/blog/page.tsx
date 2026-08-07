import Image from "next/image";
import Link from "next/link";

import { getPublishedPosts, type Post } from "@/lib/posts";
import { pageMetadata, webPageSchema, breadcrumbSchema, abs } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CoverArt } from "@/components/blog/cover-art";
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

/* Organic, hand-arranged look: a rotation, a small vertical offset, and pin vs
   tape — all derived from the card's index so it's deterministic (stable
   between renders) but never a flat repeating pattern. */
const ROT = [-4, 2, -1.5, 3.5, -2.5, 1.5, -3, 2.5];
const SHIFT = [0, 34, 0, 10, -8, 22, 6, 16];
/* Idle-sway variation, also index-derived so it's stable. The amount alternates
   sign so neighbouring cards rock towards and away from each other rather than
   in unison, and the delay is staggered so the wall never sways in lockstep. */
const SWAY_AMT = [1.4, -1.2, 1.6, -1.3, 1.1, -1.5, 1.3, -1.2];

export default async function BlogPage() {
  const posts = await getPublishedPosts();

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

      {/* Corkboard */}
      <section className="board-bg relative">
        <div className="container-page pt-28 pb-40 sm:pt-32">
          {/* Header */}
          <div className="flex max-w-2xl flex-col gap-3">
            <InstrumentLabel>Dev Syndicate / Journal</InstrumentLabel>
            <h1 className="text-[clamp(2rem,5vw,3.1rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
              Practical writing on the decisions behind a project.
            </h1>
            <p className="max-w-md text-[0.9375rem] leading-[1.6] text-muted-foreground">
              The same way we&rsquo;d explain them on a call — pinned up as we
              write them, not filed away.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="mt-20 text-muted-foreground">
              No articles pinned yet — check back soon.
            </p>
          ) : (
            <ul className="mt-20 grid grid-cols-1 gap-x-11 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3">
              {posts.map((post, i) => (
                <PolaroidCard key={post.slug} post={post} index={i} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

function PolaroidCard({ post, index }: { post: Post; index: number }) {
  const rot = ROT[index % ROT.length];
  const shift = SHIFT[index % SHIFT.length];
  const swayAmt = SWAY_AMT[index % SWAY_AMT.length];
  const useTape = index % 2 === 1;
  const tapeRot = index % 4 === 1 ? "-3deg" : "3deg";

  // Stagger the entrance, then start the idle sway once this card has settled
  // (settle delay + its 0.7s run), plus a per-card offset so the wall drifts
  // out of phase rather than rocking in unison.
  const settleDelay = 0.02 + index * 0.1;
  const swayDelay = settleDelay + 0.7 + (index % 5) * 0.6;

  return (
    <li
      className="sm:mt-[var(--shift)]"
      style={{ "--shift": `${shift}px` } as React.CSSProperties}
    >
      {/* Rotating wrapper carries the resting tilt + idle sway; the Link inside
          owns entrance + hover. Splitting them keeps hover from ever touching
          the sway animation, which was blanking the card contents on hover. */}
      <div
        className="polaroid-wrap motion-reduce:animate-none"
        style={
          {
            "--rot": `${rot}deg`,
            "--sway-delay": `${swayDelay}s`,
            "--sway-amt": `${swayAmt}deg`,
          } as React.CSSProperties
        }
      >
        <Link
          href={`/blog/${post.slug}`}
          aria-label={`Read: ${post.title}`}
          className="polaroid polaroid-hover polaroid-settle motion-reduce:animate-none motion-reduce:opacity-100 block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          style={{ "--settle-delay": `${settleDelay}s` } as React.CSSProperties}
        >
          {/* Pin or tape */}
          {useTape ? (
            <span
              aria-hidden
              className="tape"
              style={{ "--tape-rot": tapeRot } as React.CSSProperties}
            />
          ) : (
            <span aria-hidden className="pin" />
          )}

          {/* Photo */}
          <div className="group/photo relative h-[186px] overflow-hidden bg-black">
            {post.coverUrl ? (
              <Image
                src={post.coverUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[600ms] ease-out-soft group-hover/photo:scale-[1.09]"
              />
            ) : (
              <CoverArt
                slug={post.slug}
                title={post.title}
                className="h-full w-full transition-transform duration-[600ms] ease-out-soft group-hover/photo:scale-[1.09]"
              />
            )}
            {/* vignette */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Caption */}
          <div className="px-1.5 pt-3.5 pb-1">
            {post.category ? (
              <div className="mb-1.5 font-mono text-[0.59375rem] font-medium tracking-[0.1em] text-neutral-600 uppercase">
                {post.category}
              </div>
            ) : null}
            <h2 className="text-[0.96875rem] leading-[1.32] font-bold tracking-[-0.01em] text-neutral-900">
              {post.title}
            </h2>
            <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-neutral-300 pt-2">
              <span className="-rotate-2 font-[family-name:var(--font-hand)] text-xl leading-none text-neutral-800">
                {post.scrawl}
              </span>
              <span className="font-mono text-[0.625rem] text-neutral-600">
                {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
}
