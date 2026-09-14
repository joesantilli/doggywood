import "server-only";
import { getPrisma } from "@/lib/db";
import { safeParseServerEnv } from "@/lib/env";

export type HealthPayload =
  | { status: "ok"; database: "ok" }
  | { status: "error"; database: "unavailable" };

type HealthOptions = {
  env?: Record<string, string | undefined>;
  pingDatabase?: () => Promise<void>;
};

export async function getHealthPayload(
  options: HealthOptions = {},
): Promise<{ statusCode: number; body: HealthPayload }> {
  const env = options.env ?? process.env;
  const parsed = safeParseServerEnv(env);
  if (!parsed.success) {
    return { statusCode: 503, body: { status: "error", database: "unavailable" } };
  }

  const ping =
    options.pingDatabase ??
    (async () => {
      await getPrisma().$queryRaw`SELECT 1`;
    });

  try {
    await ping();
    return { statusCode: 200, body: { status: "ok", database: "ok" } };
  } catch {
    return { statusCode: 503, body: { status: "error", database: "unavailable" } };
  }
}
