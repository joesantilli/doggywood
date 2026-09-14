import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <PlaceholderPage
      description="Official monthly contest standings will appear here after scoring is implemented."
      title="Leaderboard"
    />
  );
}
