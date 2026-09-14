import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LaunchHeader } from "@/components/layout/LaunchHeader";

describe("launch header", () => {
  it("keeps Contest Rules as a homepage bookmark and Contact as /contact", () => {
    const html = renderToStaticMarkup(<LaunchHeader />);
    expect(html).toContain('href="/#contest-rules"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="/#how-it-works"');
    expect(html).toContain('href="/#faq"');
  });
});
