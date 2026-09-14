# DOGGYWOOD WIREFRAMES

These are structural wireframes for Cursor.

They define layout and hierarchy.

They are not final visual comps.

Doggywood has two labeled product states.

Launch State is the current public experience.

Future Social State is documented for later, after real approved content exists.

Do not implement Future Social State as the launch homepage.

Do not fill Launch State with fake contestants, votes, leaderboards, or trending activity.

## Launch State

## 1. Launch Landing Page Desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ DOGGYWOOD                                      Rules     Enter Doggywood    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ THE INTERNET'S DOG STAR SEARCH                                               │
│                                                                              │
│ HOLLYWOOD HAS STARS.                ┌─────────────────────────────┐          │
│ DOGGYWOOD HAS DOGS.                 │                             │          │
│                                     │     LARGE DOG PHOTOGRAPHY   │          │
│ Give your dog their shot at fame.   │     Campaign photography    │          │
│ Share their story, win over the     │     Not a fake contestant   │          │
│ fans, and compete for 300 dollars   │                             │          │
│ every month.                        │                             │          │
│                                     │                             │          │
│ [ Enter Doggywood ]                 └─────────────────────────────┘          │
│                                                                              │
│ 300 Dollar Monthly Prize   Verified Verify.Dog Customers   Authenticated Votes│
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ MONTHLY DOGGYWOOD STAR                                                       │
│                                                                              │
│ A calendar-month contest for verified Verify.Dog customers.                  │
│                                                                              │
│ The eligible entry with the most valid authenticated upvotes wins            │
│ 300 dollars.                                                                 │
│                                                                              │
│ Official action later: VOTE FOR THIS DOG                                     │
│ Sharing does not count as a vote.                                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ WHO CAN ENTER                                                                │
│                                                                              │
│ Verified Verify.Dog customers can enter.                                     │
│                                                                              │
│ Registered Verify.Dog users who are not customers can vote later,            │
│ but cannot enter this launch contest.                                        │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ HOW TO ENTER                                                                 │
│                                                                              │
│ 1. AUTHENTICATE          2. FILM                   3. PREMIERE               │
│ Sign in through          Upload a vertical         Submit for review,        │
│ Verify.Dog.              video under 59 seconds    then share and collect    │
│                          and write an honest       authenticated votes.      │
│                          Verify.Dog review.                                  │
│                                                                              │
│                         [ Enter Doggywood ]                                  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ START YOUR ENTRY                                                             │
│                                                                              │
│ Dog Name                                                                     │
│ [                                                                         ]  │
│                                                                              │
│ Breed or Mix                                                                 │
│ [                                                                         ]  │
│                                                                              │
│ Age                                                                          │
│ [                                                                         ]  │
│                                                                              │
│ Category                                                                     │
│ ( ) ESA   ( ) PSD   ( ) Service Dog   ( ) Pet                                │
│                                                                              │
│ [ Continue with Verify.Dog ]                                                 │
│                                                                              │
│ This starts the entry. It does not submit a finished contest entry.          │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ VIDEO AND REVIEW REQUIREMENTS                                                │
│                                                                              │
│ Vertical video, 9 by 16 preferred, 59 seconds maximum.                       │
│ Dog or pet must be visible.                                                  │
│ Honest Verify.Dog review required. A positive review is not required.        │
│ You must have the right to submit the video and audio.                       │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ CONTEST RULES                                                                │
│                                                                              │
│ Authenticated upvotes only.                                                  │
│ One valid vote per user per entry.                                           │
│ No self voting.                                                              │
│ Entries are moderated before they appear publicly.                           │
│ Results are subject to fraud review.                                         │
│                                                                              │
│ [ Read Official Rules ]                                                      │
│ [ Enter Doggywood ]                                                          │
│ [ Learn About Verify.Dog ]                                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 2. Launch Landing Page Mobile

```text
┌──────────────────────────────┐
│ DOGGYWOOD              Menu  │
├──────────────────────────────┤
│ THE INTERNET'S DOG STAR      │
│ SEARCH                       │
│                              │
│ HOLLYWOOD HAS STARS.         │
│ DOGGYWOOD HAS DOGS.          │
│                              │
│ Give your dog their shot     │
│ at fame and compete for      │
│ 300 dollars every month.     │
│                              │
│ [ Enter Doggywood ]          │
│                              │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │   LARGE DOG PHOTOGRAPHY  │ │
│ │   Not a fake contestant  │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ Monthly Doggywood Star       │
│ 300 dollar prize             │
│ Verified customers enter     │
│ Fans vote later              │
└──────────────────────────────┘
```

Launch State must not include:

Featured fake videos

Trending rows

This month's top dogs

Invented vote counts

Invented star ratings

Hall of Fame winner cards before a real winner exists

## Future Social State

These layouts are for later, after real approved content exists.

They are not the current launch homepage.

## 3. Future Social Homepage Desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ DOGGYWOOD        Watch   Leaderboard   Hall of Fame       Enter Doggywood   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ THE INTERNET'S DOG STAR SEARCH                                               │
│                                                                              │
│ HOLLYWOOD HAS STARS.                ┌─────────────────────────────┐          │
│ DOGGYWOOD HAS DOGS.                 │                             │          │
│                                     │   REAL APPROVED FEATURED    │          │
│ Give your dog their shot at fame.   │          DOG VIDEO          │          │
│ Share their story, win over the     │                             │          │
│ fans, and compete for 300 dollars   │     2,814 valid votes       │          │
│ every month.                        │                             │          │
│                                     │                             │          │
│ [ Enter Doggywood ]                 └─────────────────────────────┘          │
│ [ Watch the Stars ]                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ TRENDING IN DOGGYWOOD   discovery ranking, not the official contest          │
│                                                                              │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│ │ vertical │  │ vertical │  │ vertical │  │ vertical │                      │
│ │  video   │  │  video   │  │  video   │  │  video   │                      │
│ │ Buddy    │  │ Luna     │  │ Max      │  │ Coco     │                      │
│ │ 2,814    │  │ 2,532    │  │ 2,280    │  │ 2,066    │                      │
│ │ votes    │  │ votes    │  │ votes    │  │ votes    │                      │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                              │
│                         [ Watch More Stars ]                                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ THIS MONTH'S OFFICIAL CONTEST                                                │
│                                                                              │
│ 1   Buddy       2,614 valid votes                                            │
│ 2   Luna        2,532 valid votes                                            │
│ 3   Max         2,280 valid votes                                            │
│                                                                              │
│                         [ Full Official Leaderboard ]                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Names and counts in Future Social State wireframes are example structure only.

They must be replaced by real approved data at implementation time.

They must never be shown in Launch State.

## 4. Future Public Video Page

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ DOGGYWOOD                                                Profile            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌────────────────────────────┐    BUDDY                                      │
│ │                            │    Golden Retriever                           │
│ │                            │    ESA                                        │
│ │      VERTICAL VIDEO        │                                               │
│ │                            │    MONTHLY DOGGYWOOD STAR                     │
│ │                            │                                               │
│ │                            │    2,814 valid votes                          │
│ │                            │                                               │
│ └────────────────────────────┘    [ VOTE FOR THIS DOG ]                      │
│                                   [ Follow Buddy ]                           │
│                                   [ Share Premiere ]                         │
│                                                                              │
│ Buddy's Story                                                                │
│ Short owner supplied story.                                                  │
│                                                                              │
│ Verify.Dog Review                                                            │
│ Honest customer review text.                                                 │
│                                                                              │
│ Disclosure                                                                   │
│ This review was submitted as part of a Doggywood prize promotion sponsored  │
│ by Verify.Dog. A positive review is not required.                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

Do not show a five star rating control as official voting.

Decorative stars may appear in branding only.

## 5. Vote Interaction

```text
┌─────────────────────────────────────────────┐
│ VOTE FOR THIS DOG                           │
│                                             │
│ Cast your authenticated upvote for Buddy.   │
│                                             │
│ You can vote once for this entry.           │
│                                             │
│             [ VOTE FOR THIS DOG ]           │
│                                             │
│ Sharing does not count as a vote.           │
└─────────────────────────────────────────────┘
```

If logged out:

```text
┌─────────────────────────────────────────────┐
│ JOIN THE FANS                               │
│                                             │
│ Authenticate with Verify.Dog to vote        │
│ for Buddy.                                  │
│                                             │
│ You will return to this page after          │
│ verification.                               │
│                                             │
│ [ Continue with Verify.Dog ]                │
└─────────────────────────────────────────────┘
```

After authentication, return to the same page.

Record the vote only after explicit user action.

Do not silently vote because authentication succeeded.

## 6. Enter Doggywood Flow

```text
STEP 1 OF 7

YOUR DOGGYWOOD CASTING CALL STARTS HERE

Tell us about the star of the show.

Dog Name
[                                         ]

Breed or Mix
[                                         ]

Age
[                                         ]

Category
( ) ESA
( ) PSD
( ) Service Dog
( ) Pet

Dog Profile Photo
[ Upload ]

[ Continue ]
```

```text
STEP 2 OF 7

VERIFY YOUR ELIGIBILITY

The first Doggywood contest is open to verified Verify.Dog customers.

Customer Status comes from Verify.Dog.

[ Continue with Verify.Dog ]

Result states:

Verified Customer

Registered User, not contest-entry eligible

Manual Review

Not Verified
```

```text
STEP 3 OF 7

LIGHTS. CAMERA. DOGGYWOOD.

Upload a vertical video.

Maximum duration:

59 seconds

Preferred shape:

9 by 16

[ Choose Video ]

Upload Progress

[ Continue ]
```

```text
STEP 4 OF 7

TELL YOUR VERIFY.DOG STORY

How was your experience with Verify.Dog?

We want your honest experience. A positive review is not required.

[ Review text area ]

[ Continue ]
```

```text
STEP 5 OF 7

CREATE YOUR PREMIERE

Video Caption

[ Caption text ]

Preview

[ Continue ]
```

```text
STEP 6 OF 7

CONTEST TERMS

[ ] I agree to the official contest rules.

[ ] I have the right to submit this video and audio.

[ ] I grant the permissions described in the contest terms.

[ ] I understand my review will be publicly identified as part of a prize promotion.

[ Submit for Review ]
```

```text
STEP 7 OF 7

YOUR PREMIERE IS UNDER REVIEW

We review contest entries before they appear publicly.

Status:

Pending Moderation

[ Go to My Doggywood ]
```

Approved state:

```text
YOUR DOG JUST PREMIERED IN DOGGYWOOD

Buddy is officially in the contest.

Ask fans to VOTE FOR THIS DOG.

[ Share Buddy's Premiere ]

[ View Public Page ]

[ View Official Leaderboard ]
```

## 7. My Doggywood Console

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ MY DOGGYWOOD                                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Profile                                                                      │
│ Joseph                                                                       │
│ Identity: Verify.Dog                                                         │
│                                                                              │
│ MY STARS                                                                     │
│ ┌───────────────────────┐                                                     │
│ │ Buddy                 │                                                     │
│ │ ESA                   │                                                     │
│ │ 2 videos              │                                                     │
│ │ 814 followers         │                                                     │
│ └───────────────────────┘                                                     │
│                                                                              │
│ CURRENT OFFICIAL CONTEST                                                     │
│ Buddy                                                                        │
│ Rank 4                                                                       │
│ 2,066 valid votes                                                            │
│                                                                              │
│ [ View Entry ]   [ Share Premiere ]                                          │
│                                                                              │
│ NOTIFICATIONS                                                                │
│ Buddy reached 500 fans.                                                      │
│ Buddy moved into the Top 10.                                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 8. Future Official Leaderboard

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SEPTEMBER MONTHLY DOGGYWOOD STAR                                             │
│                                                                              │
│ Voting closes September 30                                                   │
│                                                                              │
│ Rank   Dog          Valid Votes                                              │
│                                                                              │
│ 1      Buddy        2,614                                                    │
│ 2      Luna         2,532                                                    │
│ 3      Max          2,280                                                    │
│                                                                              │
│ [ Load More ]                                                                │
│                                                                              │
│ This is the official contest standing.                                       │
│ Trending and Hot 30 are separate discovery rankings.                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 9. Admin Moderation

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ MODERATION QUEUE                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ Pending 24      Escalated 3      Reports 7                                   │
│                                                                              │
│ ENTRY                                                                        │
│                                                                              │
│ Dog: Buddy                                                                   │
│ User: Joseph                                                                 │
│ Eligibility: Verified Customer from Verify.Dog                               │
│                                                                              │
│ [ Video Player ]                                                             │
│                                                                              │
│ Caption                                                                      │
│ Review                                                                       │
│                                                                              │
│ Decision                                                                     │
│ [ Approve ]                                                                  │
│ [ Reject ]                                                                   │
│ [ Escalate ]                                                                 │
│                                                                              │
│ Reason                                                                       │
│ [ Select ]                                                                   │
│                                                                              │
│ Internal Note                                                                │
│ [                                                                      ]     │
└──────────────────────────────────────────────────────────────────────────────┘
```
