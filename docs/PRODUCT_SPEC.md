# DOGGYWOOD PRODUCT SPECIFICATION

## 1. Product identity

Product name:

Doggywood

Core meaning:

Doggywood is Hollywood for dogs.

Brand idea:

Dogs are the celebrities. Their owners are their managers. Viewers are fans. New videos are premieres. Official competitions are star searches. Dynamic rankings are discovery tools. Winners enter the Doggywood Hall of Fame.

Doggywood must never feel like a generic testimonial page.

Verify.Dog is the master identity platform, the launch sponsor, and the source of the first contest audience.

## 2. Two product states

### 2.1 Launch State

The initial public Doggywood page exists to collect Verify.Dog customer contest entries.

There are currently no approved public contestants.

The launch landing page must not display fake:

Videos

Contestants

Ratings

Votes

Leaderboards

Profiles

Trending activity

The launch landing page focuses on contest invitation, eligibility, how to enter, video and review requirements, rules, and calls to action.

See LAUNCH_LANDING_PAGE_SPEC.md.

### 2.2 Future Social State

After real approved content exists, Doggywood becomes a social discovery experience.

The future homepage can then show watches, votes, follows, official contest standings, and dynamic rankings.

These states are sequential. The launch page is not a fake social homepage.

## 3. Initial product promise

Doggywood gives dog owners a public stage for their dog.

The initial contest is Monthly Doggywood Star.

A verified Verify.Dog customer can:

1. Authenticate through Verify.Dog.

2. Create a Doggywood display profile and a profile for their dog.

3. Upload a vertical video no longer than 59 seconds.

4. Write an honest review about their Verify.Dog experience.

5. Publish the contest entry after moderation.

6. Share the entry with friends, family, and social networks.

7. Collect authenticated upvotes.

8. Compete for the monthly 300 dollar prize.

A registered Verify.Dog user, including a public voter who is not a Verify.Dog customer, can authenticate through Verify.Dog so they can watch, vote, follow, save, and share.

A public voter does not need to be a Verify.Dog customer.

A contest entrant in the initial launch contest must be a verified Verify.Dog customer.

## 4. Primary audiences

### 4.1 Verify.Dog customer contestant

This user already used Verify.Dog for an ESA, PSD, service animal, or related pet service.

Primary goal:

Give their dog a chance at recognition and win the monthly prize.

Secondary motivation:

Tell the story of how their dog has affected their life.

### 4.2 Public fan

This user discovers Doggywood through a shared entry, search, social media, or direct traffic.

The fan may be a registered Verify.Dog user without being a verified customer.

Primary goal:

Watch entertaining dog videos.

Secondary actions:

Vote, follow, favorite, and share.

### 4.3 Doggywood administrator

Primary responsibilities:

Moderation

Contest management

Customer eligibility review

Fraud review

Winner validation

User support

Content removal

Audit review

## 5. Brand language

Doggywood uses entertainment language.

Use:

Doggywood Star

Premiere

Casting Call

Fan

Vote

Trending in Doggywood

Spotlight

Star of the Month

Hall of Fame

My Doggywood

Do not overuse themed language in places where clarity is more important.

Authentication, settings, privacy, reports, and administrative controls should use plain language.

Do not use rating, stars, or Fan Score as official contest voting language.

Star graphics may appear as Hollywood decoration. They must not mean official votes.

## 6. Identity and authentication

Verify.Dog owns master identity.

Doggywood must not create a separate independent authentication identity for the same person.

Doggywood authenticates through Verify.Dog mobile SMS authentication.

No password login.

No Doggywood-owned duplicate mobile credentials.

After authentication, return the user to the exact Doggywood page they came from.

Record a vote only after explicit user action.

Existing authenticated Verify.Dog customers should enter Doggywood with as little friction as possible.

See IDENTITY_ARCHITECTURE.md.

## 7. Version one feature set

### 7.1 Doggywood display profile

Display name

Profile image

Optional biography

Doggywood-owned presentation fields

Contest eligibility is derived from Verify.Dog identity state, not from a second Doggywood customer database.

### 7.2 Dog profile

Dog name

Profile image

Breed or mix

Age or age range

Category

ESA

PSD

Service Dog

Pet

Short biography

Owner relationship

Celebrity statistics independent of a single contest:

Lifetime Valid Votes

Followers

Video Views

Shares

Contest Wins

Awards

Finalist Appearances

Published Videos

### 7.3 Eligibility

Required conceptual states:

Registered User

Verified Customer

Doggywood Voting Eligible

Doggywood Contest Entry Eligible

Only contest-entry eligible users can publish an initial Verify.Dog contest entry.

Registered users can vote and use social functions without being customers.

### 7.4 Video submission

Accepted orientation:

Vertical

Preferred aspect ratio:

9 by 16

Maximum duration:

59 seconds

Required content:

Dog or pet must be visible for a meaningful portion of the video.

Required written review:

Contestant must write an honest review of their Verify.Dog experience.

Review positivity is not required.

Required caption:

Short public caption for the dog video.

Required rights confirmation:

User confirms ownership or permission to submit the video and audio.

### 7.5 Video lifecycle

Draft

Uploading

Processing

Ready

Technical Reject

Removed

Contest publication states belong on the Entry, not as a second video identity.

### 7.6 Official voting

The official voting action is:

VOTE FOR THIS DOG

Only authenticated registered users who are voting eligible can vote.

Each authenticated user may cast one valid upvote for each eligible contest entry.

A user cannot cast multiple valid upvotes for the same entry.

A contestant cannot vote for their own entry.

Votes must be server validated and auditable.

The official monthly winner is the eligible entry with the highest number of valid authenticated upvotes during the contest period.

Do not use a five star rating as official contest scoring.

Share count does not create official contest votes.

### 7.7 Following

Authenticated users can follow dog profiles.

Followers receive future Doggywood notifications when the dog publishes a new approved video or wins a contest.

### 7.8 Favorites

Authenticated users can save videos to Favorites.

Favorites do not affect official contest totals.

### 7.9 Sharing

Every public video has a share action.

Entrants should be strongly encouraged to share their contest page.

Shared visitors can authenticate and vote.

Track:

Share creation

Share visits

Registration conversion

Vote conversion

Follow conversion

Sharing does not itself count as a vote.

Share channels should support:

Copy Link

Text Message

Email

Facebook

Instagram sharing handoff where supported by the browser or device

Other native share destinations through the device share sheet

Sharing may unlock awards and status. Those awards are not official contest votes.

### 7.10 Official competitions

Official competitions are prize contests. They are not discovery rankings.

The primary launch contest is:

Monthly Doggywood Star

Contest period:

Calendar month

Winner:

Eligible entry with the most valid authenticated upvotes during that calendar month

Prize:

300 dollars

Each contest instance must have configurable:

Start date

Entry close date

Voting close date

Prize

Eligibility

Contest status

Winner rules

Tie rules

The architecture must support multiple contest categories without a redesign.

Approved future categories:

Monthly Doggywood Star

Cutest Dog

Best Pet Trick

Best Story

Service Star

Rescue Star

Doggywood Dog of the Year

Do not implement all categories in the first launch.

### 7.11 Annual championship

Doggywood Dog of the Year is a separate annual championship.

Recommended eligibility:

Monthly winners qualify automatically.

Future wildcard finalists may also qualify.

Annual voting starts from zero.

Do not total all votes accumulated throughout the year. That would give an unfair time advantage to earlier entrants.

The annual contest has its own voting period and winner record.

### 7.12 Dynamic rankings

Dynamic rankings are discovery tools. They do not automatically determine a prize winner.

Approved ranking types:

Trending Today

Trending This Week

Doggywood Hot 30

Fastest Riser

Most Shared

Most Watched

Most Followed

See RANKING_ENGINE.md.

### 7.13 Hall of Fame and awards

Each finalized official contest produces a permanent ContestWinner record.

Winner page contains:

Winning dog

Winning video

Contest identity

Contest period

Final valid vote count

Prize

Short winner story

Awards are separate from winners and rankings. Awards may include share-growth badges and other non-prize recognition.

### 7.14 Notifications

Version one notification categories:

New follower

Vote milestone

Contest entry approved

Contest entry rejected

Contest closing soon

Official contest standing milestone

Winner announcement

Administrative message

## 8. Contest submission flow

Screen one:

Authenticate through Verify.Dog if needed.

Screen two:

Confirm verified customer eligibility for the launch contest.

Screen three:

Create or select dog.

Screen four:

Upload vertical video.

Screen five:

Write honest Verify.Dog review.

Screen six:

Add video caption.

Screen seven:

Review contest terms and media permission.

Screen eight:

Submit for moderation.

Screen nine:

Show pending moderation state.

Screen ten after approval:

Your dog just premiered in Doggywood.

Primary action:

Share this Premiere.

## 9. Public viewer flow

Viewer opens a shared video.

Viewer can watch without authentication.

Viewer sees:

Video

Dog identity

Contest context

Valid vote count

Vote action

Share action

Follow action

When viewer selects Vote while logged out:

Send the viewer through Verify.Dog mobile SMS authentication.

After successful authentication:

Return the viewer to the same video.

Record the vote only after explicit confirmation.

## 10. Viral loop

Entrant publishes a video.

Entrant shares the public page.

Viewer watches.

Viewer authenticates to vote.

Viewer sees more related Doggywood videos once real content exists.

Viewer follows one or more dogs.

Viewer shares a favorite entry.

Viewer later becomes a contestant if contest-entry eligible.

The product should optimize this loop before adding unrelated social features.

## 11. Trust requirements

The product must clearly show:

Votes are from authenticated users.

Contest reviews are submitted as part of a prize promotion.

Positive reviews are not required.

Videos are moderated before contest publication.

Reported content can be removed.

Contest results are subject to fraud validation.

Official contest totals are not the same thing as trending rankings.

## 12. Three concepts that must stay separate

Official Competitions

Examples:

Monthly Doggywood Star

Cutest Dog

Best Trick

Best Story

Doggywood Dog of the Year

Dynamic Rankings

Examples:

Trending Today

Trending This Week

Doggywood Hot 30

Fastest Riser

Most Shared

Celebrity Statistics

Examples:

Lifetime Votes

Followers

Views

Shares

Contest Wins

Awards

Do not mix these concepts in product copy or in the data model.

## 13. Version one exclusions

Do not build these in the first release:

Direct messaging

Live streaming

Comment threads

Creator monetization

Paid boosts

Advertising marketplace

Complex recommendation artificial intelligence

Implementation of every future contest category

Mobile native applications

Public video submission from users who are not contest-entry eligible

Partner brand sponsorship management

Password authentication

Five star official contest voting

Fake social-feed content on the launch landing page

The architecture must still support multiple contest categories, rankings, and awards later without a redesign.

## 14. Success signals

Product analytics should support measurement of:

Approved contest entries

Entry completion rate

Average views per approved entry

Authenticated vote conversion

Valid votes per entry

Shares per entry

Share visitor conversion

Registration conversion from shares

Vote conversion from shares

Follow conversion

Repeat viewer rate

Moderation rejection rate

Fraud rejection rate

Verify.Dog referral traffic generated by Doggywood
