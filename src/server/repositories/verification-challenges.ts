import "server-only";
import type { Prisma, VerificationChannel } from "@prisma/client";
import { getPrisma } from "@/lib/db";

function activeChallengeWhere(now: Date): Prisma.VerificationChallengeWhereInput {
  return {
    consumedAt: null,
    invalidatedAt: null,
    expiresAt: { gt: now },
  };
}

export const verificationChallengeRepository = {
  createVerificationChallenge(data: {
    channel: VerificationChannel;
    destination: string;
    codeHash?: string | null;
    twilioSid?: string | null;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    requestCount?: number;
  }) {
    return getPrisma().verificationChallenge.create({
      data: {
        channel: data.channel,
        destination: data.destination,
        codeHash: data.codeHash ?? undefined,
        twilioSid: data.twilioSid ?? undefined,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress ?? undefined,
        userAgent: data.userAgent ?? undefined,
        requestCount: data.requestCount,
      },
    });
  },

  findVerificationChallengeById(id: string) {
    return getPrisma().verificationChallenge.findUnique({ where: { id } });
  },

  findLatestActiveChallenge(
    channel: VerificationChannel,
    destination: string,
    now = new Date(),
  ) {
    return getPrisma().verificationChallenge.findFirst({
      where: {
        channel,
        destination,
        ...activeChallengeWhere(now),
      },
      orderBy: { createdAt: "desc" },
    });
  },

  invalidateActiveChallenges(
    channel: VerificationChannel,
    destination: string,
    now = new Date(),
  ) {
    return getPrisma().verificationChallenge.updateMany({
      where: {
        channel,
        destination,
        ...activeChallengeWhere(now),
      },
      data: { invalidatedAt: now },
    });
  },

  incrementVerificationAttempt(id: string) {
    return getPrisma().verificationChallenge.update({
      where: { id },
      data: { attemptCount: { increment: 1 } },
    });
  },

  invalidateVerificationChallenge(id: string, now = new Date()) {
    return getPrisma().verificationChallenge.updateMany({
      where: {
        id,
        consumedAt: null,
        invalidatedAt: null,
      },
      data: { invalidatedAt: now },
    });
  },

  async consumeVerificationChallenge(id: string, now = new Date()) {
    const updated = await getPrisma().verificationChallenge.updateMany({
      where: {
        id,
        ...activeChallengeWhere(now),
      },
      data: { consumedAt: now },
    });

    if (updated.count === 0) {
      return null;
    }

    return getPrisma().verificationChallenge.findUnique({ where: { id } });
  },

  countRecentChallengesForDestination(
    channel: VerificationChannel,
    destination: string,
    since: Date,
  ) {
    return getPrisma().verificationChallenge.count({
      where: {
        channel,
        destination,
        createdAt: { gte: since },
      },
    });
  },

  countRecentChallengesForIp(ipAddress: string, since: Date) {
    return getPrisma().verificationChallenge.count({
      where: {
        ipAddress,
        createdAt: { gte: since },
      },
    });
  },

  setVerificationChallengeTwilioSid(id: string, twilioSid: string) {
    return getPrisma().verificationChallenge.update({
      where: { id },
      data: { twilioSid },
    });
  },
};
