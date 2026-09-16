import type { ContestIconName } from "@/components/ui/ContestIcon";

export const STORY_MIN_CHARS = 50;
export const STORY_MAX_CHARS = 1500;
export const SCAN_AND_GO_MAX_CHARS = 1500;

export const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
export const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export const reviewContestCopy = {
  heroEyebrow: "VERIFY.DOG CUSTOMERS • WIN $500 THIS MONTH",
  headlineLine1: "Your Verify.Dog Story",
  headlineLine2: "Could Win You",
  headlineAccent: "$500.",
  lede: "Share a photo of you and your dog and tell us about your genuine Verify.Dog experience. Your story might include obtaining your ESA letter, life at home with your ESA, your relationship with your pup, or how you use Scan & Go. Each month, one eligible customer story will be selected to win $500.",
  heroCta: "ENTER THE CUSTOMER CONTEST",
  heroEligibility: "For eligible existing Verify.Dog customers.",
  snapshot: [
    {
      title: "$500 EVERY MONTH",
      icon: "contest_trophy" as ContestIconName,
    },
    {
      title: "SHARE YOUR VERIFY.DOG STORY",
      icon: "contest_join" as ContestIconName,
    },
    {
      title: "JUDGED FOR STORY, CREATIVITY & CUTENESS",
      icon: "rules_how_to_win" as ContestIconName,
    },
  ],
  aboutEyebrow: "FOR THE VERIFY.DOG FAMILY",
  aboutHeading: "Show Us Life With Your Pup",
  aboutParagraphs: [
    "Doggywood is giving Verify.Dog customers a place to share the real stories behind their dogs.",
    "Maybe Verify.Dog helped you obtain your ESA letter. Maybe your ESA has changed life at home. Maybe Scan & Go gives you a simple way to keep your dog’s identity and important information with you wherever you go.",
    "Share a photo of you with your dog and tell us about your genuine experience.",
  ],
  howEyebrow: "HOW IT WORKS",
  howHeading: "How It Works",
  stages: [
    {
      step: "STEP 1",
      title: "Upload Your Photo",
      body: "Choose a clear photo showing you together with your dog or dogs. JPG, JPEG, PNG or WEBP.",
      icon: "step_upload" as ContestIconName,
    },
    {
      step: "STEP 2",
      title: "Tell Your Verify.Dog Story",
      body: "Tell us about your genuine experience with Verify.Dog, your ESA letter, living at home with your ESA, or another Verify.Dog service you use.",
      icon: "step_enter" as ContestIconName,
    },
    {
      step: "STEP 3",
      title: "Show Us Scan & Go",
      body: "Show or describe how Scan & Go fits into life with your dog. You can feature your Scan & Go tag, Digital Pet Passport, Apple Wallet pass or Google Wallet pass.",
      icon: "step_share" as ContestIconName,
    },
    {
      step: "STEP 4",
      title: "Enter for $500",
      body: "Each month, eligible entries are reviewed using the official judging criteria. One customer story will be selected as the monthly winner.",
      icon: "step_win" as ContestIconName,
    },
  ],
  judgingEyebrow: "HOW THE WINNER IS CHOSEN",
  judgingHeading: "What Makes a Winning Story?",
  judgingLede:
    "This is a judged customer story contest. Eligible entries are evaluated on the quality of the story and photo, not on the number of likes, shares or reactions they receive.",
  criteria: [
    {
      weight: "30%",
      title: "AUTHENTICITY",
      body: "How genuine, personal and believable the customer’s Verify.Dog experience is.",
      icon: "contest_join" as ContestIconName,
    },
    {
      weight: "20%",
      title: "ACCURACY & SPECIFICITY",
      body: "How clearly and specifically the entrant describes their actual Verify.Dog, ESA or Scan & Go experience.",
      icon: "rules_basics" as ContestIconName,
    },
    {
      weight: "20%",
      title: "CREATIVITY",
      body: "The originality, personality and creativity of the photo and written story.",
      icon: "step_record" as ContestIconName,
    },
    {
      weight: "15%",
      title: "CUTENESS & PHOTO APPEAL",
      body: "The warmth, personality and overall appeal of the entrant’s photo with their dog or dogs.",
      icon: "contest_trophy" as ContestIconName,
    },
    {
      weight: "15%",
      title: "SCAN & GO",
      body: "How clearly or creatively the entry features or describes Scan & Go, the Digital Pet Passport, the Scan & Go tag, Apple Wallet or Google Wallet.",
      icon: "step_share" as ContestIconName,
    },
  ],
  judgingTotal: "TOTAL: 100%",
  judgingNote:
    "Likes, shares and other community reactions do not affect judging or determine the winner.",
  formHeading: "Enter This Month’s Verify.Dog Customer Contest",
  formLede: "Upload a photo with your dog and tell us your Verify.Dog story.",
  photoLabel: "Upload Your Photo",
  photoHelper: "Your photo must clearly show you together with your dog or dogs.",
  photoHint: "Click to upload or drag and drop",
  photoFormats: ["JPG", "JPEG", "PNG", "WEBP"],
  photoError: "Use JPG, JPEG, PNG or WEBP.",
  replacePhoto: "Replace Photo",
  removePhoto: "Remove Photo",
  storyLabel: "Tell Us Your Verify.Dog Story",
  storyHelper:
    "Tell us about your genuine experience with Verify.Dog. You may share your experience obtaining your ESA letter, living at home with your ESA, using Verify.Dog services, or how Scan & Go fits into life with your dog.",
  scanLabel: "How Do You Use Scan & Go?",
  scanHelper:
    "Tell us how you use your Scan & Go tag, Digital Pet Passport, Apple Wallet pass or Google Wallet pass.",
  acknowledgement:
    "I confirm that I am an eligible Verify.Dog customer, that the photo and story are mine to submit, and that my entry reflects my genuine experience.",
  officialRulesLabel: "Official Customer Contest Rules",
  submit: "SUBMIT MY CUSTOMER CONTEST ENTRY",
  pendingMessage: "Customer contest submission will be connected in the next build phase.",
  rulesHeading: "Rules at a Glance",
  rules: [
    {
      title: "EXISTING VERIFY.DOG CUSTOMERS",
      body: "This contest is for eligible existing Verify.Dog customers.",
      icon: "contest_join" as ContestIconName,
    },
    {
      title: "YOU + YOUR DOG",
      body: "Your submitted photograph must clearly show you together with your dog or dogs.",
      icon: "step_upload" as ContestIconName,
    },
    {
      title: "YOUR REAL EXPERIENCE",
      body: "Tell us about your genuine experience with Verify.Dog, your ESA letter, life at home with your ESA, or another Verify.Dog service.",
      icon: "step_enter" as ContestIconName,
    },
    {
      title: "STILL IMAGES ONLY",
      body: "Submit a JPG, JPEG, PNG or WEBP image. Videos are not accepted in this customer contest.",
      icon: "upload_panel" as ContestIconName,
    },
    {
      title: "$500 MONTHLY PRIZE",
      body: "One eligible customer entry is selected to receive $500 each monthly contest.",
      icon: "contest_trophy" as ContestIconName,
    },
    {
      title: "JUDGED CONTEST",
      body: "The winner is selected using the official judging criteria. Likes, shares and reactions do not determine the winner.",
      icon: "rules_how_to_win" as ContestIconName,
    },
  ],
  faqEyebrow: "FAQ",
  faqHeading: "Frequently Asked Questions",
  faqs: [
    {
      q: "Who can enter?",
      a: "This contest is intended for eligible existing Verify.Dog customers who meet the requirements in the Official Customer Contest Rules.",
    },
    {
      q: "Do I submit a video?",
      a: "No. The Verify.Dog Customer Story Contest uses still photographs. Your photo must clearly show you together with your dog or dogs.",
    },
    {
      q: "What should I write about?",
      a: "Tell us about your genuine Verify.Dog experience. You can write about obtaining your ESA letter, living at home with your ESA, your experience using Verify.Dog, or how Scan & Go fits into life with your dog.",
    },
    {
      q: "Do I have to leave a positive review?",
      a: "No. Your entry should honestly reflect your own experience.",
    },
    {
      q: "Do likes or upvotes determine the winner?",
      a: "No. This is a judged contest. Likes, shares, reactions and other popularity signals do not affect the judging result.",
    },
    {
      q: "How is the winner selected?",
      a: "Eligible entries are judged on authenticity, accuracy and specificity, creativity, cuteness and photo appeal, and the use or presentation of Scan & Go.",
    },
    {
      q: "What is Scan & Go?",
      a: "Scan & Go is Verify.Dog’s digital pet identity experience, including the Scan & Go tag, Digital Pet Passport, and supported Apple Wallet or Google Wallet access.",
    },
    {
      q: "What photo formats can I upload?",
      a: "JPG, JPEG, PNG and WEBP.",
    },
    {
      q: "Can I also enter the regular Doggywood contest?",
      a: "Yes, if you separately meet the eligibility requirements for that contest. The regular Doggywood contest and the Verify.Dog Customer Story Contest are separate contests with separate rules.",
    },
  ],
  finalHeadingLine1: "You’ve Got the Dog.",
  finalHeadingLine2: "You’ve Got the Story.",
  finalLede: "Show the Doggywood community what life with your pup and Verify.Dog looks like.",
  finalCta: "ENTER THE CUSTOMER CONTEST",
} as const;

export function isAcceptedImageFile(file: File) {
  const name = file.name.toLowerCase();
  const hasAcceptedExtension = IMAGE_EXTENSIONS.some((extension) => name.endsWith(extension));

  if (file.type && !IMAGE_TYPES.has(file.type) && !hasAcceptedExtension) {
    return false;
  }

  if (!file.type && !hasAcceptedExtension) {
    return false;
  }

  return true;
}
