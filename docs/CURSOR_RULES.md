# DOGGYWOOD CURSOR RULES

## 1. Source of truth

The docs folder controls product behavior.

When code and documentation conflict, stop and report the conflict.

Do not silently choose a new behavior.

Read IDENTITY_ARCHITECTURE.md, CONTEST_ENGINE.md, RANKING_ENGINE.md, and LAUNCH_LANDING_PAGE_SPEC.md before implementing identity, voting, contests, rankings, or the public homepage.

## 2. Product scope

Implement only the current build phase.

Do not build future phases early.

Do not add social features that are not in the specification.

Do not add comments, direct messages, creator monetization, advertising, or live video unless a later phase explicitly requires them.

Do not implement authentication, voting, contests, profiles, or video submission from an architecture-only update.

## 3. Stack

Use:

Next.js App Router

TypeScript

React

Tailwind CSS v4

Zod

PostgreSQL

Prisma

Do not replace the stack without explicit approval.

## 4. TypeScript

Use strict TypeScript.

Do not use any unless there is a documented unavoidable reason.

Prefer explicit domain types.

Keep server only types separate where useful.

## 5. Validation

All user controlled inputs must be validated with Zod at the server boundary.

Client validation is helpful but never sufficient.

## 6. Security

Never trust client supplied user identifiers.

Never trust a client supplied Verify.Dog user identifier as proof of authentication.

Never trust client supplied contest totals.

Never trust client supplied ownership.

Never expose private provider credentials to the client.

All privileged actions require server authorization.

All administrative actions require role validation.

## 7. Identity

Verify.Dog is the master identity platform.

Doggywood must not create a separate independent authentication identity for the same person.

Use the trusted application relationship in IDENTITY_ARCHITECTURE.md.

Do not add password authentication.

Do not add social login in version one.

Do not add Doggywood-owned Twilio Verify as a second identity provider.

Do not store duplicate mobile authentication credentials.

Authentication logic must be isolated from presentation components.

After authentication, return the user to the exact Doggywood page they came from.

Do not silently cast a vote because authentication succeeded.

## 8. Video

Do not send raw user video through the Doggywood application server.

Use direct provider upload architecture.

Do not mark video ready based only on client state.

Use provider status.

## 9. Database

Use Prisma migrations.

Do not change production schema manually.

Use database uniqueness constraints for critical integrity rules.

Examples:

One valid vote per user per entry.

No self voting.

One follow per user per dog.

One favorite per user per video.

Do not let share rows create vote rows.

Keep official competitions, dynamic rankings, and celebrity statistics in separate models.

## 10. Contest logic

Official vote totals must be calculated on the server.

Contest score implementation must be versioned.

The official launch contest uses authenticated upvotes, not five star ratings.

Do not reuse trending, Hot 30, or Fastest Riser as official contest score.

Do not add share points to official vote totals.

Do not total year-long votes to decide Doggywood Dog of the Year.

Annual championship voting starts from zero.

## 11. Launch page

The current public `/` page is Launch State.

Do not display fake videos, contestants, ratings, votes, leaderboards, profiles, or trending activity.

Follow LAUNCH_LANDING_PAGE_SPEC.md and the Launch State wireframes.

Future Social State homepage wireframes are later work.

## 12. Visual system

Follow DESIGN_SYSTEM.md.

Use Inter.

For Launch State, use the bright light palette.

Do not use black backgrounds, dark theme sections, gradients, gradient buttons, gradient text, glossy interface elements, or three dimensional icons on the launch landing page.

Star graphics may be decorative Hollywood branding only.

Stars must not represent official contest voting.

## 13. Moderation

No submitted contest entry becomes publicly discoverable before approval.

Moderation actions must create audit records.

## 14. Components

Create reusable components only after a real repeated pattern exists.

Do not build a large speculative component library.

Prefer feature ownership of feature specific components.

## 15. Accessibility

All interactive controls must have accessible labels.

All form fields need labels.

Keyboard navigation must work.

Focus states must be visible.

Do not rely on color alone to communicate voted state.

## 16. Error handling

Show recoverable user facing errors.

Log server errors with context.

Do not expose secrets or provider response details to the user.

## 17. Testing

Each build phase must include tests for its core domain behavior.

Do not declare a phase complete if tests fail.

## 18. Completion report

At the end of each Cursor phase report:

Files created

Files modified

Files removed

Dependencies added

Database migrations created

Environment variables added

Tests added

Tests passed

Known deviations

Open issues

Exact next recommended phase

## 19. Mobile presentation order

On viewports below `lg` (max-width 1023px), stacked page and section content must appear as:

Headline, then image, then body/text content, then CTA button.

Skip a slot if that block does not exist. Desktop overlay and two-column layouts may stay. Source order should match the mobile visual order. Do not use `order` alone when the DOM can be structured correctly.

This applies to every public page going forward, including the homepage hero, about, and closing CTA.

## 20. No invented product decisions

If a required product behavior is missing from the documents and implementation cannot reasonably proceed without it:

Report the missing decision.

Do not quietly invent it.

For trivial implementation details that do not affect product behavior, use conventional engineering judgment.

## 21. Approved desktop hero freeze

The implemented September approved desktop hero is the source of truth.

It supersedes earlier hero layout specifications, including two-thirds / one-third.

Everything from the top of the header through the bottom of the trust strip is frozen.

Do not modify `.dw-hero`, `.dw-hero-desktop`, `.dw-hero-photo-viewport`, `.dw-hero-photo-card`, `.dw-hero-photo`, `.dw-hero-inner`, `.dw-hero-copy`, `LaunchHeader`, or the trust strip unless the product owner explicitly names that area.

Future implementation work begins below the trust strip.

See `.cursor/rules/approved-hero-freeze.mdc`.
