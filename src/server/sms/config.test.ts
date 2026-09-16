import { describe, expect, it } from "vitest";
import { getTwilioVerifyConfig, TwilioConfigError } from "@/server/sms/config";

const completeEnv = {
  TWILIO_ACCOUNT_SID: "ACtestaccountsidxxxxxxxxxxxxxxxxxxxx",
  TWILIO_AUTH_TOKEN: "test-twilio-auth-token-not-real",
  TWILIO_VERIFY_SERVICE_SID: "VAtestverifysidxxxxxxxxxxxxxxxxxxxx",
};

function thrownPublicMessage(env: Record<string, string | undefined>) {
  try {
    getTwilioVerifyConfig(env);
    throw new Error("expected TwilioConfigError");
  } catch (error) {
    expect(error).toBeInstanceOf(TwilioConfigError);
    return error instanceof Error ? error.message : String(error);
  }
}

describe("getTwilioVerifyConfig", () => {
  it("loads a complete Twilio Verify configuration", () => {
    expect(getTwilioVerifyConfig(completeEnv)).toEqual({
      accountSid: "ACtestaccountsidxxxxxxxxxxxxxxxxxxxx",
      authToken: "test-twilio-auth-token-not-real",
      verifyServiceSid: "VAtestverifysidxxxxxxxxxxxxxxxxxxxx",
    });
  });

  it("fails safely when Account SID is missing", () => {
    const message = thrownPublicMessage({
      ...completeEnv,
      TWILIO_ACCOUNT_SID: "",
    });
    expect(message).toBe("SMS verification is not configured.");
    expect(message).not.toContain(completeEnv.TWILIO_AUTH_TOKEN);
    expect(message).not.toContain(completeEnv.TWILIO_VERIFY_SERVICE_SID);
  });

  it("fails safely when auth token is missing", () => {
    const message = thrownPublicMessage({
      ...completeEnv,
      TWILIO_AUTH_TOKEN: "   ",
    });
    expect(message).toBe("SMS verification is not configured.");
    expect(message).not.toContain(completeEnv.TWILIO_ACCOUNT_SID);
    expect(message).not.toContain(completeEnv.TWILIO_VERIFY_SERVICE_SID);
  });

  it("fails safely when Verify Service SID is missing", () => {
    const message = thrownPublicMessage({
      ...completeEnv,
      TWILIO_VERIFY_SERVICE_SID: undefined,
    });
    expect(message).toBe("SMS verification is not configured.");
    expect(message).not.toContain(completeEnv.TWILIO_ACCOUNT_SID);
    expect(message).not.toContain(completeEnv.TWILIO_AUTH_TOKEN);
  });

  it("does not put credential values in thrown public messages", () => {
    const message = thrownPublicMessage({
      TWILIO_ACCOUNT_SID: completeEnv.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: completeEnv.TWILIO_AUTH_TOKEN,
    });
    expect(message).toBe("SMS verification is not configured.");
    expect(message).not.toContain(completeEnv.TWILIO_ACCOUNT_SID);
    expect(message).not.toContain(completeEnv.TWILIO_AUTH_TOKEN);
    expect(JSON.stringify({ message })).not.toContain("ACtest");
    expect(JSON.stringify({ message })).not.toContain("auth-token");
  });
});
