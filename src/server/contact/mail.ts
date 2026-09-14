import "server-only";
import nodemailer from "nodemailer";
import { z } from "zod";

export const CONTACT_TO_EMAIL = "joseph.santilli@petplatforms.com";
export const RESEND_API_URL = "https://api.resend.com/emails";
const MAIL_TIMEOUT_MS = 20_000;

export type ContactMailInput = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const smtpSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  user: z.string().min(1),
  pass: z.string().min(1),
  from: z.string().min(1),
  to: z.string().email(),
  secure: z.boolean(),
});

export type ContactMailConfig = z.infer<typeof smtpSchema>;

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

export function getResendApiKey(env: Record<string, string | undefined> = process.env) {
  const explicit = env.RESEND_API_KEY?.trim();
  if (explicit) {
    return explicit;
  }

  const pass = env.SMTP_PASS?.trim() ?? "";
  return pass.startsWith("re_") ? pass : "";
}

export function getContactFrom(env: Record<string, string | undefined> = process.env) {
  return env.SMTP_FROM?.trim() || "Doggywood <noreply@doggywood.com>";
}

export function getContactMailConfig(
  env: Record<string, string | undefined> = process.env,
): ContactMailConfig | null {
  const pass = env.SMTP_PASS?.trim();
  if (!pass) {
    return null;
  }

  const port = Number(env.SMTP_PORT || "465");
  const parsed = smtpSchema.safeParse({
    host: env.SMTP_HOST?.trim() || "smtp.resend.com",
    port,
    user: env.SMTP_USER?.trim() || "resend",
    pass,
    from: getContactFrom(env),
    to: env.CONTACT_TO_EMAIL?.trim() || CONTACT_TO_EMAIL,
    secure: env.SMTP_SECURE === "true" || env.SMTP_SECURE === "ssl" || port === 465,
  });

  return parsed.success ? parsed.data : null;
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

export async function sendViaResendApi(
  input: ContactMailInput,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
) {
  const apiKey = getResendApiKey(env);
  if (!apiKey) {
    throw new Error("Resend API key is missing");
  }

  const to = env.CONTACT_TO_EMAIL?.trim() || CONTACT_TO_EMAIL;
  const message = buildContactEmail(input, to);
  const response = await fetchImpl(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      from: getContactFrom(env),
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
    }),
    signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Resend API failed (${response.status})`);
  }
}

async function sendViaSmtp(input: ContactMailInput, config: ContactMailConfig) {
  const message = buildContactEmail(input, config.to);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: MAIL_TIMEOUT_MS,
    greetingTimeout: MAIL_TIMEOUT_MS,
    socketTimeout: MAIL_TIMEOUT_MS,
  });

  await transporter.sendMail({
    from: config.from,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

export async function sendContactInquiry(
  input: ContactMailInput,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
) {
  const apiKey = getResendApiKey(env);
  if (apiKey) {
    try {
      await sendViaResendApi(input, env, fetchImpl);
      return "resend";
    } catch {
      // HostGator often blocks outbound SMTP, but HTTPS can still fail locally.
      // Fall through to SMTP when a password is present.
    }
  }

  const config = getContactMailConfig(env);
  if (!config) {
    throw new Error("Contact mail is not configured");
  }

  await sendViaSmtp(input, config);
  return "smtp";
}
