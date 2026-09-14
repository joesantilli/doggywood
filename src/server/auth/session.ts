import "server-only";
import {
  clearSessionCookie,
  readSessionCookie,
  setSessionCookie,
} from "@/server/auth/cookies";
import {
  generateSessionToken,
  hashSessionToken,
  isSessionExpired,
  sessionExpiresAt,
} from "@/server/auth/session-token";
import { sessionRepository } from "@/server/repositories/sessions";

export {
  SESSION_TTL_MS,
  generateSessionToken,
  hashSessionToken,
  isSessionExpired,
  sessionExpiresAt,
} from "@/server/auth/session-token";

export type SessionRecord = {
  id: string;
  userId: string;
  expiresAt: Date;
  lastSeenAt: Date | null;
};

/**
 * Doggywood application session bound to User.id after identity resolution.
 * Do not key sessions on email, phone, or a provider subject.
 */
export async function createSession(
  userId: string,
  meta: { ipAddress?: string; userAgent?: string } = {},
): Promise<SessionRecord> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = sessionExpiresAt();
  const session = await sessionRepository.create({
    userId,
    tokenHash,
    expiresAt,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  await setSessionCookie(token, expiresAt);

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    lastSeenAt: session.lastSeenAt,
  };
}

export async function getSession(): Promise<SessionRecord | null> {
  const token = await readSessionCookie();
  if (!token) {
    return null;
  }

  const session = await sessionRepository.findByTokenHash(hashSessionToken(token));
  if (!session) {
    await clearSessionCookie();
    return null;
  }

  if (isSessionExpired(session.expiresAt)) {
    await sessionRepository.deleteById(session.id);
    await clearSessionCookie();
    return null;
  }

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    lastSeenAt: session.lastSeenAt,
  };
}

export async function deleteSession(): Promise<void> {
  const token = await readSessionCookie();
  if (token) {
    const session = await sessionRepository.findByTokenHash(hashSessionToken(token));
    if (session) {
      await sessionRepository.deleteById(session.id);
    }
  }

  await clearSessionCookie();
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
  await sessionRepository.deleteAllForUser(userId);
  await clearSessionCookie();
}

export async function touchSession(): Promise<SessionRecord | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const updated = await sessionRepository.updateLastSeen(session.id, new Date());
  return {
    id: updated.id,
    userId: updated.userId,
    expiresAt: updated.expiresAt,
    lastSeenAt: updated.lastSeenAt,
  };
}
