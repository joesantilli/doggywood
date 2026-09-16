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

vi.mock("@/server/sms/twilio-verify", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/sms/twilio-verify")>();
  return {
    ...actual,
    checkSmsVerification: vi.fn(),
    startSmsVerification: vi.fn(),
  };
});

import { getPrisma } from "@/lib/db";
import {
  SMS_VERIFICATION_MAX_ATTEMPTS,
  SMS_VERIFICATION_TTL_MS,
  SmsVerificationConflictError,
  SmsVerificationFailedError,
  SmsVerificationUnavailableError,
  verifySmsVerification,
} from "@/server/auth/sms-verification";
import { checkSmsVerification, TwilioRequestError } from "@/server/sms/twilio-verify";
import { hashSessionToken } from "@/server/auth/session-token";

const prisma = getPrisma();
const checkSms = vi.mocked(checkSmsVerification);

function uniquePhone() {
  const tail = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-7);
  return `+1760${tail.padStart(7, "0")}`;
}

async function createSmsChallenge(destination: string, extra: Record<string, unknown> = {}) {
  return prisma.verificationChallenge.create({
    data: {
      channel: "SMS",
      destination,
      codeHash: null,
      twilioSid: "VEtestsidxxxxxxxxxxxxxxxxxxxxxxxx",
      expiresAt: new Date(Date.now() + SMS_VERIFICATION_TTL_MS),
      ...extra,
    },
  });
}

describe("verifySmsVerification", () => {
  const createdUserIds: string[] = [];
  const createdChallengeIds: string[] = [];

  beforeEach(() => {
    cookieStore.set.mockClear();
    cookieStore.get.mockReset();
    cookieStore.delete.mockClear();
    checkSms.mockReset();
    checkSms.mockResolvedValue({ status: "approved", valid: true });
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

  it("verifies an approved Twilio code, creates User, PHONE identity, and a fresh session", async () => {
    const destination = uniquePhone();
    const code = "042189";
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);
    cookieStore.get.mockReturnValue({ value: "old-raw-session-token" });

    const result = await verifySmsVerification({
      challengeId: challenge.id,
      code,
      ipAddress: "198.51.100.21",
      userAgent: "vitest-sms-verify",
    });
    createdUserIds.push(result.userId);

    expect(checkSms).toHaveBeenCalledWith({ phoneE164: destination, code });
    expect(result.phoneE164).toBe(destination);
    expect(result.phoneVerifiedAt).toBeInstanceOf(Date);
    expect(result).not.toHaveProperty("code");
    expect(result).not.toHaveProperty("twilioSid");
    expect(JSON.stringify(result)).not.toContain(code);
    expect(JSON.stringify(result)).not.toContain("VEtestsid");
    expect(JSON.stringify(result)).not.toContain("token");

    const user = await prisma.user.findUniqueOrThrow({ where: { id: result.userId } });
    expect(user.phoneE164).toBe(destination);
    expect(user.phoneVerifiedAt).not.toBeNull();
    expect(user.email).toBeNull();

    const identity = await prisma.authIdentity.findUniqueOrThrow({
      where: { provider_providerSubject: { provider: "PHONE", providerSubject: destination } },
    });
    expect(identity.userId).toBe(user.id);
    expect(identity.phoneE164).toBe(destination);
    expect(identity.provider).toBe("PHONE");

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.consumedAt).not.toBeNull();
    expect(stored.codeHash).toBeNull();

    const sessions = await prisma.session.findMany({ where: { userId: user.id } });
    expect(sessions).toHaveLength(1);
    expect(cookieStore.set).toHaveBeenCalled();
    const cookieValue = cookieStore.set.mock.calls[0]?.[1];
    expect(typeof cookieValue).toBe("string");
    expect(cookieValue).not.toBe("old-raw-session-token");
    expect(JSON.stringify(result)).not.toContain(cookieValue);
    expect(sessions[0]?.tokenHash).toBe(hashSessionToken(cookieValue));
  });

  it("fails a non-approved Twilio result and increments the attempt count", async () => {
    const destination = uniquePhone();
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);
    checkSms.mockResolvedValueOnce({ status: "pending", valid: false });

    await expect(
      verifySmsVerification({ challengeId: challenge.id, code: "222222" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.attemptCount).toBe(1);
    expect(stored.consumedAt).toBeNull();
    expect(stored.invalidatedAt).toBeNull();
    expect(await prisma.user.findUnique({ where: { phoneE164: destination } })).toBeNull();
  });

  it("invalidates the challenge after five failed attempts", async () => {
    const destination = uniquePhone();
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);
    checkSms.mockResolvedValue({ status: "pending", valid: false });

    for (let index = 0; index < SMS_VERIFICATION_MAX_ATTEMPTS; index += 1) {
      await expect(
        verifySmsVerification({ challengeId: challenge.id, code: "000000" }),
      ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    }

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.attemptCount).toBe(SMS_VERIFICATION_MAX_ATTEMPTS);
    expect(stored.invalidatedAt).not.toBeNull();

    checkSms.mockResolvedValueOnce({ status: "approved", valid: true });
    await expect(
      verifySmsVerification({ challengeId: challenge.id, code: "123456" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    expect(checkSms).toHaveBeenCalledTimes(SMS_VERIFICATION_MAX_ATTEMPTS);
  });

  it("rejects expired, consumed, and invalidated challenges generically", async () => {
    const expired = await createSmsChallenge(uniquePhone(), {
      expiresAt: new Date(Date.now() - 1000),
    });
    const consumed = await createSmsChallenge(uniquePhone(), { consumedAt: new Date() });
    const invalidated = await createSmsChallenge(uniquePhone(), { invalidatedAt: new Date() });
    createdChallengeIds.push(expired.id, consumed.id, invalidated.id);

    await expect(
      verifySmsVerification({ challengeId: expired.id, code: "444444" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    await expect(
      verifySmsVerification({ challengeId: consumed.id, code: "444444" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    await expect(
      verifySmsVerification({ challengeId: invalidated.id, code: "444444" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    expect(checkSms).not.toHaveBeenCalled();
  });

  it("rejects an EMAIL challenge through the SMS flow", async () => {
    const email = await prisma.verificationChallenge.create({
      data: {
        channel: "EMAIL",
        destination: `p03-sms-email-${Date.now()}@doggywood.test`,
        codeHash: "not-for-sms",
        expiresAt: new Date(Date.now() + SMS_VERIFICATION_TTL_MS),
      },
    });
    createdChallengeIds.push(email.id);

    await expect(
      verifySmsVerification({ challengeId: email.id, code: "123456" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    expect(checkSms).not.toHaveBeenCalled();
  });

  it("rejects a challenge without a Twilio SID", async () => {
    const challenge = await createSmsChallenge(uniquePhone(), { twilioSid: null });
    createdChallengeIds.push(challenge.id);

    await expect(
      verifySmsVerification({ challengeId: challenge.id, code: "123456" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    expect(checkSms).not.toHaveBeenCalled();
  });

  it("rejects a missing challenge generically", async () => {
    await expect(
      verifySmsVerification({ challengeId: "missing-challenge-id", code: "123456" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
  });

  it("does not consume the challenge or create a User when Twilio is unavailable", async () => {
    const destination = uniquePhone();
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);
    checkSms.mockRejectedValueOnce(new TwilioRequestError(new Error("TWILIO_AUTH_TOKEN leaked")));

    await expect(
      verifySmsVerification({ challengeId: challenge.id, code: "654321" }),
    ).rejects.toBeInstanceOf(SmsVerificationUnavailableError);

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.consumedAt).toBeNull();
    expect(stored.invalidatedAt).toBeNull();
    expect(await prisma.user.findUnique({ where: { phoneE164: destination } })).toBeNull();
  });

  it("resolves an existing PHONE AuthIdentity to the same User", async () => {
    const destination = uniquePhone();
    const existing = await prisma.user.create({
      data: { phoneE164: destination, phoneVerifiedAt: new Date("2026-01-01T00:00:00.000Z") },
    });
    createdUserIds.push(existing.id);
    await prisma.authIdentity.create({
      data: {
        userId: existing.id,
        provider: "PHONE",
        providerSubject: destination,
        phoneE164: destination,
      },
    });
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);

    const result = await verifySmsVerification({
      challengeId: challenge.id,
      code: "555555",
    });
    expect(result.userId).toBe(existing.id);
    expect(await prisma.user.count({ where: { phoneE164: destination } })).toBe(1);
  });

  it("links PHONE AuthIdentity onto a User that already has the mobile number", async () => {
    const destination = uniquePhone();
    const existing = await prisma.user.create({ data: { phoneE164: destination } });
    createdUserIds.push(existing.id);
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);

    const result = await verifySmsVerification({
      challengeId: challenge.id,
      code: "666666",
    });
    expect(result.userId).toBe(existing.id);
    const identity = await prisma.authIdentity.findUniqueOrThrow({
      where: { provider_providerSubject: { provider: "PHONE", providerSubject: destination } },
    });
    expect(identity.userId).toBe(existing.id);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: existing.id } });
    expect(user.phoneVerifiedAt).not.toBeNull();
    expect(user.email).toBeNull();
  });

  it("refuses to merge when PHONE identity and User.phoneE164 belong to different users", async () => {
    const destination = uniquePhone();
    const ownerPhone = uniquePhone();
    const owner = await prisma.user.create({ data: { phoneE164: ownerPhone } });
    const other = await prisma.user.create({ data: { phoneE164: destination } });
    createdUserIds.push(owner.id, other.id);
    await prisma.authIdentity.create({
      data: {
        userId: owner.id,
        provider: "PHONE",
        providerSubject: destination,
        phoneE164: destination,
      },
    });
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);

    await expect(
      verifySmsVerification({ challengeId: challenge.id, code: "777777" }),
    ).rejects.toBeInstanceOf(SmsVerificationConflictError);

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.consumedAt).toBeNull();
  });

  it("refuses to silently repair a PHONE identity whose User has a different number", async () => {
    const destination = uniquePhone();
    const otherPhone = uniquePhone();
    const owner = await prisma.user.create({ data: { phoneE164: otherPhone } });
    createdUserIds.push(owner.id);
    await prisma.authIdentity.create({
      data: {
        userId: owner.id,
        provider: "PHONE",
        providerSubject: destination,
        phoneE164: destination,
      },
    });
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);

    await expect(
      verifySmsVerification({ challengeId: challenge.id, code: "888888" }),
    ).rejects.toBeInstanceOf(SmsVerificationConflictError);

    const unchanged = await prisma.user.findUniqueOrThrow({ where: { id: owner.id } });
    expect(unchanged.phoneE164).toBe(otherPhone);
    const stored = await prisma.verificationChallenge.findUniqueOrThrow({ where: { id: challenge.id } });
    expect(stored.consumedAt).toBeNull();
  });

  it("consumes the challenge once and rejects replay", async () => {
    const destination = uniquePhone();
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);

    const first = await verifySmsVerification({
      challengeId: challenge.id,
      code: "888888",
    });
    createdUserIds.push(first.userId);

    await expect(
      verifySmsVerification({ challengeId: challenge.id, code: "888888" }),
    ).rejects.toBeInstanceOf(SmsVerificationFailedError);
    expect(await prisma.user.count({ where: { phoneE164: destination } })).toBe(1);
  });
});
