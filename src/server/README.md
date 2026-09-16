# Server-side application code

This directory is server-only. Do not import it from Client Components.

- `auth/` — identity mapping (`identity.ts`), session tokens, HttpOnly cookies, and session lifecycle
- `contact/` — contact-form anti-spam challenge and SendNow SMTP email forwarding
- `db.ts` — re-exports the shared Prisma client from `src/lib/db.ts`
- `repositories/` — Prisma data access helpers
- `services/` — current-contest lookup, session, and audit helpers
- `worker/` — reserved for later background jobs
- `entry.ts` — existing homepage prefill stub; not a contest workflow
