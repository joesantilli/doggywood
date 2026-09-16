import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FirstRunContestLanding } from "@/features/contest-landing/FirstRunContestLanding";
import { ReviewContestLanding } from "@/features/review-contest/ReviewContestLanding";
import ReviewContestPage from "@/app/review-contest/page";
import { launchCopy } from "@/features/homepage/launchCopy";
import { reviewContestCopy } from "@/features/review-contest/reviewContestCopy";

function visibleText(html: string) {
  return html.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
}

describe("review contest landing", () => {
  it("renders the /review-contest route", () => {
    const html = visibleText(renderToStaticMarkup(<ReviewContestPage />));
    expect(html).toContain(reviewContestCopy.headlineLine1);
    expect(html).toContain("dw-hero");
  });

  it("keeps the existing public landing page unchanged", () => {
    const html = visibleText(renderToStaticMarkup(<FirstRunContestLanding prefill={{}} />));

    expect(html).toContain(launchCopy.headlineLine1);
    expect(html).toContain(launchCopy.heroCta);
    expect(html).toContain("$500 EVERY MONTH");
    expect(html).toContain("SHOW OFF YOUR PUP");
    expect(html).toContain("MOST UPVOTES WINS");
    expect(html).toContain("How Voting Works");
    expect(html).toContain("The eligible entry with the most valid authenticated upvotes at contest close wins $500.");
    expect(html).toContain("Upload Your Dog Video");
    expect(html).not.toContain(reviewContestCopy.headlineLine1);
    expect(html).not.toContain("VERIFY.DOG CUSTOMERS • WIN $500 THIS MONTH");
    expect(html).not.toContain("What Makes a Winning Story?");
  });

  it("shows the customer contest headline, $500 messaging, and photo entry fields", () => {
    const html = visibleText(renderToStaticMarkup(<ReviewContestLanding />));

    expect(html).toContain("Your Verify.Dog Story");
    expect(html).toContain("Could Win You");
    expect(html).toContain("$500.");
    expect(html).toContain("$500 EVERY MONTH");
    expect(html).toContain("ENTER THE CUSTOMER CONTEST");
    expect(html).toContain("Upload Your Photo");
    expect(html).toContain("JPG");
    expect(html).toContain("JPEG");
    expect(html).toContain("PNG");
    expect(html).toContain("WEBP");
    expect(html).toContain("Tell Us Your Verify.Dog Story");
    expect(html).toContain("How Do You Use Scan & Go?");
    expect(html).toContain('id="review-contest-photo"');
    expect(html).toContain('id="review-contest-story"');
    expect(html).toContain('id="review-contest-scan"');
  });

  it("shows judging criteria, weights, and that likes or upvotes do not determine the winner", () => {
    const html = visibleText(renderToStaticMarkup(<ReviewContestLanding />));

    expect(html).toContain("What Makes a Winning Story?");
    expect(html).toContain("HOW THE WINNER IS CHOSEN");
    expect(html).toContain("AUTHENTICITY");
    expect(html).toContain("30%");
    expect(html).toContain("ACCURACY & SPECIFICITY");
    expect(html).toContain("20%");
    expect(html).toContain("CREATIVITY");
    expect(html).toContain("CUTENESS & PHOTO APPEAL");
    expect(html).toContain("15%");
    expect(html).toContain("SCAN & GO");
    expect(html).toContain("TOTAL: 100%");
    expect(html).toContain("Likes, shares and other community reactions do not affect judging or determine the winner.");
    expect(html).toContain("This is a judged contest.");
    expect(html).not.toMatch(/most upvotes wins/i);
    expect(html).not.toContain("MOST UPVOTES WINS");
    expect(html).not.toContain("How Voting Works");
    expect(html).not.toContain("contest_upvote");
    expect(html).not.toContain("→");
    expect(html).not.toContain("♥");
    expect(html).not.toContain("❤");
  });

  it("includes the customer contest FAQ questions", () => {
    const html = visibleText(renderToStaticMarkup(<ReviewContestLanding />));

    for (const item of reviewContestCopy.faqs) {
      expect(html).toContain(item.q);
      expect(html).toContain(item.a);
    }
  });
});
