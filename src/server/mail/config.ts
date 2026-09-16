import "server-only";
import { z } from "zod";

export const DEFAULT_SMTP_FROM = "Doggywood <noreply@doggywood.com>";

const smtpSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  user: z.string().min(1),
  pass: z.string().min(1),
  from: z.string().min(1),
  secure: z.boolean(),
});

export type SmtpConfig = z.infer<typeof smtpSchema>;

export function getSmtpFrom(env: Record<string, string | undefined> = process.env) {
  return env.SMTP_FROM?.trim() || DEFAULT_SMTP_FROM;
}

export function getSmtpConfig(
  env: Record<string, string | undefined> = process.env,
): SmtpConfig | null {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(env.SMTP_PORT || "465");
  if (!Number.isFinite(port) || port <= 0) {
    return null;
  }

  const parsed = smtpSchema.safeParse({
    host,
    port,
    user,
    pass,
    from: getSmtpFrom(env),
    secure: env.SMTP_SECURE === "true" || env.SMTP_SECURE === "ssl" || port === 465,
  });

  return parsed.success ? parsed.data : null;
}
