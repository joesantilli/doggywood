import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <PlaceholderPage
      description="My Doggywood account screens will be implemented after authentication exists."
      title="Account"
    />
  );
}
