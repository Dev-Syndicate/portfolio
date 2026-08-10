"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2, Upload } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ImageCropper } from "@/components/admin/image-cropper";
import { RichEditor } from "@/components/admin/rich-editor";
import type { Post } from "@/lib/posts";
import {
  createPost,
  updatePost,
  type PostFormState,
} from "./actions";

/* Raster formats next/image can optimise. SVG is excluded on purpose — it isn't
   optimised and carries an XSS risk. Maps MIME → file extension. */
const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB — plenty for a cover, keeps pages fast

const field = cn(
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem]",
  "text-foreground placeholder:text-muted-foreground/70",
  "transition-colors focus:border-primary focus:outline-none",
);
const label = "text-sm font-medium";

export function PostEditor({ post }: { post?: Post }) {
  const isEdit = Boolean(post);
  const action = isEdit ? updatePost : createPost;
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(
    action,
    {},
  );

  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // The picked file waiting to be cropped. Non-null → the crop dialog is open.
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  // The rich editor writes Markdown here; a hidden field submits it as `body`,
  // so the server action and storage format are unchanged.
  const [body, setBody] = useState(post?.body ?? "");

  // Step 1 — validate the pick and open the cropper. Nothing uploads yet.
  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset the input so re-picking the same file fires onChange again.
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED[file.type]) {
      setUploadError("Use a PNG, JPG, WebP, GIF, or AVIF image (not SVG).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("Image is over 8 MB — please use a smaller file.");
      return;
    }
    setUploadError(null);
    setPendingFile(file);
  }

  // Step 2 — the cropper hands back a blob (cropped) or the original file. A
  // crop is always re-encoded to PNG/JPEG, so pick the extension from the blob
  // type rather than the source file. Then upload.
  async function handleCropped(blob: Blob, usedCrop: boolean) {
    setPendingFile(null);
    const type = usedCrop ? blob.type : (blob as File).type;
    const ext = ALLOWED[type] ?? "jpg";

    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      // Unique, unpredictable name; timestamp keeps ordering readable.
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("blog-covers")
        .upload(path, blob, {
          cacheControl: "31536000",
          upsert: false,
          contentType: type,
        });
      if (error) {
        // Surface the real reason — the most common one during setup is that
        // schema.sql (which creates the bucket) hasn't been run yet.
        setUploadError(
          /bucket/i.test(error.message)
            ? "Storage bucket not found — run supabase/schema.sql first."
            : `Upload failed: ${error.message}`,
        );
        return;
      }
      const { data } = supabase.storage.from("blog-covers").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? `Upload failed: ${err.message}` : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="cover_url" value={coverUrl} />

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className={label}>
          Title{" "}
          <span className="font-normal text-muted-foreground">
            (the article headline — shown on the blog card and at the top of
            the post)
          </span>
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={post?.title}
          className={field}
          placeholder="How to choose a web stack"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="slug" className={label}>
          Slug{" "}
          <span className="font-normal text-muted-foreground">
            (URL — leave blank to auto-generate from the title)
          </span>
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          className={cn(field, "font-mono")}
          placeholder="how-to-choose-a-web-stack"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="excerpt" className={label}>
            Excerpt{" "}
            <span className="font-normal text-muted-foreground">
              (card + intro)
            </span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={post?.excerpt}
            className={cn(field, "resize-y")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className={label}>
            Meta description{" "}
            <span className="font-normal text-muted-foreground">(SEO)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={post?.description}
            className={cn(field, "resize-y")}
          />
        </div>
      </div>

      {/* Cover image */}
      <div className="flex flex-col gap-2">
        <span className={label}>Cover image</span>
        <div className="flex flex-wrap items-center gap-4">
          <label
            className={cn(
              buttonVariants({ variant: "outline", size: "md" }),
              "cursor-pointer",
            )}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            {uploading ? "Uploading" : "Upload image"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              onChange={handlePick}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {coverUrl ? (
            <div className="flex items-center gap-3">
              {/* Preview shows the whole stored image (object-contain), so the
                  admin sees exactly what the article page will show. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt="Cover preview"
                className="h-16 w-28 rounded-lg border border-border bg-brand-950/40 object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverUrl("");
                  setUploadError(null);
                }}
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          Pick an image to crop it — drag to frame and choose a ratio, or keep
          the original. The article page shows the full image you save here.
        </p>
        {uploadError ? (
          <p className="text-sm text-destructive">{uploadError}</p>
        ) : null}
      </div>

      {/* Crop dialog — opens once a file is picked, uploads on apply. */}
      {pendingFile ? (
        <ImageCropper
          file={pendingFile}
          onApply={handleCropped}
          onCancel={() => setPendingFile(null)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className={label}>
          Body{" "}
          <span className="font-normal text-muted-foreground">
            (format with the toolbar — bold, headings, lists, quotes, links)
          </span>
        </label>
        {/* The rich editor formats as you type and keeps `body` in Markdown. The
            hidden field is what the form actually submits. */}
        <input type="hidden" name="body" value={body} />
        <RichEditor id="body" defaultMarkdown={post?.body} onChange={setBody} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="keywords" className={label}>
          Keywords{" "}
          <span className="font-normal text-muted-foreground">
            (comma-separated, SEO)
          </span>
        </label>
        <input
          id="keywords"
          name="keywords"
          defaultValue={post?.keywords.join(", ")}
          className={field}
          placeholder="web stack, Next.js, React"
        />
      </div>

      {/* Polaroid-wall card fields — how the post looks pinned on /blog. */}
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <p className="mb-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Blog card</span> — how
          this post appears pinned on the /blog journal wall. Both are optional.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className={label}>
              Card tag{" "}
              <span className="font-normal text-muted-foreground">
                (small label above the title, e.g. the topic)
              </span>
            </label>
            <input
              id="category"
              name="category"
              defaultValue={post?.category}
              className={field}
              placeholder="Automation"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="scrawl" className={label}>
              Hand note{" "}
              <span className="font-normal text-muted-foreground">
                (handwritten scribble at the bottom of the card — leave blank
                for none)
              </span>
            </label>
            <input
              id="scrawl"
              name="scrawl"
              defaultValue={post?.scrawl}
              maxLength={24}
              className={cn(
                field,
                "[font-family:var(--font-hand)] text-2xl text-foreground",
              )}
              placeholder="fig. 1"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label id="status-label" htmlFor="status" className={label}>
          Status{" "}
          <span className="font-normal text-muted-foreground">
            (Draft = only you can see it; Published = live on the public blog)
          </span>
        </label>
        {/* Themed <Select> for the same reason as the enquiry form's: a native
            popup's selected row is painted with the system accent and no CSS
            reaches it. `status` still submits as a plain form field. */}
        <div className="max-w-xs">
          <Select
            id="status"
            name="status"
            labelledBy="status-label"
            defaultValue={post?.status ?? "draft"}
            options={[
              { value: "draft", label: "Draft — not visible publicly" },
              { value: "published", label: "Published — live on /blog" },
            ]}
            className={field}
          />
        </div>
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending || uploading}
          className={buttonVariants({ size: "lg" })}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create post"
          )}
        </button>
        <Link
          href="/admin"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
