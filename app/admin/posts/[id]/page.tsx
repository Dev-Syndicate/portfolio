import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getPostById } from "@/lib/admin-posts";
import { PostEditor } from "../post-editor";
import { AdminShell } from "../../admin-shell";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <AdminShell>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to posts
      </Link>
      <h1 className="mt-4 mb-8 text-2xl font-semibold tracking-tight">
        Edit post
      </h1>
      <PostEditor post={post} />
    </AdminShell>
  );
}
