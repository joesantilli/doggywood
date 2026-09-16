import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import {
  EmailVerificationConflictError,
  EmailVerificationFailedError,
  verifyEmailVerification,
} from "@/server/auth/email-verification";

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

  let sessionSecret: string;
  try {
    sessionSecret = getServerEnv().SESSION_SECRET;
  } catch {
    return errorResponse("Unable to complete verification right now.", 500);
  }

  try {
    const result = await verifyEmailVerification({
      challengeId: parsed.data.challengeId,
      code: parsed.data.code,
      sessionSecret,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: result.userId,
        email: result.email,
        emailVerifiedAt: result.emailVerifiedAt,
      },
    });
  } catch (error) {
    if (error instanceof EmailVerificationFailedError) {
      return errorResponse("Unable to verify that code.", 400);
    }
    if (error instanceof EmailVerificationConflictError) {
      return errorResponse("Unable to complete verification.", 409);
    }

    return errorResponse("Unable to complete verification right now.", 500);
  }
}
