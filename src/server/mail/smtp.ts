import "server-only";
import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/server/mail/config";

export const MAIL_TIMEOUT_MS = 20_000;

export type SmtpMailMessage = {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export async function sendSmtpMail(
  message: SmtpMailMessage,
  env: Record<string, string | undefined> = process.env,
) {
  const config = getSmtpConfig(env);
  if (!config) {
    throw new Error("Mail is not configured");
  }

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
    from: message.from ?? config.from,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}
