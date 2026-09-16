import "server-only";

export class TwilioConfigError extends Error {
  readonly kind = "config_missing" as const;

  constructor() {
    super("SMS verification is not configured.");
    this.name = "TwilioConfigError";
  }
}

export type TwilioVerifyConfig = {
  accountSid: string;
  authToken: string;
  verifyServiceSid: string;
};

function requiredEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getTwilioVerifyConfig(
  env: Record<string, string | undefined> = process.env,
): TwilioVerifyConfig {
  const accountSid = requiredEnvValue(env.TWILIO_ACCOUNT_SID);
  const authToken = requiredEnvValue(env.TWILIO_AUTH_TOKEN);
  const verifyServiceSid = requiredEnvValue(env.TWILIO_VERIFY_SERVICE_SID);

  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new TwilioConfigError();
  }

  return {
    accountSid,
    authToken,
    verifyServiceSid,
  };
}
