// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewContestEntryForm } from "@/features/review-contest/ReviewContestEntryForm";
import { reviewContestCopy } from "@/features/review-contest/reviewContestCopy";

function photoFile() {
  return new File(["photo-bytes"], "pup.jpg", { type: "image/jpeg" });
}

describe("review contest entry form", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders still photo, story, and Scan & Go fields without backend calls", () => {
    render(<ReviewContestEntryForm />);

    expect(screen.getByLabelText(/Upload Your Photo/i)).toBeTruthy();
    expect(screen.getByLabelText(/Tell Us Your Verify.Dog Story/i)).toBeTruthy();
    expect(screen.getByLabelText(/How Do You Use Scan & Go\?/i)).toBeTruthy();
    expect(screen.getByText("JPG")).toBeTruthy();
    expect(screen.getByText("JPEG")).toBeTruthy();
    expect(screen.getByText("PNG")).toBeTruthy();
    expect(screen.getByText("WEBP")).toBeTruthy();
    expect(screen.getByRole("button", { name: reviewContestCopy.submit })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the selected photo in memory and does not persist on submit", async () => {
    const user = userEvent.setup();
    render(<ReviewContestEntryForm />);

    await user.type(screen.getByLabelText(/First Name/i), "Ada");
    await user.type(screen.getByLabelText(/Last Name/i), "Lovelace");
    await user.type(screen.getByLabelText(/Email Address/i), "ada@example.com");
    await user.type(screen.getByLabelText(/Mobile Number/i), "7605551212");
    await user.type(screen.getByLabelText(/Dog’s Name/i), "King");
    await user.upload(document.getElementById("review-contest-photo") as HTMLInputElement, photoFile());
    await user.type(
      screen.getByLabelText(/Tell Us Your Verify.Dog Story/i),
      "Verify.Dog helped me obtain my ESA letter and Scan & Go keeps King with me every day.",
    );
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.submit(document.querySelector("form") as HTMLFormElement);

    expect(screen.getByRole("status").textContent).toContain(reviewContestCopy.pendingMessage);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("pup.jpg")).toBeTruthy();
  });
});
