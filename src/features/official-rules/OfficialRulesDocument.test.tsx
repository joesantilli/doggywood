import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { officialRulesDocument } from "@/content/officialRules";
import { OfficialRulesDocument } from "@/features/official-rules/OfficialRulesDocument";

function visibleText(html: string) {
  return html.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
}

describe("official rules page", () => {
  it("renders the Official Rules and does not include counsel notes", () => {
    const html = visibleText(renderToStaticMarkup(<OfficialRulesDocument />));

    expect(html).toContain(officialRulesDocument.title);
    expect(html).toContain("No Purchase Necessary");
    expect(html).toContain("Pet Platforms, Inc. dba Verify.Dog");
    expect(html).toContain("$500 USD");
    expect(html).toContain("seven day head to head tie breaker voting period");
    expect(html).toContain("35. Questions");
    expect(html).toContain("dw-eyebrow");
    expect(html).toContain("2525 Ponce de Leon Blvd #300");
    expect(html).not.toContain("COMING SOON");
    expect(html).not.toContain("I would have counsel review");
  });
});
