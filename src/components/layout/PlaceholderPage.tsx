import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PlaceholderPageProps = {
  title: string;
  description: string;
  image?: ReactNode;
  cta?: ReactNode;
  children?: ReactNode;
};

export function PlaceholderPage({
  title,
  description,
  image,
  cta,
  children,
}: PlaceholderPageProps) {
  return (
    <PageContainer>
      <section className="flex flex-col gap-space-16 py-space-48">
        <header className="text-center">
          <p className="dw-eyebrow mx-auto">COMING SOON</p>
          <div className="mt-3">
            <SectionHeading as="h1">{title}</SectionHeading>
          </div>
        </header>
        {image}
        <p className="max-w-reading text-body-large text-launch-muted">
          {description}
        </p>
        {cta}
        {children}
      </section>
    </PageContainer>
  );
}
