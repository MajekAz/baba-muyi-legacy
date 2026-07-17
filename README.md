# Baba Muyi Legacy

A Next.js App Router foundation for the public `babamuyilegacy.com` flagship archive, now being evolved into the reusable commercial digital legacy SaaS platform called **LegacyHub**.

The public website should continue using **Baba Muyi Legacy**. The reusable product, administrative system, documentation, and future commercial SaaS should use **LegacyHub**.

Brand architecture:

- **LegacyHub** is the commercial digital legacy platform.
- **Baba Muyi Legacy** is the first workspace, first legacy profile, and flagship public archive powered by LegacyHub.
- Public archive pages keep Baba Muyi Legacy as the primary brand.
- Admin and authentication pages use LegacyHub with the tagline **Preserving Legacies. Connecting Generations.**
- The public footer may show a subtle **Powered by LegacyHub** relationship without enabling public registration.

## Release Status

**LegacyHub v0.1.0 - Foundation Complete** establishes the commercial SaaS foundation while preserving Baba Muyi Legacy as the flagship public archive.

Verified release foundation:

- Full Next.js application source is present at the repository root for GitHub and Hostinger.
- Supabase migrations `0001` through `0005` are versioned and applied to the linked Supabase project.
- Live Supabase database types are generated in `lib/database.types.ts`.
- Owner bootstrap is idempotent through `pnpm bootstrap:owner`.
- Required storage buckets are present in Supabase Storage.
- Local validation passes: lint, TypeScript check, and production build.

## Current Phase

This first implementation creates the application foundation and is being refactored into a commercial multi-user SaaS:

- Next.js App Router with TypeScript strict mode and Tailwind CSS
- Public museum-style routes for biography, timeline, documentaries, gallery, family tree, tributes, blog, contact, legal pages, and waiting list
- Protected admin route shell with server-side role check
- Supabase client/server helpers
- Zod validation for public tribute and waiting-list forms
- Health-check route at `/api/health`
- Supabase schema, storage buckets, seed profile, and RLS policies in versioned migrations under `supabase/migrations/`
- Hostinger-oriented deployment notes
- Workspace-aware local CMS fallback for development
- Versioned Supabase migrations for workspace tenancy and Baba Muyi seed data
- LegacyHub-branded admin/auth surfaces with Baba Muyi workspace and legacy-profile context
- Minimal noindex `/legacyhub` future platform route shell
- Data-driven public navigation grouped into His Story, Transport Legacy, Media, Legacy, and About menus
- Workspace-scoped media library foundations for uploads, albums, archival versions, metadata, and public gallery/archive reads
- Dedicated LegacyHub administration shell that keeps public Baba Muyi archive navigation out of authenticated admin routes

## LegacyHub Planning Documents

This repository now includes a planning and architecture milestone for LegacyHub:

```text
docs/LEGACYHUB_GLOSSARY.md
docs/LEGACYHUB_PRD.md
docs/LEGACYHUB_ARCHITECTURE.md
docs/LEGACYHUB_DATA_MODEL.md
docs/LEGACYHUB_SECURITY_AND_PRIVACY.md
docs/LEGACYHUB_MONETISATION.md
docs/LEGACYHUB_ROADMAP.md
docs/DEVELOPMENT_WORKFLOW.md
docs/LEGACYHUB_BRAND_ARCHITECTURE.md
docs/LEGACYHUB_IMPLEMENTATION_STATUS.md
docs/PRODUCT_DECISIONS.md
docs/ADMIN_UX_GUIDE.md
docs/MEDIA_LIBRARY_GUIDE.md
docs/ARCHIVAL_MEDIA_POLICY.md
docs/MEDIA_PERMISSION_MATRIX.md
```

The product hierarchy is:

```text
LegacyHub Platform
-> Workspace
-> Legacy Profile
-> Legacy Content
```

The Baba Muyi Family Archive is the first workspace. Alhaji Tioluwalase "Baba Muyi" Majekodunmi is the first legacy profile and flagship demonstration.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm typecheck
pnpm bootstrap:owner
pnpm test:admin-polish
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
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
LEGACYHUB_ENABLE_LOCAL_FALLBACK=false
LEGACYHUB_OWNER_EMAIL=
LEGACYHUB_OWNER_PASSWORD=
LEGACYHUB_OWNER_NAME=
LEGACYHUB_WORKSPACE_SLUG=baba-muyi-family-archive
LEGACYHUB_WORKSPACE_NAME=Baba Muyi Family Archive
LEGACYHUB_LEGACY_PROFILE_SLUG=baba-muyi
LEGACYHUB_LEGACY_PROFILE_DISPLAY_NAME=Baba Muyi
LEGACYHUB_LEGACY_PROFILE_FULL_NAME=
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

Hostinger requires the GitHub repository root to contain `package.json` and the Next.js `app/` directory. If GitHub only shows `PROJECT_AUDIT.md` and `package.json`, the complete local app has not been pushed yet and Hostinger will fail with a missing `app` directory error.

## Supabase Setup

See `SUPABASE_SETUP.md`.

The versioned migrations are:

```text
supabase/migrations/0001_initial_foundation.sql
supabase/migrations/0002_cms_enum_additions.sql
supabase/migrations/0003_cms_access_media_documentary_menu.sql
supabase/migrations/0004_workspace_saas_foundation.sql
supabase/migrations/0005_required_storage_buckets.sql
```

For v0.1.0, these migrations have been applied to the linked Supabase project. Do not edit applied migrations; add a new migration for future schema changes.

## SaaS Architecture

See `SAAS_ARCHITECTURE.md` and `PERMISSIONS.md`.

The production hierarchy is `User -> Workspace -> Workspace Membership -> Legacy Profile -> Legacy Content`.

## Hostinger Deployment

See `DEPLOYMENT_HOSTINGER.md`.

## LegacyHub Platform Landing Page

The `/legacyhub` route is the Phase 2 platform landing page for LegacyHub. It is separate from the Baba Muyi Legacy public archive chrome and remains `noindex` until launch approval.

- LegacyHub is the commercial digital legacy platform.
- Baba Muyi Legacy remains the flagship public archive.
- The early-access form is a reviewed interest workflow stored in Supabase `waiting_list`.
- Public registration, billing, self-service onboarding, automatic workspace creation, family-tree functionality, and AI features are not enabled.

See `docs/LEGACYHUB_PHASE_2_LANDING_PAGE.md`.

## Local Setup

See `SETUP.md`.

## Dependency Purpose

- `@supabase/supabase-js`: browser/server database, auth, and storage access.
- `@supabase/ssr`: secure cookie-aware Supabase helpers for App Router server components and middleware.
- `zod`: request and form validation.
- `react-hook-form` and `@hookform/resolvers`: accessible client forms with Zod validation.
- `lucide-react`: consistent accessible icons.
- `clsx`: small conditional className helper.
