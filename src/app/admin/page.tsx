import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <PlaceholderPage
      description="Administrative tools and permissions are not implemented in Phase 01. This route reserves the admin entry point."
      title="Admin"
    />
  );
}
