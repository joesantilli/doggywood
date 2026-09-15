# DOGGYWOOD

Doggywood is Hollywood for dogs.

This folder is the source of truth for Doggywood.com.

The project is intentionally separated into product definition, identity architecture, technical architecture, data model, design system, contest logic, ranking logic, launch landing page specification, wireframes, Cursor rules, and build phases.

Cursor should not invent product behavior that conflicts with these documents.

Do not implement authentication, voting, contests, profiles, or video submission from an architecture update. Implement only the current approved build phase.

## Product thesis

Hollywood has stars. Doggywood has dogs.

Doggywood is a public monthly dog video contest and entertainment property. Dogs become the celebrities.

Verify.Dog is the sponsor and the intended future master identity platform. Doggywood does not create a separate independent authentication identity for the same person.

The first launch campaign is Monthly Doggywood Star, a public calendar-month contest.

Anyone who meets the contest eligibility rules may enter. Verify.Dog customer status is not required. A Verify.Dog review is not required.

Entrants upload a vertical video no longer than 30 seconds, share the entry, and collect valid authenticated upvotes.

The official monthly winner is the eligible entry with the highest number of valid authenticated upvotes during that calendar month.

The prize is 500 dollars.

## Core launch goals

1. Give dog owners a public stage for cute, funny, talented, or unforgettable dogs.

2. Collect real contest entries before showing a public social feed.

3. Make every entrant motivated to recruit viewers and votes through sharing.

4. Keep Doggywood an entertainment property, not a customer review program.

5. Preserve Verify.Dog as sponsor and future identity system without making customer status a contest requirement.

## Two product states

Launch State:

The public `/` page is an entry-focused landing page for the public monthly contest.

The implemented September approved desktop hero supersedes earlier headline and layout strings in this file for that page. Do not restore two-thirds / one-third hero proportions or the archive headlines below onto the live landing.

It must not display fake videos, contestants, votes, leaderboards, profiles, or trending activity.

Future Social State:

After real approved content exists, Doggywood becomes a social discovery experience with watches, votes, follows, rankings, and hall of fame.

These are separate product states. Do not mix them.

## Launch positioning

Primary headline:

HOLLYWOOD HAS STARS. DOGGYWOOD HAS DOGS.

Primary supporting line:

Give your dog their shot at fame. Share their story, win over the fans, and compete for 500 dollars every month.

Primary action:

Enter Doggywood

## Official voting

The official voting action is:

VOTE FOR THIS DOG

This is an authenticated upvote.

Star graphics may be used decoratively as part of the Hollywood brand.

Stars must not represent official contest voting.

Sharing is a growth mechanism. Sharing does not count as a vote.

## Build philosophy

The application should follow the same disciplined architecture used for LoveDecision.

The core application stack is:

Next.js App Router

TypeScript

React

Tailwind CSS v4

Zod

PostgreSQL

Prisma

Verify.Dog for master identity, mobile SMS authentication, customer status, and trusted identity assertions

Cloudflare Stream for video upload, processing, playback, and delivery

Cloudflare R2 for profile images, dog images, and static user media

HostGator hosts the Doggywood application.

Video media should not be stored directly on the HostGator application server.

Doggywood must not maintain duplicate mobile authentication credentials when Verify.Dog can provide the authenticated identity.

## Documents

PRODUCT_SPEC.md defines the product.

IDENTITY_ARCHITECTURE.md defines Verify.Dog as master identity and the Doggywood relying application relationship.

TECH_ARCHITECTURE.md defines the technical architecture.

DATA_MODEL.md defines persistent entities.

DESIGN_SYSTEM.md defines the visual language for launch and future social states.

CONTEST_ENGINE.md defines official competitions, upvotes, eligibility, fraud controls, and sharing.

RANKING_ENGINE.md defines discovery rankings that are not prize contests.

LAUNCH_LANDING_PAGE_SPEC.md defines the launch public page.

MODERATION_SPEC.md defines moderation requirements.

WIREFRAMES.md defines launch-state and future-social-state layouts.

CURSOR_RULES.md defines implementation rules.

BUILD_PHASE_01.md defines the completed first implementation phase.
