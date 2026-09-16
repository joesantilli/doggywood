export type ContestPeriod = {
  monthLabel: string;
  entryDeadline: string;
  votingDeadline: string;
};

export const contestPeriod: ContestPeriod | null = null;

export const launchCopy = {
  enter: "Enter the Contest",
  heroCta: "ENTER THIS MONTH'S CONTEST",
  viewRules: "READ OFFICIAL RULES",
  submit: "Submit My Entry",
  backToVerifyDog: "Back to Verify.Dog",
  verifyDogHref: "https://verify.dog",
  heroEyebrow: "WIN $500 THIS MONTH!",
  headlineLine1: "Your Dog’s Shot",
  headlineLine2: "at Fame",
  headlineStarts: "Starts",
  headlineAccent: "Here.",
  heroPrize: "WIN $500!",
  lede: "Upload the coolest 30 second video of your pup, share it with your friends, and rack up the upvotes. The dog with the most valid upvotes wins $500, and there’s a brand new contest every month.",
  snapshot: [
    {
      title: "$500 EVERY MONTH",
      body: "A new winner every month.",
      icon: "contest_trophy" as const,
      tone: "gold" as const,
    },
    {
      title: "SHOW OFF YOUR PUP",
      body: "Upload a short video of your furry friend.",
      icon: "contest_video" as const,
      tone: "blue" as const,
    },
    {
      title: "MOST UPVOTES WINS",
      body: "Share your entry and rally your friends.",
      icon: "contest_upvote" as const,
      tone: "gold" as const,
    },
  ],
  aboutEyebrow: "ABOUT DOGGYWOOD",
  aboutHeading: "A Monthly Contest for Dogs Who Deserve the Spotlight",
  aboutLede:
    "Think your dog is ridiculously cute, hilarious, talented, or impossible not to love? Upload a short video, share your entry, and let Doggywood voters decide. A new winner takes home $500 every month.",
  aboutCards: [
    {
      title: "$500 Every Month",
      body: "A new Doggywood winner is selected every month. The eligible entry with the most valid authenticated upvotes wins $500.",
      icon: "contest_trophy" as const,
    },
    {
      title: "Show Off Your Dog",
      body: "Upload a vertical video showing what makes your dog cute, funny, talented, or unforgettable.",
      icon: "contest_video" as const,
    },
    {
      title: "Get Upvotes",
      body: "Share your Doggywood entry with friends, family, and anyone who needs to see your dog.",
      icon: "contest_upvote" as const,
    },
    {
      title: "Join Doggywood",
      body: "Discover great dogs, vote for your favorites, and help choose the next Doggywood Star.",
      icon: "contest_join" as const,
    },
  ],
  howEyebrow: "HOW IT WORKS",
  howHeading: "It’s Easy to Enter",
  stages: [
    {
      step: "STEP 1",
      title: "Record Your Dog",
      body: "Capture a cute, funny, talented, or unforgettable moment. Your video must be 30 seconds or less.",
      icon: "step_record" as const,
    },
    {
      step: "STEP 2",
      title: "Upload Your Video",
      body: "Create your Doggywood entry and upload your vertical dog video.",
      icon: "step_upload" as const,
    },
    {
      step: "STEP 3",
      title: "Share With Friends",
      body: "Share your Doggywood entry and bring people to watch and upvote your dog.",
      icon: "step_share" as const,
    },
    {
      step: "STEP 4",
      title: "Win $500",
      body: "The eligible entry with the most valid authenticated upvotes when the monthly contest closes wins $500.",
      icon: "step_win" as const,
    },
  ],
  votingHeading: "How Voting Works",
  votingRules: [
    "Only registered authenticated users may upvote.",
    "One registered user may cast one valid upvote for each contest entry.",
    "The eligible entry with the most valid authenticated upvotes at contest close wins $500.",
  ],
  votingNote: "Sharing helps more people discover your dog. Sharing itself is not a vote.",
  formEyebrow: "ENTER DOGGYWOOD",
  formHeading: "Enter This Month’s Contest",
  formLede:
    "Upload your dog’s best 30 seconds and give them a chance to become the next Doggywood Star.",
  videoTitle: "Upload Your Dog Video",
  videoHint: "Click to upload or drag and drop",
  videoSpecs: [
    "30 seconds or less",
    "Vertical video preferred",
    "MP4, MOV, or WEBM",
    "Maximum 500MB",
  ],
  replaceVideo: "Replace Video",
  removeVideo: "Remove Video",
  requirementsHeading: "Entry Requirements",
  requirements: [
    "Your dog must be featured in the video",
    "Video must be 30 seconds or less",
    "Original video content",
    "You must have the right to submit the video",
    "Use only music or audio you have rights or permission to use",
    "Entry must comply with the Official Rules",
  ],
  authNotice:
    "You will verify your email address or mobile number before your entry is accepted.",
  verifyHeading: "Verify Your Identity",
  verifyLede: "Verify your email address or mobile number to continue your Doggywood entry.",
  verifyByEmail: "Verify by Email",
  verifyBySms: "Verify by Text Message",
  verifyCodeLabel: "Verification Code",
  verifyEmailSent: "We sent a verification code to your email.",
  verifySmsSent: "We sent a verification code to your mobile number.",
  verifiedHeading: "Identity Verified",
  verifiedLede:
    "Your identity is verified. Your contest entry is ready for the next submission step.",
  resendCode: "Send another code",
  changeMethod: "Use a different verification method",
  sendingCode: "Sending Code…",
  verifying: "Verifying…",
  verifyCode: "Verify Code",
  readyMessage:
    "Your entry details are ready. Identity verification will be added in the next phase.",
  formNote: "One entry per dog during each monthly contest.",
  agreement:
    "I agree to the Official Rules, Terms of Service, and Privacy Policy.",
  rulesHeading: "Contest Rules at a Glance",
  rulesBasicsHeading: "THE BASICS",
  rulesBasics: [
    "Open to the public under the Official Rules",
    "Upload a video of your dog",
    "Maximum 30 seconds",
    "Submit original content",
    "Follow the Official Rules",
  ],
  rulesWinHeading: "HOW YOU WIN",
  rulesWin: [
    "Share your entry",
    "Invite friends to watch",
    "Collect valid authenticated upvotes",
    "Most valid authenticated upvotes wins $500",
    "New winner every month",
  ],
  faqEyebrow: "FAQ",
  faqHeading: "Frequently Asked Questions",
  faqLede: "Questions about entering, voting, and winners.",
  faqs: [
    {
      q: "Who can enter the Doggywood contest?",
      a: "Anyone who meets the contest eligibility rules. Doggywood is a public contest. You do not need to be a Verify.Dog customer, and a Verify.Dog review is not required.",
    },
    {
      q: "What kind of video can I upload?",
      a: "An original video of your dog, 30 seconds or less. Vertical video is preferred. Use MP4, MOV, or WEBM, up to 500MB.",
    },
    {
      q: "How do upvotes work?",
      a: "Only registered authenticated users may upvote. One registered user may cast one valid upvote for each contest entry. Sharing helps people find your dog, but sharing itself is not a vote.",
    },
    {
      q: "How is the winner selected?",
      a: "The eligible entry with the most valid authenticated upvotes wins $500.",
    },
    {
      q: "Can I enter again next month?",
      a: "Yes. One entry per dog during each monthly contest.",
    },
    {
      q: "When is each winner announced?",
      a: "A new contest starts every month. Official timing is published in the Official Rules.",
    },
    {
      q: "Where can I find the full Official Rules?",
      a: "The complete Official Rules are on the Official Rules page.",
    },
  ],
  finalHeading: "Think Your Dog Has What It Takes?",
  finalLede: "Upload your dog’s best 30 seconds and compete for $500 this month.",
  footerNote: "Sponsored by Verify.Dog",
} as const;
