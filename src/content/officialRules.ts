export type RulesBlock =
  | { kind: "p"; text: string }
  | { kind: "address"; lines: readonly string[] };

export type RulesSection = {
  id: string;
  heading: string;
  blocks: readonly RulesBlock[];
};

export const officialRulesSponsorAddress = [
  "Pet Platforms, Inc. dba Verify.Dog",
  "2525 Ponce de Leon Blvd #300",
  "Coral Gables, FL 33134",
] as const;

export const officialRulesDocument = {
  title: "Doggywood Monthly Video Contest",
  documentType: "Official Rules",
  preamble: {
    heading: "No Purchase Necessary",
    blocks: [
      {
        kind: "p",
        text: "No purchase or payment is required to enter, vote, or win the Doggywood Monthly Video Contest.",
      },
      {
        kind: "p",
        text: "Doggywood is a social video competition. Winners are determined by valid upvotes recorded through Doggywood. There is no random drawing and no random selection process used to determine the winner.",
      },
      {
        kind: "p",
        text: "Doggywood is sponsored and administered by **Pet Platforms, Inc. dba Verify.Dog**.",
      },
      {
        kind: "p",
        text: "By submitting an entry, each entrant agrees to these Official Rules.",
      },
    ] satisfies readonly RulesBlock[],
  },
  sections: [
    {
      id: "sponsor",
      heading: "1. Sponsor",
      blocks: [
        {
          kind: "p",
          text: "The Doggywood Monthly Video Contest, referred to in these Official Rules as the “Contest,” is sponsored and administered by:",
        },
        {
          kind: "address",
          lines: officialRulesSponsorAddress,
        },
        {
          kind: "p",
          text: "The Sponsor operates Doggywood and is responsible for administration of the Contest.",
        },
      ],
    },
    {
      id: "eligibility",
      heading: "2. Eligibility",
      blocks: [
        {
          kind: "p",
          text: "The Contest is open to legal residents of the United States who are at least 18 years of age at the time of entry.",
        },
        {
          kind: "p",
          text: "Entrants must have the legal right and authority to submit the dog, video, images, audio, and other materials included in their entry.",
        },
        {
          kind: "p",
          text: "Employees, officers, directors, contractors, agents, and representatives of the Sponsor, together with members of their immediate households, are not eligible to win unless the Sponsor expressly states otherwise.",
        },
        {
          kind: "p",
          text: "The Contest is void where prohibited by law.",
        },
      ],
    },
    {
      id: "monthly-contest-periods",
      heading: "3. Monthly Contest Periods",
      blocks: [
        {
          kind: "p",
          text: "Doggywood operates recurring monthly contests. Each monthly Contest is a separate competition.",
        },
        {
          kind: "p",
          text: "For each Contest, Doggywood will publish the applicable entry opening date and time, entry closing date and time, voting opening date and time, voting closing date and time, tie breaker period if applicable, and expected winner announcement date.",
        },
        {
          kind: "p",
          text: "Each Contest begins and ends according to the dates and times published on Doggywood.com.",
        },
      ],
    },
    {
      id: "monthly-prize",
      heading: "4. Monthly Prize",
      blocks: [
        {
          kind: "p",
          text: "The prize for each monthly Contest is:",
        },
        {
          kind: "p",
          text: "**$500 USD**",
        },
        {
          kind: "p",
          text: "One verified winner will receive the monthly prize, subject to compliance with these Official Rules.",
        },
        {
          kind: "p",
          text: "The Sponsor may offer additional prizes in future contests. Any additional prize will be disclosed before the applicable Contest begins.",
        },
      ],
    },
    {
      id: "how-to-enter",
      heading: "5. How to Enter",
      blocks: [
        {
          kind: "p",
          text: "To enter, an entrant must complete the Doggywood entry process, provide the requested contact information, provide the dog’s name, upload an eligible vertical video featuring the entrant’s dog, accept these Official Rules, accept the applicable Terms of Service and Privacy Policy, complete any identity or contact verification required by Doggywood, and submit the entry before the applicable deadline.",
        },
        {
          kind: "p",
          text: "No purchase is required.",
        },
      ],
    },
    {
      id: "video-requirements",
      heading: "6. Video Requirements",
      blocks: [
        {
          kind: "p",
          text: "Each submitted video must feature the entrant’s dog, be in vertical video format, be no longer than 30 seconds, be original content owned or lawfully controlled by the entrant, and comply with these Official Rules.",
        },
        {
          kind: "p",
          text: "The entrant must possess all rights and permissions necessary to submit, publish, license, and permit use of the video.",
        },
        {
          kind: "p",
          text: "Videos may not contain music, video, images, performances, trademarks, copyrighted material, or other protected content unless the entrant has all necessary rights or permissions.",
        },
      ],
    },
    {
      id: "entry-limit",
      heading: "7. Entry Limit",
      blocks: [
        {
          kind: "p",
          text: "Each dog may have only one entry in a particular monthly Contest.",
        },
        {
          kind: "p",
          text: "A dog may enter a later monthly Contest unless otherwise stated in the rules applicable to that Contest.",
        },
        {
          kind: "p",
          text: "Submitting multiple entries for the same dog during the same Contest may result in removal of duplicate entries or disqualification.",
        },
      ],
    },
    {
      id: "entry-review",
      heading: "8. Entry Review",
      blocks: [
        {
          kind: "p",
          text: "Doggywood may review submitted entries before or after publication.",
        },
        {
          kind: "p",
          text: "The Sponsor may reject, suspend, remove, or disqualify any entry that violates these Official Rules, contains prohibited material, contains material the entrant does not have permission to use, contains false or misleading information, appears fraudulent, violates another person’s rights, creates an animal welfare concern, or attempts to manipulate the Contest.",
        },
        {
          kind: "p",
          text: "Publication of an entry does not prevent later removal or disqualification if a violation is subsequently discovered.",
        },
      ],
    },
    {
      id: "animal-welfare",
      heading: "9. Animal Welfare",
      blocks: [
        {
          kind: "p",
          text: "Doggywood is intended to celebrate dogs and responsible pet ownership.",
        },
        {
          kind: "p",
          text: "Entries may not depict or encourage animal cruelty, abuse, neglect, deliberate distress, dangerous treatment, dangerous stunts likely to cause injury, or illegal treatment of an animal.",
        },
        {
          kind: "p",
          text: "The Sponsor may reject or remove content that it reasonably determines presents an animal welfare or safety concern.",
        },
      ],
    },
    {
      id: "public-entry-pages",
      heading: "10. Public Entry Pages",
      blocks: [
        {
          kind: "p",
          text: "Approved entries may receive a public page on Doggywood.com.",
        },
        {
          kind: "p",
          text: "A public entry page may display the dog’s name, submitted video, current valid upvote total, Contest period, sharing controls, Contest status, and Sponsor identification.",
        },
        {
          kind: "p",
          text: "Entrants understand that Doggywood is a public social competition and that approved entries are intended to be viewed, shared, promoted, and voted upon publicly.",
        },
      ],
    },
    {
      id: "how-voting-works",
      heading: "11. How Voting Works",
      blocks: [
        {
          kind: "p",
          text: "The winner is determined by Doggywood upvotes.",
        },
        {
          kind: "p",
          text: "Only upvotes properly recorded through the official Doggywood voting system count toward the Contest.",
        },
        {
          kind: "p",
          text: "Social media likes, views, comments, shares, reactions, or other activity occurring outside Doggywood do not count as official Contest votes.",
        },
        {
          kind: "p",
          text: "Each verified voter may upvote a particular entry only once during the applicable monthly Contest.",
        },
        {
          kind: "p",
          text: "A verified voter may upvote more than one different entry unless otherwise stated for a particular Contest.",
        },
        {
          kind: "p",
          text: "Doggywood may require account, mobile number, email, identity, or other verification before accepting an upvote.",
        },
        {
          kind: "p",
          text: "The Sponsor’s Contest database constitutes the official record of votes.",
        },
      ],
    },
    {
      id: "sharing-an-entry",
      heading: "12. Sharing an Entry",
      blocks: [
        {
          kind: "p",
          text: "Entrants are encouraged to share their Doggywood entry page with friends, family, followers, social networks, and online communities.",
        },
        {
          kind: "p",
          text: "Entrants may encourage others to visit Doggywood and upvote their entry.",
        },
        {
          kind: "p",
          text: "Sharing an entry does not itself constitute a vote. A voter must complete the official Doggywood voting process.",
        },
      ],
    },
    {
      id: "valid-upvotes",
      heading: "13. Valid Upvotes",
      blocks: [
        {
          kind: "p",
          text: "A valid upvote is an upvote submitted through the official Doggywood voting system by an eligible voter that satisfies applicable verification requirements, complies with these Official Rules, and has not been generated or obtained through prohibited voting activity.",
        },
        {
          kind: "p",
          text: "Only valid upvotes will be included when determining Contest results.",
        },
      ],
    },
    {
      id: "prohibited-voting-activity",
      heading: "14. Prohibited Voting Activity",
      blocks: [
        {
          kind: "p",
          text: "Artificial manipulation of voting is prohibited.",
        },
        {
          kind: "p",
          text: "Prohibited activity includes automated voting, bots, scripts, automated voting software, purchased votes, paid voting services, vote farms, fake identities, duplicate accounts created to evade voting restrictions, identity manipulation, attempts to bypass verification controls, technical exploits, coordinated fraudulent voting, and any other artificial method designed to increase or manipulate vote totals.",
        },
        {
          kind: "p",
          text: "Entrants may not offer money, property, services, prizes, or other compensation in exchange for votes.",
        },
        {
          kind: "p",
          text: "The Sponsor may investigate suspicious voting activity and remove invalid votes at any time before final certification of the Contest results.",
        },
        {
          kind: "p",
          text: "An entrant who participates in or knowingly facilitates prohibited voting activity may be disqualified.",
        },
      ],
    },
    {
      id: "determination-of-the-monthly-winner",
      heading: "15. Determination of the Monthly Winner",
      blocks: [
        {
          kind: "p",
          text: "At the conclusion of the regular voting period, the eligible entry receiving the highest number of valid upvotes will become the potential monthly winner.",
        },
        {
          kind: "p",
          text: "No random drawing is used.",
        },
        {
          kind: "p",
          text: "Before declaring an official winner, the Sponsor may review voting records and remove votes determined to be fraudulent, artificial, duplicate, invalid, or otherwise prohibited.",
        },
        {
          kind: "p",
          text: "The entrant with the highest final valid vote total following that review will be the potential winner, subject to verification.",
        },
      ],
    },
    {
      id: "tie-breaker",
      heading: "16. Tie Breaker",
      blocks: [
        {
          kind: "p",
          text: "If two or more eligible entries have the same highest number of valid upvotes at the conclusion of the regular voting period, those entries will advance to a **seven day head to head tie breaker voting period**.",
        },
        {
          kind: "p",
          text: "Only the tied finalists will participate in the tie breaker.",
        },
        {
          kind: "p",
          text: "The tie breaker constitutes a separate voting round.",
        },
        {
          kind: "p",
          text: "The finalist receiving the highest number of valid upvotes during the seven day tie breaker period will become the potential winner.",
        },
        {
          kind: "p",
          text: "The same voter verification, voting integrity, and prohibited voting rules apply during the tie breaker.",
        },
        {
          kind: "p",
          text: "No random drawing, coin toss, or other method of chance will be used to resolve a tie.",
        },
        {
          kind: "p",
          text: "If the finalists remain tied after the seven day tie breaker period, voting will continue through additional 24 hour head to head voting periods until one finalist receives more valid upvotes than the other tied finalist or finalists.",
        },
        {
          kind: "p",
          text: "The entry receiving the highest valid vote total at the conclusion of the final tie breaker period becomes the potential winner, subject to verification.",
        },
      ],
    },
    {
      id: "winner-verification",
      heading: "17. Winner Verification",
      blocks: [
        {
          kind: "p",
          text: "A potential winner is not an official winner until verified by the Sponsor.",
        },
        {
          kind: "p",
          text: "The Sponsor may require information or documentation reasonably necessary to verify identity, age, United States residency, eligibility, authority regarding the dog, rights to the submitted content, compliance with these Official Rules, and validity of voting activity.",
        },
        {
          kind: "p",
          text: "The potential winner may also be required to complete eligibility, publicity, tax, payment, or other documentation reasonably required to administer the prize.",
        },
        {
          kind: "p",
          text: "If the potential winner does not timely respond, cannot be verified, refuses the prize, or is disqualified, the eligible entrant with the next highest valid vote total may become the potential winner.",
        },
      ],
    },
    {
      id: "prize-payment",
      heading: "18. Prize Payment",
      blocks: [
        {
          kind: "p",
          text: "The verified monthly winner will receive **$500 USD**.",
        },
        {
          kind: "p",
          text: "Payment will be made within 31 days following the end of the applicable Contest period, or no later than the last day of the next calendar month following the Contest period, whichever occurs first, provided the winner has completed all required verification and supplied any required payment or tax information.",
        },
        {
          kind: "p",
          text: "The winner is responsible for any federal, state, local, or other taxes arising from receipt of the prize.",
        },
      ],
    },
    {
      id: "ownership-of-submitted-content",
      heading: "19. Ownership of Submitted Content",
      blocks: [
        {
          kind: "p",
          text: "Entrants retain ownership of any intellectual property rights they own in their submitted content.",
        },
        {
          kind: "p",
          text: "By submitting content to Doggywood, however, the entrant grants the Sponsor the broad perpetual license described in Section 20.",
        },
        {
          kind: "p",
          text: "The entrant represents and warrants that the entrant owns the submitted content or possesses all rights, licenses, permissions, and authorizations necessary to grant the rights described in these Official Rules.",
        },
      ],
    },
    {
      id: "perpetual-license",
      heading: "20. Perpetual License to Submitted Content",
      blocks: [
        {
          kind: "p",
          text: "By submitting any video, photograph, image, audio, caption, text, dog name, likeness, statement, or other content to Doggywood, the entrant grants **Pet Platforms, Inc. dba Verify.Dog, Doggywood, and their affiliates, successors, assigns, licensees, service providers, advertising partners, contractors, and authorized representatives** a perpetual, irrevocable, worldwide, royalty free, transferable, and sublicensable license to use the submitted content.",
        },
        {
          kind: "p",
          text: "This license includes the right to reproduce, copy, store, host, archive, publish, display, publicly perform, distribute, transmit, broadcast, stream, repost, edit, crop, resize, format, adapt, translate, excerpt, combine, synchronize, modify, create derivative promotional materials from, advertise, promote, commercialize, and otherwise use or exploit the submitted content, in whole or in part, in any media, format, technology, platform, or distribution method now known or later developed.",
        },
        {
          kind: "p",
          text: "The license includes use in connection with Doggywood, Verify.Dog, Pet Platforms, Inc., current and future Doggywood contests, contest entry pages, winner pages, contest archives, websites, mobile applications, social media, email, digital communications, advertising, paid media, public relations, promotional campaigns, compilation videos, presentations, sponsor communications, marketing materials, press materials, and future promotional activities.",
        },
        {
          kind: "p",
          text: "The entrant grants these rights without additional payment, royalty, compensation, approval, accounting, or notice, except where prohibited by applicable law.",
        },
        {
          kind: "p",
          text: "The license continues after the Contest ends and continues even if the entrant stops participating in Doggywood, closes an account, withdraws from future contests, or otherwise ends a relationship with Doggywood or Verify.Dog.",
        },
        {
          kind: "p",
          text: "The Sponsor is not required to remove submitted content from archived pages, previously published materials, social media, advertisements, compilations, promotional materials, or other uses created or published pursuant to this license.",
        },
        {
          kind: "p",
          text: "The Sponsor may edit or modify submitted content for technical requirements, formatting, duration, size, presentation, branding, advertising, promotion, or other permitted uses.",
        },
        {
          kind: "p",
          text: "Nothing in these Official Rules requires the Sponsor to use any submitted content.",
        },
      ],
    },
    {
      id: "publicity-rights",
      heading: "21. Name, Likeness, Dog Identity, and Publicity Rights",
      blocks: [
        {
          kind: "p",
          text: "By entering, the entrant grants the Sponsor permission, to the extent permitted by law, to use the entrant’s first name, dog’s name, city, state, likeness, voice, image, appearance, statements, captions, biography, Contest results, submitted content, and related information in connection with Doggywood and the permitted uses described in these Official Rules.",
        },
        {
          kind: "p",
          text: "The Sponsor may identify entrants and winners in Contest related publicity, advertising, winner announcements, archives, social media, and promotional materials.",
        },
        {
          kind: "p",
          text: "The Sponsor will not intentionally publish sensitive personal information merely because an individual entered the Contest.",
        },
      ],
    },
    {
      id: "entrant-representations",
      heading: "22. Entrant Representations and Warranties",
      blocks: [
        {
          kind: "p",
          text: "By submitting an entry, the entrant represents and warrants that the submission is original or lawfully controlled by the entrant, does not infringe another person’s copyright, trademark, privacy, publicity, contract, or other rights, and may lawfully be submitted and licensed under these Official Rules.",
        },
        {
          kind: "p",
          text: "The entrant also represents that all required permissions have been obtained from any identifiable person appearing in the submission.",
        },
      ],
    },
    {
      id: "prohibited-conduct",
      heading: "23. Prohibited Conduct",
      blocks: [
        {
          kind: "p",
          text: "The Sponsor may remove votes, suspend an entry, restrict an account, or disqualify an entrant who provides false information, violates these Official Rules, manipulates voting, interferes with another contestant, harasses voters or contestants, attempts to compromise Doggywood systems, circumvents account or identity controls, violates intellectual property rights, violates animal welfare requirements, uses multiple identities to evade restrictions, or attempts to obtain an unfair technological advantage.",
        },
      ],
    },
    {
      id: "technical-problems",
      heading: "24. Technical Problems",
      blocks: [
        {
          kind: "p",
          text: "The Sponsor will use reasonable efforts to administer the Contest fairly and accurately.",
        },
        {
          kind: "p",
          text: "The Sponsor is not responsible for circumstances outside its reasonable control, including internet interruptions, telecommunications failures, device failures, corrupted uploads, network outages, or other technical failures.",
        },
        {
          kind: "p",
          text: "The Sponsor may correct technical, database, or vote counting errors affecting Contest administration.",
        },
        {
          kind: "p",
          text: "If fraud, system failure, security issues, or another material technical event affects the integrity of a Contest, the Sponsor may suspend, extend, modify, restart, or otherwise adjust the affected portion of the Contest when reasonably necessary to preserve a fair competition.",
        },
      ],
    },
    {
      id: "contest-communications",
      heading: "25. Contest Communications",
      blocks: [
        {
          kind: "p",
          text: "Entrants may receive communications reasonably necessary to administer the Contest, including messages concerning identity verification, entry receipt, entry approval, entry rejection, Contest status, voting deadlines, tie breaker participation, winner notification, winner verification, and prize administration.",
        },
        {
          kind: "p",
          text: "Consent to receive Contest administration communications does not automatically constitute consent to unrelated marketing communications.",
        },
      ],
    },
    {
      id: "privacy",
      heading: "26. Privacy",
      blocks: [
        {
          kind: "p",
          text: "Information collected in connection with the Contest may be used to administer entries, verify entrants and voters, prevent fraud, communicate Contest information, determine and verify winners, deliver prizes, maintain Contest records, and protect the integrity of Doggywood.",
        },
        {
          kind: "p",
          text: "Personal information will be handled according to the applicable Doggywood and Verify.Dog privacy disclosures.",
        },
      ],
    },
    {
      id: "social-media-platforms",
      heading: "27. Social Media Platforms",
      blocks: [
        {
          kind: "p",
          text: "Unless expressly stated otherwise, the Contest is not sponsored, endorsed, administered by, or associated with Facebook, Instagram, TikTok, YouTube, X, or any other third party social media platform.",
        },
        {
          kind: "p",
          text: "Social media platforms may be used to share Doggywood entry pages, but official voting occurs only through Doggywood.",
        },
      ],
    },
    {
      id: "sponsor-administration",
      heading: "28. Sponsor Administration",
      blocks: [
        {
          kind: "p",
          text: "Pet Platforms, Inc. dba Verify.Dog is responsible for administering the Contest and determining whether entries, entrants, votes, and voting activity comply with these Official Rules.",
        },
        {
          kind: "p",
          text: "The Sponsor may remove invalid votes and disqualify entries that violate these Official Rules.",
        },
        {
          kind: "p",
          text: "The Sponsor will not substitute a randomly selected winner for the contestant receiving the highest number of valid upvotes under the applicable Contest and tie breaker rules.",
        },
      ],
    },
    {
      id: "modification-suspension-or-termination",
      heading: "29. Modification, Suspension, or Termination",
      blocks: [
        {
          kind: "p",
          text: "The Sponsor may modify, suspend, extend, or terminate a Contest when fraud, technical failure, security issues, legal requirements, force majeure events, or circumstances beyond the Sponsor’s reasonable control materially impair the administration, security, fairness, or integrity of the Contest.",
        },
        {
          kind: "p",
          text: "If a Contest is materially affected, the Sponsor will use reasonable efforts to preserve a fair method of determining the winner based upon valid voting activity.",
        },
      ],
    },
    {
      id: "governing-law",
      heading: "30. Governing Law",
      blocks: [
        {
          kind: "p",
          text: "These Official Rules and the Contest will be governed by and construed under the laws of the **State of Florida**, without regard to conflict of law principles that would require application of the laws of another jurisdiction.",
        },
      ],
    },
    {
      id: "binding-arbitration",
      heading: "31. Binding Arbitration",
      blocks: [
        {
          kind: "p",
          text: "Except where prohibited by applicable law, any dispute, claim, or controversy arising out of or relating to the Contest, these Official Rules, an entry, voting, winner determination, a prize, Doggywood, or Contest administration will be resolved through final and binding arbitration administered by the **American Arbitration Association, AAA**, under the rules applicable to the dispute.",
        },
        {
          kind: "p",
          text: "The arbitrator will have authority to resolve the dispute, except for matters applicable law requires to be determined by a court.",
        },
        {
          kind: "p",
          text: "Each party will be responsible for its own attorneys’ fees and costs except where applicable law, these Official Rules, or applicable AAA rules provide otherwise.",
        },
        {
          kind: "p",
          text: "The arbitration agreement will be interpreted and enforced in accordance with applicable federal arbitration law and Florida law.",
        },
        {
          kind: "p",
          text: "Nothing in this section prevents either party from pursuing an eligible claim in small claims court on an individual basis.",
        },
      ],
    },
    {
      id: "individual-claims",
      heading: "32. Individual Claims",
      blocks: [
        {
          kind: "p",
          text: "To the fullest extent permitted by law, disputes must be brought on an individual basis.",
        },
        {
          kind: "p",
          text: "Neither an entrant nor the Sponsor may seek to have a dispute heard as a class action, collective action, representative action, or private attorney general action to the extent such waiver is permitted by applicable law.",
        },
        {
          kind: "p",
          text: "The arbitrator may award relief only to the individual party seeking relief and only to the extent necessary to resolve that party’s individual claim.",
        },
      ],
    },
    {
      id: "contest-and-winner-history",
      heading: "33. Contest and Winner History",
      blocks: [
        {
          kind: "p",
          text: "Doggywood may maintain a permanent public archive of completed Contests.",
        },
        {
          kind: "p",
          text: "The archive may include the monthly winner, winning dog, winning video, final valid vote total, tie breaker results, Contest month, and related public Contest information.",
        },
        {
          kind: "p",
          text: "Doggywood may use past entries and winners on Doggywood.com and in promotional materials pursuant to the perpetual license granted under these Official Rules.",
        },
      ],
    },
    {
      id: "acceptance-of-official-rules",
      heading: "34. Acceptance of Official Rules",
      blocks: [
        {
          kind: "p",
          text: "By submitting an entry, the entrant acknowledges that the entrant has read, understands, and agrees to these Official Rules.",
        },
        {
          kind: "p",
          text: "By submitting an upvote, a voter agrees to comply with the voting provisions applicable to the Contest.",
        },
        {
          kind: "p",
          text: "Attempts to circumvent these Official Rules may result in vote removal, account restriction, entry removal, or disqualification.",
        },
      ],
    },
    {
      id: "questions",
      heading: "35. Questions",
      blocks: [
        {
          kind: "p",
          text: "Questions regarding the Doggywood Monthly Video Contest or these Official Rules may be directed through the contact information provided on Doggywood.com.",
        },
      ],
    },
  ] satisfies readonly RulesSection[],
  closing: {
    brand: "Doggywood",
    sponsorLine: "Sponsored by **Pet Platforms, Inc. dba Verify.Dog**",
    address: officialRulesSponsorAddress,
  },
} as const;
