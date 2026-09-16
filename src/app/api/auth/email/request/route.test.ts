import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const { requestEmailVerification } = vi.hoisted(() => ({
  requestEmailVerification: vi.fn(),
}));

vi.mock("@/server/auth/email-verification", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/auth/email-verification")>();
  return {
    ...actual,
    requestEmailVerification,
  };
});

vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    SESSION_SECRET: "test-session-secret-for-email-codes-32ch",
    SESSION_COOKIE_NAME: "doggywood_session",
    DATABASE_URL: "postgresql://doggywood:doggywood_local_only@localhost:5432/doggywood",
    APP_URL: "http://localhost:3001",
  }),
}));

import { EmailVerificationRequestError } from "@/server/auth/email-verification";
import { POST } from "@/app/api/auth/email/request/route";

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3001/api/auth/email/request", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/email/request", () => {
  beforeEach(() => {
    requestEmailVerification.mockReset();
  });

  it("returns success without the verification code", async () => {
    requestEmailVerification.mockResolvedValueOnce({
      challengeId: "challenge_123",
      destination: "ada@example.com",
      expiresAt: new Date("2026-09-16T12:10:00.000Z"),
    });

    const response = await POST(jsonRequest({ email: "ada@example.com" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      challengeId: "challenge_123",
      expiresAt: "2026-09-16T12:10:00.000Z",
    });
    expect(JSON.stringify(body)).not.toMatch(/"code"/);
    expect(JSON.stringify(body)).not.toContain("codeHash");
    expect(requestEmailVerification).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ada@example.com",
        sessionSecret: "test-session-secret-for-email-codes-32ch",
      }),
    );
  });

  it("returns 400 for an invalid email", async () => {
    requestEmailVerification.mockRejectedValueOnce(
      new EmailVerificationRequestError("invalid_email", "Enter a valid email address."),
    );

    const response = await POST(jsonRequest({ email: "not-an-email" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Enter a valid email address.");
    expect(JSON.stringify(body)).not.toContain("codeHash");
  });

  it("returns 429 when rate limited", async () => {
    requestEmailVerification.mockRejectedValueOnce(
      new EmailVerificationRequestError("rate_limited", "Please wait before requesting another code."),
    );

    const response = await POST(jsonRequest({ email: "ada@example.com" }));
    expect(response.status).toBe(429);
    expect((await response.json()).error).toBe("Please wait before requesting another code.");
  });

  it("returns 503 when mail delivery fails", async () => {
    requestEmailVerification.mockRejectedValueOnce(
      new EmailVerificationRequestError("mail_failed", "Unable to send a verification code right now."),
    );

    const response = await POST(jsonRequest({ email: "ada@example.com" }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("Unable to send a verification code right now.");
  });

  it("returns a safe 500 without internals on unexpected failure", async () => {
    requestEmailVerification.mockRejectedValueOnce(new Error("SMTP_PASS leaked smtp://secret"));

    const response = await POST(jsonRequest({ email: "ada@example.com" }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Unable to send a verification code right now." });
    expect(JSON.stringify(body)).not.toContain("SMTP_PASS");
    expect(JSON.stringify(body)).not.toContain("smtp://secret");
  });

  it("returns 400 for invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost:3001/api/auth/email/request", {
        method: "POST",
        body: "not-json",
      }),
    );
    expect(response.status).toBe(400);
    expect(response).toBeInstanceOf(NextResponse);
  });
});
