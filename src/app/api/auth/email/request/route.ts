import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import {
  EmailVerificationRequestError,
  requestEmailVerification,
} from "@/server/auth/email-verification";

const requestSchema = z.object({
  email: z.string(),
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
    return errorResponse("Enter a valid email address.", 400);
  }

  let sessionSecret: string;
  try {
    sessionSecret = getServerEnv().SESSION_SECRET;
  } catch {
    return errorResponse("Unable to send a verification code right now.", 503);
  }

  try {
    const result = await requestEmailVerification({
      email: parsed.data.email,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
      sessionSecret,
    });

    return NextResponse.json({
      ok: true,
      challengeId: result.challengeId,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    if (error instanceof EmailVerificationRequestError) {
      if (error.kind === "invalid_email") {
        return errorResponse("Enter a valid email address.", 400);
      }
      if (error.kind === "rate_limited") {
        return errorResponse("Please wait before requesting another code.", 429);
      }
      if (error.kind === "mail_failed") {
        return errorResponse("Unable to send a verification code right now.", 503);
      }
    }

    return errorResponse("Unable to send a verification code right now.", 500);
  }
}
