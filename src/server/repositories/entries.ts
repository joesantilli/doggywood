import "server-only";
import type { EntryStatus } from "@prisma/client";
import { getPrisma } from "@/lib/db";

export const entryRepository = {
  findByContestAndDog(contestId: string, dogId: string) {
    return getPrisma().entry.findUnique({
      where: { contestId_dogId: { contestId, dogId } },
    });
  },

  create(data: {
    contestId: string;
    dogId: string;
    userId: string;
    slug: string;
    caption?: string;
    status?: EntryStatus;
  }) {
    return getPrisma().entry.create({ data });
  },
};
