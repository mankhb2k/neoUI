import type { ButtonHTMLAttributes, HTMLAttributes, SVGAttributes } from "react";
import styles from "./button.module.css";

export type ButtonVariant = "default" | "primary" | "secondary" | "soft" | "outline" | "ghost" | "destructive" | "link";
export type ButtonSize = "small" | "medium" | "default" | "large" | "icon" | "icon-small" | "icon-large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` is kept as an alias of `default`. */
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  default: styles.default,
  primary: styles.primary,
  secondary: styles.secondary,
  soft: styles.soft,
  outline: styles.outline,
  ghost: styles.ghost,
  destructive: styles.destructive,
  link: styles.link,
};

const sizeClass: Record<ButtonSize, string> = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  default: styles.sizeDefault,
  large: styles.sizeLarge,
  icon: styles.sizeIcon,
  "icon-small": styles.sizeIconSmall,
  "icon-large": styles.sizeIconLarge,
};

export function Button({
  variant = "default",
  size = "default",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={[styles.button, sizeClass[size], variantClass[variant], className].filter(Boolean).join(" ")}
    />
  );
}

/** Loading indicator. Add `data-icon="inline-start"` or `"inline-end"` for spacing inside a Button. */
export function Spinner({ className, ...props }: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
      className={[styles.spinner, className].filter(Boolean).join(" ")}
    >
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}

/** Joins buttons into one control. */
export function ButtonGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="group"
      {...props}
      className={[styles.group, className].filter(Boolean).join(" ")}
    />
  );
}
