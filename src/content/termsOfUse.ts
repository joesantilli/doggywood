import { officialRulesSponsorAddress } from "@/content/officialRules";
import type { LegalBlock, LegalSection } from "@/content/legalDocument";

export type TermsBlock = LegalBlock;
export type TermsSection = LegalSection;

export const termsCompanyAddress = officialRulesSponsorAddress;

export const termsCompanyAddressWithCountry = [
  ...officialRulesSponsorAddress,
  "United States",
] as const;

export const termsOfUseDocument = {
  title: "Doggywood Terms of Use",
  documentType: "Terms of Use",
  effectiveDateLabel: "Effective Date",
  effectiveDate: "September 13, 2026",
  preamble: [
    {
      kind: "p",
      text: "These Terms of Use govern access to and use of Doggywood.com, Doggywood services, Doggywood accounts, contest features, voting features, public entry pages, communications, and related services.",
    },
    {
      kind: "p",
      text: "Doggywood is operated by:",
    },
    {
      kind: "address",
      lines: termsCompanyAddress,
    },
    {
      kind: "p",
      text: "In these Terms, “Doggywood,” “we,” “us,” “our,” and “Company” refer to Pet Platforms, Inc. dba Verify.Dog and its Doggywood service.",
    },
    {
      kind: "p",
      text: "By accessing or using Doggywood, creating an account, submitting content, entering a contest, voting, or otherwise using our services, you agree to these Terms.",
    },
    {
      kind: "p",
      text: "If you do not agree, do not use Doggywood.",
    },
  ] satisfies readonly TermsBlock[],
  sections: [
    {
      id: "doggywood",
      heading: "1. Doggywood",
      blocks: [
        {
          kind: "p",
          text: "Doggywood is an online dog video, social voting, contest, entertainment, and community platform.",
        },
        {
          kind: "p",
          text: "Doggywood may provide features including:",
        },
        {
          kind: "list",
          items: [
            "Dog video contests",
            "Public dog profiles and entry pages",
            "Video submissions",
            "Voting and upvotes",
            "Sharing tools",
            "Contestant accounts",
            "Contest histories",
            "Winner archives",
            "Communications",
            "Other dog related community features",
          ],
        },
        {
          kind: "p",
          text: "Doggywood may add, modify, suspend, or discontinue features from time to time.",
        },
      ],
    },
    {
      id: "verify-dog-relationship",
      heading: "2. Verify.Dog Relationship",
      blocks: [
        {
          kind: "p",
          text: "Doggywood is sponsored and operated by Pet Platforms, Inc. dba Verify.Dog.",
        },
        {
          kind: "p",
          text: "Verify.Dog may provide identity verification, account verification, mobile verification, email verification, dog identity services, or related infrastructure used by Doggywood.",
        },
        {
          kind: "p",
          text: "A person does not need to be an existing Verify.Dog customer merely to participate in Doggywood unless a specific feature or contest expressly states otherwise.",
        },
      ],
    },
    {
      id: "additional-terms",
      heading: "3. Additional Terms",
      blocks: [
        {
          kind: "p",
          text: "Certain Doggywood services are subject to additional terms.",
        },
        {
          kind: "p",
          text: "These may include:",
        },
        {
          kind: "list",
          items: [
            "[Official Contest Rules](/rules)",
            "[Privacy Policy](/privacy)",
            "Specific contest terms",
            "Promotion rules",
            "Consent disclosures",
            "Other notices presented when a feature is used",
          ],
        },
        {
          kind: "p",
          text: "These additional terms are incorporated into these Terms by reference.",
        },
        {
          kind: "p",
          text: "If the Official Rules for a particular contest conflict with these Terms regarding the operation, entry requirements, voting rules, prize, winner determination, tie breaker, or administration of that contest, the applicable Official Rules control for that contest.",
        },
      ],
    },
    {
      id: "eligibility",
      heading: "4. Eligibility",
      blocks: [
        {
          kind: "p",
          text: "You must have legal capacity to agree to these Terms.",
        },
        {
          kind: "p",
          text: "You must be at least 18 years old to enter a Doggywood contest unless the applicable Official Rules expressly provide otherwise.",
        },
        {
          kind: "p",
          text: "Other Doggywood features may be subject to separate eligibility requirements.",
        },
        {
          kind: "p",
          text: "You may not use Doggywood where prohibited by applicable law.",
        },
      ],
    },
    {
      id: "accounts-and-identity-verification",
      heading: "5. Accounts and Identity Verification",
      blocks: [
        {
          kind: "p",
          text: "Certain features may require an account or verified identity.",
        },
        {
          kind: "p",
          text: "Doggywood may require verification using information such as:",
        },
        {
          kind: "list",
          items: [
            "Mobile number",
            "Email address",
            "Account identity",
            "Other reasonable verification information",
          ],
        },
        {
          kind: "p",
          text: "You agree to provide accurate information.",
        },
        {
          kind: "p",
          text: "You may not impersonate another person, create accounts using false identities, or use another person’s account without authorization.",
        },
        {
          kind: "p",
          text: "You are responsible for activity associated with your account to the extent permitted by law.",
        },
      ],
    },
    {
      id: "account-security",
      heading: "6. Account Security",
      blocks: [
        {
          kind: "p",
          text: "You must take reasonable steps to protect access to your account.",
        },
        {
          kind: "p",
          text: "You must not intentionally permit another person to use your account to bypass voting limits, contest restrictions, identity requirements, or other Doggywood controls.",
        },
        {
          kind: "p",
          text: "Doggywood may restrict or suspend access when we reasonably believe an account has been compromised or is being misused.",
        },
      ],
    },
    {
      id: "contest-participation",
      heading: "7. Contest Participation",
      blocks: [
        {
          kind: "p",
          text: "Participation in any Doggywood contest is governed by the Official Rules applicable to that contest.",
        },
        {
          kind: "p",
          text: "Doggywood contests may include requirements regarding:",
        },
        {
          kind: "list",
          items: [
            "Age",
            "Residence",
            "Entry deadlines",
            "Video format",
            "Entry limits",
            "Voting",
            "Upvote verification",
            "Prize eligibility",
            "Winner verification",
            "Tie breakers",
            "Content rights",
            "Prohibited voting activity",
          ],
        },
        {
          kind: "p",
          text: "Entering a contest constitutes acceptance of the applicable Official Rules.",
        },
      ],
    },
    {
      id: "no-purchase-necessary",
      heading: "8. No Purchase Necessary",
      blocks: [
        {
          kind: "p",
          text: "No purchase is required to enter or vote in a Doggywood contest unless a future lawful promotion expressly states otherwise.",
        },
        {
          kind: "p",
          text: "Doggywood contests are intended to be competitions based on published contest criteria and voting rules, not random drawings unless a future promotion expressly provides otherwise.",
        },
      ],
    },
    {
      id: "voting",
      heading: "9. Voting",
      blocks: [
        {
          kind: "p",
          text: "Official Doggywood votes must be recorded through the Doggywood voting system.",
        },
        {
          kind: "p",
          text: "Likes, comments, shares, reactions, views, or votes occurring on outside social media platforms do not constitute Doggywood votes.",
        },
        {
          kind: "p",
          text: "Doggywood may require voter verification before accepting an upvote.",
        },
        {
          kind: "p",
          text: "Doggywood may impose limits on voting, including limiting a verified voter to one vote for a particular entry during a contest.",
        },
        {
          kind: "p",
          text: "The applicable Official Rules determine how votes are counted for each contest.",
        },
      ],
    },
    {
      id: "voting-integrity",
      heading: "10. Voting Integrity",
      blocks: [
        {
          kind: "p",
          text: "You may not manipulate Doggywood voting.",
        },
        {
          kind: "p",
          text: "Prohibited activity includes:",
        },
        {
          kind: "list",
          items: [
            "Bots",
            "Automated voting",
            "Scripts",
            "Vote farms",
            "Purchased votes",
            "Paid voting services",
            "Fake identities",
            "Duplicate accounts created to evade voting limits",
            "Account sharing intended to increase votes",
            "Technical exploits",
            "Circumvention of verification controls",
            "Coordinated fraudulent voting",
            "Artificial vote generation",
            "Offering compensation in exchange for votes when prohibited by the applicable Official Rules",
          ],
        },
        {
          kind: "p",
          text: "Doggywood may investigate suspicious voting and remove invalid votes.",
        },
        {
          kind: "p",
          text: "Accounts, entries, or votes associated with fraudulent activity may be restricted, removed, or disqualified.",
        },
      ],
    },
    {
      id: "user-content",
      heading: "11. User Content",
      blocks: [
        {
          kind: "p",
          text: "“User Content” includes videos, photographs, images, audio, captions, comments, dog names, profile information, contest entries, statements, and other material submitted to Doggywood.",
        },
        {
          kind: "p",
          text: "You retain ownership of intellectual property rights that you own in your User Content.",
        },
        {
          kind: "p",
          text: "You are responsible for ensuring that you have all necessary rights and permissions to submit your User Content.",
        },
      ],
    },
    {
      id: "perpetual-license",
      heading: "12. Perpetual License to User Content",
      blocks: [
        {
          kind: "p",
          text: "By submitting User Content to Doggywood, you grant **Pet Platforms, Inc. dba Verify.Dog, Doggywood, and their affiliates, successors, assigns, licensees, service providers, advertising partners, contractors, and authorized representatives** a perpetual, irrevocable, worldwide, royalty free, transferable, and sublicensable license to use that User Content.",
        },
        {
          kind: "p",
          text: "This license includes the right to:",
        },
        {
          kind: "list",
          items: [
            "Reproduce",
            "Copy",
            "Store",
            "Host",
            "Archive",
            "Publish",
            "Display",
            "Publicly perform",
            "Distribute",
            "Transmit",
            "Broadcast",
            "Stream",
            "Repost",
            "Edit",
            "Crop",
            "Resize",
            "Format",
            "Adapt",
            "Translate",
            "Create excerpts",
            "Combine with other materials",
            "Synchronize",
            "Modify",
            "Create derivative promotional materials",
            "Advertise",
            "Promote",
            "Commercialize",
            "Otherwise use or exploit User Content",
          ],
        },
        {
          kind: "p",
          text: "These rights apply in any media, format, platform, technology, or distribution method now known or later developed.",
        },
        {
          kind: "p",
          text: "The license includes use in connection with:",
        },
        {
          kind: "list",
          items: [
            "Doggywood",
            "Verify.Dog",
            "Pet Platforms, Inc.",
            "Current and future contests",
            "Contest entry pages",
            "Winner pages",
            "Contest archives",
            "Websites",
            "Mobile applications",
            "Social media",
            "Email",
            "Digital communications",
            "Advertising",
            "Paid media",
            "Public relations",
            "Promotional campaigns",
            "Compilation videos",
            "Presentations",
            "Sponsor communications",
            "Marketing materials",
            "Press materials",
            "Future Doggywood promotions",
          ],
        },
        {
          kind: "p",
          text: "You grant these rights without additional payment, royalty, compensation, approval, accounting, or notice, except where prohibited by applicable law.",
        },
        {
          kind: "p",
          text: "This license continues after your participation ends and after an account is closed.",
        },
      ],
    },
    {
      id: "name-likeness-and-publicity",
      heading: "13. Name, Likeness, and Publicity",
      blocks: [
        {
          kind: "p",
          text: "To the extent permitted by applicable law, you grant Doggywood and the Company permission to use information associated with User Content, including:",
        },
        {
          kind: "list",
          items: [
            "Your first name",
            "Your dog’s name",
            "Your city or state if supplied",
            "Your likeness",
            "Your voice",
            "Your appearance",
            "Statements",
            "Captions",
            "Contest results",
            "Submitted images and videos",
          ],
        },
        {
          kind: "p",
          text: "These rights may be used in connection with Doggywood, contest operation, winner announcements, archives, advertising, social media, public relations, and promotion.",
        },
      ],
    },
    {
      id: "representations-regarding-content",
      heading: "14. Your Representations Regarding Content",
      blocks: [
        {
          kind: "p",
          text: "By submitting User Content, you represent that:",
        },
        {
          kind: "list",
          items: [
            "You own the content or have sufficient rights to submit it",
            "You have authority to grant the license in these Terms",
            "Your submission does not knowingly violate another person’s copyright, trademark, privacy, publicity, contractual, or other legal rights",
            "You have obtained necessary permissions from identifiable people appearing in the submission",
            "Information accompanying the submission is truthful",
          ],
        },
      ],
    },
    {
      id: "prohibited-content",
      heading: "15. Prohibited Content",
      blocks: [
        {
          kind: "p",
          text: "You may not submit content that:",
        },
        {
          kind: "list",
          items: [
            "Is unlawful",
            "Contains animal cruelty or abuse",
            "Encourages dangerous treatment of animals",
            "Infringes intellectual property rights",
            "Violates privacy or publicity rights",
            "Contains fraudulent or deceptive material",
            "Contains threats or unlawful harassment",
            "Contains malicious software",
            "Is designed to interfere with Doggywood systems",
            "Contains content that Doggywood reasonably determines cannot lawfully be hosted or distributed",
          ],
        },
        {
          kind: "p",
          text: "Doggywood may remove User Content that violates these Terms or applicable law.",
        },
      ],
    },
    {
      id: "animal-welfare",
      heading: "16. Animal Welfare",
      blocks: [
        {
          kind: "p",
          text: "Doggywood is intended to celebrate dogs and responsible animal ownership.",
        },
        {
          kind: "p",
          text: "You may not use Doggywood to promote, depict, encourage, or facilitate cruelty, abuse, neglect, deliberate distress, or dangerous treatment of animals.",
        },
        {
          kind: "p",
          text: "Doggywood may remove content or restrict accounts where we reasonably believe animal welfare is at risk.",
        },
      ],
    },
    {
      id: "doggywood-intellectual-property",
      heading: "17. Doggywood Intellectual Property",
      blocks: [
        {
          kind: "p",
          text: "Doggywood and its licensors own all rights in Doggywood materials other than User Content, including:",
        },
        {
          kind: "list",
          items: [
            "Doggywood name and branding",
            "Logos",
            "Website design",
            "Software",
            "Source code",
            "Graphics",
            "Contest presentation",
            "Databases",
            "Text",
            "Platform features",
            "Original visual materials",
          ],
        },
        {
          kind: "p",
          text: "You may not copy, reproduce, modify, distribute, sell, license, scrape, reverse engineer, or commercially exploit Doggywood materials except as expressly permitted by us or applicable law.",
        },
      ],
    },
    {
      id: "verify-dog-intellectual-property",
      heading: "18. Verify.Dog Intellectual Property",
      blocks: [
        {
          kind: "p",
          text: "Verify.Dog names, marks, logos, graphics, technology, and related materials remain the property of their respective owner.",
        },
        {
          kind: "p",
          text: "Use of Doggywood does not grant you a license to use Verify.Dog trademarks or branding for unrelated commercial purposes.",
        },
      ],
    },
    {
      id: "intellectual-property-complaints",
      heading: "19. Intellectual Property Complaints",
      blocks: [
        {
          kind: "p",
          text: "If you believe content available through Doggywood infringes intellectual property rights, submit your complaint through the [contact form](/contact) available on Doggywood.com.",
        },
        {
          kind: "p",
          text: "Your notice should identify:",
        },
        {
          kind: "list",
          items: [
            "The protected work or right",
            "The allegedly infringing material",
            "Where the material appears",
            "Your relationship to the rights owner",
            "Information sufficient for us to evaluate the claim",
            "Any additional information reasonably necessary to investigate",
          ],
        },
        {
          kind: "p",
          text: "Doggywood may request additional information before taking action.",
        },
      ],
    },
    {
      id: "acceptable-use",
      heading: "20. Acceptable Use",
      blocks: [
        {
          kind: "p",
          text: "You may not use Doggywood to:",
        },
        {
          kind: "list",
          items: [
            "Violate law",
            "Commit fraud",
            "Manipulate contests",
            "Harass other users",
            "Interfere with another contestant",
            "Collect personal information without authorization",
            "Attempt unauthorized access",
            "Probe platform security",
            "Circumvent access controls",
            "Disrupt servers or networks",
            "Introduce malicious code",
            "Scrape or systematically extract Doggywood data without permission",
            "Create deceptive accounts",
            "Manipulate rankings or votes",
            "Use Doggywood for unlawful commercial activity",
          ],
        },
      ],
    },
    {
      id: "enforcement",
      heading: "21. Enforcement",
      blocks: [
        {
          kind: "p",
          text: "Doggywood may take reasonable action to protect the service and its users.",
        },
        {
          kind: "p",
          text: "Actions may include:",
        },
        {
          kind: "list",
          items: [
            "Removing content",
            "Removing votes",
            "Restricting features",
            "Suspending accounts",
            "Terminating accounts",
            "Disqualifying contest entries",
            "Preserving relevant records",
            "Reporting activity where required by law",
          ],
        },
        {
          kind: "p",
          text: "Doggywood is not required to take the same action in every circumstance.",
        },
      ],
    },
    {
      id: "communications",
      heading: "22. Communications",
      blocks: [
        {
          kind: "p",
          text: "You may receive communications reasonably necessary to provide Doggywood services, including:",
        },
        {
          kind: "list",
          items: [
            "Account verification",
            "Entry receipt",
            "Entry status",
            "Voting information",
            "Contest deadlines",
            "Tie breaker notices",
            "Winner notifications",
            "Security alerts",
            "Service notices",
            "Prize administration",
          ],
        },
        {
          kind: "p",
          text: "Operational communications are separate from optional marketing communications.",
        },
      ],
    },
    {
      id: "third-party-services",
      heading: "23. Third Party Services",
      blocks: [
        {
          kind: "p",
          text: "Doggywood may use or link to third party services, including social media networks, identity providers, hosting providers, communications providers, and payment or prize services.",
        },
        {
          kind: "p",
          text: "Third party services may be governed by their own terms and privacy policies.",
        },
        {
          kind: "p",
          text: "Doggywood is not responsible for independent third party services outside our control.",
        },
      ],
    },
    {
      id: "social-media-platforms",
      heading: "24. Social Media Platforms",
      blocks: [
        {
          kind: "p",
          text: "Unless expressly stated otherwise, Doggywood contests are not sponsored, endorsed, administered by, or associated with Facebook, Instagram, TikTok, YouTube, X, or other third party social networks.",
        },
        {
          kind: "p",
          text: "Sharing a Doggywood entry through a social platform does not make that platform an administrator of the Contest.",
        },
      ],
    },
    {
      id: "privacy",
      heading: "25. Privacy",
      blocks: [
        {
          kind: "p",
          text: "Use of Doggywood is also subject to the applicable [Privacy Policy](/privacy).",
        },
        {
          kind: "p",
          text: "Doggywood may process information for purposes including:",
        },
        {
          kind: "list",
          items: [
            "Operating accounts",
            "Verifying identities",
            "Administering contests",
            "Recording votes",
            "Preventing fraud",
            "Communicating with users",
            "Determining winners",
            "Maintaining security",
            "Meeting legal obligations",
          ],
        },
      ],
    },
    {
      id: "modification-of-the-service",
      heading: "26. Modification of the Service",
      blocks: [
        {
          kind: "p",
          text: "We may modify, improve, suspend, restrict, or discontinue Doggywood features.",
        },
        {
          kind: "p",
          text: "We may also modify contest related functionality when necessary for security, fraud prevention, legal compliance, technical integrity, or platform operation.",
        },
        {
          kind: "p",
          text: "Any change to an active contest remains subject to its Official Rules.",
        },
      ],
    },
    {
      id: "suspension-and-termination",
      heading: "27. Suspension and Termination",
      blocks: [
        {
          kind: "p",
          text: "We may suspend or terminate access where we reasonably determine that a user has:",
        },
        {
          kind: "list",
          items: [
            "Violated these Terms",
            "Violated Official Rules",
            "Manipulated voting",
            "Engaged in fraud",
            "Threatened platform security",
            "Infringed another person’s rights",
            "Abused another user",
            "Used Doggywood unlawfully",
          ],
        },
        {
          kind: "p",
          text: "You may stop using Doggywood at any time.",
        },
        {
          kind: "p",
          text: "Termination does not revoke licenses already granted to User Content.",
        },
      ],
    },
    {
      id: "disclaimer-of-warranties",
      heading: "28. Disclaimer of Warranties",
      blocks: [
        {
          kind: "p",
          text: "To the fullest extent permitted by applicable law, Doggywood is provided on an “as is” and “as available” basis.",
        },
        {
          kind: "p",
          text: "We do not guarantee that Doggywood will always be uninterrupted, error free, secure, or available.",
        },
        {
          kind: "p",
          text: "We do not guarantee that every upload, vote, communication, or feature will be available at all times.",
        },
        {
          kind: "p",
          text: "Nothing in this section limits any warranty that cannot legally be excluded.",
        },
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "29. Limitation of Liability",
      blocks: [
        {
          kind: "p",
          text: "To the fullest extent permitted by applicable law, Pet Platforms, Inc. dba Verify.Dog and its affiliates, officers, directors, employees, agents, contractors, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or related to Doggywood.",
        },
        {
          kind: "p",
          text: "This includes, to the extent permitted by law, damages arising from:",
        },
        {
          kind: "list",
          items: [
            "Loss of data",
            "Loss of opportunity",
            "Contest participation",
            "Voting activity",
            "User Content",
            "Service interruptions",
            "Unauthorized account activity",
            "Third party conduct",
          ],
        },
        {
          kind: "p",
          text: "Nothing in these Terms limits liability that cannot legally be limited or excluded.",
        },
      ],
    },
    {
      id: "indemnification",
      heading: "30. Indemnification",
      blocks: [
        {
          kind: "p",
          text: "To the extent permitted by applicable law, you agree to defend, indemnify, and hold harmless Pet Platforms, Inc. dba Verify.Dog and its affiliates, officers, directors, employees, contractors, agents, and service providers from claims, liabilities, losses, damages, judgments, and reasonable costs arising from:",
        },
        {
          kind: "list",
          items: [
            "Your User Content",
            "Your violation of these Terms",
            "Your violation of Official Rules",
            "Your infringement of another person’s rights",
            "Your unlawful or fraudulent use of Doggywood",
          ],
        },
        {
          kind: "p",
          text: "This obligation does not apply to the extent a claim results from the Company’s own unlawful conduct.",
        },
      ],
    },
    {
      id: "informal-dispute-resolution",
      heading: "31. Informal Dispute Resolution",
      blocks: [
        {
          kind: "p",
          text: "Before starting arbitration, you and the Company agree to attempt in good faith to resolve the dispute informally.",
        },
        {
          kind: "p",
          text: "A user must submit a dispute notice through the [contact form](/contact) available on Doggywood.com.",
        },
        {
          kind: "p",
          text: "The notice should provide sufficient information to identify:",
        },
        {
          kind: "list",
          items: [
            "The person submitting the dispute",
            "The account involved, if applicable",
            "The nature of the dispute",
            "The relief requested",
          ],
        },
        {
          kind: "p",
          text: "After receiving a complete dispute notice, the parties will have **30 days** to attempt informal resolution.",
        },
        {
          kind: "p",
          text: "If the matter is not resolved during that period, either party may initiate arbitration.",
        },
      ],
    },
    {
      id: "agreement-to-binding-arbitration",
      heading: "32. AGREEMENT TO BINDING ARBITRATION",
      blocks: [
        {
          kind: "p",
          text: "**PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.**",
        },
        {
          kind: "p",
          text: "Except for matters expressly excluded below, any dispute, claim, or controversy arising out of or relating to:",
        },
        {
          kind: "list",
          items: [
            "Doggywood",
            "These Terms",
            "An account",
            "A contest",
            "An entry",
            "Voting",
            "Winner determination",
            "User Content",
            "Communications",
            "A prize",
            "Our relationship with you",
          ],
        },
        {
          kind: "p",
          text: "will be resolved through **final and binding arbitration administered by the American Arbitration Association, AAA**.",
        },
        {
          kind: "p",
          text: "For disputes involving individual consumers, the arbitration will be administered under the AAA Consumer Arbitration Rules and Mediation Procedures then in effect, unless the AAA determines that another set of AAA rules applies.",
        },
        {
          kind: "p",
          text: "The Federal Arbitration Act governs the interpretation and enforcement of this arbitration agreement to the extent applicable.",
        },
        {
          kind: "p",
          text: "The arbitrator may award any individual remedy or relief that would otherwise be available in a court of competent jurisdiction, subject to these Terms and applicable law.",
        },
        {
          kind: "p",
          text: "The arbitration award will be final and binding.",
        },
      ],
    },
    {
      id: "arbitration-procedure",
      heading: "33. Arbitration Procedure",
      blocks: [
        {
          kind: "p",
          text: "A party seeking arbitration must comply with the applicable AAA filing requirements.",
        },
        {
          kind: "p",
          text: "The arbitration may occur through documents, video conference, telephone, or an in person hearing as permitted by the applicable AAA rules and determined under those rules.",
        },
        {
          kind: "p",
          text: "The location of any required in person proceeding will be determined under the applicable AAA rules unless the parties agree otherwise.",
        },
        {
          kind: "p",
          text: "The allocation of arbitration filing fees, administration fees, and arbitrator compensation will be governed by the applicable AAA Consumer Arbitration Rules and fee schedule, except where applicable law requires a different allocation.",
        },
      ],
    },
    {
      id: "small-claims-court",
      heading: "34. Small Claims Court",
      blocks: [
        {
          kind: "p",
          text: "Either party may pursue an individual claim in a small claims court of competent jurisdiction if the claim qualifies and remains on an individual basis.",
        },
      ],
    },
    {
      id: "temporary-court-relief",
      heading: "35. Temporary Court Relief",
      blocks: [
        {
          kind: "p",
          text: "Either party may seek temporary or preliminary court relief when reasonably necessary to protect intellectual property, prevent unauthorized system access, preserve evidence, or maintain the status quo pending arbitration, where such relief is permitted by law.",
        },
        {
          kind: "p",
          text: "Seeking such relief does not waive the obligation to arbitrate the underlying dispute.",
        },
      ],
    },
    {
      id: "waiver-of-jury-trial",
      heading: "36. WAIVER OF JURY TRIAL",
      blocks: [
        {
          kind: "p",
          text: "**TO THE EXTENT PERMITTED BY LAW, YOU AND PET PLATFORMS, INC. DBA VERIFY.DOG WAIVE THE RIGHT TO HAVE DISPUTES COVERED BY THE ARBITRATION AGREEMENT DECIDED BY A JUDGE OR JURY IN COURT.**",
        },
      ],
    },
    {
      id: "class-action-waiver",
      heading: "37. CLASS ACTION WAIVER",
      blocks: [
        {
          kind: "p",
          text: "To the fullest extent permitted by applicable law, you and Pet Platforms, Inc. dba Verify.Dog agree that disputes covered by the arbitration agreement must be brought solely in an individual capacity.",
        },
        {
          kind: "p",
          text: "Neither party may bring or participate in a class action, collective action, consolidated action, representative action, or private attorney general action where such waiver is enforceable.",
        },
        {
          kind: "p",
          text: "An arbitrator may award relief only to the individual party seeking relief and only to the extent necessary to resolve that individual party’s claim.",
        },
      ],
    },
    {
      id: "governing-law",
      heading: "38. Governing Law",
      blocks: [
        {
          kind: "p",
          text: "These Terms and your use of Doggywood are governed by the laws of the **State of Florida**, without regard to conflict of law principles that would require application of another jurisdiction’s laws.",
        },
        {
          kind: "p",
          text: "The Federal Arbitration Act governs the arbitration agreement to the extent applicable.",
        },
      ],
    },
    {
      id: "court-venue",
      heading: "39. Court Venue for Matters Not Subject to Arbitration",
      blocks: [
        {
          kind: "p",
          text: "For any dispute or proceeding that is legally permitted to proceed in court rather than arbitration, you and the Company consent to the exclusive jurisdiction of the appropriate state or federal courts located in **Miami Dade County, Florida**, except where applicable law does not permit that limitation.",
        },
      ],
    },
    {
      id: "severability",
      heading: "40. Severability",
      blocks: [
        {
          kind: "p",
          text: "If any provision of these Terms is determined to be unlawful, invalid, or unenforceable, that provision will be enforced to the maximum extent permitted by law and the remaining provisions will remain in effect, except where applicable law requires a different result.",
        },
      ],
    },
    {
      id: "no-waiver",
      heading: "41. No Waiver",
      blocks: [
        {
          kind: "p",
          text: "Failure to enforce a provision of these Terms does not constitute a waiver of that provision or any other right.",
        },
      ],
    },
    {
      id: "assignment",
      heading: "42. Assignment",
      blocks: [
        {
          kind: "p",
          text: "You may not assign your rights or obligations under these Terms without our written permission.",
        },
        {
          kind: "p",
          text: "Pet Platforms, Inc. may assign these Terms in connection with a merger, acquisition, corporate reorganization, sale of assets, transfer of Doggywood, or similar transaction, subject to applicable law.",
        },
      ],
    },
    {
      id: "changes-to-these-terms",
      heading: "43. Changes to These Terms",
      blocks: [
        {
          kind: "p",
          text: "We may update these Terms from time to time.",
        },
        {
          kind: "p",
          text: "When changes are material, we may provide notice through Doggywood or through another reasonable method.",
        },
        {
          kind: "p",
          text: "The updated Terms will identify their effective date.",
        },
        {
          kind: "p",
          text: "Changes to these Terms do not retroactively alter the Official Rules governing a completed contest.",
        },
      ],
    },
    {
      id: "entire-agreement",
      heading: "44. Entire Agreement",
      blocks: [
        {
          kind: "p",
          text: "These Terms, together with the Privacy Policy, applicable Official Rules, and other incorporated terms, constitute the agreement governing your use of Doggywood.",
        },
      ],
    },
    {
      id: "contacting-doggywood",
      heading: "45. Contacting Doggywood",
      blocks: [
        {
          kind: "p",
          text: "Questions, complaints, legal concerns, intellectual property complaints, and other communications should be submitted using the [contact forms available on Doggywood.com](/contact).",
        },
        {
          kind: "p",
          text: "We do not publish a consumer support telephone number or support email address for Doggywood.",
        },
        {
          kind: "p",
          text: "Written correspondence may also be sent to:",
        },
        {
          kind: "address",
          lines: termsCompanyAddress,
        },
      ],
    },
    {
      id: "company-information",
      heading: "46. Company Information",
      blocks: [
        {
          kind: "p",
          text: "**Doggywood**",
        },
        {
          kind: "p",
          text: "Operated by **Pet Platforms, Inc. dba Verify.Dog**",
        },
        {
          kind: "address",
          lines: termsCompanyAddressWithCountry,
        },
      ],
    },
  ] satisfies readonly TermsSection[],
  closing: {
    brand: "Doggywood",
    sponsorLine: "Operated by **Pet Platforms, Inc. dba Verify.Dog**",
    address: termsCompanyAddressWithCountry,
  },
} as const;
