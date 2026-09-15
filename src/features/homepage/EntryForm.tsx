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
  const [ready, setReady] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const defaults = useMemo(() => prefill, [prefill]);

  async function assignFile(file: File | undefined) {
    if (!file || !inputRef.current) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    setFileName(file.name);
    setDuration(await readVideoDurationSeconds(file));
  }

  function clearVideo() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFileName(null);
    setDuration(null);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void assignFile(event.dataTransfer.files[0]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const parsed = parseEntryForm(formData);
    const video = formData.get("video");
    const file = video instanceof File ? video : null;
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
    setReady(true);
  }

  if (ready) {
    return (
      <div className="rounded-[20px] border border-launch-line bg-white px-6 py-8 text-center lg:px-10">
        <p className="text-body-large text-launch-navy">{launchCopy.readyMessage}</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
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
        label="Dog’s Name"
        name="petName"
      />

      <div className="flex min-w-0 flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-launch-navy" htmlFor="entry-caption">
          Optional Video Caption
        </label>
        <textarea
          className="min-h-[88px] rounded-[10px] border border-launch-line bg-white px-3 py-2.5 text-[15px] text-launch-navy"
          id="entry-caption"
          maxLength={280}
          name="caption"
          rows={3}
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
              required
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

      <p className="rounded-[12px] bg-[#EEF2FF] px-4 py-3 text-center text-[14px] leading-5 text-launch-navy lg:text-left">
        {launchCopy.authNotice}
      </p>

      <label className="flex items-start gap-2.5 text-[14px] leading-5 text-launch-navy">
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

      <LaunchButton disabled={pending} fullWidth size="compact" type="submit">
        {launchCopy.submit}
      </LaunchButton>
      <p className="pb-space-32 text-center text-[12px] text-launch-muted">{launchCopy.formNote}</p>
    </form>
  );
}
