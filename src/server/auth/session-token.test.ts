import { describe, expect, it } from "vitest";
import {
  SESSION_TTL_MS,
  generateSessionToken,
  hashSessionToken,
  isSessionExpired,
  sessionExpiresAt,
} from "@/server/auth/session-token";

describe("session tokens", () => {
  it("creates a high-entropy token", () => {
    const token = generateSessionToken();
    expect(token.length).toBeGreaterThanOrEqual(32);
    expect(generateSessionToken()).not.toBe(token);
  });

  it("hashes tokens with SHA-256 hex and never stores the raw value", () => {
    const token = "example-session-token-value";
    const hash = hashSessionToken(token);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toBe(token);
    expect(hashSessionToken(token)).toBe(hash);
    expect(hashSessionToken("other")).not.toBe(hash);
  });

  it("treats a session as expired at the expiration instant", () => {
    const now = new Date("2026-09-11T12:00:00.000Z");
    expect(isSessionExpired(now, now)).toBe(true);
    expect(isSessionExpired(new Date(now.getTime() + 1000), now)).toBe(false);
    expect(isSessionExpired(new Date(now.getTime() - 1000), now)).toBe(true);
  });

  it("uses a 30 day default lifetime", () => {
    const now = new Date("2026-09-11T12:00:00.000Z");
    expect(SESSION_TTL_MS).toBe(30 * 24 * 60 * 60 * 1000);
    expect(sessionExpiresAt(now).getTime() - now.getTime()).toBe(SESSION_TTL_MS);
  });
});
