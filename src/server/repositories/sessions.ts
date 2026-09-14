import "server-only";
import { getPrisma } from "@/lib/db";

export const sessionRepository = {
  create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return getPrisma().session.create({ data });
  },

  findByTokenHash(tokenHash: string) {
    return getPrisma().session.findUnique({ where: { tokenHash } });
  },

  deleteById(id: string) {
    return getPrisma().session.delete({ where: { id } });
  },

  deleteAllForUser(userId: string) {
    return getPrisma().session.deleteMany({ where: { userId } });
  },

  updateLastSeen(id: string, lastSeenAt: Date) {
    return getPrisma().session.update({
      where: { id },
      data: { lastSeenAt },
    });
  },
};
