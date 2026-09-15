import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FirstRunContestLanding } from "@/features/contest-landing/FirstRunContestLanding";
import { launchCopy } from "@/features/homepage/launchCopy";

function visibleText(html: string) {
  return html.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
}

describe("first-run contest landing", () => {
  it("keeps the frozen header, hero, and trust strip copy", () => {
    const html = visibleText(renderToStaticMarkup(<FirstRunContestLanding prefill={{}} />));

    expect(html).toContain(launchCopy.headlineLine1);
    expect(html).toContain(launchCopy.headlineLine2);
    expect(html).toContain(launchCopy.headlineAccent);
    expect(html).toContain(launchCopy.heroPrize);
    expect(html).toContain(launchCopy.lede);
    expect(html).toContain(launchCopy.heroCta);
    expect(html).toContain(launchCopy.heroEyebrow);
    expect(html).toContain("dw-hero-photo");
    expect(html).toContain("dw-hero-headline");
    expect(html).toContain("/brand/doggywood-mobile-hero.webp");
    expect(html).toContain("$500 EVERY MONTH");
    expect(html).toContain("SHOW OFF YOUR PUP");
    expect(html).toContain("MOST UPVOTES WINS");
  });

  it("renders the public contest body below the trust strip", () => {
    const html = visibleText(renderToStaticMarkup(<FirstRunContestLanding prefill={{}} />));
    const trustIndex = html.indexOf("MOST UPVOTES WINS");
    const aboutIndex = html.indexOf("ABOUT DOGGYWOOD");
    const formIndex = html.indexOf("ENTER DOGGYWOOD");
    const heroIndex = html.indexOf("dw-hero");

    expect(trustIndex).toBeGreaterThan(-1);
    expect(aboutIndex).toBeGreaterThan(trustIndex);
    expect(formIndex).toBeGreaterThan(aboutIndex);
    expect(html.indexOf('id="enter"')).toBeGreaterThan(heroIndex);

    expect(html).toContain("A Monthly Contest for Dogs Who Deserve the Spotlight");
    expect(html).toContain("$500 Every Month");
    expect(html).toContain("Show Off Your Dog");
    expect(html).toContain("Get Upvotes");
    expect(html).toContain("Join Doggywood");
    expect(html).toContain("It’s Easy to Enter");
    expect(html).toContain("Record Your Dog");
    expect(html).toContain("Upload Your Video");
    expect(html).toContain("Share With Friends");
    expect(html).toContain("Win $500");
    expect(html).toContain("How Voting Works");
    expect(html).toContain("Only registered authenticated users may upvote.");
    expect(html).toContain("One registered user may cast one valid upvote for each contest entry.");
    expect(html).toContain("The eligible entry with the most valid authenticated upvotes at contest close wins $500.");
    expect(html).toContain("Sharing itself is not a vote");
    expect(html).toContain("Enter This Month’s Contest");
    expect(html).toContain("Upload Your Dog Video");
    expect(html).toContain("30 seconds or less");
    expect(html).toContain("Submit My Entry");
    expect(html).toContain("Think Your Dog Has What It Takes?");
    expect(html).toContain("You will verify your email address or mobile number before your entry is accepted.");
    expect(html).toContain("Anyone who meets the contest eligibility rules");
    expect(html).not.toContain("Verify.Dog Review");
    expect(html).not.toContain("honest review");
    expect(html).not.toContain("Positive review");
    expect(html).not.toContain("Customers Only");
    expect(html).not.toContain("Verify.Dog customers only");
    expect(html).not.toContain("ESA");
    expect(html).not.toContain("five star");
    expect(html).not.toContain("★");
    expect(html).not.toContain("Buddy");
    expect(html).not.toContain("What Our Customers Are Saying");
    expect(html).not.toContain("Star of the Month");
    expect(html).not.toContain("→");
    expect(html).not.toContain("/watch");
    expect(html).not.toContain("ENTRY PREVIEW PLACEHOLDER");
    expect(html).not.toContain("Authenticate your identity");
    expect(html).not.toContain("Send email verification");
  });
});
