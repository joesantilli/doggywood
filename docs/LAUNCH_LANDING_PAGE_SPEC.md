# DOGGYWOOD LAUNCH LANDING PAGE SPECIFICATION

## 1. Purpose

The initial Doggywood public page is a launch landing page.

Its job is to collect public monthly dog video contest entries.

Doggywood is a public dog entertainment and contest platform. It is not a Verify.Dog customer review program.

Verify.Dog customer status is not required.

A Verify.Dog review is not required.

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

Public contest invitation

500 dollar monthly prize

Simple explanation

How to enter

How voting works

Contained entry form

Video upload

Entry requirements

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

Everything from the top of the header through the bottom of the trust strip is frozen. Phase 02 work begins immediately below the trust strip.

### 5.3 About Doggywood

Section label: ABOUT DOGGYWOOD

Headline: A Monthly Contest for Dogs Who Deserve the Spotlight

Doggywood is a public monthly contest for dogs who deserve the spotlight.

Anyone who meets the contest eligibility rules may enter.

The eligible entry with the most valid authenticated upvotes wins 500 dollars.

### 5.4 Eligibility

The contest is open to the public.

Verify.Dog customer status is not required.

A Verify.Dog review is not required.

Do not reintroduce either requirement.

### 5.5 How to enter

Simple numbered steps:

1. Record your dog. 30 seconds or less.

2. Upload your vertical dog video.

3. Share with friends.

4. The eligible entry with the most valid authenticated upvotes wins 500 dollars.

### 5.6 How voting works

Informational only in Phase 02. Do not persist votes.

Only registered authenticated users may upvote.

One registered user may cast one valid upvote for each contest entry.

The eligible entry with the most valid authenticated upvotes at contest close wins 500 dollars.

Sharing helps discovery. Sharing itself is not a vote.

### 5.7 Video requirements

Vertical video preferred

Maximum duration 30 seconds

MP4, MOV, or WEBM

Maximum 500MB

Dog must be featured in the video

Original content

Entrant must have the right to submit the video and audio

Entry must comply with the Official Rules

### 5.8 Review requirement

Removed.

A Verify.Dog review is not part of the public contest.

### 5.9 Entry form

The entry form stays in its own body section below the trust strip.

Do not move it into the hero.

Do not make it full page width.

Use a centered contained form, approximately 860 to 900 pixels.

Fields:

First Name

Last Name

Email Address

Mobile Number

Dog’s Name

Optional Video Caption

Video Upload

Do not include Verify.Dog review, customer status, ESA, PSD, service dog, order, or purchase fields.

Phase 02 may validate the form on the client.

Do not create a persistent contest entry.

Do not claim the entry has been officially submitted.

Show: Your entry details are ready. Identity verification will be added in the next phase.

Authentication notice:

You will verify your email address or mobile number before your entry is accepted.

Do not implement email verification, Twilio, verification codes, or sessions in Phase 02.

Email verification codes will be delivered through the existing SendNow SMTP configuration. SMS verification will use Twilio.

### 5.10 Contest rules

Link to official rules.

Short on-page summary:

Authenticated upvotes only

One valid vote per user per entry

Most valid authenticated upvotes wins 500 dollars

Sharing does not count as a vote

### 5.11 Final call to action

Think Your Dog Has What It Takes?

Enter the Contest, scrolling to the entry form.

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
