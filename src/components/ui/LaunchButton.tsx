import type { ReactNode } from "react";
import Link from "next/link";

type LaunchButtonSize = "header" | "hero" | "default" | "compact";

type LaunchButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "inverse";
  size?: LaunchButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

function classNameFor(
  variant: "primary" | "outline" | "inverse",
  size: LaunchButtonSize,
  fullWidth: boolean,
) {
  const width = fullWidth ? "w-full" : "";
  const sizing = {
    header: "h-10 min-w-0 px-4 text-button",
    hero: "h-[52px] px-5 text-button",
    default: "min-h-[54px] px-space-24 text-button",
    compact: "h-12 min-h-12 px-6 text-[15px] font-bold",
  }[size];
  const shared = `inline-flex items-center justify-center rounded-[10px] ${sizing} transition-colors`;

  if (variant === "outline") {
    return `${shared} border border-launch-navy bg-white text-launch-navy hover:bg-launch-page ${width}`;
  }

  if (variant === "inverse") {
    return `${shared} bg-launch-navy text-white hover:bg-black ${width}`;
  }

  return `${shared} bg-launch-gold text-launch-navy hover:bg-launch-gold-hover ${width}`;
}

export function LaunchButton({
  children,
  href,
  type = "button",
  variant = "primary",
  size = "default",
  fullWidth = false,
  disabled = false,
  className = "",
  onClick,
}: LaunchButtonProps) {
  const classes = `${classNameFor(variant, size, fullWidth)} ${className}`.trim();

  if (href) {
    if (href.startsWith("http")) {
      return (
        <a className={classes} href={href} rel="noreferrer">
          {children}
        </a>
      );
    }

    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${classes} disabled:opacity-60`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
