import { NextResponse } from "next/server";
import { parseContactForm } from "@/lib/validation/contact";
import { getServerEnv } from "@/lib/env";
import { verifyContactChallenge } from "@/server/contact/challenge";
import { sendContactInquiry } from "@/server/contact/mail";
import { inquiryRepository } from "@/server/repositories/inquiries";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }
  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseContactForm(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form." },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  let secret: string;
  try {
    secret = getServerEnv().SESSION_SECRET;
  } catch {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 503 });
  }

  const validChallenge = verifyContactChallenge(
    secret,
    parsed.data.spamToken,
    parsed.data.spamCode,
    { minAgeMs: 1500 },
  );
  if (!validChallenge) {
    return NextResponse.json(
      { error: "The anti-spam code is incorrect or expired. Refresh the page for a new code." },
      { status: 400 },
    );
  }

  const ipAddress = clientIp(request);

  try {
    if (ipAddress) {
      const recent = await inquiryRepository.countRecentByIp(
        ipAddress,
        new Date(Date.now() - 30_000),
      );
      if (recent > 0) {
        return NextResponse.json(
          { error: "Please wait a moment before sending another message." },
          { status: 429 },
        );
      }
    }

    await inquiryRepository.create({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      ipAddress,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    await sendContactInquiry({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send your message right now." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
