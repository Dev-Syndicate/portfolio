import { organizationSchema, websiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LiquidBackground } from "@/components/layout/liquid-background";

/**
 * Public site shell — header, footer, liquid background, and the site-wide
 * Organization/WebSite structured data. Everything under (site) gets this;
 * /admin lives outside the group and has its own bare shell, so the public
 * chrome never bleeds onto the dashboard.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <LiquidBackground />
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
    </>
  );
}
