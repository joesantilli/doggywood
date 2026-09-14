import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FirstRunContestLanding } from "@/features/contest-landing/FirstRunContestLanding";
import { launchCopy } from "@/features/homepage/launchCopy";

function visibleText(html: string) {
  return html.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
}

describe("first-run contest landing", () => {
  it("renders the revised launch landing page without fake contest activity", () => {
    const html = visibleText(renderToStaticMarkup(<FirstRunContestLanding prefill={{}} />));

    expect(html).toContain(launchCopy.headlineLine1);
    expect(html).toContain(launchCopy.headlineLine2);
    expect(html).toContain(launchCopy.headlineAccent);
    expect(html).toContain(launchCopy.heroPrize);
    expect(html).toContain(launchCopy.lede);
    expect(html).toContain(launchCopy.heroCta);
    expect(html).toContain("$500 EVERY MONTH");
    expect(html).toContain("MOST UPVOTES WINS");
    expect(html).toContain("Enter. Share. Win.");
    expect(html).toContain("Enter Your Dog");
    expect(html).toContain("ENTRY PREVIEW PLACEHOLDER");
    expect(html).not.toContain("A preview of your video will appear here.");
    expect(html).toContain("SUBMIT MY DOG");
    expect(html).toContain("Contest Rules at a Glance");
    expect(html).toContain("Verify.Dog");
    expect(html).toContain("dw-hero-photo");
    expect(html).toContain("dw-hero-headline");
    expect(html).toContain("/brand/doggywood-mobile-hero.webp");
    expect(html).toContain(launchCopy.heroEyebrow);
    expect(html).toContain("UPLOAD");
    expect(html).toContain("STEP 1");
    expect(html).toContain("Complete the contest form with your details.");
    expect(html).toMatch(
      /dw-how-card-step[^>]*>STEP 1[\s\S]*?dw-how-card-title[^>]*>ENTER[\s\S]*?dw-how-card-step[^>]*>STEP 2[\s\S]*?dw-how-card-title[^>]*>UPLOAD/,
    );
    expect(html.indexOf("VIDEO UPLOAD")).toBeLessThan(html.indexOf("I agree to the"));
    expect(html.indexOf("ENTRY PREVIEW")).toBeLessThan(html.indexOf("I agree to the"));
    expect(html.indexOf("I agree to the")).toBeLessThan(html.indexOf("SUBMIT MY DOG"));
    expect(html).toContain("/icons/step_upload.svg");
    expect(html).toContain("/icons/step_enter.svg");
    expect(html).toContain("/icons/step_share.svg");
    expect(html).toContain("/icons/step_win.svg");
    expect(html).toContain("/icons/faq_chevron.svg");
    expect(html).not.toContain("UPLOAD YOUR DOG");
    expect(html).toContain(launchCopy.faqHeading);
    expect(html).toContain(launchCopy.faqEyebrow);
    expect(html).toContain(launchCopy.faqLede);
    expect(html).toContain("Who can enter the Doggywood contest?");
    expect(html).toContain("/brand/doggywood-mobile-hero.webp");
    expect(html).toContain("#enter");
    expect(html).toContain("/rules");
    expect(html).not.toContain("Buddy");
    expect(html).not.toContain("Good Dogs Belong Here");
    expect(html).not.toContain("Star of the Month");
    expect(html).not.toContain("What Our Customers Are Saying");
    expect(html).not.toContain("Customers Only");
    expect(html).not.toContain("The First Ever Doggywood Contest");
    expect(html).not.toContain("Dog or Cat Name");
    expect(html).not.toContain("→");
    expect(html).not.toContain("/watch");
  });
});
