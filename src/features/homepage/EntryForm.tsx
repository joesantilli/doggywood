"use client";

import { useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { ContestIcon } from "@/components/ui/ContestIcon";
import { LaunchButton } from "@/components/ui/LaunchButton";
import { launchCopy } from "@/features/homepage/launchCopy";
import {
  formatVideoDuration,
  parseEntryForm,
  readVideoDurationSeconds,
  validateVideoDuration,
  validateVideoFile,
  type VerifyDogPrefill,
} from "@/lib/validation/entry";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

type VerificationChannel = "email" | "sms";
type VerificationStep = "form" | "choose_channel" | "code_sent" | "verified";

const REQUEST_ERROR_400 = "Please check the information and try again.";
const VERIFY_ERROR_400 = "That verification code could not be confirmed. Please try again.";
const ERROR_429 = "Too many verification requests. Please wait and try again.";
const ERROR_503 = "Verification is temporarily unavailable. Please try again shortly.";
const ERROR_500 = "Something went wrong. Please try again.";

function messageForRequestStatus(status: number) {
  if (status === 400) {
    return REQUEST_ERROR_400;
  }
  if (status === 429) {
    return ERROR_429;
  }
  if (status === 503) {
    return ERROR_503;
  }
  return ERROR_500;
}

function messageForVerifyStatus(status: number) {
  if (status === 400) {
    return VERIFY_ERROR_400;
  }
  if (status === 429) {
    return ERROR_429;
  }
  if (status === 503) {
    return ERROR_503;
  }
  return ERROR_500;
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
}: FieldProps) {
  const id = `entry-${name}`;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-launch-navy" htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-error">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <input
        autoComplete="on"
        className="h-11 rounded-[10px] border border-launch-line bg-white px-3 text-[15px] text-launch-navy"
        id={id}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}

export function EntryForm({ prefill }: { prefill: VerifyDogPrefill }) {
  const defaults = useMemo(() => prefill, [prefill]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(defaults.firstName ?? "");
  const [lastName, setLastName] = useState(defaults.lastName ?? "");
  const [email, setEmail] = useState(defaults.email ?? "");
  const [mobile, setMobile] = useState(defaults.mobile ?? "");
  const [petName, setPetName] = useState(defaults.petName ?? "");
  const [caption, setCaption] = useState("");
  const [rulesAgreed, setRulesAgreed] = useState(false);

  const [step, setStep] = useState<VerificationStep>("form");
  const [busy, setBusy] = useState<"requesting" | "verifying" | null>(null);
  const [channel, setChannel] = useState<VerificationChannel | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [, setExpiresAt] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  function clearVerificationProgress() {
    setChannel(null);
    setChallengeId(null);
    setExpiresAt(null);
    setCode("");
    setVerifyError(null);
    setBusy(null);
  }

  function onEmailChange(value: string) {
    setEmail(value);
    if (channel === "email" && (step === "code_sent" || step === "verified")) {
      clearVerificationProgress();
      setStep("choose_channel");
    }
  }

  function onMobileChange(value: string) {
    setMobile(value);
    if (channel === "sms" && (step === "code_sent" || step === "verified")) {
      clearVerificationProgress();
      setStep("choose_channel");
    }
  }

  function applyFileToInput(file: File) {
    const input = inputRef.current;
    if (!input || input.files?.[0] === file) {
      return;
    }

    try {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      if (transfer.files.length > 0) {
        input.files = transfer.files;
      }
    } catch {
      // The native file input may already hold the selected file.
    }
  }

  async function assignFile(file: File | undefined) {
    if (!file) {
      return;
    }

    applyFileToInput(file);
    setVideoFile(file);
    setFileName(file.name);
    setDuration(await readVideoDurationSeconds(file));
  }

  function clearVideo() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setVideoFile(null);
    setFileName(null);
    setDuration(null);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void assignFile(event.dataTransfer.files[0]);
  }

  async function requestCode(nextChannel: VerificationChannel) {
    if (busy) {
      return;
    }

    setBusy("requesting");
    setVerifyError(null);
    setChannel(nextChannel);

    const path = nextChannel === "email" ? "/api/auth/email/request" : "/api/auth/sms/request";
    const body =
      nextChannel === "email"
        ? { email }
        : { phone: mobile };

    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setVerifyError(messageForRequestStatus(response.status));
        setBusy(null);
        return;
      }

      const payload = (await response.json()) as {
        challengeId?: unknown;
        expiresAt?: unknown;
      };
      if (typeof payload.challengeId !== "string") {
        setVerifyError(ERROR_500);
        setBusy(null);
        return;
      }

      setChallengeId(payload.challengeId);
      setExpiresAt(typeof payload.expiresAt === "string" ? payload.expiresAt : null);
      setCode("");
      setStep("code_sent");
      setBusy(null);
    } catch {
      setVerifyError(ERROR_500);
      setBusy(null);
    }
  }

  async function submitCode() {
    if (busy || !channel || !challengeId) {
      return;
    }

    setBusy("verifying");
    setVerifyError(null);

    const path = channel === "email" ? "/api/auth/email/verify" : "/api/auth/sms/verify";

    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId, code }),
      });

      if (!response.ok) {
        setVerifyError(messageForVerifyStatus(response.status));
        setBusy(null);
        return;
      }

      setCode("");
      setStep("verified");
      setBusy(null);
    } catch {
      setVerifyError(ERROR_500);
      setBusy(null);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === "code_sent") {
      await submitCode();
      return;
    }
    if (step !== "form") {
      return;
    }

    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const parsed = parseEntryForm(formData);
    const video = formData.get("video");
    const file = video instanceof File && video.size > 0 ? video : videoFile;
    const videoError = validateVideoFile(file);
    const measuredDuration =
      duration ?? (file ? await readVideoDurationSeconds(file) : null);
    const durationError = validateVideoDuration(measuredDuration);

    if (!parsed.success) {
      setPending(false);
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    if (videoError) {
      setPending(false);
      setError(videoError);
      return;
    }

    if (durationError) {
      setPending(false);
      setError(durationError);
      return;
    }

    setPending(false);
    setVerifyError(null);
    setStep("choose_channel");
  }

  const requesting = busy === "requesting";
  const verifying = busy === "verifying";

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="grid gap-3 lg:grid-cols-2">
        <Field
          label="First Name"
          name="firstName"
          onChange={setFirstName}
          value={firstName}
        />
        <Field
          label="Last Name"
          name="lastName"
          onChange={setLastName}
          value={lastName}
        />
        <Field
          label="Email Address"
          name="email"
          onChange={onEmailChange}
          type="email"
          value={email}
        />
        <Field
          label="Mobile Number"
          name="mobile"
          onChange={onMobileChange}
          type="tel"
          value={mobile}
        />
      </div>

      <Field label="Dog’s Name" name="petName" onChange={setPetName} value={petName} />

      <div className="flex min-w-0 flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-launch-navy" htmlFor="entry-caption">
          Optional Video Caption
        </label>
        <textarea
          className="min-h-[88px] rounded-[10px] border border-launch-line bg-white px-3 py-2.5 text-[15px] text-launch-navy"
          id="entry-caption"
          maxLength={280}
          name="caption"
          onChange={(event) => setCaption(event.target.value)}
          rows={3}
          value={caption}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-stretch">
        <div className="flex min-w-0 flex-col">
          <label
            className="flex min-h-[280px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#c5ced8] bg-white px-4 py-6 text-center lg:min-h-[320px]"
            htmlFor="entry-video"
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
          >
            <ContestIcon name="upload_panel" size={56} />
            <span className="text-[18px] font-extrabold text-launch-navy">
              {launchCopy.videoTitle}
            </span>
            <span className="text-[13px] leading-5 text-launch-muted">{launchCopy.videoHint}</span>
            <span className="text-[13px] leading-5 text-launch-navy">
              {launchCopy.videoSpecs.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </span>
            {fileName ? (
              <span className="mt-2 text-[13px] font-semibold text-launch-navy">{fileName}</span>
            ) : null}
            {duration != null ? (
              <span className="text-[13px] text-launch-muted">
                Duration {formatVideoDuration(duration)}
              </span>
            ) : null}
            <input
              accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
              className="sr-only"
              id="entry-video"
              name="video"
              onChange={(event) => {
                void assignFile(event.target.files?.[0]);
              }}
              ref={inputRef}
              required={step === "form"}
              type="file"
            />
          </label>
          {fileName ? (
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <button
                className="min-h-10 rounded-[10px] border border-launch-navy bg-white px-4 text-[14px] font-bold text-launch-navy"
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                {launchCopy.replaceVideo}
              </button>
              <button
                className="min-h-10 rounded-[10px] border border-launch-line bg-white px-4 text-[14px] font-bold text-launch-navy"
                onClick={clearVideo}
                type="button"
              >
                {launchCopy.removeVideo}
              </button>
            </div>
          ) : null}
        </div>

        <aside className="rounded-[14px] border border-launch-line bg-[#F7F4EC] px-5 py-5 text-left lg:px-6">
          <h3 className="text-center text-[15px] font-extrabold tracking-[0.04em] text-launch-navy uppercase lg:text-left">
            {launchCopy.requirementsHeading}
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {launchCopy.requirements.map((item) => (
              <li className="flex items-start gap-2.5 text-[14px] leading-5 text-launch-navy" key={item}>
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-launch-gold" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <label className="flex items-start gap-2.5 text-[14px] leading-5 text-launch-navy">
        <input
          checked={rulesAgreed}
          className="mt-0.5 h-4 w-4 shrink-0 accent-launch-gold"
          name="rulesAgreed"
          onChange={(event) => setRulesAgreed(event.target.checked)}
          required
          type="checkbox"
        />
        <span>
          I agree to the{" "}
          <a className="text-launch-accent underline" href="/rules">
            Official Rules
          </a>
          ,{" "}
          <a className="text-launch-accent underline" href="/terms">
            Terms of Service
          </a>
          , and{" "}
          <a className="text-launch-accent underline" href="/privacy">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {step === "form" ? (
        <p className="rounded-[12px] bg-[#EEF2FF] px-4 py-3 text-center text-[14px] leading-5 text-launch-navy lg:text-left">
          {launchCopy.authNotice}
        </p>
      ) : (
        <div aria-live="polite" className="flex flex-col gap-4">
          <div>
            <h3 className="text-center text-[15px] font-extrabold tracking-[0.04em] text-launch-navy uppercase lg:text-left">
              {step === "verified" ? launchCopy.verifiedHeading : launchCopy.verifyHeading}
            </h3>
            <p className="mt-2 text-center text-[14px] leading-5 text-launch-navy lg:text-left">
              {step === "verified" ? launchCopy.verifiedLede : launchCopy.verifyLede}
            </p>
          </div>

          {step === "choose_channel" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <LaunchButton
                disabled={requesting}
                fullWidth
                onClick={() => {
                  void requestCode("email");
                }}
                size="compact"
                type="button"
                variant="outline"
              >
                {requesting && channel === "email" ? launchCopy.sendingCode : launchCopy.verifyByEmail}
              </LaunchButton>
              <LaunchButton
                disabled={requesting}
                fullWidth
                onClick={() => {
                  void requestCode("sms");
                }}
                size="compact"
                type="button"
                variant="outline"
              >
                {requesting && channel === "sms" ? launchCopy.sendingCode : launchCopy.verifyBySms}
              </LaunchButton>
            </div>
          ) : null}

          {step === "code_sent" ? (
            <>
              <p aria-live="polite" className="text-center text-[14px] leading-5 text-launch-navy lg:text-left">
                {channel === "sms" ? launchCopy.verifySmsSent : launchCopy.verifyEmailSent}
              </p>
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-launch-navy" htmlFor="entry-verification-code">
                  {launchCopy.verifyCodeLabel}
                </label>
                <input
                  autoComplete="one-time-code"
                  className="h-11 rounded-[10px] border border-launch-line bg-white px-3 text-[15px] text-launch-navy"
                  id="entry-verification-code"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  pattern="\d{6}"
                  required
                  type="text"
                  value={code}
                />
              </div>
              <LaunchButton disabled={verifying || code.length !== 6} fullWidth size="compact" type="submit">
                {verifying ? launchCopy.verifying : launchCopy.verifyCode}
              </LaunchButton>
              <div className="flex flex-col items-center gap-2 lg:items-start">
                <button
                  className="text-[14px] font-bold text-launch-navy underline disabled:opacity-60"
                  disabled={requesting || verifying}
                  onClick={() => {
                    if (channel) {
                      void requestCode(channel);
                    }
                  }}
                  type="button"
                >
                  {requesting ? launchCopy.sendingCode : launchCopy.resendCode}
                </button>
                <button
                  className="text-[14px] font-bold text-launch-navy underline disabled:opacity-60"
                  disabled={requesting || verifying}
                  onClick={() => {
                    clearVerificationProgress();
                    setStep("choose_channel");
                  }}
                  type="button"
                >
                  {launchCopy.changeMethod}
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {error ? (
        <p className="text-[13px] text-error" role="alert">
          {error}
        </p>
      ) : null}
      {verifyError ? (
        <p className="text-[13px] text-error" role="alert">
          {verifyError}
        </p>
      ) : null}

      {step === "form" ? (
        <LaunchButton disabled={pending} fullWidth size="compact" type="submit">
          {launchCopy.submit}
        </LaunchButton>
      ) : null}
      <p className="pb-space-32 text-center text-[12px] text-launch-muted">{launchCopy.formNote}</p>
    </form>
  );
}
