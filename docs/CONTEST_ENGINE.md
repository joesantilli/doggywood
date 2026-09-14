# DOGGYWOOD CONTEST ENGINE

Official competitions are prize contests.

They are separate from dynamic rankings and celebrity statistics.

See RANKING_ENGINE.md for discovery rankings.

## 1. Primary launch contest

Name:

Monthly Doggywood Star

Cadence:

Calendar month

Prize:

300 dollars

Sponsor:

Verify.Dog

Eligibility to enter:

Verified Verify.Dog customer who is Doggywood Contest Entry Eligible

Eligibility to vote:

Registered Verify.Dog user who is Doggywood Voting Eligible

A public voter does not need to be a Verify.Dog customer.

Authentication:

Verify.Dog master identity through trusted application relationship

Entry:

One eligible dog video plus one honest Verify.Dog review

Official winner:

Eligible entry with the most valid authenticated upvotes during that calendar month

## 2. Multiple contest categories

The engine must not assume Doggywood has only one contest type.

Reusable category model:

ContestCategory

ContestSeries

Contest instance

Approved future categories:

Monthly Doggywood Star

Cutest Dog

Best Pet Trick

Best Story

Service Star

Rescue Star

Doggywood Dog of the Year

Do not implement all categories now.

Later categories must be addable without redesigning voting, eligibility, or winner finalization.

## 3. Contest configuration

Every contest instance must support configurable:

Start date

Entry close date

Voting close date

Prize

Eligibility

Contest status

Winner rules

Tie rules

Score version

Rules version

## 4. Contest states

Draft

Scheduled

Open

Voting Only

Closed

Finalized

Cancelled

Open:

Entries and voting are allowed.

Voting Only:

New entries are closed but approved entries can still receive votes.

Closed:

Votes no longer affect the contest.

Finalized:

Fraud review is complete and the winner is recorded.

## 5. Entry requirements

User must be authenticated through Verify.Dog.

User must be Doggywood Contest Entry Eligible for that contest.

User must meet the age and geographic requirements defined in the official rules.

Dog profile must be complete.

Video must pass technical validation.

Video must pass moderation.

For the launch contest, a Verify.Dog review must be present.

Terms and media permission must be accepted.

A contestant cannot vote for their own entry.

## 6. Official voting

The official voting action is:

VOTE FOR THIS DOG

This is an authenticated upvote.

Rules:

Each authenticated registered user may cast one valid upvote for each eligible contest entry.

A user cannot cast multiple valid upvotes for the same entry.

A contestant cannot vote for their own entry.

Administrative accounts do not count toward official scoring.

Invalidated votes do not count.

Votes must be server validated.

Every vote mutation creates an audit event.

Votes may be invalidated after fraud review.

Share count does not create votes.

Five star ratings are not official contest voting.

Star graphics may be decorative brand treatment only.

## 7. Official winner formula

Version one official formula for Monthly Doggywood Star:

Winner equals the eligible entry with the highest number of valid authenticated upvotes during the contest voting period.

The formula version must be stored on the contest.

Future contests may use a different published formula without changing historical results.

Do not use:

Fan Score

Sum of stars

Average star rating

Trending score

Hot 30 score

Fastest Riser score

Lifetime celebrity statistics

Year-to-date accumulated votes for the annual championship

## 8. Tie rules

Tie rules are configurable per contest.

Until a product owner publishes different official rules, the recommended monthly default is:

First:

Higher number of valid authenticated upvotes

Second:

Earlier approved publication timestamp

The official rules must publish the winner method and tie method used for that contest.

This default is a documentation recommendation where the product update required configurable tie rules but did not enumerate the monthly fallback order.

## 9. Annual Doggywood Champion

Doggywood Dog of the Year is a separate annual championship.

It is an official competition, not a ranking.

Recommended eligibility:

Monthly Doggywood Star winners qualify automatically.

Future wildcard finalists may also qualify.

Annual voting starts from zero.

Do not sum votes collected during the year.

The annual contest has:

Its own Contest instance

Its own voting period

Its own Vote rows

Its own ContestWinner record

## 10. Leaderboard display

An official contest leaderboard may show:

Rank

Dog name

Dog photo

Valid vote count

Recent official-rank movement

Contest status

Do not show hidden fraud signals.

Do not present a ranking index as the official contest leaderboard.

Do not show five-star averages as official standing.

## 11. Voting integrity

The system must support:

One valid vote per authenticated user per contest entry

No self voting

Vote auditing

Vote invalidation

Fraud review

Authentication based identity from Verify.Dog

Server calculated totals

Contest close snapshots

Final winner validation

Never trust a client-supplied vote total.

Never trust a client-supplied winner.

## 12. Anti abuse controls

Controls should include:

Verify.Dog authenticated voting

One logical vote per user per entry

Request rate limits

Device and session analysis

IP concentration analysis

Unusual vote velocity alerts

Repeated authentication pattern alerts

Share conversion anomaly detection

Manual fraud review

Ability to invalidate a vote

Ability to disqualify an entry

Audit logging

Do not automatically disqualify solely because users share heavily.

Sharing is expected behavior.

## 13. Fraud review before winner finalization

When voting closes:

Freeze public official-total changes.

Take a contest close snapshot of valid vote totals.

Run automated fraud signals.

Create review queue for suspicious entries and vote clusters.

Allow administrator to invalidate clearly ineligible activity.

Recalculate official totals from remaining valid votes.

Record the final snapshot.

Finalize winner.

Create ContestWinner record.

Do not silently alter historical totals after finalization.

## 14. Sharing incentives

Sharing should improve growth without directly purchasing contest position.

Shared visitors can authenticate and vote.

Track:

Share creation

Share visits

Registration conversion

Vote conversion

Follow conversion

Version one can award non-monetary Awards:

Premiere Promoter

100 Views

500 Views

1000 Views

50 Fans

100 Fans

Trending Star

Doggywood Celebrity

Referral based awards may use authenticated conversion counts.

These achievements do not add official votes.

## 15. Review disclosure

Every launch-contest review should have a visible disclosure that explains:

The customer submitted the review as part of a Doggywood prize promotion sponsored by Verify.Dog.

Contestants are asked for an honest review.

A positive review is not required.

This disclosure should remain attached to the review wherever the review is publicly displayed.

## 16. Entry limit

Version one recommendation:

One active contest entry per dog per monthly contest.

A user with more than one eligible dog may require administrative approval before multiple entries are permitted.

Keep this configurable in the Contest record.

## 17. Contest close behavior

At voting close:

Vote controls become disabled for the closed contest.

Historical valid vote counts remain viewable.

Public page states that voting is closed.

Official leaderboard can show provisional results until final fraud validation.

After finalization:

Winner is marked.

Hall of Fame record is created.

Prize status becomes administratively trackable.

## 18. Official rules dependency

The software must not hard code legal eligibility assumptions that cannot be changed.

The following must be configurable or documented per contest:

Age requirement

Geographic eligibility

Entry start

Entry close

Voting close

Prize value

Entry limits

Winner method

Tie method

Sponsor identity

Content rights

Disqualification rules

Prize fulfillment requirements
