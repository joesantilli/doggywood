import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SmsVerificationConflictError,
  SmsVerificationFailedError,
  SmsVerificationUnavailableError,
  verifySmsVerification,
} from "@/server/auth/sms-verification";

const verifySchema = z.object({
  challengeId: z.string().min(1),
  code: z.string().regex(/^\d{6}$/),
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

  const parsed = verifySchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse("Invalid request.", 400);
  }

  try {
    const result = await verifySmsVerification({
      challengeId: parsed.data.challengeId,
      code: parsed.data.code,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: result.userId,
        phoneE164: result.phoneE164,
        phoneVerifiedAt: result.phoneVerifiedAt,
      },
    });
  } catch (error) {
    if (error instanceof SmsVerificationFailedError) {
      return errorResponse("Unable to verify that code.", 400);
    }
    if (error instanceof SmsVerificationConflictError) {
      return errorResponse("Unable to complete verification.", 409);
    }
    if (error instanceof SmsVerificationUnavailableError) {
      return errorResponse("Unable to complete verification right now.", 503);
    }

    return errorResponse("Unable to complete verification right now.", 500);
  }
}
