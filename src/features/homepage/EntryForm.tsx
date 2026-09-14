"use client";

import { useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { ContestIcon } from "@/components/ui/ContestIcon";
import { LaunchButton } from "@/components/ui/LaunchButton";
import { launchCopy } from "@/features/homepage/launchCopy";
import {
  parseEntryForm,
  validateVideoFile,
  type VerificationChannel,
  type VerifyDogPrefill,
} from "@/lib/validation/entry";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  defaultValue,
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
        defaultValue={defaultValue}
        id={id}
        name={name}
        required={required}
        type={type}
      />
    </div>
  );
}

export function EntryForm({ prefill }: { prefill: VerifyDogPrefill }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [channel, setChannel] = useState<VerificationChannel>("email");
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const defaults = useMemo(() => prefill, [prefill]);

  function assignFile(file: File | undefined) {
    if (!file || !inputRef.current) {
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    setFileName(file.name);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    assignFile(event.dataTransfer.files[0]);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const parsed = parseEntryForm(formData);
    const video = formData.get("video");
    const videoError = validateVideoFile(video instanceof File ? video : null);

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

    setPending(false);
    setNeedsVerification(true);
  }

  if (needsVerification) {
    return (
      <div className="flex flex-col gap-space-16">
        <h3 className="text-h3 text-launch-navy">Authenticate your identity</h3>
        <p className="text-body text-launch-muted">{launchCopy.formDisclaimer}</p>
        <fieldset className="flex flex-col gap-space-12">
          <legend className="sr-only">Verification method</legend>
          <label className="flex min-h-11 items-center gap-space-8 text-body text-launch-navy">
            <input
              checked={channel === "email"}
              name="channel"
              onChange={() => setChannel("email")}
              type="radio"
            />
            Email verification
          </label>
          <label className="flex min-h-11 items-center gap-space-8 text-body text-launch-navy">
            <input
              checked={channel === "mobile"}
              name="channel"
              onChange={() => setChannel("mobile")}
              type="radio"
            />
            Mobile SMS verification
          </label>
        </fieldset>
        {codeSent ? (
          <div className="flex flex-col gap-space-12">
            <label className="text-label text-launch-navy" htmlFor="entry-code">
              Verification code
            </label>
            <input
              className="h-11 rounded-[10px] border border-launch-line bg-white px-3 text-[15px] text-launch-navy"
              id="entry-code"
              inputMode="numeric"
              name="code"
            />
            <p className="text-caption text-launch-muted">
              Email and SMS verification are not connected in this build. Your
              entry stays pending until authentication completes. It is not
              accepted and does not appear as a contestant.
            </p>
          </div>
        ) : (
          <LaunchButton
            type="button"
            onClick={() => {
              setCodeSent(true);
            }}
          >
            {channel === "email" ? "Send email verification" : "Send SMS verification"}
          </LaunchButton>
        )}
      </div>
    );
  }

  return (
    <form
      className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.58fr)_minmax(0,0.46fr)] lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-6"
      onSubmit={onSubmit}
    >
      <div className="flex min-w-0 flex-col gap-3 lg:col-start-1 lg:row-start-1">
        <div className="grid gap-3 lg:grid-cols-2">
          <Field
            defaultValue={defaults.firstName}
            label="First Name"
            name="firstName"
          />
          <Field
            defaultValue={defaults.lastName}
            label="Last Name"
            name="lastName"
          />
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <Field
            defaultValue={defaults.email}
            label="Email Address"
            name="email"
            type="email"
          />
          <Field
            defaultValue={defaults.mobile}
            label="Mobile Number"
            name="mobile"
            type="tel"
          />
        </div>
        <Field
          defaultValue={defaults.petName}
          label="Dog's Name"
          name="petName"
        />
      </div>

      <label
        className="flex min-h-[240px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#c5ced8] bg-[#EAF1FB] px-4 py-5 text-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:h-full"
        htmlFor="entry-video"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <ContestIcon name="upload_panel" size={48} />
        <span className="text-[13px] font-extrabold tracking-[0.12em] text-launch-navy">
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
          <span className="text-[12px] text-launch-navy">{fileName}</span>
        ) : null}
        <input
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          className="sr-only"
          id="entry-video"
          name="video"
          onChange={(event) => {
            setFileName(event.target.files?.[0]?.name ?? null);
          }}
          ref={inputRef}
          required
          type="file"
        />
      </label>

      <div className="flex min-h-[240px] min-w-0 items-center justify-center rounded-[14px] bg-[#EAF1FB] px-3 py-6 text-center lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:h-full lg:min-h-0">
        <p className="text-[11px] font-extrabold tracking-[0.12em] text-launch-muted">
          {launchCopy.previewLabel}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-3 lg:col-start-1 lg:row-start-2">
        <label className="mt-1 flex items-start gap-2.5 text-[14px] leading-5 text-launch-navy">
          <input
            className="mt-0.5 h-4 w-4 shrink-0 accent-launch-gold"
            name="rulesAgreed"
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
        {error ? (
          <p className="text-[13px] text-error" role="alert">
            {error}
          </p>
        ) : null}
        <LaunchButton fullWidth disabled={pending} size="compact" type="submit">
          {launchCopy.submit}
        </LaunchButton>
        <p className="text-center text-[12px] text-launch-muted lg:text-left">{launchCopy.formNote}</p>
      </div>
    </form>
  );
}
