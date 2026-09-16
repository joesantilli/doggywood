import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const EMAIL_CODE_DIGITS = 6;
const HMAC_SHA256_HEX_LENGTH = 64;

export function generateEmailVerificationCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(EMAIL_CODE_DIGITS, "0");
}

export function hashEmailVerificationCode(
  secret: string,
  normalizedDestination: string,
  code: string,
): string {
  return createHmac("sha256", secret)
    .update(`${normalizedDestination}:${code}`)
    .digest("hex");
}

function isSixDigitCode(code: string) {
  return /^\d{6}$/.test(code);
}

function isSha256HexDigest(value: string) {
  return /^[a-f0-9]{64}$/.test(value);
}

export function verifyEmailVerificationCode(
  secret: string,
  normalizedDestination: string,
  code: string,
  codeHash: string,
): boolean {
  if (
    !secret ||
    !normalizedDestination ||
    !isSixDigitCode(code) ||
    !isSha256HexDigest(codeHash)
  ) {
    return false;
  }

  const expected = hashEmailVerificationCode(secret, normalizedDestination, code);
  if (expected.length !== HMAC_SHA256_HEX_LENGTH || codeHash.length !== HMAC_SHA256_HEX_LENGTH) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(codeHash));
}
