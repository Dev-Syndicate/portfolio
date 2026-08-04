import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";

import { site } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Pattern } from "@/components/ui/pattern";
import { WaveDivider, ZONE } from "@/components/ui/wave-divider";
import { Conversation } from "@/components/artwork/conversation";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you're building and what it needs to achieve. We'll come back with an honest view of scope and approach.",
};

const details = [
  {
    icon: Mail,
    title: "Email us",
    body: site.email,
    href: `mailto:${site.email}`,
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
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you're building."
        intro="Share the goal and the constraints. We'll come back with an honest view of scope, timeline, and cost — including when the answer is that you don't need us."
        visual={<Conversation />}
      />

      {/* The form surfaces into near-white: the one place on the site where
          we ask the visitor to do work, so it gets the clearest ground. */}
      <WaveDivider from={ZONE.deep} to={ZONE.surface} flip />

      <div className="tone-light relative isolate overflow-hidden pb-20">
        <Pattern variant="scales" tone="text-accent/[0.16]" />
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
