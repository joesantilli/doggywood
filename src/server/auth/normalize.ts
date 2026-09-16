import "server-only";
import { z } from "zod";

const emailSchema = z.string().email();

export function normalizeEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!email) {
    throw new Error("Email is required");
  }

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    throw new Error("Enter a valid email address");
  }

  return parsed.data;
}

export function normalizePhoneE164(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Mobile number is required");
  }

  if (/[a-zA-Z]/.test(trimmed)) {
    throw new Error("Enter a valid mobile number");
  }

  const digits = trimmed.replace(/\D/g, "");
  let national = "";

  if (digits.length === 10) {
    national = digits;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    national = digits.slice(1);
  } else {
    throw new Error("Enter a valid mobile number");
  }

  if (!/^[2-9]\d{9}$/.test(national)) {
    throw new Error("Enter a valid mobile number");
  }

  return `+1${national}`;
}
