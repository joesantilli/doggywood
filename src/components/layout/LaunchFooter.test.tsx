import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LaunchFooter } from "@/components/layout/LaunchFooter";

describe("launch footer", () => {
  it("sends Contact to /contact instead of the entry form", () => {
    const html = renderToStaticMarkup(<LaunchFooter />);
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Contact");
    expect(html).toContain("Official Rules");
    expect(html).toContain("Privacy Policy");
    expect(html).toContain("Terms of Service");
    expect(html).toContain('href="/#about"');
    expect(html).toContain("About");
    expect(html).not.toContain('href="/enter"');
  });
});
