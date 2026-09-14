# DOGGYWOOD DATA MODEL

This document defines persistent concepts for later approved build phases.

Identity ownership, `AuthIdentity`, sessions, and the first-run versus permanent homepage split are defined in IDENTITY_ARCHITECTURE.md. That document supersedes earlier identity notes in this file.

The exact Prisma implementation can come in a later approved build phase.

Do not implement these models as application behavior until the current build phase requires them.

Official competitions, dynamic rankings, and celebrity statistics must remain separate entities.

## 1. User

Purpose:

Doggywood application user and local profile.

This is not the master identity authority. `User.id` is Doggywood's internal application identifier.

Email and phone are cached contact fields. They are not the permanent identity key. Future Verify.Dog authentication may update them from the verified master profile.

Fields implemented in Phase 01:

id

role

first_name

last_name

email

email_verified_at

phone_e164

phone_verified_at

created_at

updated_at

Do not store passwords, password hashes, SMS secrets, or a second login identity that replaces Verify.Dog.

Administrative roles are Doggywood application permissions.

## 2. AuthIdentity

Purpose:

Link an identity provider to a Doggywood User.

Provider values:

LOCAL

VERIFY_DOG

Fields:

id

user_id

provider

provider_subject

email

phone_e164

created_at

updated_at

`provider` plus `provider_subject` is unique.

Contest, Entry, Vote, Dog, and Session records reference `User.id`, not provider subjects.

During local development, seeded users have a LOCAL identity. Later, a VERIFY_DOG identity can be linked to the same User.

IdentityAssertion records for signed Verify.Dog handoffs are a later-phase concern. They are not implemented in Phase 01.

## 3. ApplicationSession

Purpose:

Local Doggywood session bound to `User.id` after identity resolution.

This is not master authentication.

The session cookie is host-only on the Doggywood origin. Do not share cookies with verify.dog.

Fields:

id

user_id

token_hash

created_at

last_seen_at

expires_at

user_agent

ip_address

## 4. VerifyDogEligibilitySnapshot

Purpose:

Audit-safe cache of contest-entry eligibility derived from Verify.Dog.

This is not a second customer database.

Eligibility is associated with the Doggywood User. Do not store a Verify.Dog identifier on contest records.

Fields:

id

user_id

status

provider_type

provider_reference

evidence_json

created_at

updated_at

verified_at

reviewed_by_user_id

review_note

Status values:

unknown

eligible

manual_review

ineligible

revoked

## 5. Dog

Purpose:

Public dog identity owned by Doggywood.

Fields:

id

owner_user_id

external_dog_id

slug

name

profile_image_key

breed

age_text

category

bio

status

created_at

updated_at

external_dog_id is optional. It exists so a Doggywood dog can later link to a Verify.Dog master dog profile. It is not required and is not populated in Phase 01.

Category values:

esa

psd

service_dog

pet

Status values:

draft

active

hidden

removed

## 6. DogCelebrityStats

Purpose:

Permanent Doggywood statistics independent of a single contest.

This is a celebrity-statistics projection, not an official contest score and not a ranking index.

Fields:

id

dog_id

lifetime_valid_votes

follower_count

video_view_count

share_count

contest_win_count

award_count

finalist_appearance_count

published_video_count

updated_at

These values may be maintained as derived totals. They must not be used as the official monthly winner formula.

## 7. Video

Purpose:

Video media record owned by Doggywood.

Fields:

id

owner_user_id

dog_id

provider

provider_video_id

playback_id

status

duration_seconds

width

height

aspect_ratio

thumbnail_url

created_at

updated_at

ready_at

Status values:

draft

uploading

processing

ready

technical_reject

removed

## 8. ContestCategory

Purpose:

Reusable contest type that can be used across many contest instances.

Approved category keys:

monthly_doggywood_star

cutest_dog

best_pet_trick

best_story

service_star

rescue_star

doggywood_dog_of_the_year

Fields:

id

key

name

description

cadence

eligibility_policy

active

created_at

updated_at

Cadence examples:

monthly

annual

campaign

The data model must not assume Doggywood has only one contest type.

## 9. ContestSeries

Purpose:

Repeating official competition program, such as Monthly Doggywood Star.

Fields:

id

contest_category_id

slug

name

sponsor_name

prize_policy_json

eligibility_policy_json

winner_rules_json

tie_rules_json

active

created_at

updated_at

A series produces Contest instances. It is not itself a ranking index.

## 10. Contest

Purpose:

One official competition instance with its own dates, prize, eligibility, and winner rules.

Fields:

id

contest_series_id

contest_category_id

slug

name

sponsor_name

starts_at

entry_closes_at

voting_closes_at

status

prize_amount_cents

currency

eligibility_policy_json

winner_rules_json

tie_rules_json

score_version

rules_version

created_at

updated_at

finalized_at

Status values:

draft

scheduled

open

voting_only

closed

finalized

cancelled

Configurable per contest:

Start date

Entry close date

Voting close date

Prize

Eligibility

Contest status

Winner rules

Tie rules

For Monthly Doggywood Star, the contest period is a calendar month.

For Doggywood Dog of the Year, the contest is annual, voting starts from zero, and monthly winners qualify automatically. Future wildcard finalists may also qualify.

## 11. Entry

Purpose:

Joins a dog, video, and optional required review to one official contest instance.

Fields:

id

contest_id

user_id

dog_id

video_id

caption

status

submitted_at

approved_at

rejected_at

removed_at

moderation_reason

published_at

final_valid_vote_count

is_winner

Status values:

draft

submitted

pending_moderation

approved

rejected

removed

winner

Do not store five-star averages or Fan Score on Entry.

## 12. Review

Purpose:

Contest-required Verify.Dog review for the launch contest.

Fields:

id

entry_id

user_id

review_text

disclosure_version

created_at

updated_at

The public display should make the contest incentive disclosure visible near the review.

## 13. Vote

Purpose:

Authenticated upvote for an official contest entry.

The official voting action is VOTE FOR THIS DOG.

Fields:

id

contest_id

entry_id

user_id

status

created_at

updated_at

invalidated_at

invalidation_reason

fraud_case_id

Status values:

valid

flagged

invalid

Database uniqueness:

One logical vote per user_id and entry_id.

A user cannot have more than one valid vote for the same entry.

A contestant cannot vote for their own entry.

Share count must not create Vote rows.

There is no stars field.

## 14. Follow

Purpose:

Fan follows a dog.

Fields:

id

user_id

dog_id

created_at

Database uniqueness:

One follow per user_id and dog_id.

## 15. Favorite

Purpose:

User saves a video.

Fields:

id

user_id

video_id

created_at

Database uniqueness:

One favorite per user_id and video_id.

## 16. Share

Purpose:

Tracks a share action and referral token.

Sharing is a growth mechanism, not a vote.

Fields:

id

entry_id

shared_by_user_id

token

channel

created_at

## 17. ShareVisit

Purpose:

Tracks traffic produced by a share.

Fields:

id

share_id

entry_id

visitor_session_id

visited_at

referrer

became_user_id

voted_at

followed_at

Track:

Share creation

Share visits

Registration conversion

Vote conversion

Follow conversion

## 18. VideoView

Purpose:

Basic video analytics.

Fields:

id

video_id

entry_id

user_id

anonymous_session_id

started_at

completed_at

watch_seconds

source

share_id

## 19. RankingIndex

Purpose:

Configurable discovery ranking definition.

Rankings do not automatically determine a prize winner.

Approved types:

trending_today

trending_this_week

hot_30

fastest_riser

most_shared

most_watched

most_followed

Fields:

id

key

name

subject_type

window_type

calculation_version

config_json

active

created_at

updated_at

Subject type examples:

dog

entry

Window type examples:

calendar_day

calendar_week

rolling_thirty_day

comparison_period

The calculation method must be versioned and configurable. Do not hard code it permanently.

## 20. RankingSnapshot

Purpose:

Point-in-time result of a ranking index.

Fields:

id

ranking_index_id

calculation_version

window_starts_at

window_ends_at

captured_at

results_json

A snapshot is historical discovery data. It is not a ContestWinner record.

## 21. Award

Purpose:

Non-prize recognition attached to a dog or user.

Examples:

Share-growth badges

Finalist appearances that are not the official winner

Special recognition that is not a ranking and not a contest payout

Fields:

id

dog_id

user_id

award_key

contest_id

granted_at

metadata_json

Awards must not be treated as official contest votes.

## 22. Report

Purpose:

Public abuse report.

Fields:

id

reported_by_user_id

entry_id

video_id

reason_code

details

status

created_at

resolved_at

resolved_by_user_id

resolution_note

Status values:

open

reviewing

resolved

dismissed

## 23. ModerationCase

Purpose:

Moderator review of contest content.

Fields:

id

entry_id

status

assigned_to_user_id

created_at

updated_at

decision_at

decision_by_user_id

reason_code

note

Status values:

pending

approved

rejected

escalated

removed

## 24. FraudCase

Purpose:

Tracks suspicious contest or voting activity.

Fields:

id

contest_id

entry_id

user_id

status

reason_code

signal_json

created_at

updated_at

resolved_at

resolved_by_user_id

resolution_note

Status values:

open

reviewing

cleared

confirmed

## 25. Notification

Purpose:

In-product notification.

Fields:

id

user_id

type

title

body

link_path

read_at

created_at

## 26. ContestWinner

Purpose:

Permanent finalized official contest winner record.

Fields:

id

contest_id

entry_id

user_id

dog_id

video_id

prize_amount_cents

currency

valid_vote_count

finalized_at

paid_at

payment_reference

Do not store star averages or Fan Score.

Only one ContestWinner should exist for a finalized single-winner contest instance.

Annual championship winners are separate ContestWinner rows on the annual Contest.

## 27. AuditEvent

Purpose:

Immutable record of sensitive state changes.

Fields:

id

actor_user_id

event_type

entity_type

entity_id

metadata_json

created_at

ip_hash

## 28. Important database constraints

A User is keyed by Doggywood `User.id`. External providers map through AuthIdentity. `provider` plus `provider_subject` is unique.

A Video belongs to one owner and one dog.

An Entry belongs to one Contest.

An Entry references one Video.

A launch-contest Entry references one Review.

A Vote references one approved Entry.

A user cannot have more than one valid vote for the same Entry.

A user cannot vote for their own Entry.

A user cannot follow the same Dog more than once.

A user cannot favorite the same Video more than once.

Share rows do not create Vote rows.

RankingSnapshot rows do not create ContestWinner rows.

DogCelebrityStats totals do not determine official contest winners.

Historical final_valid_vote_count should not be recalculated after winner finalization unless an administrator performs a documented correction with an audit event.

## 29. Removed concepts

Do not continue Rating as the official contest scoring entity.

Do not continue Fan Score.

Do not continue one-to-five-star contest voting.

Do not continue Doggywood-owned AuthAttempt SMS credential records as master identity.

UserSession as an independent Doggywood identity provider is replaced by ApplicationSession bound to User.id after AuthIdentity resolution.
