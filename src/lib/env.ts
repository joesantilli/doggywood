import "server-only";
import { z } from "zod";

export const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) =>
        value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection string",
    ),
  APP_URL: z.string().url("APP_URL must be a valid URL"),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
  SESSION_COOKIE_NAME: z.string().min(1, "SESSION_COOKIE_NAME is required"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function readServerEnv(source: Record<string, string | undefined>) {
  return {
    DATABASE_URL: source.DATABASE_URL,
    APP_URL: source.APP_URL,
    SESSION_SECRET: source.SESSION_SECRET,
    SESSION_COOKIE_NAME: source.SESSION_COOKIE_NAME,
  };
}

export function parseServerEnv(
  source: Record<string, string | undefined>,
): ServerEnv {
  return serverEnvSchema.parse(readServerEnv(source));
}

export function safeParseServerEnv(source: Record<string, string | undefined>) {
  return serverEnvSchema.safeParse(readServerEnv(source));
}

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (!cachedEnv) {
    cachedEnv = parseServerEnv(process.env);
  }
  return cachedEnv;
}

export function resetServerEnvCache() {
  cachedEnv = undefined;
}
