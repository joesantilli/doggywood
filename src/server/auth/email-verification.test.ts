import { afterAll, describe, expect, it, vi } from "vitest";
import { getPrisma } from "@/lib/db";
import {
  EMAIL_VERIFICATION_TTL_MS,
  EmailVerificationRequestError,
  requestEmailVerification,
} from "@/server/auth/email-verification";
import { hashEmailVerificationCode } from "@/server/auth/verification-code";
import { sendSmtpMail } from "@/server/mail/smtp";

vi.mock("@/server/mail/smtp", () => ({
  sendSmtpMail: vi.fn(async () => undefined),
}));

const prisma = getPrisma();
const sessionSecret = "test-session-secret-for-email-codes-32ch";
const sendMail = vi.mocked(sendSmtpMail);

function unique(label: string) {
  return `p03-email-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

describe("requestEmailVerification", () => {
  const destinations: string[] = [];

  afterAll(async () => {
    if (destinations.length === 0) {
      return;
    }
    await prisma.verificationChallenge.deleteMany({
      where: { destination: { in: destinations } },
    });
  });

  it("normalizes the email and persists only the hashed code", async () => {
    const local = unique("norm");
    const destination = `${local}@doggywood.test`;
    destinations.push(destination);
    sendMail.mockClear();
    sendMail.mockResolvedValueOnce(undefined);

    const result = await requestEmailVerification(
      {
        email: `  ${local.toUpperCase()}@Doggywood.TEST  `,
        sessionSecret,
        ipAddress: "203.0.113.10",
        userAgent: "vitest",
      },
      { generateCode: () => "042189" },
    );

    expect(result.destination).toBe(destination);
    expect(result.challengeId).toBeTruthy();
    expect(result.expiresAt.getTime() - Date.now()).toBeGreaterThan(9 * 60 * 1000);
    expect(result.expiresAt.getTime() - Date.now()).toBeLessThan(EMAIL_VERIFICATION_TTL_MS + 2000);
    expect(result).not.toHaveProperty("code");
    expect(result).not.toHaveProperty("codeHash");
    expect(JSON.stringify(result)).not.toContain("042189");

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({
      where: { id: result.challengeId },
    });
    expect(stored.destination).toBe(destination);
    expect(stored.channel).toBe("EMAIL");
    expect(stored.codeHash).toBe(hashEmailVerificationCode(sessionSecret, destination, "042189"));
    expect(stored.codeHash).not.toBe("042189");
    expect(stored.twilioSid).toBeNull();
    expect(stored.attemptCount).toBe(0);
    expect(stored.requestCount).toBe(1);
    expect(stored.consumedAt).toBeNull();
    expect(stored.invalidatedAt).toBeNull();
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: destination,
        subject: "Your Doggywood verification code",
      }),
    );
    expect(sendMail.mock.calls[0]?.[0]?.text).toContain("042189");
    expect(sendMail.mock.calls[0]?.[0]?.text).toContain("ten minutes");
  });

  it("invalidates an older active challenge for the same destination", async () => {
    const destination = `${unique("old")}@doggywood.test`;
    destinations.push(destination);
    sendMail.mockClear();
    sendMail.mockResolvedValueOnce(undefined);

    const older = await prisma.verificationChallenge.create({
      data: {
        channel: "EMAIL",
        destination,
        codeHash: "old-hash",
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      },
    });

    const result = await requestEmailVerification({
      email: destination,
      sessionSecret,
    });

    const previous = await prisma.verificationChallenge.findUniqueOrThrow({
      where: { id: older.id },
    });
    expect(previous.invalidatedAt).not.toBeNull();
    expect(result.challengeId).not.toBe(older.id);
  });

  it("enforces a 60 second destination cooldown", async () => {
    const destination = `${unique("cool")}@doggywood.test`;
    destinations.push(destination);
    sendMail.mockClear();
    sendMail.mockResolvedValue(undefined);

    await requestEmailVerification({ email: destination, sessionSecret });
    await expect(requestEmailVerification({ email: destination, sessionSecret })).rejects.toMatchObject({
      kind: "rate_limited",
    });
  });

  it("enforces five requests per hour per destination", async () => {
    const destination = `${unique("hour")}@doggywood.test`;
    destinations.push(destination);

    await prisma.verificationChallenge.createMany({
      data: Array.from({ length: 5 }, (_, index) => ({
        channel: "EMAIL" as const,
        destination,
        codeHash: `hour-${index}`,
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      })),
    });

    await expect(requestEmailVerification({ email: destination, sessionSecret })).rejects.toBeInstanceOf(
      EmailVerificationRequestError,
    );
    await expect(requestEmailVerification({ email: destination, sessionSecret })).rejects.toMatchObject({
      kind: "rate_limited",
    });
  });

  it("enforces ten requests per hour per IP", async () => {
    const ipAddress = `203.0.113.${Math.floor(Math.random() * 50) + 20}`;
    const destination = `${unique("ip")}@doggywood.test`;
    destinations.push(destination);

    const extras = Array.from({ length: 10 }, (_, index) => `${unique(`ip-row-${index}`)}@doggywood.test`);
    destinations.push(...extras);

    await prisma.verificationChallenge.createMany({
      data: extras.map((rowDestination, index) => ({
        channel: "EMAIL" as const,
        destination: rowDestination,
        codeHash: `ip-${index}`,
        ipAddress,
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      })),
    });

    await expect(
      requestEmailVerification({ email: destination, sessionSecret, ipAddress }),
    ).rejects.toMatchObject({ kind: "rate_limited" });
  });

  it("invalidates the new challenge when SMTP delivery fails and does not create users or sessions", async () => {
    const destination = `${unique("fail")}@doggywood.test`;
    destinations.push(destination);
    sendMail.mockClear();
    sendMail.mockRejectedValueOnce(new Error("smtp timeout"));

    const usersBefore = await prisma.user.count({ where: { email: destination } });
    const sessionsBefore = await prisma.session.count({
      where: { user: { email: destination } },
    });
    const identitiesBefore = await prisma.authIdentity.count({
      where: { email: destination },
    });

    await expect(requestEmailVerification({ email: destination, sessionSecret })).rejects.toMatchObject({
      kind: "mail_failed",
    });

    const rows = await prisma.verificationChallenge.findMany({ where: { destination } });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.invalidatedAt).not.toBeNull();
    expect(await prisma.user.count({ where: { email: destination } })).toBe(usersBefore);
    expect(
      await prisma.session.count({
        where: { user: { email: destination } },
      }),
    ).toBe(sessionsBefore);
    expect(await prisma.authIdentity.count({ where: { email: destination } })).toBe(
      identitiesBefore,
    );
  });
});
