"use client";

import { useActionState, useId } from "react";
import {
  ArrowRight,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Loader2,
} from "lucide-react";

import { submitContact, type ContactState } from "./actions";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const initialState: ContactState = { status: "idle" };

const fieldBase = cn(
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem]",
  "text-foreground placeholder:text-muted-foreground/70",
  "transition-colors duration-[var(--duration-fast)]",
  "focus:border-primary focus:outline-none",
);

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );
  const id = useId();

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          name="name"
          label="Name"
          required
          autoComplete="name"
          placeholder="Jane Okafor"
          error={errors.name}
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label="Email"
          required
          autoComplete="email"
          placeholder="jane@company.com"
          error={errors.email}
        />
        <Field
          id={`${id}-company`}
          name="company"
          label="Company"
          autoComplete="organization"
          placeholder="Optional"
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${id}-interest`}
            className="text-sm font-medium text-foreground"
          >
            What do you need?
          </label>
          {/* Options come from the services list rather than a budget ladder —
              we have no published pricing, so asking for a range would imply
              one exists.

              `appearance-none` drops the native arrow, so the control would
              otherwise be indistinguishable from the text inputs beside it.
              The chevron below replaces it. */}
          <div className="relative">
            <select
              id={`${id}-interest`}
              name="interest"
              defaultValue=""
              className={cn(fieldBase, "appearance-none pr-11")}
            >
              <option value="">Not sure yet</option>
              {services.items.map((service) => (
                <option key={service.title}>{service.title}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${id}-message`}
          className="text-sm font-medium text-foreground"
        >
          What are you building?{" "}
          <span aria-hidden className="text-primary">
            *
          </span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          placeholder="A few sentences about the project, your timeline, and what success looks like."
          className={cn(
            fieldBase,
            "resize-y",
            errors.message && "border-destructive",
          )}
        />
        {errors.message ? (
          <p
            id={`${id}-message-error`}
            className="text-sm text-destructive"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className={buttonVariants({ size: "lg" })}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
        <p className="text-sm text-muted-foreground">
          We&rsquo;ll come back with an honest view of scope and approach.
        </p>
      </div>

      {/* Announced to screen readers when the action resolves. */}
      <div aria-live="polite" role="status">
        {state.status !== "idle" && state.message ? (
          <p
            className={cn(
              "flex items-start gap-2.5 rounded-xl border p-4 text-sm",
              state.status === "success"
                ? "border-primary/30 bg-primary/5 text-foreground"
                : "border-destructive/30 bg-destructive/5 text-foreground",
            )}
          >
            {state.status === "success" ? (
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            ) : (
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
            )}
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  error,
  required,
  type = "text",
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden className="text-primary">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldBase, error && "border-destructive")}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
