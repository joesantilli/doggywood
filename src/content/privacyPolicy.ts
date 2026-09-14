import type { LegalBlock, LegalSection } from "@/content/legalDocument";
import {
  termsCompanyAddress,
  termsCompanyAddressWithCountry,
} from "@/content/termsOfUse";

export const privacyPolicyDocument = {
  title: "Privacy Policy",
  documentType: "Privacy Policy",
  effectiveDateLabel: "Effective Date",
  effectiveDate: "September 13, 2026",
  preamble: [
    {
      kind: "p",
      text: "Pet Platforms, Inc. dba Verify.Dog respects your privacy.",
    },
    {
      kind: "p",
      text: "This Privacy Policy describes how Pet Platforms, Inc. collects, uses, stores, discloses, and otherwise processes personal information through Verify.Dog, Doggywood.com, ScanAndGo.pet, related websites, applications, account systems, contests, products, and services.",
    },
    {
      kind: "p",
      text: "In this Privacy Policy, “Pet Platforms,” “Verify.Dog,” “Doggywood,” “we,” “us,” and “our” refer to:",
    },
    {
      kind: "address",
      lines: termsCompanyAddress,
    },
    {
      kind: "p",
      text: "Verify.Dog and Doggywood are related services operated by Pet Platforms, Inc.",
    },
    {
      kind: "p",
      text: "Doggywood is sponsored by Verify.Dog and operates as a public dog video, contest, voting, and community platform.",
    },
    {
      kind: "p",
      text: "By accessing or using our services, you acknowledge the practices described in this Privacy Policy.",
    },
  ] satisfies readonly LegalBlock[],
  sections: [
    {
      id: "services-covered",
      heading: "1. Services Covered by This Privacy Policy",
      blocks: [
        {
          kind: "p",
          text: "This Privacy Policy applies to personal information collected through services including Verify.Dog, Doggywood.com, ScanAndGo.pet, related account systems, contest services, voting services, pet identity services, digital records services, assistance animal services, customer support, communications, and related Pet Platforms services.",
        },
        {
          kind: "p",
          text: "Some services may also provide additional privacy notices at the time information is collected.",
        },
        {
          kind: "p",
          text: "If a separate notice applies to a particular service, that notice should be read together with this Privacy Policy.",
        },
      ],
    },
    {
      id: "information-you-provide",
      heading: "2. Information You Provide to Us",
      blocks: [
        {
          kind: "p",
          text: "We may collect information that you provide directly to us.",
        },
        {
          kind: "p",
          text: "Depending on the service you use, this information may include your name, email address, mobile telephone number, mailing address, account information, dog information, payment information, communications with us, and other information you choose to provide.",
        },
        {
          kind: "p",
          text: "For Doggywood, information you provide may include your first and last name, email address, mobile number, dog name, contest entry information, uploaded video, captions, photographs, account information, consent records, and other information submitted in connection with a Doggywood contest or account.",
        },
      ],
    },
    {
      id: "doggywood-contest-information",
      heading: "3. Doggywood Contest Information",
      blocks: [
        {
          kind: "p",
          text: "When you enter or participate in Doggywood, we may collect information necessary to administer the contest.",
        },
        {
          kind: "p",
          text: "This may include your identity and contact information, dog name, contest entry, video, entry date, contest period, voting information, account status, verification status, consent to Official Rules and Terms, and information reasonably necessary to verify a potential winner.",
        },
        {
          kind: "p",
          text: "We may also maintain records relating to entry approval, moderation, voting activity, vote validity, contest results, tie breaker participation, winner verification, prize administration, and contest history.",
        },
        {
          kind: "p",
          text: "Doggywood contests are public competitions.",
        },
        {
          kind: "p",
          text: "Approved contest videos and certain information associated with an entry may be publicly displayed on Doggywood.com.",
        },
        {
          kind: "p",
          text: "Public information may include your dog’s name, submitted video, contest period, valid upvote total, entry status, and sharing information.",
        },
        {
          kind: "p",
          text: "If you become a winner, Doggywood may also publish information permitted under the applicable Official Rules, such as your first name, city or state if provided, dog name, winning video, contest month, and final vote total.",
        },
      ],
    },
    {
      id: "voting-information",
      heading: "4. Voting Information",
      blocks: [
        {
          kind: "p",
          text: "When you vote or upvote an entry on Doggywood, we may collect information necessary to verify and record the vote.",
        },
        {
          kind: "p",
          text: "This may include your account identifier, verified mobile number or email status, entry voted for, contest identifier, date and time of the vote, IP address, device information, browser information, and information used to identify duplicate, invalid, automated, or fraudulent voting.",
        },
        {
          kind: "p",
          text: "We use this information to maintain contest integrity, enforce voting limits, investigate suspicious activity, remove invalid votes, and determine contest results.",
        },
      ],
    },
    {
      id: "identity-verification",
      heading: "5. Identity Verification",
      blocks: [
        {
          kind: "p",
          text: "Certain Verify.Dog and Doggywood features may require identity, mobile number, or email verification.",
        },
        {
          kind: "p",
          text: "Information used for identity verification may be processed directly by us or by service providers acting on our behalf.",
        },
        {
          kind: "p",
          text: "Doggywood may in the future use Verify.Dog as its master identity service.",
        },
        {
          kind: "p",
          text: "Where this occurs, Verify.Dog may provide Doggywood with an authenticated account identifier and verified account information necessary to operate Doggywood.",
        },
        {
          kind: "p",
          text: "Verify.Dog and Doggywood are operated by the same company, Pet Platforms, Inc.",
        },
      ],
    },
    {
      id: "information-about-your-dog",
      heading: "6. Information About Your Dog",
      blocks: [
        {
          kind: "p",
          text: "We may collect information about dogs associated with your account.",
        },
        {
          kind: "p",
          text: "This may include dog name, photographs, videos, identification information, records, recovery information, service or assistance animal information where applicable, and information that you voluntarily provide.",
        },
        {
          kind: "p",
          text: "Doggywood may associate a contest dog with a Verify.Dog dog profile where you authorize or use that functionality.",
        },
        {
          kind: "p",
          text: "Participation in Doggywood does not require an existing Verify.Dog dog profile unless a specific feature expressly states otherwise.",
        },
      ],
    },
    {
      id: "verify-dog-services",
      heading: "7. Information Related to Verify.Dog Services",
      blocks: [
        {
          kind: "p",
          text: "Verify.Dog may collect information necessary to provide pet identity, records, recovery, assistance animal, customer account, and related services.",
        },
        {
          kind: "p",
          text: "Depending on the service requested, information may include contact information, pet information, transaction information, account data, and information necessary to coordinate services with professional or third party providers.",
        },
      ],
    },
    {
      id: "third-party-providers",
      heading: "8. Information Submitted to Third Party Providers",
      blocks: [
        {
          kind: "p",
          text: "Certain Verify.Dog services may involve independent professional or third party providers.",
        },
        {
          kind: "p",
          text: "If you submit information directly to such a provider through or in connection with our services, the provider may collect information that Pet Platforms does not receive or control.",
        },
        {
          kind: "p",
          text: "Such information may include health information, medications, medical records, diagnoses, treatment information, genetic information, HIV status or testing information, race, ethnicity, sexual orientation, or other information requested by the provider.",
        },
        {
          kind: "p",
          text: "Information submitted directly to an independent provider is subject to that provider’s privacy practices.",
        },
        {
          kind: "p",
          text: "Pet Platforms does not necessarily have access to information submitted directly to such providers.",
        },
      ],
    },
    {
      id: "sensitive-information",
      heading: "9. Sensitive Information",
      blocks: [
        {
          kind: "p",
          text: "Pet Platforms does not request sensitive personal information unless it is reasonably necessary for a particular service or you voluntarily provide it.",
        },
        {
          kind: "p",
          text: "Doggywood does not require medical information, mental health information, race, ethnicity, religion, political affiliation, sexual orientation, or similar sensitive personal information to enter a standard Doggywood contest.",
        },
        {
          kind: "p",
          text: "If you believe sensitive information has been provided to us unnecessarily, you may contact us through the [contact form](/contact) available on the applicable website.",
        },
      ],
    },
    {
      id: "payment-information",
      heading: "10. Payment Information",
      blocks: [
        {
          kind: "p",
          text: "When you purchase a product or service or receive a contest prize, information may be processed for payment, billing, prize administration, tax reporting, or fraud prevention purposes.",
        },
        {
          kind: "p",
          text: "Payment card information may be processed through payment service providers.",
        },
        {
          kind: "p",
          text: "We may not directly store complete payment card numbers or security codes where the transaction is handled by an independent payment processor.",
        },
        {
          kind: "p",
          text: "Contest winners may be required to provide information reasonably necessary for prize payment and tax compliance.",
        },
      ],
    },
    {
      id: "information-collected-automatically",
      heading: "11. Information Collected Automatically",
      blocks: [
        {
          kind: "p",
          text: "We may automatically collect information when you visit or use our services.",
        },
        {
          kind: "p",
          text: "This information may include IP address, browser type, device type, operating system, device identifiers, referring pages, pages viewed, links clicked, dates and times of visits, duration of visits, interactions with our services, general location information derived from network information, and similar technical information.",
        },
        {
          kind: "p",
          text: "For Doggywood, this information may also be used to detect duplicate accounts, automated activity, vote manipulation, abuse, security threats, and violations of contest rules.",
        },
      ],
    },
    {
      id: "cookies",
      heading: "12. Cookies and Similar Technologies",
      blocks: [
        {
          kind: "p",
          text: "We use cookies and similar technologies to operate our websites and services.",
        },
        {
          kind: "p",
          text: "Cookies may be used to maintain sessions, remember preferences, provide account functionality, understand how our services are used, prevent fraud, measure advertising, improve performance, and provide relevant content.",
        },
        {
          kind: "p",
          text: "You may control cookies through your browser settings.",
        },
        {
          kind: "p",
          text: "Disabling certain cookies may prevent some services from functioning properly.",
        },
      ],
    },
    {
      id: "analytics",
      heading: "13. Analytics",
      blocks: [
        {
          kind: "p",
          text: "We may use analytics services to understand how visitors use Verify.Dog, Doggywood, and related services.",
        },
        {
          kind: "p",
          text: "Analytics information may include page usage, device information, approximate location, referral information, interactions, and other information used to evaluate and improve our services.",
        },
      ],
    },
    {
      id: "advertising-and-marketing",
      heading: "14. Advertising and Marketing",
      blocks: [
        {
          kind: "p",
          text: "We may use advertising services to promote Verify.Dog, Doggywood, and related Pet Platforms services.",
        },
        {
          kind: "p",
          text: "Advertising providers may use cookies or similar technologies to measure advertising activity and provide advertising based on interests or previous interactions.",
        },
        {
          kind: "p",
          text: "We do not sell personal information for money.",
        },
        {
          kind: "p",
          text: "Where permitted by law, we may share certain identifiers or online activity information with advertising providers to measure or provide advertising.",
        },
        {
          kind: "p",
          text: "Depending on where you live, applicable privacy law may provide rights to opt out of certain targeted advertising or data sharing practices.",
        },
        {
          kind: "p",
          text: "Requests may be submitted through our [contact forms](/contact) or privacy controls where available.",
        },
      ],
    },
    {
      id: "how-we-use-personal-information",
      heading: "15. How We Use Personal Information",
      blocks: [
        {
          kind: "p",
          text: "We may use personal information to provide and operate our services, maintain accounts, authenticate users, verify mobile numbers and email addresses, process transactions, administer Doggywood contests, receive and publish contest entries, record votes, verify vote integrity, prevent fraud, determine contest winners, administer prizes, provide pet identity and recovery services, communicate with users, provide customer support, maintain security, improve our services, develop new features, comply with legal obligations, protect our rights, and enforce our Terms and Official Rules.",
        },
      ],
    },
    {
      id: "contest-communications",
      heading: "16. Contest Communications",
      blocks: [
        {
          kind: "p",
          text: "If you enter or participate in Doggywood, we may send communications reasonably necessary to administer the contest.",
        },
        {
          kind: "p",
          text: "These communications may concern entry submission, identity verification, entry approval, entry rejection, public entry status, voting deadlines, tie breaker participation, winner notification, winner verification, prize administration, account security, and other contest related matters.",
        },
        {
          kind: "p",
          text: "Contest administration messages are separate from optional marketing communications.",
        },
      ],
    },
    {
      id: "sms-communications",
      heading: "17. SMS Communications",
      blocks: [
        {
          kind: "p",
          text: "Where you provide your mobile number and consent to receive text messages, we may send transactional, verification, contest, account, or promotional text messages consistent with the consent you provide.",
        },
        {
          kind: "p",
          text: "You may opt out of promotional text messages by following the instructions provided with the message, including replying STOP where supported.",
        },
        {
          kind: "p",
          text: "Opting out of promotional messages does not prevent us from sending messages that are legally permitted or reasonably necessary for security, account verification, contest administration, or transactions where applicable.",
        },
        {
          kind: "p",
          text: "Marketing consent is not required merely to enter Doggywood unless expressly permitted by law and disclosed before entry.",
        },
      ],
    },
    {
      id: "email-communications",
      heading: "18. Email Communications",
      blocks: [
        {
          kind: "p",
          text: "We may send email regarding accounts, transactions, contest participation, contest status, customer support, security, services, and other operational matters.",
        },
        {
          kind: "p",
          text: "Where permitted by law and based on your preferences or consent, we may also send marketing communications.",
        },
        {
          kind: "p",
          text: "You may unsubscribe from marketing email using the unsubscribe method provided in the communication.",
        },
        {
          kind: "p",
          text: "You may continue to receive operational or transactional messages after opting out of marketing.",
        },
      ],
    },
    {
      id: "public-content",
      heading: "19. Public Content",
      blocks: [
        {
          kind: "p",
          text: "Doggywood is designed in part for public sharing.",
        },
        {
          kind: "p",
          text: "If you submit content to a public Doggywood contest or public area, information you submit may be visible to other users and to the public.",
        },
        {
          kind: "p",
          text: "Public content may also be indexed by search engines, shared through social networks, copied by other users, or otherwise distributed beyond our direct control.",
        },
        {
          kind: "p",
          text: "Do not include information in public submissions that you do not want publicly available.",
        },
        {
          kind: "p",
          text: "The use of submitted content by Pet Platforms is also governed by the applicable [Terms of Use](/terms) and [Official Rules](/rules).",
        },
      ],
    },
    {
      id: "how-we-share-information",
      heading: "20. How We Share Information",
      blocks: [
        {
          kind: "p",
          text: "We may share personal information with service providers and contractors that assist us with website hosting, cloud storage, communications, identity verification, fraud prevention, analytics, customer support, payment processing, video processing, contest administration, advertising, security, database services, and other business operations.",
        },
        {
          kind: "p",
          text: "We may also disclose information when reasonably necessary to comply with law, respond to lawful process, protect rights or safety, investigate fraud or abuse, enforce agreements, or establish or defend legal claims.",
        },
      ],
    },
    {
      id: "corporate-transactions",
      heading: "21. Corporate Transactions",
      blocks: [
        {
          kind: "p",
          text: "Personal information may be disclosed or transferred in connection with a merger, acquisition, financing, reorganization, sale of assets, bankruptcy, or other corporate transaction involving some or all of Pet Platforms.",
        },
      ],
    },
    {
      id: "service-providers",
      heading: "22. Service Providers",
      blocks: [
        {
          kind: "p",
          text: "Service providers may process personal information on our behalf.",
        },
        {
          kind: "p",
          text: "Depending on the service, these providers may assist with hosting, cloud storage, database infrastructure, communications, mobile verification, email delivery, analytics, advertising, payment processing, security, video storage, video processing, fraud prevention, and other functions.",
        },
        {
          kind: "p",
          text: "Service providers receive information appropriate to the services they perform.",
        },
      ],
    },
    {
      id: "deidentified-and-aggregated-information",
      heading: "23. Deidentified and Aggregated Information",
      blocks: [
        {
          kind: "p",
          text: "We may create information that has been aggregated or deidentified so that it is not reasonably capable of identifying an individual.",
        },
        {
          kind: "p",
          text: "We may use and disclose aggregated or deidentified information for analytics, reporting, research, product development, security, business planning, and other lawful purposes.",
        },
        {
          kind: "p",
          text: "We will not attempt to reidentify information that we maintain as deidentified except as permitted by law for purposes such as evaluating our deidentification methods.",
        },
      ],
    },
    {
      id: "data-retention",
      heading: "24. Data Retention",
      blocks: [
        {
          kind: "p",
          text: "We retain personal information for as long as reasonably necessary for the purposes for which it was collected and for legitimate business, legal, security, accounting, fraud prevention, contest administration, and reporting purposes.",
        },
        {
          kind: "p",
          text: "Different categories of information may have different retention periods.",
        },
        {
          kind: "p",
          text: "Doggywood may retain contest records, entry records, voting records, winner records, fraud prevention records, consent records, and audit records after a particular contest ends.",
        },
        {
          kind: "p",
          text: "Public contest entries and winner history may remain available as part of the Doggywood contest archive, subject to the applicable Terms and Official Rules.",
        },
        {
          kind: "p",
          text: "Closing an account does not necessarily require removal of public content, archived contest materials, records we are legally required to retain, or content that Pet Platforms is permitted to continue using under a valid license.",
        },
      ],
    },
    {
      id: "security",
      heading: "25. Security",
      blocks: [
        {
          kind: "p",
          text: "We use reasonable administrative, technical, and organizational measures intended to protect personal information.",
        },
        {
          kind: "p",
          text: "These measures may include access controls, account verification, secure sessions, encryption in transit, database security, service provider controls, audit records, and fraud monitoring.",
        },
        {
          kind: "p",
          text: "No internet service or storage system can guarantee absolute security.",
        },
        {
          kind: "p",
          text: "You are responsible for taking reasonable steps to protect access to your devices and accounts.",
        },
      ],
    },
    {
      id: "account-access-and-management",
      heading: "26. Account Access and Management",
      blocks: [
        {
          kind: "p",
          text: "Where account functionality is available, you may be able to review or update certain account information through your account.",
        },
        {
          kind: "p",
          text: "You may also request assistance through the [contact form](/contact) available on the applicable website.",
        },
        {
          kind: "p",
          text: "Closing an account does not necessarily delete all information associated with previous transactions, contests, voting, fraud prevention, legal obligations, public submissions, or other records we are permitted or required to retain.",
        },
      ],
    },
    {
      id: "privacy-rights",
      heading: "27. Privacy Rights",
      blocks: [
        {
          kind: "p",
          text: "Depending on your state of residence, applicable law may provide rights concerning your personal information.",
        },
        {
          kind: "p",
          text: "These rights may include the right to request access, correction, deletion, or information concerning certain uses or disclosures of personal information.",
        },
        {
          kind: "p",
          text: "Some states may also provide rights relating to targeted advertising, certain forms of data sharing, or profiling.",
        },
        {
          kind: "p",
          text: "Rights and exceptions differ by jurisdiction.",
        },
        {
          kind: "p",
          text: "You may submit a privacy request through the [contact form](/contact) available on Verify.Dog or Doggywood.com.",
        },
        {
          kind: "p",
          text: "We may take reasonable steps to verify your identity before processing a request.",
        },
        {
          kind: "p",
          text: "Authorized agents may submit requests where permitted by applicable law and subject to appropriate verification.",
        },
        {
          kind: "p",
          text: "We will not unlawfully discriminate against you for exercising applicable privacy rights.",
        },
      ],
    },
    {
      id: "california-residents",
      heading: "28. California Residents",
      blocks: [
        {
          kind: "p",
          text: "California residents may have privacy rights under California law regarding personal information collected by businesses subject to those laws.",
        },
        {
          kind: "p",
          text: "Where applicable, these rights may include requests to know, correct, or delete personal information and rights relating to certain uses or disclosures of personal information.",
        },
        {
          kind: "p",
          text: "California residents may submit requests through our [contact forms](/contact).",
        },
        {
          kind: "p",
          text: "Pet Platforms does not sell personal information for monetary compensation.",
        },
        {
          kind: "p",
          text: "Where a California privacy law treats certain advertising disclosures as sharing, applicable opt out rights will be provided where required.",
        },
      ],
    },
    {
      id: "children",
      heading: "29. Children",
      blocks: [
        {
          kind: "p",
          text: "Doggywood contests are intended for adults age 18 or older.",
        },
        {
          kind: "p",
          text: "Doggywood is not intended to knowingly collect contest entries from children.",
        },
        {
          kind: "p",
          text: "Our general services are not directed to children under 13.",
        },
        {
          kind: "p",
          text: "If we learn that personal information from a child under 13 was collected in circumstances requiring parental consent and such consent was not obtained, we will take reasonable steps to delete the information as required by law.",
        },
      ],
    },
    {
      id: "third-party-websites-and-social-media",
      heading: "30. Third Party Websites and Social Media",
      blocks: [
        {
          kind: "p",
          text: "Our services may contain links to websites or services operated by other companies.",
        },
        {
          kind: "p",
          text: "Those third parties have their own privacy practices.",
        },
        {
          kind: "p",
          text: "We encourage you to review their policies before providing information.",
        },
        {
          kind: "p",
          text: "Doggywood may also allow contest entries to be shared through social media services.",
        },
        {
          kind: "p",
          text: "Information shared with or through those services is subject to their privacy practices.",
        },
      ],
    },
    {
      id: "social-media-contest-sharing",
      heading: "31. Social Media Contest Sharing",
      blocks: [
        {
          kind: "p",
          text: "Doggywood entries may be shared on services such as Facebook, Instagram, TikTok, YouTube, X, and other social platforms.",
        },
        {
          kind: "p",
          text: "Unless expressly stated otherwise, those platforms do not sponsor, administer, or control Doggywood contests.",
        },
        {
          kind: "p",
          text: "Official voting occurs through Doggywood.",
        },
        {
          kind: "p",
          text: "Sharing an entry through an external platform may provide information to that platform under its own privacy terms.",
        },
      ],
    },
    {
      id: "changes-to-this-privacy-policy",
      heading: "32. Changes to This Privacy Policy",
      blocks: [
        {
          kind: "p",
          text: "We may update this Privacy Policy from time to time to reflect changes in our services, privacy practices, technology, business operations, or legal requirements.",
        },
        {
          kind: "p",
          text: "The effective date at the top of the Privacy Policy identifies the current version.",
        },
        {
          kind: "p",
          text: "If we make material changes, we may provide notice through Verify.Dog, Doggywood, your account, or another reasonable method.",
        },
      ],
    },
    {
      id: "contact-us",
      heading: "33. Contact Us",
      blocks: [
        {
          kind: "p",
          text: "Questions, privacy requests, complaints, account requests, and other communications regarding this Privacy Policy should be submitted through the [contact form](/contact) available on Verify.Dog or Doggywood.com.",
        },
        {
          kind: "p",
          text: "We do not require users to contact us through a published support telephone number or support email address.",
        },
        {
          kind: "p",
          text: "Written correspondence may also be directed to:",
        },
        {
          kind: "address",
          lines: termsCompanyAddressWithCountry,
        },
      ],
    },
    {
      id: "company-information",
      heading: "34. Company Information",
      blocks: [
        {
          kind: "p",
          text: "**Pet Platforms, Inc. dba Verify.Dog**",
        },
        {
          kind: "p",
          text: "Operator of Verify.Dog and Doggywood.com",
        },
        {
          kind: "address",
          lines: termsCompanyAddressWithCountry,
        },
      ],
    },
  ] satisfies readonly LegalSection[],
  closing: {
    brand: "Doggywood",
    sponsorLine: "Operated by **Pet Platforms, Inc. dba Verify.Dog**",
    address: termsCompanyAddressWithCountry,
  },
} as const;
