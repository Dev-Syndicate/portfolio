import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The brand mark in its lit sphere.
 *
 * The reference anchors two moments with this: the apex of the hero arc, and
 * the top of the closing panel. In both it reads as a small lit object rather
 * than a logo pasted on — the sphere is lit from the upper-left by the same
 * source as everything else on the page, so it belongs to the scene.
 *
 * The gradient sphere is `.mark-badge` in globals.css; this only sizes it and
 * places the logo inside.
 */
export function Mark({
  size = 56,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  /** Set on the hero instance only — it is above the fold. */
  priority?: boolean;
}) {
  return (
    <span
      className={cn("mark-badge shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/dev-syndicate-logo.png"
        alt=""
        width={size * 2}
        height={size * 2}
        priority={priority}
        aria-hidden
        // Fills the circle rather than sitting inside it. The asset is a white
        // glyph on an opaque black square, so letting it cover the badge makes
        // its own black field the sphere's dark interior — the corners it
        // loses to the circular crop are empty padding. Scaled slightly past
        // 100% so no anti-aliased edge of the square reaches the rim.
        className="size-full scale-[1.04] object-cover"
      />
    </span>
  );
}

/**
 * Mark + wordmark, the horizontal lockup used in the header, the closing
 * panel, and the footer.
 */
export function MarkLockup({
  size = 34,
  className,
  nameClassName,
  name,
  priority = false,
}: {
  size?: number;
  className?: string;
  nameClassName?: string;
  name: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark size={size} priority={priority} />
      <span className={cn("font-medium tracking-tight", nameClassName)}>
        {name}
      </span>
    </span>
  );
}
