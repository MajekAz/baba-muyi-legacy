# LegacyHub v0.1.0

Foundation Complete

Release date: 2026-07-15

## Overview

LegacyHub v0.1.0 completes the foundation release for the reusable commercial digital legacy platform, with Baba Muyi Legacy as the flagship archive and first implementation. This release is a stabilization and release-preparation milestone, not a new feature milestone.

## Completed Milestones

- LegacyHub product and architecture documentation created.
- Next.js App Router application foundation completed.
- Public Baba Muyi Legacy route structure established.
- Protected administration shell established.
- Supabase browser, server, middleware, and service-role workflows established.
- Versioned Supabase migrations applied through `0005`.
- Owner bootstrap process created and verified as idempotent.
- Required Supabase Storage buckets verified.
- Live database TypeScript types generated.
- Hostinger deployment documentation prepared.

## Architecture Summary

The platform hierarchy is:

```text
LegacyHub Platform
-> Workspace
-> Legacy Profile
-> Legacy Content
```

Baba Muyi Family Archive is the first workspace. Baba Muyi is the first legacy profile. Public website routes remain Baba Muyi branded while reusable platform concepts use LegacyHub terminology.

## Database Summary

Applied migrations:

```text
0001_initial_foundation.sql
0002_cms_enum_additions.sql
0003_cms_access_media_documentary_menu.sql
0004_workspace_saas_foundation.sql
0005_required_storage_buckets.sql
```

The schema includes users, roles, workspaces, workspace memberships, workspace invitations, legacy profiles, legacy-profile memberships, content tables, media tables, documentary tables, menu tables, settings, audit logs, RLS policies, helper functions, indexes, and storage bucket definitions.

## Supabase Summary

- Linked Supabase project migration history matches local migrations `0001` through `0005`.
- Live database types match `lib/database.types.ts`.
- Owner bootstrap verifies the owner Auth user, user profile, platform owner role, workspace, workspace membership, legacy profile, and legacy-profile membership.
- Required buckets are present: `legacy-images`, `legacy-documents`, `legacy-audio`, `legacy-video`, `profile-images`, and `tribute-uploads`.

## GitHub Summary

The repository is configured to use `origin/main` at:

```text
https://github.com/MajekAz/baba-muyi-legacy.git
```

This release should be committed on `main` and tagged as `v0.1.0`.

## Hostinger Deployment Summary

Hostinger should deploy this as a Node.js application, not a static site.

- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Start command: `pnpm start`
- App root: repository root
- Health check: `/api/health`
- Keep `LEGACYHUB_ENABLE_LOCAL_FALLBACK=false` in production.

Use the Hostinger preview URL for preview environment variables, then switch `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_AUTH_REDIRECT_URL` to the final custom domain after DNS is live.

## Known Issues

- Admin CMS screens are still foundation-level and not full Supabase-backed CRUD workflows.
- Media upload UI and storage helpers exist, but full production upload workflows remain incomplete.
- Documentary management schema exists, but complete episode/transcript/subtitle/chapter workflows remain incomplete.
- Public pages still rely heavily on seeded/fallback CMS content.
- Formal remote RLS regression tests are not yet automated.
- Final Hostinger production deployment still requires a manual redeploy after the release push.

## Edge Runtime Warning

`next build` may emit a Supabase warning that `@supabase/supabase-js` references a Node.js API in the middleware import trace. The production build still completes successfully. This warning is tracked for a future focused middleware/runtime cleanup and is intentionally not addressed in this release-preparation task.

## Remaining Work

- Build full Supabase-backed CMS CRUD.
- Implement production media upload, validation, signed URL, and album workflows.
- Complete documentary management.
- Add invitation acceptance and email delivery.
- Add contribution moderation queues.
- Add formal RLS, permission, upload, and route tests.
- Complete Hostinger production deployment and smoke testing.

## Next Milestone

Milestone 2 should focus on Supabase-backed CMS CRUD and server-side permission enforcement, without adding billing, marketplace, AI generation, public self-registration, or native mobile applications.
