import { FirstRunContestLanding } from "@/features/contest-landing/FirstRunContestLanding";
import { getVerifyDogPrefill } from "@/server/entry";

/**
 * First launch keeps the contest landing at `/` so existing URLs stay intact.
 * Later `/` becomes the permanent Doggywood homepage and this composition
 * moves to `/contest`.
 */
export default function HomePage() {
  const prefill = getVerifyDogPrefill();
  return <FirstRunContestLanding prefill={prefill} />;
}
