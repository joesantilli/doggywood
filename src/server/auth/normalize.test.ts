import { describe, expect, it } from "vitest";
import { normalizeEmail, normalizePhoneE164 } from "@/server/auth/normalize";

describe("normalizeEmail", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeEmail("  ada@example.com  ")).toBe("ada@example.com");
  });

  it("lowercases the address", () => {
    expect(normalizeEmail("Ada@Example.COM")).toBe("ada@example.com");
  });

  it("rejects an empty value", () => {
    expect(() => normalizeEmail("   ")).toThrow("Email is required");
  });

  it("rejects clearly invalid email syntax", () => {
    expect(() => normalizeEmail("not-an-email")).toThrow("Enter a valid email address");
    expect(() => normalizeEmail("ada@")).toThrow("Enter a valid email address");
  });
});

describe("normalizePhoneE164", () => {
  it("normalizes a ten digit US number", () => {
    expect(normalizePhoneE164("7605551212")).toBe("+17605551212");
  });

  it("normalizes a formatted US number", () => {
    expect(normalizePhoneE164("(760) 555 1212")).toBe("+17605551212");
    expect(normalizePhoneE164("760 555 1212")).toBe("+17605551212");
    expect(normalizePhoneE164("760.555.1212")).toBe("+17605551212");
  });

  it("normalizes a plus-one number", () => {
    expect(normalizePhoneE164("+1 760 555 1212")).toBe("+17605551212");
  });

  it("normalizes a leading one number", () => {
    expect(normalizePhoneE164("1 760 555 1212")).toBe("+17605551212");
  });

  it("rejects an invalid short number", () => {
    expect(() => normalizePhoneE164("5551212")).toThrow("Enter a valid mobile number");
  });

  it("rejects an invalid long number", () => {
    expect(() => normalizePhoneE164("176055512123")).toThrow("Enter a valid mobile number");
  });

  it("rejects alphabetic input", () => {
    expect(() => normalizePhoneE164("call me")).toThrow("Enter a valid mobile number");
  });

  it("rejects empty input", () => {
    expect(() => normalizePhoneE164("   ")).toThrow("Mobile number is required");
  });
});
