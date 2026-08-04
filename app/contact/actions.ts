"use server";

import { headers } from "next/headers";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field name → error, for inline validation messages. */
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Handles a contact enquiry.
 *
 * Delivery is intentionally pluggable: set `CONTACT_WEBHOOK_URL` to any
 * endpoint that accepts a JSON POST (Resend, Formspree, a Slack incoming
 * webhook, your own handler). Until that is configured the action refuses the
 * submission and tells the visitor to email directly, rather than showing a
 * success message for a request that went nowhere.
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

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "error",
      message:
        "Our form isn't connected yet — please email hello@devsyndicate.com directly and we'll pick it up from there.",
    };
  }

  try {
    const referer = (await headers()).get("referer") ?? undefined;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        company: company || null,
        interest: interest || null,
        message,
        submittedFrom: referer,
      }),
    });

    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please email hello@devsyndicate.com instead.",
    };
  }

  return {
    status: "success",
    message:
      "Thanks — we've got it. We'll read it properly and come back to you with a considered reply.",
  };
}
