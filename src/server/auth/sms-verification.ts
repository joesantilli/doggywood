import "server-only";
import { getPrisma } from "@/lib/db";
import { createSession } from "@/server/auth/session";
import { normalizePhoneE164 } from "@/server/auth/normalize";
import { verificationChallengeRepository } from "@/server/repositories/verification-challenges";
import {
  checkSmsVerification,
  startSmsVerification,
  TwilioConfigError,
  TwilioRequestError,
  type CheckSmsVerificationResult,
} from "@/server/sms/twilio-verify";

export const SMS_VERIFICATION_TTL_MS = 10 * 60 * 1000;
export const SMS_REQUEST_COOLDOWN_MS = 60 * 1000;
export const SMS_REQUESTS_PER_HOUR = 3;
export const SMS_REQUESTS_PER_HOUR_PER_IP = 5;

const HOUR_MS = 60 * 60 * 1000;

export type SmsVerificationRequestKind = "invalid_phone" | "rate_limited" | "sms_failed";

export class SmsVerificationRequestError extends Error {
  readonly kind: SmsVerificationRequestKind;

  constructor(kind: SmsVerificationRequestKind, message: string) {
    super(message);
    this.name = "SmsVerificationRequestError";
    this.kind = kind;
  }
}

export type RequestSmsVerificationInput = {
  phone: string;
  ipAddress?: string;
  userAgent?: string;
  currentTime?: Date;
};

export type RequestSmsVerificationResult = {
  challengeId: string;
  destination: string;
  expiresAt: Date;
};

type RequestSmsVerificationDeps = {
  startSms?: typeof startSmsVerification;
};

function rateLimited() {
  return new SmsVerificationRequestError(
    "rate_limited",
    "Please wait before requesting another code.",
  );
}

function smsFailed() {
  return new SmsVerificationRequestError(
    "sms_failed",
    "Unable to send a verification code right now.",
  );
}

export async function requestSmsVerification(
  input: RequestSmsVerificationInput,
  deps: RequestSmsVerificationDeps = {},
): Promise<RequestSmsVerificationResult> {
  const now = input.currentTime ?? new Date();
  const startSms = deps.startSms ?? startSmsVerification;

  let destination: string;
  try {
    destination = normalizePhoneE164(input.phone);
  } catch {
    throw new SmsVerificationRequestError("invalid_phone", "Enter a valid mobile number.");
  }

  const recentMinute = await verificationChallengeRepository.countRecentChallengesForDestination(
    "SMS",
    destination,
    new Date(now.getTime() - SMS_REQUEST_COOLDOWN_MS),
  );
  if (recentMinute > 0) {
    throw rateLimited();
  }

  const recentHour = await verificationChallengeRepository.countRecentChallengesForDestination(
    "SMS",
    destination,
    new Date(now.getTime() - HOUR_MS),
  );
  if (recentHour >= SMS_REQUESTS_PER_HOUR) {
    throw rateLimited();
  }

  if (input.ipAddress) {
    const recentIp = await verificationChallengeRepository.countRecentChallengesForIp(
      input.ipAddress,
      new Date(now.getTime() - HOUR_MS),
    );
    if (recentIp >= SMS_REQUESTS_PER_HOUR_PER_IP) {
      throw rateLimited();
    }
  }

  await verificationChallengeRepository.invalidateActiveChallenges("SMS", destination, now);

  const expiresAt = new Date(now.getTime() + SMS_VERIFICATION_TTL_MS);
  const challenge = await verificationChallengeRepository.createVerificationChallenge({
    channel: "SMS",
    destination,
    codeHash: null,
    twilioSid: null,
    expiresAt,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    requestCount: 1,
  });

  try {
    const started = await startSms({ phoneE164: destination });
    await verificationChallengeRepository.setVerificationChallengeTwilioSid(
      challenge.id,
      started.sid,
    );
  } catch {
    await verificationChallengeRepository.invalidateVerificationChallenge(challenge.id, now);
    throw smsFailed();
  }

  return {
    challengeId: challenge.id,
    destination,
    expiresAt,
  };
}

export const SMS_VERIFICATION_MAX_ATTEMPTS = 5;

export class SmsVerificationFailedError extends Error {
  readonly kind = "failed" as const;

  constructor() {
    super("Unable to verify that code.");
    this.name = "SmsVerificationFailedError";
  }
}

export class SmsVerificationConflictError extends Error {
  readonly kind = "conflict" as const;

  constructor() {
    super("Unable to complete verification.");
    this.name = "SmsVerificationConflictError";
  }
}

export class SmsVerificationUnavailableError extends Error {
  readonly kind = "unavailable" as const;

  constructor() {
    super("Unable to complete verification right now.");
    this.name = "SmsVerificationUnavailableError";
  }
}

export type VerifySmsVerificationInput = {
  challengeId: string;
  code: string;
  currentTime?: Date;
  ipAddress?: string;
  userAgent?: string;
};

export type VerifySmsVerificationResult = {
  userId: string;
  phoneE164: string;
  phoneVerifiedAt: Date;
};

type VerifySmsVerificationDeps = {
  checkSms?: typeof checkSmsVerification;
};

function isSixDigitCode(code: string) {
  return /^\d{6}$/.test(code);
}

function genericSmsFailure(): never {
  throw new SmsVerificationFailedError();
}

export async function verifySmsVerification(
  input: VerifySmsVerificationInput,
  deps: VerifySmsVerificationDeps = {},
): Promise<VerifySmsVerificationResult> {
  const now = input.currentTime ?? new Date();
  const checkSms = deps.checkSms ?? checkSmsVerification;
  const challenge = await verificationChallengeRepository.findVerificationChallengeById(
    input.challengeId,
  );

  if (
    !challenge ||
    challenge.channel !== "SMS" ||
    challenge.codeHash !== null ||
    !challenge.twilioSid ||
    challenge.consumedAt ||
    challenge.invalidatedAt ||
    challenge.expiresAt.getTime() <= now.getTime()
  ) {
    genericSmsFailure();
  }

  const activeChallenge = challenge;

  if (activeChallenge.attemptCount >= SMS_VERIFICATION_MAX_ATTEMPTS) {
    await verificationChallengeRepository.invalidateVerificationChallenge(activeChallenge.id, now);
    genericSmsFailure();
  }

  if (!isSixDigitCode(input.code)) {
    genericSmsFailure();
  }

  const attempted = await verificationChallengeRepository.incrementVerificationAttempt(
    activeChallenge.id,
  );

  let checked: CheckSmsVerificationResult;
  try {
    checked = await checkSms({
      phoneE164: activeChallenge.destination,
      code: input.code,
    });
  } catch (error) {
    if (error instanceof TwilioConfigError || error instanceof TwilioRequestError) {
      throw new SmsVerificationUnavailableError();
    }
    throw error;
  }

  if (!checked.valid) {
    if (attempted.attemptCount >= SMS_VERIFICATION_MAX_ATTEMPTS) {
      await verificationChallengeRepository.invalidateVerificationChallenge(
        activeChallenge.id,
        now,
      );
    }
    genericSmsFailure();
  }

  const prisma = getPrisma();
  const destination = activeChallenge.destination;

  const user = await prisma.$transaction(async (tx) => {
    const consumed = await tx.verificationChallenge.updateMany({
      where: {
        id: activeChallenge.id,
        channel: "SMS",
        consumedAt: null,
        invalidatedAt: null,
        expiresAt: { gt: now },
      },
      data: { consumedAt: now },
    });
    if (consumed.count !== 1) {
      throw new SmsVerificationFailedError();
    }

    const identity = await tx.authIdentity.findUnique({
      where: {
        provider_providerSubject: { provider: "PHONE", providerSubject: destination },
      },
    });
    const userByPhone = await tx.user.findUnique({ where: { phoneE164: destination } });

    if (identity && userByPhone && identity.userId !== userByPhone.id) {
      throw new SmsVerificationConflictError();
    }

    if (identity) {
      const owner = await tx.user.findUniqueOrThrow({ where: { id: identity.userId } });
      if (owner.phoneE164 && owner.phoneE164 !== destination) {
        throw new SmsVerificationConflictError();
      }
      return tx.user.update({
        where: { id: owner.id },
        data: {
          phoneE164: destination,
          phoneVerifiedAt: now,
        },
      });
    }

    if (userByPhone) {
      await tx.authIdentity.create({
        data: {
          userId: userByPhone.id,
          provider: "PHONE",
          providerSubject: destination,
          phoneE164: destination,
        },
      });
      return tx.user.update({
        where: { id: userByPhone.id },
        data: {
          phoneE164: destination,
          phoneVerifiedAt: now,
        },
      });
    }

    const created = await tx.user.create({
      data: {
        phoneE164: destination,
        phoneVerifiedAt: now,
      },
    });
    await tx.authIdentity.create({
      data: {
        userId: created.id,
        provider: "PHONE",
        providerSubject: destination,
        phoneE164: destination,
      },
    });
    return created;
  });

  await createSession(user.id, {
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  if (!user.phoneE164 || !user.phoneVerifiedAt) {
    genericSmsFailure();
  }

  return {
    userId: user.id,
    phoneE164: user.phoneE164,
    phoneVerifiedAt: user.phoneVerifiedAt,
  };
}

