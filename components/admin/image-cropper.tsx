"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ZoomIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * A dependency-free image cropper dialog.
 *
 * The admin picks a file, this opens over it: drag to pan, a slider to zoom, and
 * a row of aspect presets ("Original" keeps the file untouched). "Apply" paints
 * the visible crop onto an off-screen canvas at full source resolution and hands
 * back a Blob to upload — so the stored image *is* the final composition, and
 * the article page can then show it in full without any surprise crop.
 *
 * The interaction model is the familiar one: a fixed crop frame, and the image
 * moves/scales behind it. We track the image as a scale + offset over a base
 * "cover" fit (the image always at least fills the frame), clamped so you can
 * never drag an edge inside the frame and leave a gap.
 */

export type CropRatio = {
  label: string;
  /** width / height, or null for "Original" (no crop — upload as-is). */
  value: number | null;
};

const RATIOS: CropRatio[] = [
  { label: "Original", value: null },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
];

/* The crop frame is laid out to fit within this box (px); the actual pixels
   exported are computed from the source image, not this preview size. */
const FRAME_MAX_W = 560;
const FRAME_MAX_H = 420;

type Props = {
  /** The picked file to crop. */
  file: File;
  /** Called with the cropped Blob (or the original file if "Original"). */
  onApply: (blob: Blob, usedCrop: boolean) => void;
  onCancel: () => void;
};

export function ImageCropper({ file, onApply, onCancel }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [ratio, setRatio] = useState<CropRatio>(RATIOS[1]); // default 16:9
  const [zoom, setZoom] = useState(1); // 1 = base "cover" fit
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // px, from centered
  const [busy, setBusy] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  // Load the picked file into an <img> so we know its natural dimensions.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => setImg(image);
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Frame pixel size for the preview, derived from the chosen ratio (or the
  // image's own ratio for "Original"), fit within the max box.
  const frameRatio =
    ratio.value ?? (img ? img.naturalWidth / img.naturalHeight : 16 / 9);
  let frameW = FRAME_MAX_W;
  let frameH = frameW / frameRatio;
  if (frameH > FRAME_MAX_H) {
    frameH = FRAME_MAX_H;
    frameW = frameH * frameRatio;
  }

  // Base "cover" scale: the image scaled to at least fill the frame.
  const baseScale = img
    ? Math.max(frameW / img.naturalWidth, frameH / img.naturalHeight)
    : 1;
  const scale = baseScale * zoom;

  // Clamp the offset so the frame is always fully covered (no gaps at edges).
  const clampOffset = useCallback(
    (o: { x: number; y: number }) => {
      if (!img) return o;
      const dispW = img.naturalWidth * scale;
      const dispH = img.naturalHeight * scale;
      const maxX = Math.max(0, (dispW - frameW) / 2);
      const maxY = Math.max(0, (dispH - frameH) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, o.x)),
        y: Math.min(maxY, Math.max(-maxY, o.y)),
      };
    },
    [img, scale, frameW, frameH],
  );

  // Re-clamp whenever scale/ratio changes so a zoom-out can't leave a gap.
  useEffect(() => {
    setOffset((o) => clampOffset(o));
  }, [clampOffset]);

  function onPointerDown(e: React.PointerEvent) {
    if (!img) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setOffset(clampOffset({ x: drag.current.ox + dx, y: drag.current.oy + dy }));
  }
  function onPointerUp() {
    drag.current = null;
  }

  async function handleApply() {
    if (!img) return;

    // "Original" — no crop; hand back the file untouched.
    if (ratio.value === null) {
      onApply(file, false);
      return;
    }

    setBusy(true);
    try {
      // Export at the source resolution the frame maps to, so we don't upscale.
      // The frame is `frameW×frameH` display px at `scale`; the source region is
      // that divided by scale.
      const srcCropW = frameW / scale;
      const srcCropH = frameH / scale;
      // Top-left of the crop in source pixels. The image is centered in the
      // frame then shifted by `offset`; convert back to source coordinates.
      const srcCenterX = img.naturalWidth / 2 - offset.x / scale;
      const srcCenterY = img.naturalHeight / 2 - offset.y / scale;
      const sx = srcCenterX - srcCropW / 2;
      const sy = srcCenterY - srcCropH / 2;

      // Cap the exported size so covers stay web-weight, keeping the ratio.
      const MAX_W = 1600;
      const outW = Math.min(MAX_W, Math.round(srcCropW));
      const outH = Math.round(outW * (srcCropH / srcCropW));

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, srcCropW, srcCropH, 0, 0, outW, outH);

      // Prefer the source type where lossless matters; otherwise JPEG at high
      // quality keeps covers small. PNG/transparency is preserved as PNG.
      const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Export failed"))),
          outType,
          0.9,
        ),
      );
      onApply(blob, true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop cover image"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <div className="flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-border-strong bg-card p-5 shadow-[var(--elevation-3)] sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Crop cover</h2>
          <p className="text-sm text-muted-foreground">
            Drag to reposition, zoom to fill. Choose{" "}
            <span className="font-medium text-foreground">Original</span> to keep
            the image untouched.
          </p>
        </div>

        {/* Ratio presets */}
        <div className="flex flex-wrap gap-2">
          {RATIOS.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRatio(r)}
              aria-pressed={r.label === ratio.label}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                r.label === ratio.label
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Crop stage */}
        <div className="flex justify-center">
          {img ? (
            <div
              ref={frameRef}
              className="relative touch-none overflow-hidden rounded-xl border border-border bg-brand-950/60 select-none"
              style={{ width: frameW, height: frameH, cursor: "grab" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt=""
                draggable={false}
                className="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
                style={{
                  width: img.naturalWidth * scale,
                  height: img.naturalHeight * scale,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                }}
              />
              {ratio.value !== null ? (
                // Rule-of-thirds guides, so framing reads as deliberate.
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, transparent calc(33.33% - 0.5px), var(--border-strong) calc(33.33% - 0.5px) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), var(--border-strong) calc(66.66% - 0.5px) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px)), linear-gradient(to bottom, transparent calc(33.33% - 0.5px), var(--border-strong) calc(33.33% - 0.5px) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), var(--border-strong) calc(66.66% - 0.5px) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px))",
                  }}
                />
              ) : null}
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded-xl border border-border bg-brand-950/60"
              style={{ width: FRAME_MAX_W, height: 280 }}
            >
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Zoom — disabled for "Original" since there's no crop frame to fill. */}
        <div className="flex items-center gap-3">
          <ZoomIn className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            disabled={ratio.value === null}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!img || busy}
            className={buttonVariants({ size: "md" })}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Applying
              </>
            ) : ratio.value === null ? (
              "Use original"
            ) : (
              "Apply crop"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
