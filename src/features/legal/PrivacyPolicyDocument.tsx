import { privacyPolicyDocument } from "@/content/privacyPolicy";
import { LegalDocument } from "@/features/legal/LegalDocument";

export function PrivacyPolicyDocument() {
  return <LegalDocument document={privacyPolicyDocument} />;
}
