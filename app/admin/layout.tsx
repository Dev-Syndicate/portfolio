import type { Metadata } from "next";

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
    <div className="min-h-svh bg-background text-foreground">{children}</div>
  );
}
