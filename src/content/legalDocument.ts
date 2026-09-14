export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "address"; lines: readonly string[] }
  | { kind: "list"; items: readonly string[] };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: readonly LegalBlock[];
};

export type LegalDocumentContent = {
  title: string;
  documentType: string;
  effectiveDateLabel: string;
  effectiveDate: string;
  preamble: readonly LegalBlock[];
  sections: readonly LegalSection[];
  closing: {
    brand: string;
    sponsorLine: string;
    address: readonly string[];
  };
};
