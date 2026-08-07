import Link from "next/link";
import { Plus, Pencil, ExternalLink, FileText, Trash2 } from "lucide-react";

import { getAllPosts } from "@/lib/admin-posts";
import { deletePost } from "./posts/actions";
import { AdminShell } from "./admin-shell";
import { Button } from "@/components/ui/button";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminDashboard() {
  const posts = await getAllPosts();
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <AdminShell
      title="Posts"
      actions={
        <Button href="/admin/posts/new" size="sm">
          <Plus className="size-4" aria-hidden />
          New post
        </Button>
      }
    >
      {/* Stat tiles */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:max-w-md">
        <Stat label="Published" value={published} accent />
        <Stat label="Drafts" value={drafts} />
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
            <FileText className="size-6" aria-hidden />
          </span>
          <div>
            <p className="font-medium">No posts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Write your first article to get the blog started.
            </p>
          </div>
          <Button href="/admin/posts/new" size="sm">
            <Plus className="size-4" aria-hidden />
            New post
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-strong sm:p-5"
            >
              {/* Status dot + text block */}
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <StatusDot status={post.status} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-medium">{post.title}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    /blog/{post.slug}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="hidden shrink-0 flex-col items-end gap-0.5 text-right md:flex">
                <StatusBadge status={post.status} />
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {post.status === "published"
                    ? formatDate(post.publishedAt)
                    : `edited ${formatDate(post.updatedAt)}`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1">
                {post.status === "published" ? (
                  <IconLink
                    href={`/blog/${post.slug}`}
                    label="View live"
                    external
                  >
                    <ExternalLink className="size-4" />
                  </IconLink>
                ) : null}
                <IconLink href={`/admin/posts/${post.id}`} label="Edit post">
                  <Pencil className="size-4" />
                </IconLink>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="slug" value={post.slug} />
                  <button
                    type="submit"
                    aria-label="Delete post"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span
          className={
            accent
              ? "size-2 rounded-full bg-primary"
              : "size-2 rounded-full bg-muted-foreground"
          }
        />
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StatusDot({ status }: { status: "draft" | "published" }) {
  return (
    <span
      aria-hidden
      className={
        status === "published"
          ? "relative flex size-2.5 shrink-0"
          : "flex size-2.5 shrink-0 items-center justify-center"
      }
    >
      {status === "published" ? (
        <>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
        </>
      ) : (
        <span className="size-2.5 rounded-full border border-muted-foreground" />
      )}
    </span>
  );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="text-[0.625rem] font-semibold tracking-wide text-primary uppercase">
      Live
    </span>
  ) : (
    <span className="text-[0.625rem] font-semibold tracking-wide text-muted-foreground uppercase">
      Draft
    </span>
  );
}

function IconLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {children}
    </Link>
  );
}
