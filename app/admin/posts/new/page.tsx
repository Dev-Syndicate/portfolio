import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PostEditor } from "../post-editor";
import { AdminShell } from "../../admin-shell";

export const metadata = { title: "New post" };

export default function NewPostPage() {
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
        New post
      </h1>
      <PostEditor />
    </AdminShell>
  );
}
