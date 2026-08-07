import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { seo, site } from "@/lib/content";
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
    default: `${site.name} — ${seo.tagline} | Building Digital Experiences That Help Businesses Grow`,
    template: `%s — ${site.name}`,
  },
  description: site.promise,
  applicationName: site.name,
  keywords: [...seo.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  // Home is the canonical root; interior pages set their own.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en",
    url: site.url,
    title: `${site.name} — ${seo.tagline}`,
    description: site.promise,
    // OG image URL + alt come from app/opengraph-image.tsx (file convention),
    // which exports `alt` — no manual image entry needed here.
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${seo.tagline}`,
    description: site.promise,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Google Search Console ownership verification for www.devsyndicate.in.
  // A public ownership claim, not a secret — safe to commit.
  verification: {
    google: "nGPRdcdcn94uKBjsLzkBK2Nebm0oO5gOwPqVE_qANzk",
  },
};

export const viewport: Viewport = {
  // Tints the mobile browser chrome to match the page canvas. Must be a
  // literal — the meta tag is emitted before any stylesheet loads, so it
  // cannot read `--ref-deep`. Keep this in sync with that variable in
  // app/globals.css; it is the one colour that has to be duplicated.
  themeColor: "#0a0a0c",
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
      {/* Root layout is just the document shell. The public site chrome lives
          in app/(site)/layout.tsx and the admin area in app/admin/layout.tsx,
          so /admin never inherits the public header/footer. */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
