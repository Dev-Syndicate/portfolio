import type { Metadata } from "next";

import { seo, site } from "@/lib/content";

/**
 * Build a page's Metadata with a self-canonical URL, page keywords layered on
 * the site set, and matching Open Graph / Twitter — so every interior page has
 * correct, non-duplicated signals pointing at the real domain.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const fullTitle = `${opts.title} — ${site.name}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: [...(opts.keywords ?? []), ...seo.keywords],
    alternates: { canonical: opts.path },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: abs(opts.path),
      title: fullTitle,
      description: opts.description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
    },
  };
}

/**
 * Structured-data (JSON-LD) builders — the machine-readable description of the
 * brand entity that lets Google understand "Dev Syndicate", "DS", "Developer
 * Syndicate", etc. all refer to one organisation, and rank the site for each.
 *
 * Everything resolves from `site` + `seo` in content.ts, so the canonical
 * domain and brand variants live in exactly one place.
 */

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

/** Absolute URL helper against the canonical domain. */
export function abs(path = "/"): string {
  return new URL(path, site.url).toString();
}

/** The Organization entity — the core of brand-name search. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    alternateName: seo.alternateNames.filter((n) => n !== site.name),
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: abs("/dev-syndicate-logo.png"),
      width: 512,
      height: 512,
    },
    image: abs("/opengraph-image"),
    description: site.promise,
    email: site.email,
    slogan: seo.tagline,
    knowsAbout: [
      "Web Development",
      "Web Application Development",
      "Mobile Application Development",
      "API Integration",
      "Cloud Infrastructure",
      "Workflow Automation",
    ],
    sameAs: seo.sameAs,
  };
}

/** The WebSite entity + a Sitelinks SearchAction. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: site.url,
    name: site.name,
    alternateName: seo.alternateNames.filter((n) => n !== site.name),
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** A WebPage tied to the org, for interior pages. */
export function webPageSchema(opts: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${abs(opts.path)}#webpage`,
    url: abs(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** BreadcrumbList for interior pages (Home → Page). */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** An Article entity for an Insights post. */
export function articleSchema(opts: {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
}) {
  const url = abs(`/insights/${opts.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: opts.title,
    description: opts.description,
    url,
    mainEntityOfPage: url,
    image: abs(`/insights/${opts.slug}/opengraph-image`),
    datePublished: opts.published,
    dateModified: opts.updated,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** The studio's service catalogue as an ItemList of Service entities. */
export function servicesSchema(
  services: readonly { title: string; body: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services — Dev Syndicate",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.body,
        provider: { "@id": ORG_ID },
        areaServed: "Worldwide",
      },
    })),
  };
}
