import type { DogCategory } from "@/types/domain";

export type HomepageVideoCard = {
  id: string;
  dogName: string;
  dogSlug: string;
  ownerDisplayName: string;
  category: DogCategory;
  averageRating: number;
  ratingCount: number;
  fanScore: number;
};

export type HomepageLeaderboardRow = HomepageVideoCard & {
  rank: number;
};

export type HomepageStarOfTheMonth = HomepageVideoCard & {
  contestMonthLabel: string;
  prizeLabel: string;
};

export const featuredVideo: HomepageVideoCard = {
  id: "video-buddy-featured",
  dogName: "Buddy",
  dogSlug: "buddy",
  ownerDisplayName: "Joseph",
  category: "esa",
  averageRating: 4.9,
  ratingCount: 2814,
  fanScore: 12440,
};

export const trendingVideos: HomepageVideoCard[] = [
  featuredVideo,
  {
    id: "video-luna",
    dogName: "Luna",
    dogSlug: "luna",
    ownerDisplayName: "Maya",
    category: "psd",
    averageRating: 4.8,
    ratingCount: 2532,
    fanScore: 11983,
  },
  {
    id: "video-max",
    dogName: "Max",
    dogSlug: "max",
    ownerDisplayName: "Chris",
    category: "service_dog",
    averageRating: 4.7,
    ratingCount: 2280,
    fanScore: 10774,
  },
  {
    id: "video-coco",
    dogName: "Coco",
    dogSlug: "coco",
    ownerDisplayName: "Ava",
    category: "pet",
    averageRating: 4.9,
    ratingCount: 2066,
    fanScore: 9981,
  },
];

export const topDogs: HomepageLeaderboardRow[] = [
  { ...featuredVideo, rank: 1, ratingCount: 2614 },
  {
    id: "video-luna",
    dogName: "Luna",
    dogSlug: "luna",
    ownerDisplayName: "Maya",
    category: "psd",
    averageRating: 4.8,
    ratingCount: 2532,
    fanScore: 11983,
    rank: 2,
  },
  {
    id: "video-max",
    dogName: "Max",
    dogSlug: "max",
    ownerDisplayName: "Chris",
    category: "service_dog",
    averageRating: 4.7,
    ratingCount: 2280,
    fanScore: 10774,
    rank: 3,
  },
  {
    id: "video-coco",
    dogName: "Coco",
    dogSlug: "coco",
    ownerDisplayName: "Ava",
    category: "pet",
    averageRating: 4.9,
    ratingCount: 2066,
    fanScore: 9981,
    rank: 4,
  },
  {
    id: "video-charlie",
    dogName: "Charlie",
    dogSlug: "charlie",
    ownerDisplayName: "Sam",
    category: "pet",
    averageRating: 4.7,
    ratingCount: 2082,
    fanScore: 9402,
    rank: 5,
  },
];

export const starOfTheMonth: HomepageStarOfTheMonth = {
  id: "video-buddy-august",
  dogName: "Buddy",
  dogSlug: "buddy",
  ownerDisplayName: "Joseph",
  category: "esa",
  averageRating: 4.9,
  ratingCount: 3201,
  fanScore: 15685,
  contestMonthLabel: "August Doggywood Star",
  prizeLabel: "Winner of 300 dollars",
};

export const homepageCopy = {
  eyebrow: "THE INTERNET'S DOG STAR SEARCH",
  headlineLineOne: "HOLLYWOOD HAS STARS.",
  headlineLineTwo: "DOGGYWOOD HAS DOGS.",
  heroBody:
    "Give your dog their shot at fame. Share their story, win over the fans, and compete for 300 dollars every month.",
  primaryAction: "Enter Doggywood",
  secondaryAction: "Watch the Stars",
  proofPoints: [
    "300 Dollar Monthly Prize",
    "Authenticated Fan Ratings",
    "New Stars Every Day",
  ],
  trendingHeading: "TRENDING IN DOGGYWOOD",
  watchMore: "Watch More Stars",
  topDogsHeading: "THIS MONTH'S TOP DOGS",
  fullLeaderboard: "Full Leaderboard",
  castingHeading: "THINK YOUR DOG HAS STAR POWER?",
  castingSteps: [
    {
      number: "1",
      title: "FILM",
      body: "Create a vertical video under one minute.",
    },
    {
      number: "2",
      title: "PREMIERE",
      body: "Tell your story and submit your entry.",
    },
    {
      number: "3",
      title: "WIN THE FANS",
      body: "Share your Premiere and collect ratings.",
    },
  ],
  starOfTheMonthHeading: "DOGGYWOOD STAR OF THE MONTH",
  visitHallOfFame: "Visit Hall of Fame",
  storiesHeading: "POWERED BY REAL DOG STORIES",
  storiesBody:
    "The first Doggywood Casting Call celebrates verified Verify.Dog customers and the dogs who changed their lives.",
  verifyDogAction: "Learn About Verify.Dog",
} as const;
