import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { termsOfUseDocument } from "@/content/termsOfUse";
import { TermsOfUseDocument } from "@/features/legal/TermsOfUseDocument";

function visibleText(html: string) {
  return html.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
}

describe("terms of use page", () => {
  it("renders the Terms of Use and does not include counsel notes", () => {
    const html = visibleText(renderToStaticMarkup(<TermsOfUseDocument />));

    expect(html).toContain(termsOfUseDocument.title);
    expect(html).toContain("September 13, 2026");
    expect(html).toContain("Pet Platforms, Inc. dba Verify.Dog");
    expect(html).toContain("2525 Ponce de Leon Blvd #300");
    expect(html).toContain("No Purchase Necessary");
    expect(html).toContain("AGREEMENT TO BINDING ARBITRATION");
    expect(html).toContain("CLASS ACTION WAIVER");
    expect(html).toContain("American Arbitration Association");
    expect(html).toContain("Miami Dade County, Florida");
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="/rules"');
    expect(html).toContain('href="/privacy"');
    expect(html).toContain("dw-eyebrow");
    expect(html).not.toContain("COMING SOON");
    expect(html).not.toContain("I would have counsel review");
    expect(html).not.toContain("chatgpt.com");
    expect(html).not.toContain("Legal Information Institute");
  });
});
