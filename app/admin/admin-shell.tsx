import Image from "next/image";
import Link from "next/link";

import { logout } from "./actions";

/**
 * The admin top bar + page container. A calm, focused shell for the person
 * writing posts — logo, area name, and sign-out on the left/right of a sticky
 * bar, with the page content in a comfortable centred column below.
 */
export function AdminShell({
  title,
  actions,
  children,
}: {
  title?: string;
  /** Optional right-aligned actions in the sub-header (e.g. "New post"). */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/dev-syndicate-logo.png"
              alt=""
              aria-hidden
              width={28}
              height={28}
              className="size-7"
            />
            <span className="text-sm font-semibold">
              Dev Syndicate{" "}
              <span className="text-muted-foreground">/ Blog admin</span>
            </span>
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {title ? (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {actions}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
