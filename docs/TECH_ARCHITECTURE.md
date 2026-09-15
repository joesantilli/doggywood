# DOGGYWOOD TECHNICAL ARCHITECTURE

## 1. Architecture goals

The architecture must be:

Simple enough for a controlled first build.

Secure for authenticated voting and contest participation.

Able to support large video traffic without placing video processing load on HostGator.

Able to evolve from one Verify.Dog contest into a broader dog video network with multiple official competitions.

Able to keep official competitions, dynamic rankings, and celebrity statistics separate.

Auditable for voting, contest scoring, and moderation.

Portable so application hosting can change later without rewriting core product logic.

## 2. Core application stack

Framework:

Next.js App Router

Language:

TypeScript

User interface:

React

Styling:

Tailwind CSS v4

Validation:

Zod

Database:

PostgreSQL

ORM:

Prisma

Master identity:

Verify.Dog

Video infrastructure:

Cloudflare Stream

Image and user media storage:

Cloudflare R2

Application host:

HostGator

Doggywood must not use Twilio Verify as a second independent identity provider.

Verify.Dog owns mobile number, SMS verification, and trusted identity assertions.

## 3. Hosting principle

HostGator should host the application runtime and application assets that belong with the Next.js deployment.

User video files should not be uploaded to HostGator for processing or long term delivery.

The application should request a secure direct video upload session from Cloudflare Stream.

The browser uploads the video directly to the video provider.

Doggywood stores only the provider identifiers, metadata, status, and playback information in PostgreSQL.

This isolates the application host from video bandwidth and transcoding load.

## 4. Application structure

Recommended source organization:

src/app

src/components

src/features

src/lib

src/server

src/styles

src/types

prisma

docs

public

### 4.1 Feature domains

src/features/identity

src/features/users

src/features/dogs

src/features/videos

src/features/contests

src/features/entries

src/features/votes

src/features/rankings

src/features/awards

src/features/follows

src/features/favorites

src/features/shares

src/features/moderation

src/features/notifications

src/features/admin

Do not add a ratings feature domain. Official voting is an upvote.

## 5. Product states in routing

Launch State:

`/` is the launch landing page defined in LAUNCH_LANDING_PAGE_SPEC.md.

Future Social State:

`/` becomes the social discovery homepage after real approved content exists.

Do not ship fake contestant feeds on the launch page.

## 6. Route map

Public routes:

/

 /watch

 /watch/[video_id]

 /stars/[dog_slug]

 /leaderboard

 /hall_of_fame

 /rules

 /privacy

 /terms

Identity handoff routes:

 /auth

 /auth/callback

 /auth/return

Account routes:

 /account

 /account/profile

 /account/dogs

 /account/videos

 /account/favorites

 /account/following

 /account/notifications

Contest routes:

 /enter

 /enter/eligibility

 /enter/dog

 /enter/video

 /enter/review

 /enter/terms

 /enter/preview

 /enter/status

Administrative routes:

 /admin

 /admin/moderation

 /admin/contests

 /admin/entries

 /admin/users

 /admin/reports

 /admin/fraud

 /admin/audit

Launch State should not advertise Watch, Leaderboard, or Hall of Fame as live inventory before approved content exists.

## 7. API route map

Identity:

 /api/auth/start

 /api/auth/callback

 /api/auth/logout

Users:

 /api/users/me

 /api/users/profile

Dogs:

 /api/dogs

 /api/dogs/[dog_id]

Videos:

 /api/videos/upload_intent

 /api/videos/[video_id]/complete

 /api/videos/[video_id]/status

Entries:

 /api/entries

 /api/entries/[entry_id]

Votes:

 /api/votes

Follows:

 /api/follows

Favorites:

 /api/favorites

Shares:

 /api/shares/create

 /api/shares/visit

Reports:

 /api/reports

Contest:

 /api/contest/current

 /api/contest/leaderboard

Rankings:

 /api/rankings/[index_key]

Administration:

 /api/admin/moderation

 /api/admin/entries

 /api/admin/contests

 /api/admin/fraud

Do not create `/api/ratings`.

## 8. Identity architecture

See IDENTITY_ARCHITECTURE.md.

Doggywood is a relying application.

Verify.Dog is the master identity platform.

Doggywood references a person through a permanent Verify.Dog user identifier.

Doggywood must not create a separate independent authentication identity for the same person.

### 8.1 Start authentication

User attempts a privileged action such as Vote.

If unauthenticated, Doggywood starts a Verify.Dog authentication handoff.

Doggywood preserves the exact return path.

### 8.2 Return

Verify.Dog authenticates the user with mobile SMS verification.

Doggywood receives a trusted identity assertion.

Server validates the assertion.

Doggywood finds or creates the local User projection keyed by verify_dog_user_id.

Doggywood creates or refreshes a local ApplicationSession.

Doggywood returns the user to the exact page they came from.

### 8.3 Vote after return

If the original intent was to vote, Doggywood does not silently cast the vote.

The user must take an explicit vote action after return.

### 8.4 Authorization

Public launch content can be viewed without authentication.

Voting requires an authenticated registered Verify.Dog user who is voting eligible.

Following requires authentication.

Favorites require authentication.

Launch-contest submission requires an authenticated verified Verify.Dog customer who is contest-entry eligible.

Administration requires a Doggywood administrative role.

## 9. Video upload architecture

### 9.1 Upload intent

Authenticated contestant requests an upload intent.

Server confirms:

User is contest-entry eligible.

Contest is open.

Submission limit is not exceeded.

Dog belongs to user.

Server requests a direct upload URL from Cloudflare Stream.

Server creates a local video record with status Uploading.

Server returns upload URL and local video identifier.

### 9.2 Client upload

Browser uploads directly to Cloudflare Stream.

Application displays progress locally.

The video file does not pass through the Doggywood application server.

### 9.3 Processing

Video provider processes the upload.

Doggywood receives status through webhook or status polling.

Once ready:

Store playback identifier.

Store duration.

Store dimensions.

Validate duration no longer than 30 seconds.

Validate vertical orientation.

If invalid:

Mark video rejected for technical reason.

If valid:

Mark Ready.

### 9.4 Publication

Ready video is attached to a contest entry.

Entry is submitted for moderation.

Only approved entries are visible in public contest surfaces.

## 10. Voting architecture

Database must enforce one logical vote per user per entry.

A user cannot have more than one valid upvote for the same entry.

A contestant cannot vote for their own entry.

Every vote mutation creates an audit event.

Vote rows should support:

Status

Created timestamp

Updated timestamp

Invalidated timestamp

Invalidation reason

Fraud case reference

Official contest totals use only valid votes.

Do not store star values.

Do not let share count create votes.

## 11. Contest architecture

Official competitions use ContestCategory, ContestSeries, and Contest.

The primary launch contest is Monthly Doggywood Star.

Each Contest instance has configurable dates, prize, eligibility, status, winner rules, and tie rules.

Official winner calculation is server-side and versioned.

Monthly Doggywood Star version one:

Highest number of valid authenticated upvotes during the contest period.

Doggywood Dog of the Year is a separate annual Contest.

Annual voting starts from zero.

Monthly winners qualify automatically.

Future wildcard finalists may also qualify.

Do not reuse ranking scores as official contest scores.

Do not add share points to official vote totals.

## 12. Ranking architecture

RankingIndex and RankingSnapshot are discovery systems.

Approved indices include Trending Today, Trending This Week, Doggywood Hot 30, Fastest Riser, Most Shared, Most Watched, and Most Followed.

Hot 30 uses a rolling thirty day window.

Calculation methods are versioned and configurable.

See RANKING_ENGINE.md.

Rankings must not write ContestWinner records.

## 13. Sharing architecture

Each share event can create a unique share token.

Token fields:

Entry identifier

Sharing user identifier if authenticated

Created timestamp

Channel if known

Share visit endpoint records:

Token

Entry

Visitor session

Timestamp

Referrer where available

Registration conversion

Vote conversion

Follow conversion

Sharing is a growth mechanism.

Sharing does not itself count as a vote.

## 14. Celebrity statistics

DogCelebrityStats is a projection on the dog identity.

Examples:

Lifetime Valid Votes

Followers

Video Views

Shares

Contest Wins

Awards

Finalist Appearances

Published Videos

These statistics are independent of a single contest.

They must not determine the official monthly winner.

## 15. Moderation architecture

Only approved video entries are publicly discoverable.

Moderation queue should support:

Pending

Approved

Rejected

Flagged

Removed

Escalated

Moderator action requires:

Actor

Timestamp

Decision

Reason code

Optional note

Moderation actions create audit events.

## 16. Administrative permissions

Roles:

user

moderator

administrator

super_administrator

Permissions should be server checked.

Never rely only on hidden navigation or client state.

## 17. Security controls

Rate limit authentication handoff starts.

Rate limit votes.

Rate limit reports.

Use CSRF protection where applicable.

Use secure HTTP-only cookies for the local application session.

Validate all request bodies with Zod.

Validate ownership on every dog, video, and entry mutation.

Validate Verify.Dog identity assertions server side.

Never trust a client-supplied Verify.Dog user identifier as authentication.

Use signed provider webhooks.

Store secrets only in environment configuration.

Do not expose provider credentials to the browser.

Never trust client supplied contest totals.

Never trust client supplied video duration.

Never trust client supplied vote counts.

## 18. Audit requirements

Audit events should cover:

Authentication handoff success

Authentication assertion failure threshold events

Local session creation

Local session revocation

Dog creation

Video upload creation

Entry submission

Entry moderation

Vote creation

Vote invalidation

Eligibility state change

Contest opening

Contest closing

Contest close snapshot

Winner finalization

Administrative role change

Content removal

## 19. Analytics events

Track:

page_view

video_view_start

video_view_complete

auth_started

auth_completed

dog_created

upload_started

upload_completed

entry_submitted

entry_approved

entry_rejected

vote_started

vote_completed

follow_created

favorite_created

share_created

share_visit

share_auth_conversion

share_vote_conversion

leaderboard_view

ranking_view

verifydog_link_click

## 20. Environment variables

Application URL

Database URL

Local application session secret

Verify.Dog trusted application credentials

Verify.Dog identity assertion secret

Verify.Dog authentication start URL

Cloudflare account identifier

Cloudflare Stream credentials

Cloudflare R2 credentials

Cloudflare R2 bucket

Webhook secret

Administrative bootstrap identifier

Do not commit secrets.

Do not add Doggywood-owned Twilio Verify credentials.

## 21. Deployment environments

Development

Staging

Production

Each environment uses separate database and provider credentials.

Contest testing must never use production prize records.

## 22. Database migration discipline

All schema changes use Prisma migrations.

Do not manually change production database structure.

Every migration must be checked into source control.

The exact Prisma implementation of this revised data model belongs to a later approved build phase.

Phase 01 may retain its original Prisma foundation until that later phase replaces Rating and independent Doggywood auth tables.

## 23. Testing requirements

Unit tests:

Zod validation

Official vote uniqueness

No self voting

Eligibility rules

Contest state transitions

Video validation

Identity assertion validation

Ranking configuration versioning

Integration tests:

Verify.Dog authentication return-to-origin

Contest entry creation

Vote create and invalidation

Moderation approval

Official contest leaderboard

Share referral tracking

Authorization

Browser tests later:

Entry submission

Public vote

Return after authentication without silent vote

Admin moderation
