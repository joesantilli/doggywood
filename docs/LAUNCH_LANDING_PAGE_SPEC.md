# DOGGYWOOD LAUNCH LANDING PAGE SPECIFICATION

## 1. Purpose

The initial Doggywood public page is a launch landing page.

Its job is to collect Verify.Dog customer contest entries for Monthly Doggywood Star.

There are currently no approved public contestants.

This page is Launch State.

It is not the future social homepage.

## 2. What this page must not show

The launch landing page must not display fake:

Videos

Contestants

Ratings

Votes

Leaderboards

Profiles

Trending activity

Do not use fixture dogs, sample Fan Scores, sample star ratings, or placeholder leaderboards as if they were live contest data.

Brand photography of real dogs is allowed when it is clearly campaign photography, not a fake contestant profile, vote count, or leaderboard row.

## 3. What this page must focus on

Contest invitation

300 dollar monthly prize

Verify.Dog customer eligibility

Simple explanation

Entry incentives

How to enter

Starter entry form

Video requirements

Written Verify.Dog review requirement

Contest rules

Calls to action

## 4. Visual direction

The approved visual direction is bright, light, clean, playful, and Hollywood inspired.

The page should feel fun and aspirational without looking childish or visually crowded.

Use:

White

Warm cream

Flat gold

Warm yellow

Light coral accents

Large dog photography

Generous whitespace

Simple flat icons

Clean typography

Simple calls to action

Do not use:

Black backgrounds

Dark theme sections

Gradients

Gradient buttons

Gradient text

Gradient icons

Glossy interface elements

Three dimensional bullets

Three dimensional icons

Fake activity

See DESIGN_SYSTEM.md for launch-state tokens.

## 5. Page structure

### 5.1 Header

Doggywood wordmark

Enter Doggywood

Contest rules link

Keep navigation short. Do not present Watch, Leaderboard, or Hall of Fame as if live social inventory exists.

### 5.2 Hero

Eyebrow:

THE INTERNET'S DOG STAR SEARCH

Headline:

HOLLYWOOD HAS STARS.
DOGGYWOOD HAS DOGS.

Supporting copy:

Give your dog their shot at fame. Share their story, win over the fans, and compete for 300 dollars every month.

Primary action:

Enter Doggywood

Supporting proof points, not fake stats:

300 Dollar Monthly Prize

Verified Verify.Dog Customers

Authenticated Fan Votes

Hero media:

Large dog photography

Do not use a fake featured contestant video card with invented votes.

The implemented September approved desktop hero supersedes earlier hero layout instructions in this spec, including any two-thirds / one-third or other width split. Do not change the current 46% / 54% grid, 520px height, rounded feature card, or `/brand/doggywood-mobile-hero.webp` crop to match older documentation.

### 5.3 Contest invitation

Explain Monthly Doggywood Star.

This is a calendar-month contest.

The eligible entry with the most valid authenticated upvotes during that month wins 300 dollars.

### 5.4 Eligibility

The first contest is open to verified Verify.Dog customers.

A registered Verify.Dog user who is not a customer may later vote, but cannot enter this launch contest.

Plain-language eligibility summary:

Verified Verify.Dog customer

Authenticate through Verify.Dog

One honest review

One vertical video under 59 seconds

### 5.5 How to enter

Simple numbered steps:

1. Authenticate through Verify.Dog.

2. Create your dog's profile.

3. Upload a vertical video under one minute.

4. Write an honest Verify.Dog review.

5. Submit for review.

6. Share your Premiere and ask fans to vote.

### 5.6 Video requirements

Vertical video

Preferred shape 9 by 16

Maximum duration 59 seconds

Dog or pet must be visible for a meaningful portion of the video

Entrant must have the right to submit the video and audio

### 5.7 Review requirement

Contestants must write an honest review of their Verify.Dog experience.

A positive review is not required.

The review will be publicly identified as part of a prize promotion.

### 5.8 Entry incentives

Give your dog a public stage.

Compete for 300 dollars every month.

Share a Premiere page fans can vote on.

Join the first Doggywood Casting Call.

### 5.9 Starter entry form

The landing page may include a starter entry form that begins the contest flow.

Starter fields:

Dog name

Breed or mix

Age

Category

ESA

PSD

Service Dog

Pet

Continue action:

Continue to Verify.Dog authentication and the rest of the entry flow

The starter form is an invitation, not a completed submission.

Do not collect a Doggywood password.

Do not collect a second mobile-login identity.

Video upload, eligibility confirmation, review, and terms happen in the later entry steps.

### 5.10 Contest rules

Link to official rules.

Short on-page summary:

Authenticated upvotes only

One valid vote per user per entry

No self voting

Entries are moderated before they appear publicly

Results are subject to fraud review

Sharing does not count as a vote

### 5.11 Final call to action

Enter Doggywood

Learn About Verify.Dog

## 6. Voting language on the launch page

Use:

VOTE FOR THIS DOG

Authenticated upvote

Do not describe five star ratings as the contest mechanic.

Decorative stars may appear in the wordmark or Hollywood styling.

## 7. Relationship to future homepage

After real approved entries exist, Doggywood can introduce the future social homepage.

That later page may include:

Watch

Official contest leaderboard

Hall of Fame

Dynamic rankings

Real dog profiles

Until then, `/` remains the launch landing page defined here.

## 8. Implementation boundary

Do not implement a fake social homepage to stand in for this page.

A later approved build phase should replace the Phase 01 fixture homepage with this launch landing page.

Do not implement authentication, voting, or contest submission as part of an architecture-only update.
