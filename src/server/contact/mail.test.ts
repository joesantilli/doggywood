import { describe, expect, it, vi } from "vitest";
import {
  CONTACT_TO_EMAIL,
  RESEND_API_URL,
  buildContactEmail,
  getContactMailConfig,
  getResendApiKey,
  sendContactInquiry,
  sendViaResendApi,
} from "@/server/contact/mail";

const sample = {
  name: "Ada Lovelace",
  phone: "5551234567",
  email: "ada@example.com",
  subject: "Contest question",
  message: "How do I enter?",
};

describe("contact mail", () => {
  it("forwards to joseph.santilli@petplatforms.com", () => {
    expect(CONTACT_TO_EMAIL).toBe("joseph.santilli@petplatforms.com");
    const message = buildContactEmail(sample);
    expect(message.to).toBe("joseph.santilli@petplatforms.com");
    expect(message.replyTo).toBe("ada@example.com");
    expect(message.subject).toBe("[Doggywood Contact] Contest question");
    expect(message.text).toContain("How do I enter?");
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

  it("treats SMTP_PASS as the Resend API key when it starts with re_", () => {
    expect(getResendApiKey({})).toBe("");
    expect(getResendApiKey({ SMTP_PASS: "not-a-resend-key" })).toBe("");
    expect(getResendApiKey({ SMTP_PASS: "re_test_key" })).toBe("re_test_key");
    expect(getResendApiKey({ RESEND_API_KEY: "re_explicit", SMTP_PASS: "re_other" })).toBe(
      "re_explicit",
    );
  });

  it("defaults SMTP fallback to smtp.resend.com:465", () => {
    expect(getContactMailConfig({})).toBeNull();
    expect(
      getContactMailConfig({
        SMTP_PASS: "re_test_key",
        SMTP_FROM: "Doggywood <noreply@doggywood.com>",
      }),
    ).toMatchObject({
      host: "smtp.resend.com",
      port: 465,
      user: "resend",
      pass: "re_test_key",
      to: CONTACT_TO_EMAIL,
      secure: true,
    });
  });

  it("sends through the Resend HTTPS API first", async () => {
    const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe(RESEND_API_URL);
      expect(init?.headers).toMatchObject({
        Authorization: "Bearer re_test_key",
      });
      const body = JSON.parse(String(init?.body));
      expect(body.to).toEqual([CONTACT_TO_EMAIL]);
      expect(body.reply_to).toBe("ada@example.com");
      expect(body.from).toBe("Doggywood <noreply@doggywood.com>");
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;

    await expect(
      sendViaResendApi(
        sample,
        {
          SMTP_PASS: "re_test_key",
          SMTP_FROM: "Doggywood <noreply@doggywood.com>",
        },
        fetchImpl,
      ),
    ).resolves.toBeUndefined();

    await expect(
      sendContactInquiry(
        sample,
        {
          SMTP_PASS: "re_test_key",
          SMTP_FROM: "Doggywood <noreply@doggywood.com>",
        },
        fetchImpl,
      ),
    ).resolves.toBe("resend");
  });
});
