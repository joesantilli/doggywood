# Local development

Phase 01 runs entirely on this machine. Do not deploy to HostGator, change DNS, or configure production.

PostgreSQL runs in Docker. Application code does not hard-code Docker hostnames; it reads `DATABASE_URL`.

Identity is local only. Seeded users receive `IdentityProvider.LOCAL` records (`local_admin` and `local_sample_user`). Do not connect to Verify.Dog. See `docs/IDENTITY_ARCHITECTURE.md`.

## Startup

```bash
npm install
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

If this project is already using another port, keep that port in `APP_URL`. The intended local URL is `http://localhost:3001`.

Start Next.js on that port:

```bash
npx next dev -p 3001
```

or set the port in your usual `npm run dev` command.

## Database

`npm run db:up` starts PostgreSQL with Docker Compose.

Credentials for local development only:

- database: `doggywood`
- user: `doggywood`
- password: `doggywood_local_only`
- port: `5432`

Data is stored in the Docker volume `doggywood_pgdata`.

## Prisma

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

`npm run db:studio` opens Prisma Studio against the local database.

## Reset the local database

This drops local data, reapplies migrations, and re-seeds:

```bash
npm run db:reset
```

To remove the Docker volume as well:

```bash
npm run db:down
docker volume rm doggywood_doggywood_pgdata
npm run db:up
npm run db:migrate
npm run db:seed
```

## Environment

Copy `.env.example` to `.env.local` and `.env` (Prisma CLI reads `.env`).

Required:

- `DATABASE_URL`
- `APP_URL`
- `SESSION_SECRET`
- `SESSION_COOKIE_NAME`

Contact form messages are emailed to `joseph.santilli@petplatforms.com` using the same Resend setup as serviceanimallaw.com:

1. HTTPS API at `https://api.resend.com` first, with the API key in `SMTP_PASS` (starts with `re_`). This is preferred because HostGator often blocks outbound SMTP.
2. SMTP fallback to `smtp.resend.com:465` with username `resend` and that same API key as the password.

Also set:

- `CONTACT_TO_EMAIL`
- `SMTP_FROM` (must be a domain verified in Resend)
- `SMTP_PASS` (Resend API key)

Never commit `SESSION_SECRET` or `SMTP_PASS`.

## Checks

```bash
npm run typecheck
npm test
curl http://localhost:3001/api/health
```

A healthy response looks like:

```json
{ "status": "ok", "database": "ok" }
```

## Production

Production deployment is deliberately deferred. Later, the same application can run on a HostGator Snappy VPS by installing PostgreSQL, setting production environment variables, running Prisma migrations, and starting Next.js. No application rewrite should be required.
