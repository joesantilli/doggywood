import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { privacyPolicyDocument } from "@/content/privacyPolicy";
import { PrivacyPolicyDocument } from "@/features/legal/PrivacyPolicyDocument";

function visibleText(html: string) {
  return html.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
}

describe("privacy policy page", () => {
  it("renders the Privacy Policy and does not include placeholder or citation notes", () => {
    const html = visibleText(renderToStaticMarkup(<PrivacyPolicyDocument />));

    expect(html).toContain(privacyPolicyDocument.title);
    expect(html).toContain("September 13, 2026");
    expect(html).toContain("Pet Platforms, Inc. dba Verify.Dog");
    expect(html).toContain("Doggywood Contest Information");
    expect(html).toContain("Voting Information");
    expect(html).toContain("ScanAndGo.pet");
    expect(html).toContain("assistance animal");
    expect(html).toContain("We do not sell personal information for money.");
    expect(html).toContain("California Residents");
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="/terms"');
    expect(html).toContain('href="/rules"');
    expect(html).toContain("dw-eyebrow");
    expect(html).not.toContain("COMING SOON");
    expect(html).not.toContain("privacy policy placeholder");
    expect(html).not.toContain("chatgpt.com");
    expect(html).not.toContain("scanandgo.pet/privacy");
  });
});
