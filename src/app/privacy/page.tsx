import type { Metadata } from "next";
import { PrivacyPolicyDocument } from "@/features/legal/PrivacyPolicyDocument";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <PrivacyPolicyDocument />;
}
