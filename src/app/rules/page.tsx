import type { Metadata } from "next";
import { OfficialRulesDocument } from "@/features/official-rules/OfficialRulesDocument";

export const metadata: Metadata = { title: "Official Rules" };

export default function RulesPage() {
  return <OfficialRulesDocument />;
}
