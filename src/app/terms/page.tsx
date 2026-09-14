import type { Metadata } from "next";
import { TermsOfUseDocument } from "@/features/legal/TermsOfUseDocument";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return <TermsOfUseDocument />;
}
