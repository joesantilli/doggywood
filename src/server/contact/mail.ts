import "server-only";
import { getSmtpConfig } from "@/server/mail/config";
import { sendSmtpMail } from "@/server/mail/smtp";

export const CONTACT_TO_EMAIL = "joseph.santilli@petplatforms.com";

export type ContactMailInput = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function buildContactEmail(input: ContactMailInput, to = CONTACT_TO_EMAIL) {
  const subject = `[Doggywood Contact] ${oneLine(input.subject)}`;
  const text = [
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject}`,
    "",
    input.message,
  ].join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
    <p>${escapeHtml(input.message).replaceAll("\n", "<br />")}</p>
  `.trim();

  return {
    to,
    replyTo: input.email,
    subject,
    text,
    html,
  };
}

export async function sendContactInquiry(
  input: ContactMailInput,
  env: Record<string, string | undefined> = process.env,
) {
  const config = getSmtpConfig(env);
  if (!config) {
    throw new Error("Contact mail is not configured");
  }

  const to = env.CONTACT_TO_EMAIL?.trim() || CONTACT_TO_EMAIL;
  const message = buildContactEmail(input, to);

  await sendSmtpMail(
    {
      to: message.to,
      from: config.from,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    },
    env,
  );

  return "smtp";
}
