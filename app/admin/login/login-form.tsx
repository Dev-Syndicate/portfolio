"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { login, type AuthState } from "../actions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const field = cn(
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem]",
  "text-foreground placeholder:text-muted-foreground/70",
  "transition-colors focus:border-primary focus:outline-none",
);

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});

  // On success, REPLACE (not push) so /admin/login leaves the history stack —
  // Back from the dashboard then skips login entirely. router.refresh syncs
  // the new session into server components.
  useEffect(() => {
    if (state.ok) {
      router.replace(state.next ?? "/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={field}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants({ size: "lg" }), "mt-1 w-full")}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Signing in
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
