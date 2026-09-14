import { termsOfUseDocument } from "@/content/termsOfUse";
import { LegalDocument } from "@/features/legal/LegalDocument";

export function TermsOfUseDocument() {
  return <LegalDocument document={termsOfUseDocument} />;
}
