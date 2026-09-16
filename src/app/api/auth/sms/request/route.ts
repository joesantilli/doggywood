import { NextResponse } from "next/server";
import { z } from "zod";
import {
  requestSmsVerification,
  SmsVerificationRequestError,
} from "@/server/auth/sms-verification";

const requestSchema = z.object({
  phone: z.string(),
});

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }
  return request.headers.get("x-real-ip") ?? undefined;
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid request.", 400);
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse("Enter a valid mobile number.", 400);
  }

  try {
    const result = await requestSmsVerification({
      phone: parsed.data.phone,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      challengeId: result.challengeId,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    if (error instanceof SmsVerificationRequestError) {
      if (error.kind === "invalid_phone") {
        return errorResponse("Enter a valid mobile number.", 400);
      }
      if (error.kind === "rate_limited") {
        return errorResponse("Please wait before requesting another code.", 429);
      }
      if (error.kind === "sms_failed") {
        return errorResponse("Unable to send a verification code right now.", 503);
      }
    }

    return errorResponse("Unable to send a verification code right now.", 500);
  }
}
