import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const { cookieStore } = vi.hoisted(() => ({
  cookieStore: {
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  cookies: async () => cookieStore,
}));

import { getPrisma } from "@/lib/db";
import {
  EMAIL_VERIFICATION_MAX_ATTEMPTS,
  EMAIL_VERIFICATION_TTL_MS,
  EmailVerificationConflictError,
  EmailVerificationFailedError,
  verifyEmailVerification,
} from "@/server/auth/email-verification";
import { hashEmailVerificationCode } from "@/server/auth/verification-code";
import { hashSessionToken } from "@/server/auth/session-token";

const prisma = getPrisma();
const sessionSecret = "test-session-secret-for-email-codes-32ch";

function unique(label: string) {
  return `p03-ev-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function createEmailChallenge(destination: string, code: string, extra: Record<string, unknown> = {}) {
  return prisma.verificationChallenge.create({
    data: {
      channel: "EMAIL",
      destination,
      codeHash: hashEmailVerificationCode(sessionSecret, destination, code),
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
      ...extra,
    },
  });
}

describe("verifyEmailVerification", () => {
  const createdUserIds: string[] = [];
  const createdChallengeIds: string[] = [];

  beforeEach(() => {
    cookieStore.set.mockClear();
    cookieStore.get.mockReset();
    cookieStore.delete.mockClear();
  });

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await prisma.session.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.authIdentity.deleteMany({ where: { userId: { in: createdUserIds } } });
    }
    if (createdChallengeIds.length > 0) {
      await prisma.verificationChallenge.deleteMany({ where: { id: { in: createdChallengeIds } } });
    }
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
  });

  it("verifies a valid code, creates User, EMAIL identity, and a fresh session", async () => {
    const destination = `${unique("new")}@doggywood.test`;
    const code = "042189";
    const challenge = await createEmailChallenge(destination, code);
    createdChallengeIds.push(challenge.id);

    cookieStore.get.mockReturnValue({ value: "old-raw-session-token" });

    const result = await verifyEmailVerification({
      challengeId: challenge.id,
      code,
      sessionSecret,
      ipAddress: "203.0.113.80",
      userAgent: "vitest",
    });
    createdUserIds.push(result.userId);

    expect(result.email).toBe(destination);
    expect(result.emailVerifiedAt).toBeInstanceOf(Date);
    expect(result).not.toHaveProperty("code");
    expect(result).not.toHaveProperty("codeHash");
    expect(JSON.stringify(result)).not.toContain(code);
    expect(JSON.stringify(result)).not.toContain("token");

    const user = await prisma.user.findUniqueOrThrow({ where: { id: result.userId } });
    expect(user.email).toBe(destination);
    expect(user.emailVerifiedAt).not.toBeNull();
    expect(user.phoneE164).toBeNull();

    const identity = await prisma.authIdentity.findUniqueOrThrow({
      where: { provider_providerSubject: { provider: "EMAIL", providerSubject: destination } },
    });
    expect(identity.userId).toBe(user.id);
    expect(identity.email).toBe(destination);

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.consumedAt).not.toBeNull();
    expect(stored.codeHash).not.toBe(code);

    const sessions = await prisma.session.findMany({ where: { userId: user.id } });
    expect(sessions).toHaveLength(1);
    expect(cookieStore.set).toHaveBeenCalled();
    const cookieValue = cookieStore.set.mock.calls[0]?.[1];
    expect(typeof cookieValue).toBe("string");
    expect(cookieValue).not.toBe("old-raw-session-token");
    expect(JSON.stringify(result)).not.toContain(cookieValue);
    expect(JSON.stringify(result)).not.toContain("old-raw-session-token");
    expect(sessions[0]?.tokenHash).toBe(hashSessionToken(cookieValue));
  });

  it("fails a wrong code and increments the attempt count", async () => {
    const destination = `${unique("wrong")}@doggywood.test`;
    const challenge = await createEmailChallenge(destination, "111111");
    createdChallengeIds.push(challenge.id);

    await expect(
      verifyEmailVerification({ challengeId: challenge.id, code: "222222", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.attemptCount).toBe(1);
    expect(stored.consumedAt).toBeNull();
    expect(stored.invalidatedAt).toBeNull();
    expect(await prisma.user.findUnique({ where: { email: destination } })).toBeNull();
  });

  it("invalidates the challenge after five failed attempts", async () => {
    const destination = `${unique("max")}@doggywood.test`;
    const code = "333333";
    const challenge = await createEmailChallenge(destination, code);
    createdChallengeIds.push(challenge.id);

    for (let index = 0; index < EMAIL_VERIFICATION_MAX_ATTEMPTS; index += 1) {
      await expect(
        verifyEmailVerification({ challengeId: challenge.id, code: "000000", sessionSecret }),
      ).rejects.toBeInstanceOf(EmailVerificationFailedError);
    }

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.attemptCount).toBe(EMAIL_VERIFICATION_MAX_ATTEMPTS);
    expect(stored.invalidatedAt).not.toBeNull();

    await expect(
      verifyEmailVerification({ challengeId: challenge.id, code, sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);
  });

  it("rejects expired, consumed, and invalidated challenges generically", async () => {
    const destination = `${unique("state")}@doggywood.test`;
    const expired = await createEmailChallenge(destination, "444444", {
      expiresAt: new Date(Date.now() - 1000),
    });
    const consumed = await createEmailChallenge(`${unique("cons")}@doggywood.test`, "444444", {
      consumedAt: new Date(),
    });
    const invalidated = await createEmailChallenge(`${unique("inv")}@doggywood.test`, "444444", {
      invalidatedAt: new Date(),
    });
    createdChallengeIds.push(expired.id, consumed.id, invalidated.id);

    await expect(
      verifyEmailVerification({ challengeId: expired.id, code: "444444", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);
    await expect(
      verifyEmailVerification({ challengeId: consumed.id, code: "444444", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);
    await expect(
      verifyEmailVerification({ challengeId: invalidated.id, code: "444444", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);
  });

  it("rejects an SMS challenge through the email flow", async () => {
    const sms = await prisma.verificationChallenge.create({
      data: {
        channel: "SMS",
        destination: "+17605551212",
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
      },
    });
    createdChallengeIds.push(sms.id);

    await expect(
      verifyEmailVerification({ challengeId: sms.id, code: "123456", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);
  });

  it("rejects a missing challenge generically", async () => {
    await expect(
      verifyEmailVerification({ challengeId: "missing-challenge-id", code: "123456", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);
  });

  it("resolves an existing EMAIL AuthIdentity to the same User", async () => {
    const destination = `${unique("ident")}@doggywood.test`;
    const existing = await prisma.user.create({
      data: { email: destination, emailVerifiedAt: new Date("2026-01-01T00:00:00.000Z") },
    });
    createdUserIds.push(existing.id);
    await prisma.authIdentity.create({
      data: {
        userId: existing.id,
        provider: "EMAIL",
        providerSubject: destination,
        email: destination,
      },
    });
    const challenge = await createEmailChallenge(destination, "555555");
    createdChallengeIds.push(challenge.id);

    const result = await verifyEmailVerification({
      challengeId: challenge.id,
      code: "555555",
      sessionSecret,
    });
    expect(result.userId).toBe(existing.id);
    expect(await prisma.user.count({ where: { email: destination } })).toBe(1);
  });

  it("links EMAIL AuthIdentity onto a User that already has the email", async () => {
    const destination = `${unique("link")}@doggywood.test`;
    const existing = await prisma.user.create({ data: { email: destination } });
    createdUserIds.push(existing.id);
    const challenge = await createEmailChallenge(destination, "666666");
    createdChallengeIds.push(challenge.id);

    const result = await verifyEmailVerification({
      challengeId: challenge.id,
      code: "666666",
      sessionSecret,
    });
    expect(result.userId).toBe(existing.id);
    const identity = await prisma.authIdentity.findUniqueOrThrow({
      where: { provider_providerSubject: { provider: "EMAIL", providerSubject: destination } },
    });
    expect(identity.userId).toBe(existing.id);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: existing.id } });
    expect(user.emailVerifiedAt).not.toBeNull();
    expect(user.phoneE164).toBeNull();
  });

  it("refuses to merge when EMAIL identity and User.email belong to different users", async () => {
    const destination = `${unique("conflict")}@doggywood.test`;
    const owner = await prisma.user.create({ data: { email: `${unique("owner")}@doggywood.test` } });
    const other = await prisma.user.create({ data: { email: destination } });
    createdUserIds.push(owner.id, other.id);
    await prisma.authIdentity.create({
      data: {
        userId: owner.id,
        provider: "EMAIL",
        providerSubject: destination,
        email: destination,
      },
    });
    const challenge = await createEmailChallenge(destination, "777777");
    createdChallengeIds.push(challenge.id);

    await expect(
      verifyEmailVerification({ challengeId: challenge.id, code: "777777", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationConflictError);

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.consumedAt).toBeNull();
  });

  it("consumes the challenge once and rejects replay", async () => {
    const destination = `${unique("replay")}@doggywood.test`;
    const challenge = await createEmailChallenge(destination, "888888");
    createdChallengeIds.push(challenge.id);

    const first = await verifyEmailVerification({
      challengeId: challenge.id,
      code: "888888",
      sessionSecret,
    });
    createdUserIds.push(first.userId);

    await expect(
      verifyEmailVerification({ challengeId: challenge.id, code: "888888", sessionSecret }),
    ).rejects.toBeInstanceOf(EmailVerificationFailedError);
    expect(await prisma.user.count({ where: { email: destination } })).toBe(1);
  });
});
