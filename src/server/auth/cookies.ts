import "server-only";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

function isSecureCookie() {
  return process.env.NODE_ENV === "production";
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const env = getServerEnv();
  const store = await cookies();
  store.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecureCookie(),
    expires: expiresAt,
    // Host-only cookie for the Doggywood origin. Do not set Domain.
    // verify.dog and doggywood.com are separate registrable domains and must
    // not share browser cookies. Future cross-site login is a signed identity
    // exchange, not cookie sharing.
  });
}

export async function readSessionCookie(): Promise<string | undefined> {
  const env = getServerEnv();
  const store = await cookies();
  return store.get(env.SESSION_COOKIE_NAME)?.value;
}

export async function clearSessionCookie() {
  const env = getServerEnv();
  const store = await cookies();
  store.delete(env.SESSION_COOKIE_NAME);
}
