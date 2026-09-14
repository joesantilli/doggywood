import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Authentication" };

export default function AuthPage() {
  return (
    <PlaceholderPage
      description="Mobile SMS authentication is not implemented in Phase 01. This route is the future sign-in entry point."
      title="Authentication"
    />
  );
}
