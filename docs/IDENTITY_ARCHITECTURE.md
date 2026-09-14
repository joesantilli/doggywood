# Doggywood identity architecture

Doggywood is a public consumer brand and contest application.

Verify.Dog is the sponsor and the intended future master identity system for Doggywood and Verify.Dog.

Doggywood is not a permanently isolated authentication product. It also is not a section inside Verify.Dog.

This document is the source of truth for identity ownership. Phase 01 implements the data model and mapping abstraction only. Do not implement Verify.Dog single sign-on, OAuth, OpenID Connect, or a production Verify.Dog connection until a later approved phase.

## Ownership

### Verify.Dog

Master identity

Verified mobile number

Verified email address

Shared account profile

Potential shared dog profile

Authentication service

### Doggywood

Contest application

Contest periods

Entries

Videos

Votes

Rankings

Winners

Contest history

Public dog entry pages

Contestant console

These Doggywood records stay in the Doggywood database:

Contest

Entry

Vote

MediaAsset

Contest status

Vote status

Winner information

Contest history

Moderation records

Audit events

Do not move them into Verify.Dog.

Public Doggywood pages remain on doggywood.com. Do not redirect normal browsing to Verify.Dog.

## Application user versus identity provider

`User` is the Doggywood application user and local profile.

`AuthIdentity` links an external identity provider to that user.

```
AuthIdentity
  id
  userId
  provider          LOCAL | VERIFY_DOG
  providerSubject
  email             optional
  phoneE164         optional
  createdAt
  updatedAt
```

Unique constraint: `provider` + `providerSubject`

Index: `userId`

Contest, Entry, Vote, Dog, Session, and related records reference `User.id`.

They must not reference email addresses, phone numbers, or Verify.Dog identifiers directly.

Email and phone on `User` are cached contact fields for the local application profile. They are not the permanent identity key. Future Verify.Dog authentication may update those fields from the verified master profile.

A person can exist as a Doggywood `User` before, during, or after a provider identity is linked.

During local development, users have a `LOCAL` identity.

Later, Verify.Dog becomes the identity provider by creating a `VERIFY_DOG` `AuthIdentity` linked to the same Doggywood `User`.

## Dog records

`Dog` remains a Doggywood record.

`externalDogId` is an optional string for a future link to a Verify.Dog master dog profile.

It is not required. Phase 01 does not populate it. Not every Doggywood entrant will already have a Verify.Dog dog profile.

## Sessions

Doggywood keeps its own secure server session after identity verification.

The session cookie is host-only for the Doggywood origin. It stores an opaque random token. The server stores only a hash.

Sessions are bound to `User.id`.

Authentication logic must not be hard-coded around LOCAL credentials. Identity resolution lives in `src/server/auth/identity.ts`:

- `resolveIdentity`
- `findUserByExternalIdentity`
- `linkIdentityToUser`
- `createUserForIdentity`

Phase 01 implements these for `IdentityProvider.LOCAL`. The same functions accept `VERIFY_DOG` later without changing contest logic.

Do not add passwords, password hashes, password reset tables, or username login.

## Cookies and domains

`verify.dog` and `doggywood.com` are separate registrable domains.

Do not share browser cookies between them.

Future cross-site login must use a proper identity exchange such as OAuth 2, OpenID Connect, or another signed redirect-based authentication flow.

Do not implement that exchange in Phase 01.

## Future authentication flow

Documentation only. Not implemented in Phase 01.

1. User visits Doggywood.
2. User chooses Enter or Upvote.
3. Doggywood redirects to the Verify.Dog identity service.
4. Verify.Dog verifies the person.
5. Verify.Dog returns a signed authenticated identity.
6. Doggywood validates it.
7. Doggywood finds or creates the corresponding `User` through `AuthIdentity`.
8. Doggywood creates its own secure application session.
9. User returns to the requested Doggywood page.

Do not silently submit an entry or cast a vote because authentication succeeded.

## Local development

Local development stays completely local.

Seeded identities use `IdentityProvider.LOCAL`.

| User | providerSubject |
| --- | --- |
| `admin@doggywood.local` | `local_admin` |
| `user@doggywood.local` | `local_sample_user` |

Do not connect to Verify.Dog during local development.

## First-run contest page versus permanent homepage

The page currently rendered at `/` is the first-run contest landing experience. It is not the permanent long-term Doggywood homepage.

Do not design or build the permanent homepage in Phase 01.

There are no previous winners yet. Do not fabricate winner content.

The future permanent homepage may include:

Current contest

Current entries

Featured dogs

Previous monthly winner

Winner archive

Past contests

Watch and Vote

Contest navigation

Entry CTA

## Future routes

| Route | Purpose |
| --- | --- |
| `/` | Permanent Doggywood homepage in the future |
| `/contest` | Current monthly contest landing page |
| `/enter` | Contest entry flow |
| `/contact` | Contact Doggywood |
| `/watch` | Browse and vote |
| `/dog/[slug]` | Public contestant entry page |
| `/winners` | Winner archive |
| `/winners/[contestSlug]` | Individual contest results |
| `/rules` | Official Rules |
| `/account` | Contestant and voter console |
| `/admin` | Administration |

First launch may keep the first-run contest landing at `/` so existing URLs stay intact.

The first-run page is isolated as `FirstRunContestLanding` so it can later move to `/contest` without a full rewrite.

## Implementation boundary

Do not implement Verify.Dog SSO.

Do not implement OAuth or OpenID Connect.

Do not connect to the production Verify.Dog system.

Do not rebuild the current contest landing page design.
