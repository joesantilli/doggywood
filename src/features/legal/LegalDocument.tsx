import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import type { LegalBlock, LegalDocumentContent } from "@/content/legalDocument";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong className="font-semibold text-launch-navy" key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a className="text-launch-accent underline" href={link[2]} key={index}>
          {link[1]}
        </a>
      );
    }

    return part;
  });
}

function LegalBlocks({ blocks }: { blocks: readonly LegalBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        if (block.kind === "address") {
          return (
            <address
              className="text-body not-italic text-launch-navy"
              key={`${block.kind}-${index}`}
            >
              {block.lines.map((line, lineIndex) => (
                <span className="block" key={line}>
                  {lineIndex === 0 ? <strong className="font-semibold">{line}</strong> : line}
                </span>
              ))}
            </address>
          );
        }

        if (block.kind === "list") {
          return (
            <ul className="flex flex-col gap-1.5" key={`${block.kind}-${index}`}>
              {block.items.map((item) => (
                <li
                  className="flex items-start gap-2.5 text-body text-launch-muted"
                  key={item}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-launch-gold"
                  />
                  <span>
                    <RichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p className="text-body text-launch-muted" key={`${block.kind}-${index}`}>
            <RichText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

function LegalSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4" id={id}>
      <h2 className="text-[18px] leading-6 font-extrabold tracking-[0.01em] text-launch-navy lg:text-[20px] lg:leading-7">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export function LegalDocument({ document }: { document: LegalDocumentContent }) {
  const { preamble, sections, closing } = document;

  return (
    <PageContainer width="reading">
      <article className="flex min-w-0 flex-col gap-8 py-space-40 pb-space-32 lg:gap-10 lg:pt-space-48">
        <header className="text-center">
          <p className="dw-eyebrow mx-auto">{document.documentType}</p>
          <h1 className="dw-legal-title mt-3 text-h1 text-launch-navy">{document.title}</h1>
          <p className="mt-3 text-body text-launch-muted">
            {document.effectiveDateLabel}: {document.effectiveDate}
          </p>
        </header>

        <LegalBlocks blocks={preamble} />

        {sections.map((section) => (
          <LegalSection heading={section.heading} id={section.id} key={section.id}>
            <LegalBlocks blocks={section.blocks} />
          </LegalSection>
        ))}

        <footer className="border-t border-launch-line pt-6">
          <p className="text-[18px] font-extrabold text-launch-navy">{closing.brand}</p>
          <p className="mt-2 text-body text-launch-muted">
            <RichText text={closing.sponsorLine} />
          </p>
          <address className="mt-3 text-body not-italic text-launch-navy">
            {closing.address.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </address>
        </footer>
      </article>
    </PageContainer>
  );
}
