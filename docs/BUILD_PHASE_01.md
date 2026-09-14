# DOGGYWOOD BUILD PHASE 01

## Historical status

Phase 01 was completed as a project foundation phase.

Later approved architecture now supersedes these Phase 01 assumptions:

Verify.Dog is the master identity platform. Doggywood must not add independent Twilio Verify authentication.

Official contest voting is authenticated upvotes, not five star ratings.

The public `/` page is Launch State and must not display fake contestants, votes, leaderboards, or trending activity.

Do not use this file as current product behavior. Follow PRODUCT_SPEC.md, IDENTITY_ARCHITECTURE.md, DATA_MODEL.md, CONTEST_ENGINE.md, RANKING_ENGINE.md, LAUNCH_LANDING_PAGE_SPEC.md, DESIGN_SYSTEM.md, and WIREFRAMES.md.

This file remains as a record of the original foundation phase.

## Name

Project Foundation

## Objective

Create a clean, runnable Doggywood application foundation that matches the approved architecture without implementing the contest experience yet.

## Required outcome

A developer can run the project locally.

The application has the approved route skeleton.

The database connection and Prisma foundation exist.

The visual foundation exists.

The project has a basic health check.

No real SMS, video upload, contest scoring, or moderation workflow is implemented yet.

## 1. Create project structure

Required folders:

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

## 2. Install and configure

Next.js App Router

TypeScript

Tailwind CSS v4

Zod

Prisma

PostgreSQL client support

Testing framework consistent with the existing LoveDecision project where practical

## 3. Global application shell

Create:

Marketing header

Marketing footer

Base page container

Primary button

Secondary button

Section heading

Star rating display component in non interactive display mode only

Video placeholder card

Dog avatar component

Rank badge component

## 4. Global visual foundation

Implement colors from DESIGN_SYSTEM.md.

Use Inter.

Set consistent spacing.

Set accessible focus states.

Set responsive page widths.

## 5. Route placeholders

Create functional placeholder pages for:

/

 /watch

 /leaderboard

 /hall_of_fame

 /rules

 /privacy

 /terms

 /auth

 /account

 /enter

 /admin

Each page should clearly identify itself.

Do not implement final page design beyond the home page shell.

## 6. Homepage foundation

Implement the static homepage structure from WIREFRAMES.md with placeholder videos and placeholder dog data.

Sections:

Hero

Trending in Doggywood

This Month's Top Dogs

Think Your Dog Has Star Power

Doggywood Star of the Month

Powered by Real Dog Stories

No live database data in Phase 01.

Use local typed fixtures.

## 7. Domain types

Create initial shared types for:

UserRole

UserStatus

DogCategory

VideoStatus

ContestStatus

EntryStatus

RatingValue

ModerationStatus

Do not create business logic that belongs to later phases.

## 8. Prisma foundation

Create initial Prisma schema containing the core model names from DATA_MODEL.md.

Phase 01 may include only essential fields required to validate relational structure.

However, model names and relationships should not conflict with DATA_MODEL.md.

Create initial migration.

## 9. Environment validation

Create typed environment validation.

Required placeholders:

DATABASE_URL

SESSION_SECRET

NEXT_PUBLIC_APP_URL

Do not require Twilio or Cloudflare credentials until the phase that uses them.

## 10. Health route

Create:

 /api/health

Response should indicate:

Application running

Environment

Database connectivity status where appropriate

Do not reveal secrets.

## 11. Tests

Add tests for:

Environment validation

Basic domain enum validation

Homepage renders

Health route response shape

## 12. Documentation copy

Place the approved source of truth files into the repository docs folder.

Do not alter their product meaning.

## 13. Phase 01 exclusions

Do not implement:

Real authentication

Twilio Verify

Cloudflare Stream

Cloudflare R2

Video upload

Customer eligibility lookup

Contest entry flow

Rating mutation

Follow mutation

Favorites

Share tracking

Moderation queue behavior

Fraud detection

Notifications

Leaderboard calculation

Admin permissions

## 14. Phase completion standard

Phase 01 is complete only when:

Project builds.

Lint passes.

Type checking passes.

Tests pass.

Database migration is valid.

Homepage is responsive.

All placeholder routes load.

No Phase 02 or later behavior was implemented.

## 15. Completion report

Cursor must return:

Files created

Files modified

Files removed

Dependencies added

Migration name

Environment variables added

Tests created

Test results

Any deviations

Any unresolved issues

Recommended next phase
