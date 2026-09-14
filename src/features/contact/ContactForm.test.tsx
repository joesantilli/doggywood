import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/features/contact/ContactForm";

describe("contact form", () => {
  it("renders contact fields and an anti-spam control, not the contest entry form", () => {
    const html = renderToStaticMarkup(
      <ContactForm challengeCode="AB23K" challengeToken="token" />,
    );

    expect(html).toContain("Name");
    expect(html).toContain("Phone");
    expect(html).toContain("Email");
    expect(html).toContain("Subject");
    expect(html).toContain("Message");
    expect(html).toContain("Anti-spam code");
    expect(html).toContain("AB23K");
    expect(html).toContain("Send Message");
    expect(html).not.toContain("Dog's Name");
    expect(html).not.toContain("SUBMIT MY DOG");
    expect(html).not.toContain("VIDEO UPLOAD");
  });
});
