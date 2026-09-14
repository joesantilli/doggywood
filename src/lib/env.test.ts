import { describe, expect, it } from "vitest";
import { parseServerEnv, safeParseServerEnv } from "@/lib/env";

const validEnv = {
  DATABASE_URL: "postgresql://doggywood:doggywood_local_only@localhost:5432/doggywood?schema=public",
  APP_URL: "http://localhost:3001",
  SESSION_SECRET: "local-development-session-secret-32ch",
  SESSION_COOKIE_NAME: "doggywood_session",
};

describe("server environment validation", () => {
  it("accepts the required server variables", () => {
    expect(parseServerEnv(validEnv)).toEqual(validEnv);
  });

  it("accepts postgres:// database URLs", () => {
    expect(
      parseServerEnv({
        ...validEnv,
        DATABASE_URL: "postgres://doggywood:doggywood_local_only@localhost:5432/doggywood",
      }).DATABASE_URL,
    ).toBe("postgres://doggywood:doggywood_local_only@localhost:5432/doggywood");
  });

  it("rejects missing required variables", () => {
    const result = safeParseServerEnv({
      DATABASE_URL: validEnv.DATABASE_URL,
      APP_URL: validEnv.APP_URL,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-postgres database URL", () => {
    const result = safeParseServerEnv({
      ...validEnv,
      DATABASE_URL: "mysql://localhost/doggywood",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short session secret", () => {
    const result = safeParseServerEnv({
      ...validEnv,
      SESSION_SECRET: "too-short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid application URL", () => {
    const result = safeParseServerEnv({
      ...validEnv,
      APP_URL: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
