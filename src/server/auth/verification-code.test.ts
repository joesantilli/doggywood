import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  generateEmailVerificationCode,
  hashEmailVerificationCode,
  verifyEmailVerificationCode,
} from "@/server/auth/verification-code";

const secret = "test-session-secret-for-email-codes-32ch";

describe("email verification codes", () => {
  it("generates an exactly six digit numeric code", () => {
    for (let index = 0; index < 20; index += 1) {
      expect(generateEmailVerificationCode()).toMatch(/^\d{6}$/);
    }
  });

  it("verifies the same email and code against the stored hash", () => {
    const code = "042189";
    const hash = hashEmailVerificationCode(secret, "ada@example.com", code);
    expect(verifyEmailVerificationCode(secret, "ada@example.com", code, hash)).toBe(true);
  });

  it("rejects the wrong code", () => {
    const hash = hashEmailVerificationCode(secret, "ada@example.com", "042189");
    expect(verifyEmailVerificationCode(secret, "ada@example.com", "042188", hash)).toBe(false);
  });

  it("rejects the wrong email", () => {
    const hash = hashEmailVerificationCode(secret, "ada@example.com", "042189");
    expect(verifyEmailVerificationCode(secret, "other@example.com", "042189", hash)).toBe(false);
  });

  it("rejects a malformed code", () => {
    const hash = hashEmailVerificationCode(secret, "ada@example.com", "042189");
    expect(verifyEmailVerificationCode(secret, "ada@example.com", "42189", hash)).toBe(false);
    expect(verifyEmailVerificationCode(secret, "ada@example.com", "042189a", hash)).toBe(false);
    expect(verifyEmailVerificationCode(secret, "ada@example.com", "", hash)).toBe(false);
  });

  it("does not persist or equal the plaintext code", () => {
    const code = "042189";
    const hash = hashEmailVerificationCode(secret, "ada@example.com", code);
    expect(hash).not.toBe(code);
    expect(hash).not.toContain(code);
  });

  it("compares only fixed-length SHA-256 hex digests", () => {
    const hash = hashEmailVerificationCode(secret, "ada@example.com", "042189");
    expect(hash).toHaveLength(64);
    expect(hash).toBe(
      createHmac("sha256", secret).update("ada@example.com:042189").digest("hex"),
    );
    expect(verifyEmailVerificationCode(secret, "ada@example.com", "042189", hash.slice(0, 32))).toBe(
      false,
    );
    expect(verifyEmailVerificationCode(secret, "ada@example.com", "042189", "not-a-digest")).toBe(
      false,
    );
  });
});
