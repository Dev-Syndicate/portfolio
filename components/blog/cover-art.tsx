import { cn } from "@/lib/utils";

/**
 * Generated cover art for a post that has no uploaded image. A gradient chosen
 * deterministically from the post's slug (so a post always looks the same),
 * with a big monogram of its title, the DS mark, and film grain — so a
 * cover-less card still looks designed and distinct, never a grey blank.
 *
 * Colours stay on the monochrome brand ramp; only the composition varies.
 */

/* Five on-brand gradient recipes. The slug hash picks one. */
const GRADIENTS = [
  "radial-gradient(120% 120% at 20% 10%, #3a3d44, transparent 60%), linear-gradient(135deg, #23262c, #0d0e11)",
  "radial-gradient(120% 120% at 80% 15%, #4a4f57, transparent 55%), linear-gradient(200deg, #1a1c21, #0b0c0f)",
  "radial-gradient(130% 100% at 30% 90%, #565b64, transparent 60%), linear-gradient(115deg, #20232a, #0c0d10)",
  "radial-gradient(120% 120% at 70% 30%, #41454d, transparent 58%), linear-gradient(160deg, #191b20, #0a0b0e)",
  "conic-gradient(from 200deg at 70% 30%, #3a3d44, #14161a, #2a2e35, #0d0e11, #3a3d44)",
];

// Inline SVG grain as a data URI — no external request.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Stable small hash from a string. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function CoverArt({
  slug,
  title,
  className,
  monoClassName,
}: {
  slug: string;
  title: string;
  className?: string;
  /** Override the monogram size per placement (featured vs card). */
  monoClassName?: string;
}) {
  const gradient = GRADIENTS[hash(slug) % GRADIENTS.length];
  const monogram = (title.trim()[0] ?? "D").toUpperCase();

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden bg-brand-800", className)}
    >
      {/* Gradient field */}
      <div className="absolute inset-0" style={{ background: gradient }} />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* DS mark, top-left */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="absolute top-5 left-6 size-7 opacity-55"
      >
        <path
          d="M4 7 9 12l-5 5M12 17h8"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Oversized monogram */}
      <span
        className={cn(
          "absolute -right-[4%] -bottom-[20%] font-mono font-bold leading-none tracking-[-0.05em] text-white/[0.08] select-none",
          monoClassName ?? "text-[8rem]",
        )}
      >
        {monogram}
      </span>
    </div>
  );
}
