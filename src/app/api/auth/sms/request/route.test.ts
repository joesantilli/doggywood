import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const { requestSmsVerification } = vi.hoisted(() => ({
  requestSmsVerification: vi.fn(),
}));

vi.mock("@/server/auth/sms-verification", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/auth/sms-verification")>();
  return {
    ...actual,
    requestSmsVerification,
  };
});

import { SmsVerificationRequestError } from "@/server/auth/sms-verification";
import { POST } from "@/app/api/auth/sms/request/route";

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3001/api/auth/sms/request", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/sms/request", () => {
  beforeEach(() => {
    requestSmsVerification.mockReset();
  });

  it("returns success without an SMS code or Twilio SID", async () => {
    requestSmsVerification.mockResolvedValueOnce({
      challengeId: "challenge_sms_123",
      destination: "+14155552671",
      expiresAt: new Date("2026-09-16T12:10:00.000Z"),
    });

    const response = await POST(
      jsonRequest(
        { phone: "(415) 555-2671" },
        { "user-agent": "vitest-sms", "x-forwarded-for": "198.51.100.80" },
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      challengeId: "challenge_sms_123",
      expiresAt: "2026-09-16T12:10:00.000Z",
    });
    expect(JSON.stringify(body)).not.toMatch(/"code"/);
    expect(JSON.stringify(body)).not.toContain("twilioSid");
    expect(JSON.stringify(body)).not.toContain("TWILIO_");
    expect(JSON.stringify(body)).not.toContain("VEtest");
    expect(requestSmsVerification).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: "(415) 555-2671",
        ipAddress: "198.51.100.80",
        userAgent: "vitest-sms",
      }),
    );
  });

  it("accepts a formatted US number and lets the service normalize it", async () => {
    requestSmsVerification.mockResolvedValueOnce({
      challengeId: "challenge_sms_formatted",
      destination: "+17605551212",
      expiresAt: new Date("2026-09-16T12:10:00.000Z"),
    });

    const response = await POST(jsonRequest({ phone: "(760) 555-1212" }));
    expect(response.status).toBe(200);
    expect(requestSmsVerification).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "(760) 555-1212" }),
    );
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(JSON.stringify(body)).not.toContain("twilioSid");
    expect(JSON.stringify(body)).not.toContain("TWILIO_AUTH_TOKEN");
  });

  it("returns 400 for an invalid phone", async () => {
    requestSmsVerification.mockRejectedValueOnce(
      new SmsVerificationRequestError("invalid_phone", "Enter a valid mobile number."),
    );

    const response = await POST(jsonRequest({ phone: "555-1212" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Enter a valid mobile number.");
    expect(JSON.stringify(body)).not.toContain("twilioSid");
  });

  it("returns 429 when rate limited", async () => {
    requestSmsVerification.mockRejectedValueOnce(
      new SmsVerificationRequestError(
        "rate_limited",
        "Please wait before requesting another code.",
      ),
    );

    const response = await POST(jsonRequest({ phone: "+17605551212" }));
    expect(response.status).toBe(429);
    expect((await response.json()).error).toBe("Please wait before requesting another code.");
  });

  it("returns 503 when Twilio start fails", async () => {
    requestSmsVerification.mockRejectedValueOnce(
      new SmsVerificationRequestError(
        "sms_failed",
        "Unable to send a verification code right now.",
      ),
    );

    const response = await POST(jsonRequest({ phone: "+17605551212" }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("Unable to send a verification code right now.");
  });

  it("returns a safe 500 without internals on unexpected failure", async () => {
    requestSmsVerification.mockRejectedValueOnce(
      new Error("TWILIO_AUTH_TOKEN leaked token=raw-secret VA123"),
    );

    const response = await POST(jsonRequest({ phone: "+17605551212" }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Unable to send a verification code right now." });
    expect(JSON.stringify(body)).not.toContain("TWILIO_AUTH_TOKEN");
    expect(JSON.stringify(body)).not.toContain("raw-secret");
  });

  it("returns 400 for invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost:3001/api/auth/sms/request", {
        method: "POST",
        body: "not-json",
      }),
    );
    expect(response.status).toBe(400);
    expect(response).toBeInstanceOf(NextResponse);
    expect((await response.json()).error).toBe("Invalid request.");
  });
});
