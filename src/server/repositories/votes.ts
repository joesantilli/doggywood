import "server-only";
import type { VoteStatus } from "@prisma/client";
import { getPrisma } from "@/lib/db";

export const voteRepository = {
  findByEntryAndVoter(entryId: string, voterUserId: string) {
    return getPrisma().vote.findUnique({
      where: { entryId_voterUserId: { entryId, voterUserId } },
    });
  },

  create(data: {
    contestId: string;
    entryId: string;
    voterUserId: string;
    status?: VoteStatus;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return getPrisma().vote.create({ data });
  },
};
