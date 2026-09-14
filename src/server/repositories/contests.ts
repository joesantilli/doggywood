import "server-only";
import type { ContestStatus } from "@prisma/client";
import { getPrisma } from "@/lib/db";

export const contestRepository = {
  findBySlug(slug: string) {
    return getPrisma().contest.findUnique({ where: { slug } });
  },

  findCurrent(now = new Date()) {
    return getPrisma().contest.findFirst({
      where: {
        status: "OPEN",
        startsAt: { lte: now },
        entryClosesAt: { gt: now },
      },
      orderBy: { startsAt: "desc" },
    });
  },

  create(data: {
    name: string;
    slug: string;
    status?: ContestStatus;
    startsAt: Date;
    entryClosesAt: Date;
    votingClosesAt: Date;
    prizeAmountCents?: number;
    currency?: string;
    rulesVersion: string;
  }) {
    return getPrisma().contest.create({ data });
  },
};
