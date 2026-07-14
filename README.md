# Baba Muyi Legacy

A production-ready Next.js App Router foundation for `babamuyilegacy.com`, built as a reusable digital legacy-profile system with Supabase Auth, PostgreSQL, Storage, and Row Level Security.

## Current Phase

This first implementation creates the application foundation and is being refactored into a commercial multi-user SaaS:

- Next.js App Router with TypeScript strict mode and Tailwind CSS
- Public museum-style routes for biography, timeline, documentaries, gallery, family tree, tributes, blog, contact, legal pages, and waiting list
- Protected admin route shell with server-side role check
- Supabase client/server helpers
- Zod validation for public tribute and waiting-list forms
- Health-check route at `/api/health`
- Supabase schema, storage buckets, seed profile, and RLS policies in `supabase/schema.sql`
- Hostinger-oriented deployment notes
- Workspace-aware local CMS fallback for development
- Versioned Supabase migrations for workspace tenancy and Baba Muyi seed data

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm typecheck
```

Production build command:

```bash
pnpm build
```

Production start command:

```bash
pnpm start
```

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_SITE_URL=https://babamuyilegacy.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to client components. Use it only in server-only code for trusted administrative tasks.

## Hostinger Node.js Web App Notes

Use Node.js hosting, not static export.

- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Start command: `pnpm start`
- App root: this `baba-muyi-legacy` directory
- Public URL: `https://babamuyilegacy.com`
- Required environment variables: see `.env.example`
- Health check: `/api/health`

## Supabase Setup

See `SUPABASE_SETUP.md`.

The versioned migrations are:

```text
supabase/migrations/0001_initial_foundation.sql
supabase/migrations/0002_cms_access_media_documentary_menu.sql
supabase/migrations/0003_workspace_saas_foundation.sql
```

Do not claim remote migrations are applied until this SQL has been run against a real Supabase project.

## SaaS Architecture

See `SAAS_ARCHITECTURE.md` and `PERMISSIONS.md`.

The production hierarchy is `User -> Workspace -> Workspace Membership -> Legacy Profile -> Legacy Content`.

## Hostinger Deployment

See `DEPLOYMENT_HOSTINGER.md`.

## Local Setup

See `SETUP.md`.

## Dependency Purpose

- `@supabase/supabase-js`: browser/server database, auth, and storage access.
- `@supabase/ssr`: secure cookie-aware Supabase helpers for App Router server components and middleware.
- `zod`: request and form validation.
- `react-hook-form` and `@hookform/resolvers`: accessible client forms with Zod validation.
- `lucide-react`: consistent accessible icons.
- `clsx`: small conditional className helper.
