import { describe, expect, it } from "vitest";
import { parseEntryForm, validateVideoDuration, validateVideoFile } from "@/lib/validation/entry";

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

  it("accepts an optional video caption", () => {
    const formData = new FormData();
    formData.set("firstName", "Ada");
    formData.set("lastName", "Lovelace");
    formData.set("email", "ada@example.com");
    formData.set("mobile", "5551234567");
    formData.set("petName", "King");
    formData.set("caption", "King does a trick.");
    formData.set("rulesAgreed", "on");

    const parsed = parseEntryForm(formData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.caption).toBe("King does a trick.");
    }
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

  it("rejects videos longer than 30 seconds when duration metadata is available", () => {
    expect(validateVideoDuration(30)).toBeNull();
    expect(validateVideoDuration(31)).toContain("30 seconds or less");
    expect(validateVideoDuration(null)).toBeNull();
  });
});
