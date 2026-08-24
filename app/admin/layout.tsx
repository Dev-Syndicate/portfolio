import type { Metadata } from "next";
import { Caveat } from "next/font/google";

// The handwriting face is used by exactly one control: the post editor's
// "hand note" field. It used to be loaded in the ROOT layout, which shipped it
// to every public visitor even though nothing public renders in it any more —
// the blog's polaroid wall, which did, was replaced. Scoping it here keeps the
// editor field looking right and takes the font off the public critical path.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  // The entire admin area is never indexed.
  robots: { index: false, follow: false },
};

/**
 * Admin shell — deliberately bare. No public site header/footer/liquid
 * background (those live in the (site) route group), so the dashboard is its
 * own clean space. Individual admin pages render their own top bar via
 * <AdminShell> where they need one.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${caveat.variable} min-h-svh bg-background text-foreground`}>
      {children}
    </div>
  );
}
