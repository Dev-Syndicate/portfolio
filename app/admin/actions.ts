"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; ok?: boolean; next?: string };

/**
 * Sign in with email + password. On success the session cookie is set and we
 * return `ok` with the safe destination — the client then does a history
 * `replace()` so /admin/login never stays in the back/forward stack (pressing
 * Back from the dashboard won't bounce through login into the public site).
 *
 * There is no sign-up action anywhere — accounts are created only in the
 * Supabase dashboard, and email sign-ups are disabled there, so this is the
 * single door in.
 */
export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const requested = String(formData.get("next") ?? "/admin");
  // Only ever allow an in-admin destination — never an attacker-supplied URL.
  const next = requested.startsWith("/admin") ? requested : "/admin";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague — never reveal whether the email exists.
    return { error: "Invalid email or password." };
  }

  return { ok: true, next };
}

/** Sign out and return to the login page. */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
