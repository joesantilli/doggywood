import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Hall of Fame" };

export default function HallOfFamePage() {
  return (
    <PlaceholderPage
      description="Completed monthly winners will be recorded here after contests are finalized."
      title="Hall of Fame"
    />
  );
}
