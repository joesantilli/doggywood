import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;
export const CONTACT_CHALLENGE_TTL_MS = 15 * 60 * 1000;

export type ContactChallenge = {
  code: string;
  token: string;
  issuedAt: number;
  expiresAt: number;
};

function hmac(secret: string, value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createContactChallenge(
  secret: string,
  now = Date.now(),
): ContactChallenge {
  let code = "";
  const bytes = randomBytes(CODE_LENGTH);
  for (const byte of bytes) {
    code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  }

  const issuedAt = now;
  const expiresAt = now + CONTACT_CHALLENGE_TTL_MS;
  const signature = hmac(secret, `${code}|${issuedAt}|${expiresAt}`);
  return {
    code,
    token: `${issuedAt}.${expiresAt}.${signature}`,
    issuedAt,
    expiresAt,
  };
}

export function verifyContactChallenge(
  secret: string,
  token: string,
  code: string,
  options: { now?: number; minAgeMs?: number } = {},
) {
  const now = options.now ?? Date.now();
  const minAgeMs = options.minAgeMs ?? 0;
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [issuedRaw, expiresRaw, signature] = parts;
  const issuedAt = Number(issuedRaw);
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt) || !signature) {
    return false;
  }

  if (now < issuedAt + minAgeMs || now > expiresAt) {
    return false;
  }

  const normalized = code.trim().toUpperCase();
  const expected = hmac(secret, `${normalized}|${issuedAt}|${expiresAt}`);
  return safeEqual(expected, signature);
}
