import "server-only";
import twilio from "twilio";
import { getTwilioVerifyConfig } from "@/server/sms/config";

export { TwilioConfigError } from "@/server/sms/config";

export class TwilioRequestError extends Error {
  readonly kind = "request_failed" as const;

  constructor(cause?: unknown) {
    super(
      "Unable to complete SMS verification right now.",
      cause !== undefined ? { cause } : undefined,
    );
    this.name = "TwilioRequestError";
  }
}

export type StartSmsVerificationInput = {
  phoneE164: string;
};

export type StartSmsVerificationResult = {
  sid: string;
  status: string;
  to: string;
};

export type CheckSmsVerificationInput = {
  phoneE164: string;
  code: string;
};

export type CheckSmsVerificationResult = {
  status: string;
  valid: boolean;
};

function twilioClient(accountSid: string, authToken: string) {
  return twilio(accountSid, authToken);
}

export async function startSmsVerification(
  input: StartSmsVerificationInput,
  env: Record<string, string | undefined> = process.env,
): Promise<StartSmsVerificationResult> {
  const config = getTwilioVerifyConfig(env);

  try {
    const verification = await twilioClient(config.accountSid, config.authToken)
      .verify.v2.services(config.verifyServiceSid)
      .verifications.create({
        to: input.phoneE164,
        channel: "sms",
      });

    return {
      sid: verification.sid,
      status: verification.status,
      to: verification.to,
    };
  } catch (error) {
    throw new TwilioRequestError(error);
  }
}

export async function checkSmsVerification(
  input: CheckSmsVerificationInput,
  env: Record<string, string | undefined> = process.env,
): Promise<CheckSmsVerificationResult> {
  const config = getTwilioVerifyConfig(env);

  try {
    const check = await twilioClient(config.accountSid, config.authToken)
      .verify.v2.services(config.verifyServiceSid)
      .verificationChecks.create({
        to: input.phoneE164,
        code: input.code,
      });

    const status = check.status ?? "";
    return {
      status,
      valid: status === "approved",
    };
  } catch (error) {
    throw new TwilioRequestError(error);
  }
}
