import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { EntryForm } from "@/features/homepage/EntryForm";
import { launchCopy } from "@/features/homepage/launchCopy";
import { getVerifyDogPrefill } from "@/server/entry";

export const metadata: Metadata = { title: "Enter the Contest" };

export default function EnterPage() {
  const prefill = getVerifyDogPrefill();

  return (
    <PageContainer>
      <section className="mx-auto w-full max-w-[900px] py-space-40">
        <header className="text-center">
          <p className="dw-eyebrow mx-auto">Enter</p>
          <h1 className="mt-3 text-h1 text-launch-navy">{launchCopy.formHeading}</h1>
          <p className="mt-space-12 text-body-large text-launch-muted">
            {launchCopy.formLede}
          </p>
        </header>
        <div className="mt-space-32 rounded-[24px] bg-launch-cream px-space-24 py-space-32 sm:px-space-40">
          <EntryForm prefill={prefill} />
        </div>
      </section>
    </PageContainer>
  );
}
