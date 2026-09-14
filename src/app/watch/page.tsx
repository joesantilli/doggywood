import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Watch" };

export default function WatchPage() {
  return (
    <PlaceholderPage
      description="Public video watching will live here in a later phase. Phase 01 provides the route skeleton only."
      title="Watch"
    />
  );
}
