"use client";

import { useState, type FormEvent } from "react";
import { LaunchButton } from "@/components/ui/LaunchButton";
import { parseContactForm } from "@/lib/validation/contact";

type ContactFormProps = {
  challengeToken: string;
  challengeCode: string;
};

function Field({
  label,
  name,
  type = "text",
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;
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
        autoComplete={autoComplete}
        className="h-11 rounded-[10px] border border-launch-line bg-white px-3 text-[15px] text-launch-navy"
        id={id}
        name={name}
        required={required}
        type={type}
      />
    </div>
  );
}

export function ContactForm({ challengeToken, challengeCode }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      spamCode: String(formData.get("spamCode") ?? ""),
      spamToken: challengeToken,
      website: String(formData.get("website") ?? ""),
    };

    const parsed = parseContactForm(payload);
    if (!parsed.success) {
      setPending(false);
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setPending(false);
      setError(body?.error ?? "Unable to send your message right now.");
      return;
    }

    setPending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-h3 text-launch-navy">Message sent</h2>
        <p className="text-body text-launch-muted">
          Thank you. Your message has been received. We will follow up using the
          email or phone number you provided.
        </p>
      </div>
    );
  }

  return (
    <form className="relative flex flex-col gap-4" onSubmit={onSubmit}>
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input autoComplete="off" id="contact-website" name="website" tabIndex={-1} />
      </div>

      <Field autoComplete="name" label="Name" name="name" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field autoComplete="tel" label="Phone" name="phone" type="tel" />
        <Field autoComplete="email" label="Email" name="email" type="email" />
      </div>
      <Field autoComplete="off" label="Subject" name="subject" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-launch-navy" htmlFor="contact-message">
          Message
          <span aria-hidden="true" className="text-error">
            {" "}
            *
          </span>
        </label>
        <textarea
          className="min-h-[140px] resize-y rounded-[10px] border border-launch-line bg-white px-3 py-2.5 text-[15px] text-launch-navy"
          id="contact-message"
          name="message"
          required
        />
      </div>

      <div className="rounded-[14px] border border-launch-line bg-launch-mist px-4 py-4">
        <p className="text-[13px] font-semibold text-launch-navy">Anti-spam code</p>
        <p className="mt-1 text-[13px] text-launch-muted">
          Enter the code below to help us keep this form free of automated messages.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <p
            aria-hidden="true"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-launch-accent bg-white px-4 font-extrabold tracking-[0.28em] text-launch-accent"
          >
            {challengeCode}
          </p>
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="contact-spamCode">
              Anti-spam code
            </label>
            <input
              autoComplete="off"
              className="h-11 w-full rounded-[10px] border border-launch-line bg-white px-3 text-[15px] tracking-[0.12em] text-launch-navy uppercase"
              id="contact-spamCode"
              name="spamCode"
              required
              spellCheck={false}
            />
          </div>
        </div>
        <p className="mt-2 text-[12px] text-launch-muted">
          Code not working?{" "}
          <a className="text-launch-accent underline" href="/contact">
            Get a new code
          </a>
          .
        </p>
      </div>

      {error ? (
        <p className="text-[13px] text-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-center">
        <LaunchButton className="min-w-[240px]" disabled={pending} size="compact" type="submit">
          Send Message
        </LaunchButton>
      </div>
    </form>
  );
}
