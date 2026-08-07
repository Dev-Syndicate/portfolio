import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  // The admin area must never be indexed.
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="container-page flex min-h-[80svh] items-center justify-center py-20">
      <div className="surface-card w-full max-w-sm p-8">
        <span aria-hidden className="card-node" />
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restricted area. Authorised access only.
        </p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
