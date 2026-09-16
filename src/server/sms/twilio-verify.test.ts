import { beforeEach, describe, expect, it, vi } from "vitest";

const { twilioFactory, services, verificationsCreate, verificationChecksCreate } = vi.hoisted(
  () => {
    const verificationsCreate = vi.fn();
    const verificationChecksCreate = vi.fn();
    const services = vi.fn(() => ({
      verifications: { create: verificationsCreate },
      verificationChecks: { create: verificationChecksCreate },
    }));
    const twilioFactory = vi.fn(() => ({
      verify: {
        v2: {
          services,
        },
      },
    }));
    return { twilioFactory, services, verificationsCreate, verificationChecksCreate };
  },
);

vi.mock("twilio", () => ({
  default: twilioFactory,
}));

import {
  checkSmsVerification,
  startSmsVerification,
  TwilioConfigError,
  TwilioRequestError,
} from "@/server/sms/twilio-verify";

const env = {
  TWILIO_ACCOUNT_SID: "ACtestaccountsidxxxxxxxxxxxxxxxxxxxx",
  TWILIO_AUTH_TOKEN: "test-twilio-auth-token-not-real",
  TWILIO_VERIFY_SERVICE_SID: "VAtestverifysidxxxxxxxxxxxxxxxxxxxx",
};

const phoneE164 = "+17605550199";

describe("Twilio Verify wrapper", () => {
  beforeEach(() => {
    twilioFactory.mockClear();
    services.mockClear();
    verificationsCreate.mockReset();
    verificationChecksCreate.mockReset();
  });

  it("starts SMS verification through the configured Verify service", async () => {
    verificationsCreate.mockResolvedValueOnce({
      sid: "VEtestverificationxxxxxxxxxxxxxxxxxx",
      status: "pending",
      to: phoneE164,
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
    });

    const result = await startSmsVerification({ phoneE164 }, env);

    expect(twilioFactory).toHaveBeenCalledWith(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    expect(services).toHaveBeenCalledWith(env.TWILIO_VERIFY_SERVICE_SID);
    expect(verificationsCreate).toHaveBeenCalledWith({
      to: phoneE164,
      channel: "sms",
    });
    expect(result).toEqual({
      sid: "VEtestverificationxxxxxxxxxxxxxxxxxx",
      status: "pending",
      to: phoneE164,
    });
    expect(result).not.toHaveProperty("accountSid");
    expect(result).not.toHaveProperty("authToken");
    expect(JSON.stringify(result)).not.toContain(env.TWILIO_AUTH_TOKEN);
    expect(JSON.stringify(result)).not.toContain(env.TWILIO_ACCOUNT_SID);
  });

  it("checks an approved SMS code as valid", async () => {
    const code = "654321";
    verificationChecksCreate.mockResolvedValueOnce({
      status: "approved",
      valid: true,
      to: phoneE164,
      accountSid: env.TWILIO_ACCOUNT_SID,
    });

    const result = await checkSmsVerification({ phoneE164, code }, env);

    expect(services).toHaveBeenCalledWith(env.TWILIO_VERIFY_SERVICE_SID);
    expect(verificationChecksCreate).toHaveBeenCalledWith({
      to: phoneE164,
      code,
    });
    expect(result).toEqual({
      status: "approved",
      valid: true,
    });
    expect(JSON.stringify(result)).not.toContain(code);
    expect(JSON.stringify(result)).not.toContain(env.TWILIO_AUTH_TOKEN);
    expect(result).not.toHaveProperty("code");
    expect(result).not.toHaveProperty("authToken");
  });

  it("treats a non-approved status as invalid", async () => {
    verificationChecksCreate.mockResolvedValueOnce({
      status: "pending",
      valid: false,
    });

    const result = await checkSmsVerification({ phoneE164, code: "000000" }, env);

    expect(result).toEqual({
      status: "pending",
      valid: false,
    });
    expect(JSON.stringify(result)).not.toContain("000000");
  });

  it("maps Twilio request failures to a typed safe server error", async () => {
    verificationsCreate.mockRejectedValueOnce(
      new Error("Authenticate failed TWILIO_AUTH_TOKEN=test-twilio-auth-token-not-real"),
    );

    await expect(startSmsVerification({ phoneE164 }, env)).rejects.toMatchObject({
      name: "TwilioRequestError",
      message: "Unable to complete SMS verification right now.",
    });

    try {
      verificationsCreate.mockRejectedValueOnce(
        new Error("Authenticate failed TWILIO_AUTH_TOKEN=test-twilio-auth-token-not-real"),
      );
      await startSmsVerification({ phoneE164 }, env);
      throw new Error("expected TwilioRequestError");
    } catch (error) {
      expect(error).toBeInstanceOf(TwilioRequestError);
      expect((error as Error).message).toBe("Unable to complete SMS verification right now.");
      expect((error as Error).message).not.toContain(env.TWILIO_AUTH_TOKEN);
      expect((error as Error).message).not.toContain("Authenticate");
    }
  });

  it("throws a typed configuration error before calling Twilio", async () => {
    await expect(
      startSmsVerification({ phoneE164 }, { TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID }),
    ).rejects.toBeInstanceOf(TwilioConfigError);
    expect(twilioFactory).not.toHaveBeenCalled();
  });
});
