import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

const base = cn(
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full",
  "font-medium whitespace-nowrap select-none isolate",
  // PRD motion spec: scale 1.03, soft shadow transition, 250ms ease-out
  "transition-[transform,background-color,box-shadow,border-color,color]",
  "duration-[var(--duration-base)] ease-out-soft",
  "hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.99]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "disabled:pointer-events-none disabled:opacity-50",
  // Respect reduced-motion users: no scale or lift nudge
  "motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
  "motion-reduce:active:scale-100",
);

const variants: Record<ButtonVariant, string> = {
  primary: cn(
    "sheen bg-primary text-primary-foreground",
    // Inner top highlight makes the pill read as a lit physical object
    // rather than a flat colour fill. Palette-driven, so it stays correct if
    // --primary is repointed at a darker step.
    "shadow-[var(--elevation-2),inset_0_1px_0_var(--highlight-strong)]",
    "hover:bg-primary-hover hover:shadow-[var(--elevation-3),inset_0_1px_0_var(--highlight-strong)]",
  ),
  secondary: cn(
    "bg-secondary text-secondary-foreground shadow-[var(--elevation-1)]",
    "hover:bg-secondary/70 hover:shadow-[var(--elevation-2)]",
  ),
  outline: cn(
    "conic-sweep glass text-foreground",
    "hover:border-primary/50 hover:text-primary",
  ),
  ghost: "text-foreground hover:bg-secondary",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >;

type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    ComponentProps<"button">,
    "className" | "children"
  >;

/**
 * Renders a `<Link>` when `href` is provided, otherwise a `<button>`.
 * Server-safe — the magnetic pull from the PRD motion spec is layered on
 * separately via `<Magnetic>` so most buttons stay zero-JS.
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant, size, className, children, ...rest } = props;
  const classes = buttonVariants({ variant, size, className });

  if (typeof rest === "object" && "href" in rest && rest.href) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
