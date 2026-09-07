import { organizationSchema, websiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RevealObserver } from "@/components/ui/reveal-observer";

/**
 * Public site shell — header, footer, and the site-wide Organization/WebSite
 * structured data. Everything under (site) gets this; /admin lives outside the
 * group and has its own bare shell, so the public chrome never bleeds onto the
 * dashboard. The page sits on the flat void canvas (--background on <html>);
 * depth comes from each section's elevation, not an animated ground.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]"
      >
        Skip to content
      </a>

      {/* Drives every `[data-reveal]` on the public site from one observer.
          Mounted here rather than in the root layout so the admin area — a
          tool, not a page you read — never animates its text on scroll. */}
      <RevealObserver />

      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />

      {/* Film grain over the whole document. Large fields of near-black band
          badly on 8-bit panels, and this design is almost entirely soft
          gradients over near-black — without it the blooms show visible rings.
          Fixed and pointer-events-none, so it never interferes. */}
      <div aria-hidden className="grain" />
    </>
  );
}
