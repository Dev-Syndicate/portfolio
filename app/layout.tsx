import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { site } from "@/lib/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Building Digital Experiences That Help Businesses Grow`,
    template: `%s — ${site.name}`,
  },
  description: site.promise,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — Building Digital Experiences That Help Businesses Grow`,
    description: site.promise,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.promise,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Tints the mobile browser chrome to match the page canvas. Must be a
  // literal — the meta tag is emitted before any stylesheet loads, so it
  // cannot read `--ref-deep`. Keep this in sync with that variable in
  // app/globals.css; it is the one colour that has to be duplicated.
  themeColor: "#0a1931",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Next 16 no longer overrides `scroll-behavior: smooth` during route
      // transitions unless asked to. Without this, navigating between pages
      // animates the scroll to top instead of jumping.
      // See node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
