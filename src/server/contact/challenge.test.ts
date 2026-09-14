import { describe, expect, it } from "vitest";
import {
  CONTACT_CHALLENGE_TTL_MS,
  createContactChallenge,
  verifyContactChallenge,
} from "@/server/contact/challenge";

const secret = "local-development-session-secret-32ch";

describe("contact anti-spam challenge", () => {
  it("accepts the matching code for a fresh token", () => {
    const now = Date.now();
    const challenge = createContactChallenge(secret, now);
    expect(challenge.code).toHaveLength(5);
    expect(
      verifyContactChallenge(secret, challenge.token, challenge.code, { now: now + 2_000 }),
    ).toBe(true);
    expect(
      verifyContactChallenge(secret, challenge.token, challenge.code.toLowerCase(), {
        now: now + 2_000,
      }),
    ).toBe(true);
  });

  it("rejects a wrong code, expired token, or too-fast submission", () => {
    const now = Date.now();
    const challenge = createContactChallenge(secret, now);
    expect(verifyContactChallenge(secret, challenge.token, "XXXXX", { now: now + 2_000 })).toBe(
      false,
    );
    expect(
      verifyContactChallenge(secret, challenge.token, challenge.code, {
        now: now + CONTACT_CHALLENGE_TTL_MS + 1,
      }),
    ).toBe(false);
    expect(
      verifyContactChallenge(secret, challenge.token, challenge.code, {
        now,
        minAgeMs: 1500,
      }),
    ).toBe(false);
  });
});
