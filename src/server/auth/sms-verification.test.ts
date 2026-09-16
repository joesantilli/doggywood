import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getPrisma } from "@/lib/db";
import {
  SMS_VERIFICATION_TTL_MS,
  SmsVerificationRequestError,
  requestSmsVerification,
} from "@/server/auth/sms-verification";
import { startSmsVerification, TwilioConfigError, TwilioRequestError } from "@/server/sms/twilio-verify";

vi.mock("@/server/sms/twilio-verify", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/sms/twilio-verify")>();
  return {
    ...actual,
    startSmsVerification: vi.fn(),
  };
});

const prisma = getPrisma();
const startSms = vi.mocked(startSmsVerification);

function uniquePhone() {
  const tail = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-7);
  return `+1760${tail.padStart(7, "0")}`;
}

function formatUs(e164: string) {
  const national = e164.replace(/^\+1/, "");
  return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
}

describe("requestSmsVerification", () => {
  const destinations: string[] = [];

  beforeEach(() => {
    startSms.mockReset();
    startSms.mockResolvedValue({
      sid: "VEtestverificationxxxxxxxxxxxxxxxxxx",
      status: "pending",
      to: "+17605551212",
    });
  });

  afterAll(async () => {
    if (destinations.length === 0) {
      return;
    }
    await prisma.verificationChallenge.deleteMany({
      where: { destination: { in: destinations } },
    });
  });

  it("normalizes the phone and stores an SMS challenge without a local code", async () => {
    const destination = uniquePhone();
    destinations.push(destination);
    const twilioSid = "VEnormalizedsidxxxxxxxxxxxxxxxxxxxx";
    startSms.mockImplementation(async ({ phoneE164 }) => {
      const existing = await prisma.verificationChallenge.findFirst({
        where: { destination: phoneE164, channel: "SMS" },
        orderBy: { createdAt: "desc" },
      });
      expect(existing?.twilioSid).toBeNull();
      expect(existing?.codeHash).toBeNull();
      return { sid: twilioSid, status: "pending", to: phoneE164 };
    });

    const result = await requestSmsVerification({
      phone: formatUs(destination),
      ipAddress: "198.51.100.20",
      userAgent: "vitest-sms",
    });

    expect(result.destination).toBe(destination);
    expect(result.challengeId).toBeTruthy();
    expect(result.expiresAt.getTime() - Date.now()).toBeGreaterThan(9 * 60 * 1000);
    expect(result.expiresAt.getTime() - Date.now()).toBeLessThan(SMS_VERIFICATION_TTL_MS + 2000);
    expect(result).not.toHaveProperty("twilioSid");
    expect(result).not.toHaveProperty("code");
    expect(result).not.toHaveProperty("sid");
    expect(JSON.stringify(result)).not.toContain(twilioSid);
    expect(JSON.stringify(result)).not.toMatch(/"code"/);

    const stored = await prisma.verificationChallenge.findUniqueOrThrow({
      where: { id: result.challengeId },
    });
    expect(stored.channel).toBe("SMS");
    expect(stored.destination).toBe(destination);
    expect(stored.codeHash).toBeNull();
    expect(stored.twilioSid).toBe(twilioSid);
    expect(stored.attemptCount).toBe(0);
    expect(stored.requestCount).toBe(1);
    expect(stored.consumedAt).toBeNull();
    expect(stored.invalidatedAt).toBeNull();
    expect(stored.ipAddress).toBe("198.51.100.20");
    expect(stored.userAgent).toBe("vitest-sms");
    expect(startSms).toHaveBeenCalledWith({ phoneE164: destination });
    expect(startSms.mock.calls[0]?.[0]).not.toHaveProperty("code");
    expect(await prisma.user.count({ where: { phoneE164: destination } })).toBe(0);
    expect(
      await prisma.authIdentity.count({
        where: { provider: "PHONE", providerSubject: destination },
      }),
    ).toBe(0);
    expect(
      await prisma.session.count({
        where: { user: { phoneE164: destination } },
      }),
    ).toBe(0);
  });

  it("invalidates an older active SMS challenge for the same destination", async () => {
    const destination = uniquePhone();
    destinations.push(destination);
    startSms.mockResolvedValue({
      sid: "VEnewerxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      status: "pending",
      to: destination,
    });

    const older = await prisma.verificationChallenge.create({
      data: {
        channel: "SMS",
        destination,
        expiresAt: new Date(Date.now() + SMS_VERIFICATION_TTL_MS),
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      },
    });

    const result = await requestSmsVerification({ phone: destination });
    const previous = await prisma.verificationChallenge.findUniqueOrThrow({
      where: { id: older.id },
    });
    expect(previous.invalidatedAt).not.toBeNull();
    expect(previous.twilioSid).toBeNull();
    expect(result.challengeId).not.toBe(older.id);
    expect(await prisma.verificationChallenge.count({ where: { destination } })).toBe(2);
  });

  it("enforces a 60 second destination cooldown", async () => {
    const destination = uniquePhone();
    destinations.push(destination);
    startSms.mockResolvedValue({
      sid: "VEcooldownxxxxxxxxxxxxxxxxxxxxxxxxx",
      status: "pending",
      to: destination,
    });

    await requestSmsVerification({ phone: destination });
    await expect(requestSmsVerification({ phone: destination })).rejects.toMatchObject({
      kind: "rate_limited",
    });
  });

  it("enforces three requests per hour per destination", async () => {
    const destination = uniquePhone();
    destinations.push(destination);

    await prisma.verificationChallenge.createMany({
      data: Array.from({ length: 3 }, (_, index) => ({
        channel: "SMS" as const,
        destination,
        expiresAt: new Date(Date.now() + SMS_VERIFICATION_TTL_MS),
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
        twilioSid: `VE-hour-${index}`,
      })),
    });

    await expect(requestSmsVerification({ phone: destination })).rejects.toBeInstanceOf(
      SmsVerificationRequestError,
    );
    await expect(requestSmsVerification({ phone: destination })).rejects.toMatchObject({
      kind: "rate_limited",
    });
    expect(startSms).not.toHaveBeenCalled();
  });

  it("enforces five requests per hour per IP", async () => {
    const ipAddress = `198.51.100.${Math.floor(Math.random() * 50) + 30}`;
    const destination = uniquePhone();
    destinations.push(destination);

    const extras = Array.from({ length: 5 }, () => uniquePhone());
    destinations.push(...extras);

    await prisma.verificationChallenge.createMany({
      data: extras.map((rowDestination, index) => ({
        channel: "SMS" as const,
        destination: rowDestination,
        ipAddress,
        expiresAt: new Date(Date.now() + SMS_VERIFICATION_TTL_MS),
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
        twilioSid: `VE-ip-${index}`,
      })),
    });

    await expect(
      requestSmsVerification({ phone: destination, ipAddress }),
    ).rejects.toMatchObject({ kind: "rate_limited" });
    expect(startSms).not.toHaveBeenCalled();
  });

  it("invalidates the new challenge when Twilio configuration is missing", async () => {
    const destination = uniquePhone();
    destinations.push(destination);
    startSms.mockRejectedValueOnce(new TwilioConfigError());

    await expect(requestSmsVerification({ phone: destination })).rejects.toMatchObject({
      kind: "sms_failed",
    });

    const rows = await prisma.verificationChallenge.findMany({ where: { destination } });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.invalidatedAt).not.toBeNull();
    expect(rows[0]?.twilioSid).toBeNull();
    expect(await prisma.user.count({ where: { phoneE164: destination } })).toBe(0);
  });

  it("invalidates the new challenge when the Twilio request fails", async () => {
    const destination = uniquePhone();
    destinations.push(destination);
    startSms.mockRejectedValueOnce(
      new TwilioRequestError(new Error("TWILIO_AUTH_TOKEN leaked")),
    );

    await expect(requestSmsVerification({ phone: destination })).rejects.toMatchObject({
      kind: "sms_failed",
    });

    const rows = await prisma.verificationChallenge.findMany({ where: { destination } });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.invalidatedAt).not.toBeNull();
    expect(rows[0]?.codeHash).toBeNull();
    expect(
      await prisma.session.count({
        where: { user: { phoneE164: destination } },
      }),
    ).toBe(0);
  });
});
