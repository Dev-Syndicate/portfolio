import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

import { seo, site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Bloom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "./contact-form";

/** Instagram glyph — lucide-react dropped its brand icons, so it's inline. */
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

const instagramUrl =
  seo.sameAs.find((u) => u.includes("instagram.com")) ??
  "https://www.instagram.com/dev.syndicate/";
const instagramHandle = "@dev.syndicate";

const description =
  "Tell us what you're building and what it needs to achieve. We'll come back with an honest view of scope and approach. Contact Dev Syndicate to start your project.";

export const metadata = pageMetadata({
  title: "Contact",
  description,
  path: "/contact",
  keywords: ["contact Dev Syndicate", "hire web developers", "start a project"],
});

const details = [
  {
    icon: Mail,
    title: "Email us",
    body: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: InstagramIcon,
    title: "Follow us",
    body: instagramHandle,
    href: instagramUrl,
  },
  {
    icon: MessageSquare,
    title: "What to send",
    body: "What you're building, who it's for, and what it has to achieve. Rough is fine — we'd rather start from the real problem than a polished brief.",
  },
  {
    icon: ShieldCheck,
    title: "What you get back",
    body: "An honest read on scope and approach — including when the answer is that you don't need us for this.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/contact",
            name: "Contact — Dev Syndicate",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Contact"
        title={{ lead: "Tell us where", lit: "the work gets stuck." }}
        intro="Share the goal and the constraints. You'll get an honest view of scope, timeline, and cost — including when the answer is that you don't need us."
      />

      <div className="section-y-sm pb-24">
        <div className="container-page grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-6">
          {/* The form sits in the brightest panel on the page — this is the one
              thing the page is for, so it gets the light. */}
          <Reveal>
            <Bloom from="tl" soft={false} className="p-7 sm:p-10">
              <ContactForm />
            </Bloom>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-3 lg:sticky lg:top-28">
            {details.map(({ icon: Icon, title, body, href }) => (
              <Bloom key={title} from="tr" className="p-6">
                <span
                  aria-hidden
                  className="mb-4 grid size-10 shrink-0 place-items-center rounded-full border border-hairline bg-wash text-foreground"
                >
                  <Icon className="size-[1.125rem]" strokeWidth={1.6} />
                </span>

                <h2 className="font-medium tracking-tight">{title}</h2>

                {href ? (
                  <a
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="mt-1.5 text-[0.9375rem] text-primary underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {body}
                  </a>
                ) : (
                  <p className="mt-1.5 text-[0.9375rem] leading-[1.7] text-muted-foreground">
                    {body}
                  </p>
                )}
              </Bloom>
            ))}
          </Reveal>
        </div>
      </div>
    </>
  );
}
