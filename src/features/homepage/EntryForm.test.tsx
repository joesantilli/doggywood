// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { EntryForm } from "@/features/homepage/EntryForm";
import { launchCopy } from "@/features/homepage/launchCopy";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

vi.mock("@/lib/validation/entry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/validation/entry")>();
  return {
    ...actual,
    readVideoDurationSeconds: vi.fn(async () => 12),
  };
});

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );
}

function videoFile() {
  return new File(["video-bytes"], "king.mp4", { type: "video/mp4" });
}

function submitEntryForm() {
  fireEvent.submit(document.querySelector("form") as HTMLFormElement);
}

async function prepareValidForm() {
  const user = userEvent.setup();
  render(<EntryForm prefill={{}} />);

  await user.type(screen.getByLabelText(/First Name/i), "Ada");
  await user.type(screen.getByLabelText(/Last Name/i), "Lovelace");
  await user.type(screen.getByLabelText(/Email Address/i), "ada@example.com");
  await user.type(screen.getByLabelText(/Mobile Number/i), "7605551212");
  await user.type(screen.getByLabelText(/Dog’s Name/i), "King");
  await user.type(screen.getByLabelText(/Optional Video Caption/i), "King does a trick.");
  await user.upload(document.getElementById("entry-video") as HTMLInputElement, videoFile());
  fireEvent.click(screen.getByRole("checkbox"));
  submitEntryForm();
  await screen.findByText(launchCopy.verifyHeading);
  return user;
}

describe("contest entry form", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.clear();
    }
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the public contest fields and upload, without Verify.Dog review or customer status", () => {
    const html = renderToStaticMarkup(<EntryForm prefill={{}} />);

    expect(html).toContain("First Name");
    expect(html).toContain("Last Name");
    expect(html).toContain("Email Address");
    expect(html).toContain("Mobile Number");
    expect(html).toContain("Dog’s Name");
    expect(html).toContain("Optional Video Caption");
    expect(html).toContain("Upload Your Dog Video");
    expect(html).toContain("30 seconds or less");
    expect(html).toContain("Vertical video preferred");
    expect(html).toContain("MP4, MOV, or WEBM");
    expect(html).toContain("Maximum 500MB");
    expect(html).toContain("Entry Requirements");
    expect(html).toContain("Your dog must be featured in the video");
    expect(html).toContain("Submit My Entry");
    expect(html).toContain("You will verify your email address or mobile number before your entry is accepted.");
    expect(html).not.toContain("Identity verification will be added in the next phase");
    expect(html).not.toContain("Verify.Dog Review");
    expect(html).not.toContain("Verify.Dog Customer");
    expect(html).not.toContain("ESA");
    expect(html).not.toContain("PSD");
    expect(html).not.toContain("Service Dog");
    expect(html).not.toContain("Order number");
    expect(html).not.toContain("→");
  });

  it("keeps existing validation before verification begins", async () => {
    const user = userEvent.setup();
    render(<EntryForm prefill={{}} />);
    await user.type(screen.getByLabelText(/First Name/i), "Ada");
    await user.type(screen.getByLabelText(/Last Name/i), "Lovelace");
    await user.type(screen.getByLabelText(/Email Address/i), "ada@example.com");
    await user.type(screen.getByLabelText(/Mobile Number/i), "123");
    await user.type(screen.getByLabelText(/Dog’s Name/i), "King");
    await user.upload(document.getElementById("entry-video") as HTMLInputElement, videoFile());
    fireEvent.click(screen.getByRole("checkbox"));
    submitEntryForm();
    expect((await screen.findByRole("alert")).textContent).toContain("Enter a valid mobile number");
    expect(screen.queryByText(launchCopy.verifyHeading)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows identity verification choices after a valid form is prepared", async () => {
    await prepareValidForm();

    expect(screen.getByText(launchCopy.verifyHeading)).toBeTruthy();
    expect(screen.getByText(launchCopy.verifyLede)).toBeTruthy();
    expect(screen.getByRole("button", { name: launchCopy.verifyByEmail })).toBeTruthy();
    expect(screen.getByRole("button", { name: launchCopy.verifyBySms })).toBeTruthy();
    expect(screen.queryByText(launchCopy.readyMessage)).toBeNull();
    expect(screen.queryByText(/entry submitted/i)).toBeNull();
  });

  it("requests email verification with the entered email and then verifies the code", async () => {
    fetchMock
      .mockImplementationOnce(() =>
        jsonResponse({ challengeId: "email-challenge-1", expiresAt: "2026-09-16T12:10:00.000Z" }),
      )
      .mockImplementationOnce(() => jsonResponse({ ok: true, user: { id: "user_1" } }));

    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyByEmail }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/email/request",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "ada@example.com" }),
        }),
      );
    });

    expect(await screen.findByLabelText(launchCopy.verifyCodeLabel)).toBeTruthy();
    expect(screen.getByText(launchCopy.verifyEmailSent)).toBeTruthy();

    await user.type(screen.getByLabelText(launchCopy.verifyCodeLabel), "042189");
    await user.click(screen.getByRole("button", { name: launchCopy.verifyCode }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/email/verify",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ challengeId: "email-challenge-1", code: "042189" }),
        }),
      );
    });

    expect(await screen.findByText(launchCopy.verifiedHeading)).toBeTruthy();
    expect(screen.getByText(launchCopy.verifiedLede)).toBeTruthy();
    expect(screen.queryByText(/entry submitted/i)).toBeNull();
    expect(screen.queryByText(/entry accepted/i)).toBeNull();
    expect((screen.getByLabelText(/First Name/i) as HTMLInputElement).value).toBe("Ada");
    expect((screen.getByLabelText(/Email Address/i) as HTMLInputElement).value).toBe("ada@example.com");
    expect((screen.getByLabelText(/Optional Video Caption/i) as HTMLTextAreaElement).value).toBe(
      "King does a trick.",
    );
    expect(localStorage?.getItem?.("code") ?? null).toBeNull();
    expect(sessionStorage?.getItem?.("code") ?? null).toBeNull();
  });

  it("requests SMS verification with the entered mobile number", async () => {
    fetchMock
      .mockImplementationOnce(() =>
        jsonResponse({ challengeId: "sms-challenge-1", expiresAt: "2026-09-16T12:10:00.000Z" }),
      )
      .mockImplementationOnce(() => jsonResponse({ ok: true, user: { id: "user_2" } }));

    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyBySms }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/sms/request",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ phone: "7605551212" }),
        }),
      );
    });

    expect(await screen.findByText(launchCopy.verifySmsSent)).toBeTruthy();
    await user.type(screen.getByLabelText(launchCopy.verifyCodeLabel), "654321");
    await user.click(screen.getByRole("button", { name: launchCopy.verifyCode }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/sms/verify",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ challengeId: "sms-challenge-1", code: "654321" }),
        }),
      );
    });

    expect(await screen.findByText(launchCopy.verifiedHeading)).toBeTruthy();
  });

  it("lets the user change verification method before verifying", async () => {
    fetchMock.mockImplementationOnce(() =>
      jsonResponse({ challengeId: "email-challenge-2", expiresAt: "2026-09-16T12:10:00.000Z" }),
    );

    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyByEmail }));
    expect(await screen.findByLabelText(launchCopy.verifyCodeLabel)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: launchCopy.changeMethod }));
    expect(screen.getByRole("button", { name: launchCopy.verifyByEmail })).toBeTruthy();
    expect(screen.getByRole("button", { name: launchCopy.verifyBySms })).toBeTruthy();
    expect(screen.queryByLabelText(launchCopy.verifyCodeLabel)).toBeNull();
    expect((screen.getByLabelText(/Dog’s Name/i) as HTMLInputElement).value).toBe("King");
  });

  it("resends through the same request endpoint", async () => {
    fetchMock
      .mockImplementationOnce(() => jsonResponse({ challengeId: "email-challenge-3" }))
      .mockImplementationOnce(() => jsonResponse({ challengeId: "email-challenge-4" }));

    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyByEmail }));
    expect(await screen.findByLabelText(launchCopy.verifyCodeLabel)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: launchCopy.resendCode }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
    expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/auth/email/request");
  });

  it("shows a safe rate limit message for 429", async () => {
    fetchMock.mockImplementationOnce(() => jsonResponse({ error: "rate" }, 429));
    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyByEmail }));
    expect(
      await screen.findByText("Too many verification requests. Please wait and try again."),
    ).toBeTruthy();
  });

  it("shows a safe unavailable message for 503", async () => {
    fetchMock.mockImplementationOnce(() => jsonResponse({ error: "smtp timeout" }, 503));
    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyByEmail }));
    expect(
      await screen.findByText("Verification is temporarily unavailable. Please try again shortly."),
    ).toBeTruthy();
    expect(screen.queryByText("smtp timeout")).toBeNull();
  });

  it("shows a safe message for a wrong verification code", async () => {
    fetchMock
      .mockImplementationOnce(() => jsonResponse({ challengeId: "email-challenge-5" }))
      .mockImplementationOnce(() => jsonResponse({ error: "Unable to verify that code." }, 400));

    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyByEmail }));
    await user.type(await screen.findByLabelText(launchCopy.verifyCodeLabel), "000000");
    await user.click(screen.getByRole("button", { name: launchCopy.verifyCode }));
    expect(
      await screen.findByText("That verification code could not be confirmed. Please try again."),
    ).toBeTruthy();
  });

  it("does not write the verification code to web storage", async () => {
    const localSet = vi.spyOn(Storage.prototype, "setItem");
    fetchMock.mockImplementationOnce(() => jsonResponse({ challengeId: "email-challenge-6" }));
    const user = await prepareValidForm();
    await user.click(screen.getByRole("button", { name: launchCopy.verifyByEmail }));
    await user.type(await screen.findByLabelText(launchCopy.verifyCodeLabel), "111222");
    expect(localSet).not.toHaveBeenCalled();
    localSet.mockRestore();
  });
});
