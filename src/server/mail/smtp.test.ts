import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn(async () => undefined);
  const createTransport = vi.fn(() => ({ sendMail }));
  return { sendMail, createTransport };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport,
  },
  createTransport,
}));

import { MAIL_TIMEOUT_MS, sendSmtpMail } from "@/server/mail/smtp";

const env = {
  SMTP_HOST: "smtp.sendnow.example",
  SMTP_PORT: "465",
  SMTP_USER: "your-sendnow-smtp-username",
  SMTP_PASS: "secret-pass",
  SMTP_FROM: "Doggywood <noreply@doggywood.com>",
  SMTP_SECURE: "ssl",
};

describe("smtp sender", () => {
  beforeEach(() => {
    sendMail.mockClear();
    createTransport.mockClear();
  });

  it("creates a Nodemailer transport and sends the message", async () => {
    await sendSmtpMail(
      {
        to: "ada@example.com",
        subject: "Contest question",
        text: "How do I enter?",
        html: "<p>How do I enter?</p>",
        replyTo: "noreply@doggywood.com",
      },
      env,
    );

    expect(createTransport).toHaveBeenCalledWith({
      host: "smtp.sendnow.example",
      port: 465,
      secure: true,
      auth: {
        user: "your-sendnow-smtp-username",
        pass: "secret-pass",
      },
      connectionTimeout: MAIL_TIMEOUT_MS,
      greetingTimeout: MAIL_TIMEOUT_MS,
      socketTimeout: MAIL_TIMEOUT_MS,
    });
    expect(MAIL_TIMEOUT_MS).toBe(20_000);
    expect(sendMail).toHaveBeenCalledWith({
      from: "Doggywood <noreply@doggywood.com>",
      to: "ada@example.com",
      replyTo: "noreply@doggywood.com",
      subject: "Contest question",
      text: "How do I enter?",
      html: "<p>How do I enter?</p>",
    });
  });

  it("uses the message from address when supplied", async () => {
    await sendSmtpMail(
      {
        to: "ada@example.com",
        from: "Doggywood <hello@doggywood.com>",
        subject: "Hello",
        text: "Hi",
      },
      env,
    );

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Doggywood <hello@doggywood.com>",
        html: undefined,
      }),
    );
  });
});
