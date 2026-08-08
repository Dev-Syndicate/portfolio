import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

import { seo, site } from "@/lib/content";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Conversation } from "@/components/artwork/conversation";
import { ContactForm } from "./contact-form";

/** Instagram glyph — lucide-react dropped its brand icons, so it's inline.
 *  Accepts the same props the render passes to lucide icons. */
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
    body: "An honest view of scope and approach, including when the answer is that you don't need us for it.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/contact", name: "Contact — Dev Syndicate", description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you're building."
        intro="Share the goal and the constraints. We'll come back with an honest view of scope, timeline, and cost — including when the answer is that you don't need us."
        visual={<Conversation />}
      />

      {/* The form area — the cards carry the structure; the ground stays the
          same liquid as the rest of the site. */}
      <div className="tone-light relative isolate pt-16 pb-20">
        <div className="relative container-page grid gap-12 pt-4 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <Reveal className="surface-card p-7 sm:p-9">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-8">
            {details.map(({ icon: Icon, title, body, href }) => (
              <div key={title} className="flex flex-col gap-2">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="font-semibold">{title}</h2>
                {href ? (
                  <a
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-[0.9375rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {body}
                  </a>
                ) : (
                  <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </>
  );
}
