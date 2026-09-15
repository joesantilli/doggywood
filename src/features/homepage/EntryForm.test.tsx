import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EntryForm } from "@/features/homepage/EntryForm";

describe("contest entry form", () => {
  it("renders the public contest fields and upload, without Verify.Dog review or customer status", () => {
    const html = renderToStaticMarkup(<EntryForm prefill={{}} />);

    expect(html).toContain("First Name");
    expect(html).toContain("Last Name");
    expect(html).toContain("Email Address");
    expect(html).toContain("Mobile Number");
    expect(html).toContain("Dog’s Name");
    expect(html).toContain("Optional Video Caption");
    expect(html).toContain("Upload Your Dog Video");
    expect(html).toContain("30 seconds or less");
    expect(html).toContain("Vertical video preferred");
    expect(html).toContain("MP4, MOV, or WEBM");
    expect(html).toContain("Maximum 500MB");
    expect(html).toContain("Entry Requirements");
    expect(html).toContain("Your dog must be featured in the video");
    expect(html).toContain("Submit My Entry");
    expect(html).toContain("You will verify your email address or mobile number before your entry is accepted.");
    expect(html).not.toContain("Verify.Dog Review");
    expect(html).not.toContain("Verify.Dog Customer");
    expect(html).not.toContain("ESA");
    expect(html).not.toContain("PSD");
    expect(html).not.toContain("Service Dog");
    expect(html).not.toContain("Order number");
    expect(html).not.toContain("→");
  });
});
