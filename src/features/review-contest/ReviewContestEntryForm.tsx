"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { ContestIcon } from "@/components/ui/ContestIcon";
import { LaunchButton } from "@/components/ui/LaunchButton";
import {
  IMAGE_ACCEPT,
  SCAN_AND_GO_MAX_CHARS,
  STORY_MAX_CHARS,
  STORY_MIN_CHARS,
  isAcceptedImageFile,
  reviewContestCopy,
} from "@/features/review-contest/reviewContestCopy";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
}: FieldProps) {
  const id = `review-contest-${name}`;
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ReviewContestEntryForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [petName, setPetName] = useState("");
  const [story, setStory] = useState("");
  const [scanAndGo, setScanAndGo] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

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

  function assignFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!isAcceptedImageFile(file)) {
      setError(reviewContestCopy.photoError);
      return;
    }

    applyFileToInput(file);
    setPhotoFile(file);
    setPhotoName(file.name);
    setError(null);
    setStatus(null);
  }

  function clearPhoto() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPhotoFile(null);
    setPhotoName(null);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    assignFile(event.dataTransfer.files[0]);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (mobile.trim().length < 7) {
      setError("Enter a valid mobile number.");
      return;
    }

    if (!petName.trim()) {
      setError("Dog’s name is required.");
      return;
    }

    const file = photoFile;
    if (!file || file.size === 0) {
      setError("Upload a photo that clearly shows you together with your dog or dogs.");
      return;
    }

    if (!isAcceptedImageFile(file)) {
      setError(reviewContestCopy.photoError);
      return;
    }

    const storyLength = story.trim().length;
    if (storyLength < STORY_MIN_CHARS || storyLength > STORY_MAX_CHARS) {
      setError(`Your Verify.Dog story must be ${STORY_MIN_CHARS} to ${STORY_MAX_CHARS} characters.`);
      return;
    }

    if (scanAndGo.trim().length > SCAN_AND_GO_MAX_CHARS) {
      setError(`Scan & Go details must be ${SCAN_AND_GO_MAX_CHARS} characters or less.`);
      return;
    }

    if (!agreed) {
      setError("Please confirm that you are an eligible Verify.Dog customer.");
      return;
    }

    setStatus(reviewContestCopy.pendingMessage);
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="grid gap-3 lg:grid-cols-2">
        <Field label="First Name" name="firstName" onChange={setFirstName} value={firstName} />
        <Field label="Last Name" name="lastName" onChange={setLastName} value={lastName} />
        <Field
          label="Email Address"
          name="email"
          onChange={setEmail}
          type="email"
          value={email}
        />
        <Field
          label="Mobile Number"
          name="mobile"
          onChange={setMobile}
          type="tel"
          value={mobile}
        />
      </div>

      <Field label="Dog’s Name" name="petName" onChange={setPetName} value={petName} />

      <div className="flex min-w-0 flex-col">
        <label
          className="flex min-h-[280px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#c5ced8] bg-white px-4 py-6 text-center lg:min-h-[320px]"
          htmlFor="review-contest-photo"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
        >
          <ContestIcon name="upload_panel" size={56} />
          <span className="text-[18px] font-extrabold text-launch-navy">
            {reviewContestCopy.photoLabel}
          </span>
          <span className="text-[13px] leading-5 text-launch-muted">
            {reviewContestCopy.photoHelper}
          </span>
          <span className="text-[13px] leading-5 text-launch-muted">
            {reviewContestCopy.photoHint}
          </span>
          <span className="text-[13px] leading-5 text-launch-navy">
            {reviewContestCopy.photoFormats.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </span>
          {photoName ? (
            <span className="mt-2 text-[13px] font-semibold text-launch-navy">{photoName}</span>
          ) : null}
          <input
            accept={IMAGE_ACCEPT}
            className="sr-only"
            id="review-contest-photo"
            name="photo"
            onChange={(event) => {
              assignFile(event.target.files?.[0]);
            }}
            ref={inputRef}
            required
            type="file"
          />
        </label>
        {photoName ? (
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button
              className="min-h-10 rounded-[10px] border border-launch-navy bg-white px-4 text-[14px] font-bold text-launch-navy"
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              {reviewContestCopy.replacePhoto}
            </button>
            <button
              className="min-h-10 rounded-[10px] border border-launch-line bg-white px-4 text-[14px] font-bold text-launch-navy"
              onClick={clearPhoto}
              type="button"
            >
              {reviewContestCopy.removePhoto}
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-launch-navy" htmlFor="review-contest-story">
          {reviewContestCopy.storyLabel}
          <span aria-hidden="true" className="text-error">
            {" "}
            *
          </span>
        </label>
        <p className="text-[13px] leading-5 text-launch-muted">{reviewContestCopy.storyHelper}</p>
        <textarea
          className="min-h-[160px] rounded-[10px] border border-launch-line bg-white px-3 py-2.5 text-[15px] text-launch-navy"
          id="review-contest-story"
          maxLength={STORY_MAX_CHARS}
          minLength={STORY_MIN_CHARS}
          name="story"
          onChange={(event) => setStory(event.target.value)}
          required
          rows={8}
          value={story}
        />
        <p className="text-[13px] text-launch-muted">
          {story.length}/{STORY_MAX_CHARS}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-launch-navy" htmlFor="review-contest-scan">
          {reviewContestCopy.scanLabel}
        </label>
        <p className="text-[13px] leading-5 text-launch-muted">{reviewContestCopy.scanHelper}</p>
        <textarea
          className="min-h-[88px] rounded-[10px] border border-launch-line bg-white px-3 py-2.5 text-[15px] text-launch-navy"
          id="review-contest-scan"
          maxLength={SCAN_AND_GO_MAX_CHARS}
          name="scanAndGo"
          onChange={(event) => setScanAndGo(event.target.value)}
          rows={3}
          value={scanAndGo}
        />
        <p className="text-[13px] text-launch-muted">
          {scanAndGo.length}/{SCAN_AND_GO_MAX_CHARS}
        </p>
      </div>

      <label className="flex items-start gap-2.5 text-[14px] leading-5 text-launch-navy">
        <input
          checked={agreed}
          className="mt-0.5 h-4 w-4 shrink-0 accent-launch-gold"
          name="acknowledgement"
          onChange={(event) => setAgreed(event.target.checked)}
          required
          type="checkbox"
        />
        <span>{reviewContestCopy.acknowledgement}</span>
      </label>

      <p className="text-center text-[14px] leading-5 text-launch-navy lg:text-left">
        <a className="text-launch-accent underline" href="#contest-rules">
          {reviewContestCopy.officialRulesLabel}
        </a>
      </p>

      {error ? (
        <p className="text-[13px] text-error" role="alert">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="text-[13px] text-launch-navy" role="status">
          {status}
        </p>
      ) : null}

      <LaunchButton fullWidth size="compact" type="submit">
        {reviewContestCopy.submit}
      </LaunchButton>
      <p className="pb-space-32 text-center text-[12px] text-launch-muted">
        {reviewContestCopy.heroEligibility}
      </p>
    </form>
  );
}
