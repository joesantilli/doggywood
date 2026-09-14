import "server-only";
import type { IdentityProvider } from "@prisma/client";
import { getPrisma } from "@/lib/db";

export const identityRepository = {
  findByProviderSubject(provider: IdentityProvider, providerSubject: string) {
    return getPrisma().authIdentity.findUnique({
      where: {
        provider_providerSubject: { provider, providerSubject },
      },
      include: { user: true },
    });
  },

  findByUserId(userId: string) {
    return getPrisma().authIdentity.findMany({ where: { userId } });
  },

  create(data: {
    userId: string;
    provider: IdentityProvider;
    providerSubject: string;
    email?: string;
    phoneE164?: string;
  }) {
    return getPrisma().authIdentity.create({ data });
  },
};
