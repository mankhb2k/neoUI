import type { HTMLAttributes } from "react";

const baseStyle = {
  background: "linear-gradient(145deg, #1a1e22, #15181b)",
  border: "1px solid #343a41",
  borderRadius: 12,
  color: "#f2f4f6",
  padding: 20,
} as const;

export function Card({ style, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} style={{ ...baseStyle, ...style }} />;
}

export function CardHeader({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} style={{ marginBottom: 12, ...style }} />;
}

export function CardTitle({ style, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} style={{ fontSize: 16, fontWeight: 600, margin: 0, ...style }} />;
}

export function CardDescription({ style, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} style={{ color: "#929ba5", fontSize: 13, lineHeight: 1.6, margin: "6px 0 0", ...style }} />;
}

export function CardContent({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} style={style} />;
}
