import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variantClasses = {
  primary:
    "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)] active:bg-[color:var(--color-accent-strong)]",
  secondary:
    "bg-[color:var(--color-panel-strong)] text-[color:var(--color-text)] active:opacity-80",
  ghost:
    "bg-transparent text-[color:var(--color-accent)] active:bg-[color:var(--color-accent-soft)]",
} as const;

const sizeClasses = {
  sm: "min-h-10 px-4 text-[13px]",
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-12 px-6 text-[16px]",
} as const;

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
};

type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonProps = ButtonLinkProps | ButtonButtonProps;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const classes = cn(
    "pressable inline-flex items-center justify-center rounded-full font-semibold tracking-tight disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props as ButtonLinkProps;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonButtonProps;
  return (
    <button className={classes} type={buttonProps.type ?? "button"} {...buttonProps}>
      {children}
    </button>
  );
}
