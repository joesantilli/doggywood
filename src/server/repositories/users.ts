import "server-only";
import type { UserRole } from "@prisma/client";
import { getPrisma } from "@/lib/db";

export const userRepository = {
  findById(id: string) {
    return getPrisma().user.findUnique({ where: { id } });
  },

  // Cached application-profile lookup. Identity resolution goes through AuthIdentity.
  findByEmail(email: string) {
    return getPrisma().user.findUnique({ where: { email } });
  },

  findByPhone(phoneE164: string) {
    return getPrisma().user.findUnique({ where: { phoneE164 } });
  },

  create(data: {
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneE164?: string;
  }) {
    return getPrisma().user.create({ data });
  },
};
