import { Newsreader } from "next/font/google";

/**
 * The blog's own reading face.
 *
 * The rest of the site is one grotesque (Instrument Sans) doing every job.
 * That is right for marketing pages, and wrong for a 12-minute read: at 20px
 * over long prose a serif's stroke modulation is what gives the eye something
 * to track along a line. Newsreader is a low-contrast, screen-tuned TEXT serif
 * with a real italic, which is what makes an article read like a publication
 * rather than like a long UI screen.
 *
 * This layout is what keeps the exception honest — Newsreader loads for
 * `/blog` and `/blog/[slug]` only, and never reaches the marketing pages,
 * exactly the way Caveat is scoped to the admin area.
 */
const newsreader = Newsreader({
  variable: "--font-reading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={newsreader.variable}>{children}</div>;
}
