import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  officialRulesDocument,
  type RulesBlock,
} from "@/content/officialRules";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong className="font-semibold text-launch-navy" key={index}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function RulesBlocks({ blocks }: { blocks: readonly RulesBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        if (block.kind === "address") {
          return (
            <address
              className="text-body not-italic text-launch-navy"
              key={`${block.kind}-${index}`}
            >
              {block.lines.map((line) => (
                <span className="block" key={line}>
                  {line === officialRulesDocument.closing.address[0] ? (
                    <strong className="font-semibold">{line}</strong>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </address>
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

function RuleSection({
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

export function OfficialRulesDocument() {
  const { preamble, sections, closing } = officialRulesDocument;

  return (
    <PageContainer width="reading">
      <article className="flex flex-col gap-8 py-space-40 pb-space-32 lg:gap-10 lg:pt-space-48">
        <header className="text-center">
          <p className="dw-eyebrow mx-auto">{officialRulesDocument.documentType}</p>
          <h1 className="mt-3 text-h1 text-launch-navy">{officialRulesDocument.title}</h1>
        </header>

        <RuleSection heading={preamble.heading} id="no-purchase-necessary">
          <RulesBlocks blocks={preamble.blocks} />
        </RuleSection>

        {sections.map((section) => (
          <RuleSection heading={section.heading} id={section.id} key={section.id}>
            <RulesBlocks blocks={section.blocks} />
          </RuleSection>
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
