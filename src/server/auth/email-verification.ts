import "server-only";
import { getPrisma } from "@/lib/db";
import { createSession } from "@/server/auth/session";
import { sendSmtpMail } from "@/server/mail/smtp";
import { normalizeEmail } from "@/server/auth/normalize";
import {
  generateEmailVerificationCode,
  hashEmailVerificationCode,
  verifyEmailVerificationCode,
} from "@/server/auth/verification-code";
import { verificationChallengeRepository } from "@/server/repositories/verification-challenges";

export const EMAIL_VERIFICATION_TTL_MS = 10 * 60 * 1000;
export const EMAIL_REQUEST_COOLDOWN_MS = 60 * 1000;
export const EMAIL_REQUESTS_PER_HOUR = 5;
export const EMAIL_REQUESTS_PER_HOUR_PER_IP = 10;

const HOUR_MS = 60 * 60 * 1000;
const EMAIL_SUBJECT = "Your Doggywood verification code";

export type EmailVerificationRequestKind = "invalid_email" | "rate_limited" | "mail_failed";

export class EmailVerificationRequestError extends Error {
  readonly kind: EmailVerificationRequestKind;

  constructor(kind: EmailVerificationRequestKind, message: string) {
    super(message);
    this.name = "EmailVerificationRequestError";
    this.kind = kind;
  }
}

export type RequestEmailVerificationInput = {
  email: string;
  ipAddress?: string;
  userAgent?: string;
  sessionSecret: string;
  currentTime?: Date;
};

export type RequestEmailVerificationResult = {
  challengeId: string;
  destination: string;
  expiresAt: Date;
};

type RequestEmailVerificationDeps = {
  sendMail?: typeof sendSmtpMail;
  generateCode?: typeof generateEmailVerificationCode;
};

function rateLimited() {
  return new EmailVerificationRequestError(
    "rate_limited",
    "Please wait before requesting another code.",
  );
}

export async function requestEmailVerification(
  input: RequestEmailVerificationInput,
  deps: RequestEmailVerificationDeps = {},
): Promise<RequestEmailVerificationResult> {
  const now = input.currentTime ?? new Date();
  const sendMail = deps.sendMail ?? sendSmtpMail;
  const generateCode = deps.generateCode ?? generateEmailVerificationCode;

  let destination: string;
  try {
    destination = normalizeEmail(input.email);
  } catch {
    throw new EmailVerificationRequestError("invalid_email", "Enter a valid email address.");
  }

  const recentMinute = await verificationChallengeRepository.countRecentChallengesForDestination(
    "EMAIL",
    destination,
    new Date(now.getTime() - EMAIL_REQUEST_COOLDOWN_MS),
  );
  if (recentMinute > 0) {
    throw rateLimited();
  }

  const recentHour = await verificationChallengeRepository.countRecentChallengesForDestination(
    "EMAIL",
    destination,
    new Date(now.getTime() - HOUR_MS),
  );
  if (recentHour >= EMAIL_REQUESTS_PER_HOUR) {
    throw rateLimited();
  }

  if (input.ipAddress) {
    const recentIp = await verificationChallengeRepository.countRecentChallengesForIp(
      input.ipAddress,
      new Date(now.getTime() - HOUR_MS),
    );
    if (recentIp >= EMAIL_REQUESTS_PER_HOUR_PER_IP) {
      throw rateLimited();
    }
  }

  await verificationChallengeRepository.invalidateActiveChallenges("EMAIL", destination, now);

  const code = generateCode();
  const codeHash = hashEmailVerificationCode(input.sessionSecret, destination, code);
  const expiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_TTL_MS);

  const challenge = await verificationChallengeRepository.createVerificationChallenge({
    channel: "EMAIL",
    destination,
    codeHash,
    twilioSid: null,
    expiresAt,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  try {
    await sendMail({
      to: destination,
      subject: EMAIL_SUBJECT,
      text: `Your Doggywood verification code is ${code}.\n\nThis code expires in ten minutes.`,
      html: `<p>Your Doggywood verification code is <strong>${code}</strong>.</p><p>This code expires in ten minutes.</p>`,
    });
  } catch {
    await verificationChallengeRepository.invalidateActiveChallenges("EMAIL", destination, now);
    throw new EmailVerificationRequestError(
      "mail_failed",
      "Unable to send a verification code right now.",
    );
  }

  return {
    challengeId: challenge.id,
    destination,
    expiresAt,
  };
}

export const EMAIL_VERIFICATION_MAX_ATTEMPTS = 5;

export class EmailVerificationFailedError extends Error {
  readonly kind = "failed" as const;

  constructor() {
    super("Unable to verify that code.");
    this.name = "EmailVerificationFailedError";
  }
}

export class EmailVerificationConflictError extends Error {
  readonly kind = "conflict" as const;

  constructor() {
    super("Unable to complete verification.");
    this.name = "EmailVerificationConflictError";
  }
}

export type VerifyEmailVerificationInput = {
  challengeId: string;
  code: string;
  sessionSecret: string;
  currentTime?: Date;
  ipAddress?: string;
  userAgent?: string;
};

export type VerifyEmailVerificationResult = {
  userId: string;
  email: string;
  emailVerifiedAt: Date;
};

function isSixDigitCode(code: string) {
  return /^\d{6}$/.test(code);
}

function genericFailure(): never {
  throw new EmailVerificationFailedError();
}

export async function verifyEmailVerification(
  input: VerifyEmailVerificationInput,
): Promise<VerifyEmailVerificationResult> {
  const now = input.currentTime ?? new Date();
  const challenge = await verificationChallengeRepository.findVerificationChallengeById(
    input.challengeId,
  );

  if (
    !challenge ||
    challenge.channel !== "EMAIL" ||
    !challenge.codeHash ||
    challenge.consumedAt ||
    challenge.invalidatedAt ||
    challenge.expiresAt.getTime() <= now.getTime()
  ) {
    genericFailure();
  }

  const activeChallenge = challenge;
  const codeHash = activeChallenge.codeHash;
  if (!codeHash) {
    genericFailure();
  }

  if (activeChallenge.attemptCount >= EMAIL_VERIFICATION_MAX_ATTEMPTS) {
    await verificationChallengeRepository.invalidateVerificationChallenge(activeChallenge.id, now);
    genericFailure();
  }

  if (!isSixDigitCode(input.code)) {
    genericFailure();
  }

  const attempted = await verificationChallengeRepository.incrementVerificationAttempt(
    activeChallenge.id,
  );
  const codeMatches = verifyEmailVerificationCode(
    input.sessionSecret,
    activeChallenge.destination,
    input.code,
    codeHash,
  );

  if (!codeMatches) {
    if (attempted.attemptCount >= EMAIL_VERIFICATION_MAX_ATTEMPTS) {
      await verificationChallengeRepository.invalidateVerificationChallenge(
        activeChallenge.id,
        now,
      );
    }
    genericFailure();
  }

  const prisma = getPrisma();
  const destination = activeChallenge.destination;

  const user = await prisma.$transaction(async (tx) => {
    const consumed = await tx.verificationChallenge.updateMany({
      where: {
        id: activeChallenge.id,
        channel: "EMAIL",
        consumedAt: null,
        invalidatedAt: null,
        expiresAt: { gt: now },
      },
      data: { consumedAt: now },
    });
    if (consumed.count !== 1) {
      throw new EmailVerificationFailedError();
    }

    const identity = await tx.authIdentity.findUnique({
      where: {
        provider_providerSubject: { provider: "EMAIL", providerSubject: destination },
      },
    });
    const userByEmail = await tx.user.findUnique({ where: { email: destination } });

    if (identity && userByEmail && identity.userId !== userByEmail.id) {
      throw new EmailVerificationConflictError();
    }

    if (identity) {
      return tx.user.update({
        where: { id: identity.userId },
        data: {
          email: destination,
          emailVerifiedAt: now,
        },
      });
    }

    if (userByEmail) {
      await tx.authIdentity.create({
        data: {
          userId: userByEmail.id,
          provider: "EMAIL",
          providerSubject: destination,
          email: destination,
        },
      });
      return tx.user.update({
        where: { id: userByEmail.id },
        data: {
          email: destination,
          emailVerifiedAt: now,
        },
      });
    }

    const created = await tx.user.create({
      data: {
        email: destination,
        emailVerifiedAt: now,
      },
    });
    await tx.authIdentity.create({
      data: {
        userId: created.id,
        provider: "EMAIL",
        providerSubject: destination,
        email: destination,
      },
    });
    return created;
  });

  await createSession(user.id, {
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  if (!user.email || !user.emailVerifiedAt) {
    genericFailure();
  }

  return {
    userId: user.id,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt,
  };
}
