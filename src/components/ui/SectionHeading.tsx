import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  tone?: "default" | "onDark";
};

const sizeClassName = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const;

export function SectionHeading({
  children,
  as: Tag = "h2",
  tone = "default",
}: SectionHeadingProps) {
  const color = tone === "onDark" ? "text-warm-white" : "text-launch-navy";
  return <Tag className={`${sizeClassName[Tag]} ${color}`}>{children}</Tag>;
}
