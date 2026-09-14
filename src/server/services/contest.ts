import "server-only";
import { contestRepository } from "@/server/repositories/contests";

export const contestService = {
  getCurrentContest(now = new Date()) {
    return contestRepository.findCurrent(now);
  },

  getContestBySlug(slug: string) {
    return contestRepository.findBySlug(slug);
  },
};
