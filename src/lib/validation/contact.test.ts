import { describe, expect, it } from "vitest";
import { parseContactForm } from "@/lib/validation/contact";

function payload(overrides: Record<string, string> = {}) {
  return {
    name: "Ada Lovelace",
    phone: "5551234567",
    email: "ada@example.com",
    subject: "Contest question",
    message: "How do I enter next month?",
    spamCode: "AB23K",
    spamToken: "token",
    website: "",
    ...overrides,
  };
}

describe("contact form validation", () => {
  it("accepts a complete contact payload", () => {
    expect(parseContactForm(payload()).success).toBe(true);
  });

  it("requires name, phone, email, subject, message, and anti-spam code", () => {
    for (const field of ["name", "phone", "email", "subject", "message", "spamCode"]) {
      const parsed = parseContactForm(payload({ [field]: "" }));
      expect(parsed.success).toBe(false);
    }
  });

  it("rejects an invalid email", () => {
    expect(parseContactForm(payload({ email: "not-an-email" })).success).toBe(false);
  });
});
