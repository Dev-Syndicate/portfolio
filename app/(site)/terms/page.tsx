import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";

const description =
  "The terms that apply when you use the DevSyndicate website, its content, and its contact form.";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description,
  path: "/terms",
});

const body = `
_Last updated: 18 October 2026_

These terms govern your use of ${site.url.replace("https://", "")} (the "Site"), operated by ${site.name} ("we", "us"). By using the Site you agree to them. If you do not agree, please do not use the Site.

## Use of the Site

You may browse the Site and share links to it. You agree not to:

- use the Site for anything unlawful, or in a way that could harm us or anyone else;
- try to gain unauthorised access to the Site, its admin area, or its systems;
- send spam, malicious code, or misleading information through the contact form;
- scrape, copy, or republish substantial parts of the Site without our written permission.

## Intellectual property

The Site's content — including text, articles, graphics, logos, and the ${site.name} name and mark — belongs to us or our licensors and is protected by copyright and trademark law. You may quote short excerpts with attribution and a link back. Anything beyond that needs our written permission.

## Our services

Information on the Site describes our services in general terms and is not an offer. Any project, engagement, or service we provide is governed by a separate written agreement (such as a proposal, statement of work, or contract). If that agreement conflicts with these terms, the agreement wins.

## Enquiries

Sending an enquiry does not create a client relationship or oblige either side to proceed. Please do not send confidential information through the contact form until we have agreed how it will be handled. How we treat the information you send is described in our [Privacy Policy](/privacy).

## Blog and other content

Articles and other content on the Site are for general information only. They are not professional, legal, or financial advice, and you should not rely on them as such. We try to keep content accurate but make no guarantee that it is complete or current.

## Third-party links

The Site links to sites we do not control. We are not responsible for their content, products, or practices.

## Disclaimer

The Site is provided "as is" and "as available", without warranties of any kind, express or implied. We do not guarantee that it will be uninterrupted, error-free, or free of harmful components.

## Limitation of liability

To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential loss, or any loss of data, profit, or business, arising from your use of the Site. Nothing in these terms limits liability that cannot be limited by law.

## Changes

We may update these terms from time to time. The date at the top shows when they last changed, and continuing to use the Site means you accept the current version.

## Governing law

These terms are governed by the laws of India, and the courts of India have exclusive jurisdiction over any dispute arising from them.

## Contact

Questions about these terms: [${site.email}](mailto:${site.email}).
`;

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/terms",
            name: `Terms & Conditions — ${site.name}`,
            description,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms & Conditions", path: "/terms" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        intro="The ground rules for using this site and what you can expect from us."
      />
      <div className="container-page section-y-sm pb-24">
        <div className="prose-blog max-w-[68ch]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}
