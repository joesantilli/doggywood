# DOGGYWOOD RANKING ENGINE

Dynamic rankings are discovery tools.

They are not official prize contests.

They are not celebrity statistics.

Do not use a ranking index to determine an official contest winner.

Do not implement ranking calculations until an approved build phase requires them.

## 1. Purpose

Doggywood needs ranking indices that help people discover dogs and entries.

Official prize winners are determined only by the published contest engine.

Celebrity statistics belong to the dog identity and persist independent of any one ranking window.

## 2. RankingIndex

A RankingIndex is a named, versioned, configurable discovery ranking.

Required properties:

Key

Name

Subject type, such as dog or entry

Window type

Calculation version

Configuration

Active flag

Approved ranking types:

Trending Today

Trending This Week

Doggywood Hot 30

Fastest Riser

Most Shared

Most Watched

Most Followed

## 3. RankingSnapshot

A RankingSnapshot stores a point-in-time result for one RankingIndex.

Required properties:

Ranking index

Calculation version

Window start

Window end

Captured at

Ordered results

Snapshots make rankings auditable and replayable without becoming ContestWinner records.

## 4. Trending Today

Window:

Current calendar day or a rolling twenty-four hour window, stored in the index configuration.

Purpose:

Show what is getting attention now.

This is not the official monthly contest standing.

## 5. Trending This Week

Window:

Current calendar week or a rolling seven day window, stored in the index configuration.

Purpose:

Show recent discovery momentum over a short period.

This is not the official monthly contest standing.

## 6. Doggywood Hot 30

Doggywood Hot 30 represents activity during a rolling thirty day period.

The date window moves continuously.

It is separate from the calendar month contest.

The calculation method should be versioned and configurable.

Do not hard code the calculation permanently.

Hot 30 must not be used as the Monthly Doggywood Star winner formula.

## 7. Fastest Riser

Fastest Riser measures momentum.

It should identify dogs or entries whose ranking or engagement is increasing unusually quickly over a defined comparison period.

Possible later signals:

Vote growth

Rank movement

View growth

Follower growth

Share growth

The precise algorithm will be defined in a later phase.

This document creates the architectural concept only.

## 8. Most Shared

Ranks by share and share-visit activity in the configured window.

Sharing remains a growth mechanism.

Most Shared does not create official contest votes.

## 9. Most Watched

Ranks by video view activity in the configured window.

## 10. Most Followed

Ranks by follow activity or current follower count according to the index configuration.

Follower count as a celebrity statistic is separate from this ranking window.

## 11. Calculation rules

Ranking formulas must be:

Server calculated

Versioned

Configurable

Reproducible from snapshots

A new calculation version must not silently rewrite historical snapshots.

Do not mix official contest close snapshots with ranking snapshots.

## 12. Display rules

A ranking surface must identify itself as a discovery ranking.

Do not label Hot 30, Trending, or Fastest Riser as Star of the Month.

Do not show ranking position as proof of prize eligibility.

If a ranking uses votes as a signal, those votes remain votes. The ranking is still not the official contest.

## 13. Implementation boundary

Do not implement ranking jobs, snapshots, or public ranking pages until the approved build phase that requires them.
