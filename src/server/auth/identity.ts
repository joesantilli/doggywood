import "server-only";
import type { AuthIdentity, IdentityProvider, User, UserRole } from "@prisma/client";
import { identityRepository } from "@/server/repositories/identities";
import { userRepository } from "@/server/repositories/users";

export type IdentityInput = {
  provider: IdentityProvider;
  providerSubject: string;
  email?: string | null;
  phoneE164?: string | null;
};

export type UserProfileInput = {
  role?: UserRole;
  firstName?: string | null;
  lastName?: string | null;
};

/**
 * Identity mapping for Doggywood application users.
 *
 * Phase 01 uses IdentityProvider.LOCAL only. VERIFY_DOG will later call the
 * same functions after a signed identity exchange. Contest, vote, and
 * session logic must keep using User.id from the resolved User.
 *
 * This module does not implement OAuth, OpenID Connect, or a Verify.Dog
 * production connection.
 */
function optionalText(value: string | null | undefined) {
  return value ?? undefined;
}

export async function findUserByExternalIdentity(
  provider: IdentityProvider,
  providerSubject: string,
): Promise<User | null> {
  const identity = await identityRepository.findByProviderSubject(provider, providerSubject);
  return identity?.user ?? null;
}

export async function linkIdentityToUser(
  userId: string,
  identity: IdentityInput,
): Promise<AuthIdentity> {
  return identityRepository.create({
    userId,
    provider: identity.provider,
    providerSubject: identity.providerSubject,
    email: optionalText(identity.email),
    phoneE164: identity.phoneE164 ?? undefined,
  });
}

export async function createUserForIdentity(
  identity: IdentityInput,
  profile: UserProfileInput = {},
): Promise<User> {
  const user = await userRepository.create({
    role: profile.role,
    firstName: optionalText(profile.firstName),
    lastName: optionalText(profile.lastName),
    email: optionalText(identity.email),
    phoneE164: identity.phoneE164 ?? undefined,
  });

  await identityRepository.create({
    userId: user.id,
    provider: identity.provider,
    providerSubject: identity.providerSubject,
    email: optionalText(identity.email),
    phoneE164: identity.phoneE164 ?? undefined,
  });

  return user;
}

export async function resolveIdentity(
  identity: IdentityInput,
  profile: UserProfileInput = {},
): Promise<User> {
  const existing = await findUserByExternalIdentity(identity.provider, identity.providerSubject);
  if (existing) {
    return existing;
  }

  return createUserForIdentity(identity, profile);
}
