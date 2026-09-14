import { describe, expect, it } from "vitest";
import { getHealthPayload } from "@/server/health";

const validEnv = {
  DATABASE_URL: "postgresql://doggywood:doggywood_local_only@localhost:5432/doggywood?schema=public",
  APP_URL: "http://localhost:3001",
  SESSION_SECRET: "local-development-session-secret-32ch",
  SESSION_COOKIE_NAME: "doggywood_session",
};

describe("health payload", () => {
  it("returns ok when PostgreSQL responds", async () => {
    const result = await getHealthPayload({
      env: validEnv,
      pingDatabase: async () => undefined,
    });
    expect(result).toEqual({
      statusCode: 200,
      body: { status: "ok", database: "ok" },
    });
  });

  it("returns a server error without leaking connection details", async () => {
    const result = await getHealthPayload({
      env: validEnv,
      pingDatabase: async () => {
        throw new Error("ECONNREFUSED secret-should-not-leak");
      },
    });
    expect(result.statusCode).toBe(503);
    expect(result.body).toEqual({ status: "error", database: "unavailable" });
    expect(JSON.stringify(result.body)).not.toContain("secret");
    expect(JSON.stringify(result.body)).not.toContain("ECONNREFUSED");
  });

  it("returns unavailable when required environment is missing", async () => {
    const result = await getHealthPayload({
      env: {},
      pingDatabase: async () => undefined,
    });
    expect(result).toEqual({
      statusCode: 503,
      body: { status: "error", database: "unavailable" },
    });
  });
});
