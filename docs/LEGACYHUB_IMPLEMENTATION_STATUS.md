# LegacyHub Implementation Status

Status key:

- Complete and tested
- Complete but locally tested only
- Partial
- Placeholder
- Not started
- Blocked
- Deferred

## v0.1.0 Release Status

**LegacyHub v0.1.0 - Foundation Complete** verifies the platform foundation and does not start Milestone 2.

| Area | v0.1.0 Status | Evidence |
| --- | --- | --- |
| GitHub source structure | Complete pending release push | `package.json`, `app/`, `components/`, `lib/`, `public/`, `supabase/` are present at repository root. |
| Supabase migrations | Complete | `supabase migration list --linked` reports local/remote `0001` through `0005`. |
| Supabase types | Complete | `supabase gen types typescript --linked` matches `lib/database.types.ts`. |
| Owner bootstrap | Complete | `pnpm bootstrap:owner` succeeds twice with owner/profile/workspace counts at `1`. |
| Storage buckets | Complete | Required buckets verified through Supabase Storage API. |
| Validation | Complete | `pnpm lint`, `pnpm typecheck`, and `pnpm build` pass locally. |
| Hostinger | Ready for deployment | Deployment documentation is present; production redeploy is the next manual hosting step. |
| CMS implementation | Partial | Admin shells and local CMS fallback exist; full Supabase-backed CRUD is Milestone 2 work. |
| Media/documentary workflows | Partial | Schema and UI foundations exist; production upload and documentary workflows remain future work. |
| Billing, public registration, AI, marketplace, native mobile | Deferred | Explicitly excluded from current MVP. |

## Executive Status Matrix

| Area | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Hosting | Blocked | `DEPLOYMENT_HOSTINGER.md`, GitHub screenshot, `git ls-tree origin/main` | Hostinger sees `package.json` but not `app/` until local commits are pushed. |
| GitHub | Blocked | `origin/main` currently contains only `PROJECT_AUDIT.md` and `package.json` | Local app is committed but push requires GitHub authentication. |
| Next.js | Complete but locally tested only | `app/`, `next.config.ts`, `pnpm build` | Local production build passes. Remote deploy not proven. |
| Supabase | Partial | `lib/supabase/*`, `supabase/migrations/*` | Clients and migrations exist; remote project not configured/tested. |
| Authentication | Partial | `app/login/page.tsx`, `lib/auth-actions.ts`, `lib/auth.ts` | Local fallback works; remote auth untested. |
| Workspaces | Partial | `0003_workspace_saas_foundation.sql`, `lib/tenant-context.ts` | Schema/helper exists; switching and remote tests missing. |
| Legacy profiles | Partial | `legacy_profiles`, `legacy_profile_members`, `lib/cms-seed.ts` | Baba Muyi seeded; reusable profile management UI missing. |
| RLS | Partial | `supabase/migrations/*` | SQL policies exist; remote verification missing. |
| CMS | Partial | `data/cms.json`, `lib/cms-store.ts`, `lib/cms-actions.ts` | Local JSON CRUD exists; Supabase-backed CMS missing. |
| Media | Partial | `components/admin/media-uploader.tsx`, `lib/media/storage.ts` | Validation/preview/helpers exist; real upload incomplete. |
| Documentaries | Placeholder | `app/admin/documentaries/page.tsx`, documentary tables | Generic admin shell and schema; full workflow missing. |
| Family tree | Placeholder | `app/family-tree/page.tsx`, family tables | Public route/schema exist; admin workflow missing. |
| Contributions | Partial | `components/tribute-form.tsx`, `stories`, `tributes` tables | Submission foundations exist; moderation workflow incomplete. |
| Invitations | Partial | `lib/admin-actions.ts`, invitation tables | Records/actions exist; email delivery and acceptance missing. |
| Menus | Partial | `components/admin/menu-management-form.tsx`, `components/mobile-navigation.tsx` | Local CMS-driven menu exists; DB-backed CRUD/reorder missing. |
| SEO | Partial | `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`, `lib/site.ts` | Public SEO foundation exists; structured data and CMS SEO workflow incomplete. |
| Accessibility | Partial | Existing semantic routes/navigation | Mobile menu accepted; full WCAG audit not done. |
| Analytics | Not started | No analytics integration found | Must be privacy-safe. |
| Backups | Not started | TODO only | Export/backup required before commercial launch. |
| Billing | Deferred | `docs/LEGACYHUB_MONETISATION.md` | Excluded from MVP implementation. |
| AI | Deferred | Roadmap only | Later phase after consent/governance. |
| Custom domains | Deferred | Deployment docs and roadmap only | Later SaaS phase. |
| Platform administration | Not started | No super-admin tables/routes | Platform owner tooling remains future work. |

## Repository Audit Findings

### Current Application Architecture

- Next.js App Router with TypeScript and Tailwind: `app/`, `components/`, `next.config.ts`, `tailwind.config.ts`.
- CMS public pages: `components/cms/cms-public-page.tsx`.
- Local JSON CMS store: `data/cms.json`, `lib/cms-store.ts`.
- Admin shells: `app/admin/*`, `components/admin-navigation.tsx`.

### Existing Public Routes

Routes are under `app/*/page.tsx`, including `/`, `/biography`, `/timeline`, `/documentaries`, `/gallery`, `/family-tree`, `/lessons`, `/blog`, `/archive`, `/tributes`, `/contact`, legal pages, and supporting Baba Muyi menu child routes.

### Existing Admin Routes

Routes include `/admin`, `/admin/content`, `/admin/media`, `/admin/documentaries`, `/admin/access`, `/admin/menus`, and location-specific menu routes in `app/admin/menus/*`.

### Existing Supabase Integration

- Clients and middleware exist: `lib/supabase/*`, `middleware.ts`.
- Env validation exists: `lib/env.ts`.
- Remote project configuration is not verified.

### Existing Migrations

- `0001_initial_foundation.sql`: profile, content, media, documentary, family, storage, and base RLS.
- `0002_cms_access_media_documentary_menu.sql`: permissions, invitations, access grants, documentary detail tables, menus, revisions.
- `0003_workspace_saas_foundation.sql`: workspaces, workspace members, workspace invitations, legacy profile members, workspace-aware fields/RLS/seed.

### Existing Workspace And Legacy-Profile Architecture

- Schema exists in migration `0003`.
- Local fallback is workspace-aware through `activeWorkspaceId` and `activeLegacyProfileId`.
- Interactive switching and Supabase-backed workspace/profile management are missing.

### Existing Authentication

- Login/reset/update/callback routes exist.
- Admin route guard exists.
- Local fallback owner exists when Supabase is not configured.
- Remote auth is untested.

### Existing Permissions

- Code role map exists in `lib/permissions.ts`.
- Tenant permission helper exists in `lib/tenant-context.ts`.
- Role/permission SQL tables exist.
- Full server-side and RLS enforcement is not remotely proven.

### Existing CMS Functionality

- Local create/update/archive for CMS pages/content/menu records exists.
- Supabase-backed CRUD is missing.
- Rich-text editor exists but is not fully wired into all forms.

### Existing Media Functionality

- Media uploader UI and validation exist.
- Storage helper functions exist.
- Actual Supabase upload, progress, privacy display, signed delivery UI, and album management remain incomplete.

### Existing Documentary Functionality

- Documentary schema exists.
- Admin route shell exists.
- Full provider, episodes, transcripts, subtitles, chapters, thumbnails, and publish workflow are incomplete.

### Existing Menu System

- Public/mobile/footer/admin menu concepts exist.
- Local CMS menu data drives navigation.
- Database-backed menu loading/mutation/reorder remains incomplete.

### Existing Local Fallback Behaviour

- `lib/auth.ts` returns a local owner when Supabase env vars are missing.
- `lib/cms-store.ts` reads/writes `data/cms.json`.
- This is development convenience, not production security.

### Existing Hostinger Deployment Configuration

- `DEPLOYMENT_HOSTINGER.md` and `README.md` describe Hostinger Node.js deployment.
- Current remote repository structure is incomplete until local commits are pushed.

## Hard-Coded Baba Muyi-Specific Code

- Public site metadata: `lib/site.ts`.
- Seed content and workspace/profile IDs: `lib/cms-seed.ts`, `data/cms.json`.
- Public layout branding: `app/layout.tsx`, `components/mobile-navigation.tsx`.
- Domain references: `README.md`, `DEPLOYMENT_HOSTINGER.md`, `SUPABASE_SETUP.md`, `lib/env.ts`.

These are acceptable for the flagship archive but must be isolated from reusable LegacyHub platform logic.

## Reusable LegacyHub-Compatible Code

- Workspace/profile migrations: `0003_workspace_saas_foundation.sql`.
- Tenant helper: `lib/tenant-context.ts`.
- Role map: `lib/permissions.ts`.
- CMS type model: `lib/cms-types.ts`.
- Supabase client helpers: `lib/supabase/*`.
- Storage helpers: `lib/media/storage.ts`.

## Placeholder Interfaces

- Admin documentary screen: `app/admin/documentaries/page.tsx`.
- Admin media screen: partial at `app/admin/media/page.tsx`.
- Generic admin content shell: `app/admin/content/page.tsx`.
- Family tree public route without full management workflow.
- Many public pages are CMS placeholders seeded from `lib/cms-seed.ts`.

## Missing Core Functionality

- Complete GitHub push of the app to `origin/main`.
- Live Supabase dev/prod project.
- Remote migrations and generated DB types.
- Supabase-backed CMS repositories.
- Real media uploads.
- Full documentary manager.
- Family tree management.
- Contribution moderation queues.
- Invitation acceptance/email delivery.
- Data export/backup.
- Remote RLS tests.
- Billing and platform administration, deferred.

## Technical Debt

- Duplicate membership/invitation models.
- Hand-maintained DB types.
- Local JSON fallback may drift from Supabase schema.
- Polymorphic content/tag/revision tables have weak database constraints.
- Current docs and code still mix Baba Muyi flagship language with future SaaS language.

## Security Risks

- RLS not remotely verified.
- Local fallback owner must never be treated as production auth.
- Upload malware/rate-limit handling missing.
- Private media signed delivery workflow incomplete.
- Invitation token acceptance and expiry not fully implemented.
- Service-role key handling must be checked in production hosting.

## Deployment Risks

- GitHub remote currently lacks the full app source.
- Hostinger will fail until `app/` reaches `origin/main`.
- Production Supabase env vars are not configured/tested.
- Remote migrations are not confirmed.
