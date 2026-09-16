import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const { cookieStore, verifyEmailVerificationMock, actualVerify } = vi.hoisted(() => ({
  cookieStore: {
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
  verifyEmailVerificationMock: vi.fn(),
  actualVerify: {
    current: undefined as
      | undefined
      | typeof import("@/server/auth/email-verification").verifyEmailVerification,
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

vi.mock("@/server/auth/email-verification", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/auth/email-verification")>();
  actualVerify.current = actual.verifyEmailVerification;
  verifyEmailVerificationMock.mockImplementation(actual.verifyEmailVerification);
  return {
    ...actual,
    verifyEmailVerification: verifyEmailVerificationMock,
  };
});

import { getPrisma } from "@/lib/db";
import {
  EMAIL_VERIFICATION_TTL_MS,
  EmailVerificationConflictError,
} from "@/server/auth/email-verification";
import { hashEmailVerificationCode } from "@/server/auth/verification-code";
import { POST } from "@/app/api/auth/email/verify/route";

const prisma = getPrisma();
const sessionSecret = "test-session-secret-for-email-codes-32ch";

function unique(label: string) {
  return `p03-ev-api-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3001/api/auth/email/verify", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
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

describe("POST /api/auth/email/verify", () => {
  const createdUserIds: string[] = [];
  const createdChallengeIds: string[] = [];

  beforeEach(() => {
    cookieStore.set.mockClear();
    cookieStore.get.mockReset();
    cookieStore.delete.mockClear();
    verifyEmailVerificationMock.mockReset();
    if (actualVerify.current) {
      verifyEmailVerificationMock.mockImplementation(actualVerify.current);
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
    const destination = `${unique("ok")}@doggywood.test`;
    const code = "042189";
    const challenge = await createEmailChallenge(destination, code);
    createdChallengeIds.push(challenge.id);

    const response = await POST(
      jsonRequest(
        { challengeId: challenge.id, code },
        { "user-agent": "vitest-verify", "x-forwarded-for": "203.0.113.90" },
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.user.id).toBeTruthy();
    expect(body.user.email).toBe(destination);
    expect(body.user.emailVerifiedAt).toBeTruthy();
    expect(body.user).toEqual({
      id: body.user.id,
      email: destination,
      emailVerifiedAt: body.user.emailVerifiedAt,
    });
    expect(JSON.stringify(body)).not.toContain(code);
    expect(JSON.stringify(body)).not.toContain("codeHash");
    expect(JSON.stringify(body)).not.toMatch(/"token"/);
    expect(JSON.stringify(body)).not.toContain("tokenHash");

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
      new Request("http://localhost:3001/api/auth/email/verify", {
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
    const destination = `${unique("wrong")}@doggywood.test`;
    const challenge = await createEmailChallenge(destination, "111111");
    createdChallengeIds.push(challenge.id);

    const response = await POST(jsonRequest({ challengeId: challenge.id, code: "222222" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Unable to verify that code." });
    expect(JSON.stringify(body)).not.toContain("attempt");
    expect(JSON.stringify(body)).not.toContain("codeHash");
  });

  it("returns a generic 400 for an expired challenge", async () => {
    const destination = `${unique("exp")}@doggywood.test`;
    const challenge = await createEmailChallenge(destination, "333333", {
      expiresAt: new Date(Date.now() - 1000),
    });
    createdChallengeIds.push(challenge.id);

    const response = await POST(jsonRequest({ challengeId: challenge.id, code: "333333" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Unable to verify that code." });
  });

  it("returns 409 for an identity conflict", async () => {
    const destination = `${unique("conflict")}@doggywood.test`;
    const owner = await prisma.user.create({
      data: { email: `${unique("owner")}@doggywood.test` },
    });
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

    const response = await POST(jsonRequest({ challengeId: challenge.id, code: "777777" }));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ error: "Unable to complete verification." });
    expect(JSON.stringify(body)).not.toContain(owner.id);
    expect(JSON.stringify(body)).not.toContain("AuthIdentity");
  });

  it("returns a safe 500 without internals on unexpected failure", async () => {
    verifyEmailVerificationMock.mockRejectedValueOnce(
      new Error("SESSION_SECRET leaked token=raw-session-token"),
    );

    const response = await POST(
      jsonRequest({ challengeId: "challenge_123", code: "123456" }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Unable to complete verification right now." });
    expect(JSON.stringify(body)).not.toContain("SESSION_SECRET");
    expect(JSON.stringify(body)).not.toContain("raw-session-token");
  });

  it("does not treat a conflict error as a 500", async () => {
    verifyEmailVerificationMock.mockRejectedValueOnce(new EmailVerificationConflictError());

    const response = await POST(
      jsonRequest({ challengeId: "challenge_123", code: "123456" }),
    );
    expect(response.status).toBe(409);
  });
});
