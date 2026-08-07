"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { site } from "@/lib/content";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field name → error, for inline validation messages. */
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Delivery config, read once from the server-side environment. None of these
 * are `NEXT_PUBLIC_*`, so they never reach the browser bundle.
 *
 *   RESEND_API_KEY     — Resend secret key (server-only credential).
 *   CONTACT_TO_EMAIL   — inbox that receives enquiries (defaults to site.email).
 *   CONTACT_FROM_EMAIL — verified sender on our domain, e.g.
 *                        "Dev Syndicate <contact@devsyndicate.in>".
 *
 * The recipient is fixed by config, never by form input — the form can't be
 * used to relay mail to an arbitrary address.
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? site.email;
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? `Dev Syndicate <${site.email}>`;

/** Neutralise a value before it goes into an email header (subject / reply-to).
 *  Strips CR/LF so a crafted field can't inject extra headers, and caps length. */
function headerSafe(value: string, max = 200): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

/** Minimal HTML escape so submitted text can't inject markup into the email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Handles a contact enquiry.
 *
 * Enquiries are delivered via Resend to our own inbox. The visitor's address is
 * set as Reply-To so the team can reply straight from the inbox, while `From`
 * stays on our verified domain (required for deliverability, and it stops the
 * form being used to spoof arbitrary senders). If the API key is absent the
 * action refuses the submission rather than showing a false success.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const interest = String(formData.get("interest") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot: bots fill every field, humans never see this one.
  const website = String(formData.get("website") ?? "").trim();

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(email))
    fieldErrors.email = "Please enter a valid email address.";
  if (message.length < 20)
    fieldErrors.message = "A sentence or two about the project helps us reply usefully.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  // Silently accept-and-drop spam so bots get no signal.
  if (website) {
    return { status: "success", message: "Thanks — we've got your message." };
  }

  if (!RESEND_API_KEY) {
    // Misconfiguration, not the visitor's fault — log for us, fall back for them.
    console.error("[contact] RESEND_API_KEY is not set; cannot deliver enquiry.");
    return {
      status: "error",
      message:
        `Our form isn't connected yet — please email ${site.email} directly and we'll pick it up from there.`,
    };
  }

  try {
    const referer = (await headers()).get("referer") ?? undefined;
    const resend = new Resend(RESEND_API_KEY);

    const subject = headerSafe(
      `New enquiry — ${name}${interest ? ` (${interest})` : ""}`,
    );

    const html = `
      <h2>New contact enquiry</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Company</strong></td><td>${escapeHtml(company) || "—"}</td></tr>
        <tr><td><strong>Interest</strong></td><td>${escapeHtml(interest) || "—"}</td></tr>
        <tr><td valign="top"><strong>Message</strong></td><td>${escapeHtml(message).replace(/\n/g, "<br>")}</td></tr>
        <tr><td><strong>Submitted from</strong></td><td>${escapeHtml(referer ?? "—")}</td></tr>
      </table>
    `.trim();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      // Visitor's address is only ever a Reply-To — never the From, never the
      // recipient — and is header-sanitised above via the regex validation.
      replyTo: email,
      subject,
      html,
    });

    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return {
      status: "error",
      message:
        `Something went wrong sending your message. Please email ${site.email} instead.`,
    };
  }

  return {
    status: "success",
    message:
      "Thanks — we've got it. We'll read it properly and come back to you with a considered reply.",
  };
}
