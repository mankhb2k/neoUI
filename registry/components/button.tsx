import type { ButtonHTMLAttributes, CSSProperties } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "#16aee9", borderColor: "#2dc2fa", color: "#04131b" },
  secondary: { background: "#252a30", borderColor: "#383f47", color: "#e9edf1" },
  outline: { background: "transparent", borderColor: "#3a4149", color: "#d7dde3" },
  ghost: { background: "transparent", borderColor: "transparent", color: "#a7b0ba" },
  danger: { background: "#321d20", borderColor: "#633238", color: "#ff9ba2" },
};

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: { padding: "7px 10px", fontSize: 12 },
  md: { padding: "10px 14px", fontSize: 13 },
  lg: { padding: "13px 18px", fontSize: 14 },
};

export function Button({ variant = "primary", size = "md", style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...variants[variant],
        ...sizes[size],
        alignItems: "center",
        border: "1px solid",
        borderRadius: 8,
        cursor: "pointer",
        display: "inline-flex",
        fontFamily: "inherit",
        fontWeight: 600,
        justifyContent: "center",
        lineHeight: 1.2,
        transition: "filter 160ms ease",
        ...style,
      }}
    />
  );
}
