import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendSmtpMail } = vi.hoisted(() => ({
  sendSmtpMail: vi.fn(async () => undefined),
}));

vi.mock("@/server/mail/smtp", () => ({
  sendSmtpMail,
}));

import { CONTACT_TO_EMAIL, buildContactEmail, sendContactInquiry } from "@/server/contact/mail";

const sample = {
  name: "Ada Lovelace",
  phone: "5551234567",
  email: "ada@example.com",
  subject: "Contest question",
  message: "How do I enter?",
};

const smtpEnv = {
  SMTP_HOST: "smtp.sendnow.example",
  SMTP_PORT: "465",
  SMTP_USER: "your-sendnow-smtp-username",
  SMTP_PASS: "secret-pass",
  SMTP_FROM: "Doggywood <noreply@doggywood.com>",
  SMTP_SECURE: "ssl",
};

describe("contact mail", () => {
  beforeEach(() => {
    sendSmtpMail.mockClear();
  });

  it("forwards to joseph.santilli@petplatforms.com", () => {
    expect(CONTACT_TO_EMAIL).toBe("joseph.santilli@petplatforms.com");
    const message = buildContactEmail(sample);
    expect(message.to).toBe("joseph.santilli@petplatforms.com");
    expect(message.replyTo).toBe("ada@example.com");
    expect(message.subject).toBe("[Doggywood Contact] Contest question");
    expect(message.text).toContain("How do I enter?");
    expect(message.text).toContain("Ada Lovelace");
  });

  it("strips line breaks from the subject and escapes HTML", () => {
    const message = buildContactEmail({
      ...sample,
      name: "<script>",
      subject: "Hello\nBcc: evil@example.com",
      message: "Line 1\nLine 2",
    });
    expect(message.subject).toBe("[Doggywood Contact] Hello Bcc: evil@example.com");
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.html).toContain("Line 1<br />Line 2");
  });

  it("sends contact mail through SMTP", async () => {
    await expect(sendContactInquiry(sample, smtpEnv)).resolves.toBe("smtp");

    expect(sendSmtpMail).toHaveBeenCalledWith(
      {
        to: CONTACT_TO_EMAIL,
        from: "Doggywood <noreply@doggywood.com>",
        subject: "[Doggywood Contact] Contest question",
        text: [
          "Name: Ada Lovelace",
          "Phone: 5551234567",
          "Email: ada@example.com",
          "Subject: Contest question",
          "",
          "How do I enter?",
        ].join("\n"),
        html: buildContactEmail(sample).html,
        replyTo: "ada@example.com",
      },
      smtpEnv,
    );
  });

  it("throws when SMTP is not configured", async () => {
    await expect(sendContactInquiry(sample, {})).rejects.toThrow("Contact mail is not configured");
    expect(sendSmtpMail).not.toHaveBeenCalled();
  });
});
