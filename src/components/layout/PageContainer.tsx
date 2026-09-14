import type { ReactNode } from "react";

type PageContainerWidth = "content" | "reading";

type PageContainerProps = {
  children: ReactNode;
  width?: PageContainerWidth;
  className?: string;
};

const widthClassName: Record<PageContainerWidth, string> = {
  content: "max-w-content",
  reading: "max-w-reading",
};

export function PageContainer({
  children,
  width = "content",
  className = "",
}: PageContainerProps) {
  return (
    <div className="page-shell">
      <div
        className={`mx-auto w-full min-w-0 ${widthClassName[width]} ${className}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}
