import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContactForm } from "@/features/contact/ContactForm";
import { getServerEnv } from "@/lib/env";
import { createContactChallenge } from "@/server/contact/challenge";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const challenge = createContactChallenge(getServerEnv().SESSION_SECRET);

  return (
    <PageContainer width="reading">
      <section className="py-space-40 pb-space-32">
        <header className="text-center">
          <p className="dw-eyebrow mx-auto">Contact</p>
          <h1 className="mt-3 text-h1 text-launch-navy">Contact Doggywood</h1>
          <p className="mt-space-12 text-body-large text-launch-muted">
            Questions about the contest, Official Rules, or Doggywood can be sent
            with this form. This is not a contest entry form.
          </p>
        </header>
        <div className="relative mt-space-32 rounded-[24px] bg-launch-cream px-space-24 py-space-32 sm:px-space-40">
          <ContactForm
            challengeCode={challenge.code}
            challengeToken={challenge.token}
          />
        </div>
      </section>
    </PageContainer>
  );
}
