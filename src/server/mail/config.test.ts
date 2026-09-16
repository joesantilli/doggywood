import { describe, expect, it } from "vitest";
import { DEFAULT_SMTP_FROM, getSmtpConfig, getSmtpFrom } from "@/server/mail/config";

const completeEnv = {
  SMTP_HOST: "smtp.sendnow.example",
  SMTP_PORT: "465",
  SMTP_USER: "your-sendnow-smtp-username",
  SMTP_PASS: "secret-pass",
  SMTP_FROM: "Doggywood <noreply@doggywood.com>",
  SMTP_SECURE: "ssl",
};

describe("smtp config", () => {
  it("loads a complete SMTP configuration", () => {
    expect(getSmtpConfig(completeEnv)).toEqual({
      host: "smtp.sendnow.example",
      port: 465,
      user: "your-sendnow-smtp-username",
      pass: "secret-pass",
      from: "Doggywood <noreply@doggywood.com>",
      secure: true,
    });
  });

  it("converts SMTP_PORT to a number", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_PORT: "587",
        SMTP_SECURE: "false",
      })?.port,
    ).toBe(587);
  });

  it("sets secure true for port 465", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_PORT: "465",
        SMTP_SECURE: "",
      })?.secure,
    ).toBe(true);
  });

  it("sets secure true when SMTP_SECURE is true", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_PORT: "587",
        SMTP_SECURE: "true",
      })?.secure,
    ).toBe(true);
  });

  it("sets secure true when SMTP_SECURE is ssl", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_PORT: "587",
        SMTP_SECURE: "ssl",
      })?.secure,
    ).toBe(true);
  });

  it("sets secure false for a non-secure 587 configuration", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_PORT: "587",
        SMTP_SECURE: "false",
      })?.secure,
    ).toBe(false);
  });

  it("fails when SMTP_HOST is missing", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_HOST: "",
      }),
    ).toBeNull();
  });

  it("fails when SMTP_USER is missing", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_USER: "",
      }),
    ).toBeNull();
  });

  it("fails when SMTP_PASS is missing", () => {
    expect(
      getSmtpConfig({
        ...completeEnv,
        SMTP_PASS: "",
      }),
    ).toBeNull();
  });

  it("uses the Doggywood From default when SMTP_FROM is absent", () => {
    expect(getSmtpFrom({})).toBe(DEFAULT_SMTP_FROM);
    expect(
      getSmtpConfig({
        SMTP_HOST: "smtp.sendnow.example",
        SMTP_USER: "your-sendnow-smtp-username",
        SMTP_PASS: "secret-pass",
      })?.from,
    ).toBe("Doggywood <noreply@doggywood.com>");
  });

  it("uses SMTP_FROM when provided", () => {
    expect(getSmtpFrom({ SMTP_FROM: " Contest <hello@doggywood.com> " })).toBe(
      "Contest <hello@doggywood.com>",
    );
  });
});
