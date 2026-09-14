import Link from "next/link";
import type { ReactNode } from "react";

type ButtonBaseProps = {
  children: ReactNode;
  fullWidthOnMobile?: boolean;
  tone?: "default" | "onDark";
};

type ButtonLinkProps = ButtonBaseProps & {
  href: string;
};

type ButtonActionProps = ButtonBaseProps & {
  href?: never;
  type?: "button" | "submit";
  disabled?: boolean;
};

type ButtonProps = ButtonLinkProps | ButtonActionProps;

function classNameForButton(
  variant: "primary" | "secondary",
  fullWidthOnMobile: boolean,
  tone: "default" | "onDark",
) {
  const width = fullWidthOnMobile ? "w-full sm:w-auto" : "";
  const shared =
    "inline-flex min-h-12 items-center justify-center rounded-pill px-space-24 text-button transition-colors";

  if (variant === "primary") {
    return `${shared} bg-red-carpet text-warm-white hover:bg-red-carpet-hover ${width}`;
  }

  if (tone === "onDark") {
    return `${shared} border border-warm-white bg-transparent text-warm-white hover:bg-warm-white/10 ${width}`;
  }

  return `${shared} border border-midnight bg-transparent text-midnight hover:bg-champagne ${width}`;
}

export function PrimaryButton(props: ButtonProps) {
  const className = classNameForButton(
    "primary",
    props.fullWidthOnMobile ?? false,
    props.tone ?? "default",
  );

  if ("href" in props && props.href) {
    return (
      <Link className={className} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const actionProps = props as ButtonActionProps;
  return (
    <button
      className={`${className} disabled:opacity-60`}
      disabled={actionProps.disabled}
      type={actionProps.type ?? "button"}
    >
      {actionProps.children}
    </button>
  );
}

export function SecondaryButton(props: ButtonProps) {
  const className = classNameForButton(
    "secondary",
    props.fullWidthOnMobile ?? false,
    props.tone ?? "default",
  );

  if ("href" in props && props.href) {
    return (
      <Link className={className} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const actionProps = props as ButtonActionProps;
  return (
    <button
      className={`${className} disabled:opacity-60`}
      disabled={actionProps.disabled}
      type={actionProps.type ?? "button"}
    >
      {actionProps.children}
    </button>
  );
}
