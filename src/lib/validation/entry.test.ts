import { describe, expect, it } from "vitest";
import { parseEntryForm, validateVideoFile } from "@/lib/validation/entry";

describe("entry form validation", () => {
  it("accepts a complete entry payload", () => {
    const formData = new FormData();
    formData.set("firstName", "Ada");
    formData.set("lastName", "Lovelace");
    formData.set("email", "ada@example.com");
    formData.set("mobile", "5551234567");
    formData.set("petName", "King");
    formData.set("rulesAgreed", "on");

    const parsed = parseEntryForm(formData);
    expect(parsed.success).toBe(true);
  });

  it("requires agreement to the Official Rules", () => {
    const formData = new FormData();
    formData.set("firstName", "Ada");
    formData.set("lastName", "Lovelace");
    formData.set("email", "ada@example.com");
    formData.set("mobile", "5551234567");
    formData.set("petName", "King");

    const parsed = parseEntryForm(formData);
    expect(parsed.success).toBe(false);
  });

  it("rejects a missing video file", () => {
    expect(validateVideoFile(null)).toContain("30 seconds or less");
  });
});
