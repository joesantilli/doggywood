import type { Metadata } from "next";
import { ReviewContestLanding } from "@/features/review-contest/ReviewContestLanding";

export const metadata: Metadata = {
  title: "Verify.Dog Customer Story Contest",
  description:
    "Share a photo and your genuine Verify.Dog story for a chance to win $500. A judged contest for eligible existing Verify.Dog customers.",
};

export default function ReviewContestPage() {
  return <ReviewContestLanding />;
}
