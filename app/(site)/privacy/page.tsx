import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";

const description =
  "How DevSyndicate collects, uses, and protects the information you share through this website and our contact form.";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description,
  path: "/privacy",
});

/* Written against what the site actually does: the contact form is the only
   thing that collects personal data, there is no analytics, and the only
   cookies are the admin sign-in session. Update this if any of that changes. */
const body = `
_Last updated: 18 October 2026_

This policy explains what information ${site.name} ("we", "us") collects when you use ${site.url.replace("https://", "")} (the "Site"), how we use it, and the choices you have.

## Information we collect

**Information you give us.** When you send an enquiry through the contact form we receive your name, email address, and message, plus your company and area of interest if you provide them. We also record which page you sent the form from.

**Information collected automatically.** Like most websites, our hosting provider keeps standard server logs — IP address, browser type, the pages requested, and the time of the request — for security and to keep the Site running. We do not use analytics, advertising, or tracking cookies.

**Cookies.** The public Site sets no cookies. Cookies are used only to keep our own team signed in to the admin area.

## How we use it

- To read and reply to your enquiry, and to discuss and deliver any work you ask us about.
- To keep the Site secure and prevent spam or abuse.
- To meet legal, accounting, or regulatory obligations.

We do not sell your personal information, and we do not use it for marketing unless you have asked us to.

## Who we share it with

We share information only with service providers that help us run the Site, and only as far as they need it:

- **Resend** — delivers contact-form enquiries to our inbox.
- **Supabase** — stores the Site's blog content and admin accounts.
- **Our hosting provider** — serves the Site and keeps the server logs described above.

These providers may process data outside your country. We may also disclose information if required by law or to protect our rights, users, or the public.

## How long we keep it

We keep enquiry emails for as long as needed to respond and to manage any resulting relationship, and then for as long as the law requires. Server logs are kept for a limited period by our hosting provider.

## Security

We use reasonable technical and organisational measures to protect your information, including encrypted (HTTPS) connections. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.

## Your rights

Depending on where you live — including under India's Digital Personal Data Protection Act, 2023 and the EU/UK GDPR — you may have the right to access, correct, or delete your personal information, to withdraw consent, or to object to how we use it. To make a request, email us at [${site.email}](mailto:${site.email}). We will respond within a reasonable time.

## Children

The Site is intended for businesses and is not directed at children under 18. We do not knowingly collect their personal information.

## Links to other sites

The Site links to third-party sites such as Instagram, LinkedIn, and GitHub. Their privacy practices are their own; please read their policies.

## Changes to this policy

We may update this policy from time to time. The date at the top shows when it last changed.

## Contact

Questions about this policy or your data: [${site.email}](mailto:${site.email}).
`;

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/privacy",
            name: `Privacy Policy — ${site.name}`,
            description,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        intro="What we collect, why we collect it, and what you can ask us to do with it."
      />
      <div className="container-page section-y-sm pb-24">
        <div className="prose-blog max-w-[68ch]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}
