import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const { cookieStore, verifySmsVerificationMock, actualVerify } = vi.hoisted(() => ({
  cookieStore: {
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
  verifySmsVerificationMock: vi.fn(),
  actualVerify: {
    current: undefined as
      | undefined
      | typeof import("@/server/auth/sms-verification").verifySmsVerification,
  },
}));

vi.mock("next/headers", () => ({
  cookies: async () => cookieStore,
}));

vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    SESSION_SECRET: "test-session-secret-for-email-codes-32ch",
    SESSION_COOKIE_NAME: "doggywood_session",
    DATABASE_URL: "postgresql://doggywood:doggywood_local_only@localhost:5432/doggywood",
    APP_URL: "http://localhost:3001",
  }),
}));

vi.mock("@/server/sms/twilio-verify", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/sms/twilio-verify")>();
  return {
    ...actual,
    checkSmsVerification: vi.fn(),
    startSmsVerification: vi.fn(),
  };
});

vi.mock("@/server/auth/sms-verification", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/auth/sms-verification")>();
  actualVerify.current = actual.verifySmsVerification;
  verifySmsVerificationMock.mockImplementation(actual.verifySmsVerification);
  return {
    ...actual,
    verifySmsVerification: verifySmsVerificationMock,
  };
});

import { getPrisma } from "@/lib/db";
import {
  SMS_VERIFICATION_TTL_MS,
  SmsVerificationConflictError,
  SmsVerificationUnavailableError,
} from "@/server/auth/sms-verification";
import { checkSmsVerification } from "@/server/sms/twilio-verify";
import { POST } from "@/app/api/auth/sms/verify/route";

const prisma = getPrisma();
const checkSms = vi.mocked(checkSmsVerification);

function uniquePhone() {
  const tail = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-7);
  return `+1760${tail.padStart(7, "0")}`;
}

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3001/api/auth/sms/verify", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

async function createSmsChallenge(destination: string, extra: Record<string, unknown> = {}) {
  return prisma.verificationChallenge.create({
    data: {
      channel: "SMS",
      destination,
      codeHash: null,
      twilioSid: "VEapisidxxxxxxxxxxxxxxxxxxxxxxxxx",
      expiresAt: new Date(Date.now() + SMS_VERIFICATION_TTL_MS),
      ...extra,
    },
  });
}

describe("POST /api/auth/sms/verify", () => {
  const createdUserIds: string[] = [];
  const createdChallengeIds: string[] = [];

  beforeEach(() => {
    cookieStore.set.mockClear();
    cookieStore.get.mockReset();
    cookieStore.delete.mockClear();
    checkSms.mockReset();
    checkSms.mockResolvedValue({ status: "approved", valid: true });
    verifySmsVerificationMock.mockReset();
    if (actualVerify.current) {
      verifySmsVerificationMock.mockImplementation(actualVerify.current);
    }
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

  it("returns success and sets the session cookie", async () => {
    const destination = uniquePhone();
    const code = "042189";
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);

    const response = await POST(
      jsonRequest(
        { challengeId: challenge.id, code },
        { "user-agent": "vitest-sms-verify", "x-forwarded-for": "198.51.100.90" },
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.user.id).toBeTruthy();
    expect(body.user.phoneE164).toBe(destination);
    expect(body.user.phoneVerifiedAt).toBeTruthy();
    expect(body.user).toEqual({
      id: body.user.id,
      phoneE164: destination,
      phoneVerifiedAt: body.user.phoneVerifiedAt,
    });
    expect(JSON.stringify(body)).not.toContain(code);
    expect(JSON.stringify(body)).not.toContain("twilioSid");
    expect(JSON.stringify(body)).not.toContain("VEapisid");
    expect(JSON.stringify(body)).not.toMatch(/"token"/);

    createdUserIds.push(body.user.id);

    expect(cookieStore.set).toHaveBeenCalled();
    const cookieName = cookieStore.set.mock.calls[0]?.[0];
    const cookieValue = cookieStore.set.mock.calls[0]?.[1];
    expect(cookieName).toBe("doggywood_session");
    expect(typeof cookieValue).toBe("string");
    expect(cookieValue.length).toBeGreaterThan(16);
    expect(JSON.stringify(body)).not.toContain(cookieValue);

    const sessions = await prisma.session.findMany({ where: { userId: body.user.id } });
    expect(sessions).toHaveLength(1);
  });

  it("returns 400 for a malformed request", async () => {
    const invalidJson = await POST(
      new Request("http://localhost:3001/api/auth/sms/verify", {
        method: "POST",
        body: "not-json",
      }),
    );
    expect(invalidJson.status).toBe(400);
    expect(invalidJson).toBeInstanceOf(NextResponse);
    expect((await invalidJson.json()).error).toBe("Invalid request.");

    const missing = await POST(jsonRequest({ challengeId: "" }));
    expect(missing.status).toBe(400);
    expect((await missing.json()).error).toBe("Invalid request.");
  });

  it("returns a generic 400 for a wrong code", async () => {
    const destination = uniquePhone();
    const challenge = await createSmsChallenge(destination);
    createdChallengeIds.push(challenge.id);
    checkSms.mockResolvedValueOnce({ status: "pending", valid: false });

    const response = await POST(jsonRequest({ challengeId: challenge.id, code: "222222" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Unable to verify that code." });
    expect(JSON.stringify(body)).not.toContain("attempt");
    expect(JSON.stringify(body)).not.toContain("twilioSid");
  });

  it("returns a generic 400 for an expired challenge", async () => {
    const destination = uniquePhone();
    const challenge = await createSmsChallenge(destination, {
      expiresAt: new Date(Date.now() - 1000),
    });
    createdChallengeIds.push(challenge.id);

    const response = await POST(jsonRequest({ challengeId: challenge.id, code: "333333" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Unable to verify that code." });
    expect(checkSms).not.toHaveBeenCalled();
  });

  it("returns 409 for an identity conflict", async () => {
    const destination = uniquePhone();
    const owner = await prisma.user.create({ data: { phoneE164: uniquePhone() } });
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

    const response = await POST(jsonRequest({ challengeId: challenge.id, code: "777777" }));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ error: "Unable to complete verification." });
    expect(JSON.stringify(body)).not.toContain(owner.id);
    expect(JSON.stringify(body)).not.toContain("AuthIdentity");
  });

  it("returns 503 when Twilio is temporarily unavailable", async () => {
    verifySmsVerificationMock.mockRejectedValueOnce(new SmsVerificationUnavailableError());

    const response = await POST(
      jsonRequest({ challengeId: "challenge_123", code: "123456" }),
    );
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ error: "Unable to complete verification right now." });
    expect(JSON.stringify(body)).not.toContain("TWILIO_");
  });

  it("returns a safe 500 without internals on unexpected failure", async () => {
    verifySmsVerificationMock.mockRejectedValueOnce(
      new Error("TWILIO_AUTH_TOKEN leaked token=raw-session-token"),
    );

    const response = await POST(
      jsonRequest({ challengeId: "challenge_123", code: "123456" }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Unable to complete verification right now." });
    expect(JSON.stringify(body)).not.toContain("TWILIO_AUTH_TOKEN");
    expect(JSON.stringify(body)).not.toContain("raw-session-token");
  });

  it("does not treat a conflict error as a 500", async () => {
    verifySmsVerificationMock.mockRejectedValueOnce(new SmsVerificationConflictError());

    const response = await POST(
      jsonRequest({ challengeId: "challenge_123", code: "123456" }),
    );
    expect(response.status).toBe(409);
  });
});
