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
| Media workflows | Partial but materially implemented | Media upload actions, album UI, metadata editing, archival version schema, and public gallery/archive reads exist. Remote upload acceptance remains required. |
| Documentary workflows | Partial | Schema and route foundations exist; documentary-series management remains future work. |
| Billing, public registration, AI, marketplace, native mobile | Deferred | Explicitly excluded from current MVP. |

## Brand Integration Status

| Area | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Public archive identity | Complete but locally tested only | `app/layout.tsx`, `components/mobile-navigation.tsx`, `lib/site.ts` | Baba Muyi Legacy remains the public archive name and visual identity. |
| Platform relationship | Complete but locally tested only | `app/layout.tsx`, `data/cms.json`, `lib/cms-seed.ts` | Footer and About content explain that Baba Muyi Legacy is powered by LegacyHub. |
| Admin branding | Complete but locally tested only | `app/admin/layout.tsx`, `components/admin/workspace-context-bar.tsx` | Admin displays LegacyHub plus data-driven workspace/profile context. |
| Auth branding | Complete but locally tested only | `app/login/page.tsx`, `app/reset-password/page.tsx`, `app/update-password/page.tsx` | Auth pages use LegacyHub and the platform tagline. |
| Brand tokens | Partial | `lib/brand.ts` | Platform/workspace/profile token boundaries exist; full theme editing is future work. |
| Future platform route | Placeholder | `app/legacyhub/page.tsx` | Noindex route shell only; pricing, billing and registration are not built. |
| Public navigation refinement | Complete but locally tested only | `components/public-header-client.tsx`, `components/mobile-navigation.tsx`, `lib/navigation.ts`, `data/cms.json` | Header/menu hierarchy is data-driven; desktop dropdown and mobile overlay behaviour need final browser QA before merge. |

## Milestone 3.5 Administration Production Polish

| Area | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Separate admin shell | Partial, in progress | `app/layout.tsx`, `app/(public)/layout.tsx`, `app/admin/layout.tsx`, `components/admin/admin-shell.tsx` | Public chrome is isolated in the public route group and admin routes render only the LegacyHub shell. |
| Header | Partial, in progress | `components/admin/admin-shell.tsx` | Header shows LegacyHub, active workspace, active legacy profile, user name, role, public archive link, and sign-out. |
| Sidebar | Partial, in progress | `components/admin/admin-shell.tsx`, `lib/navigation.ts` | Sidebar is role-aware, collapsible on desktop, drawer-based on mobile, and marks unfinished modules planned. |
| Breadcrumbs | Partial, in progress | `components/admin/admin-shell.tsx` | Route-derived breadcrumbs are present; record-title breadcrumbs remain future refinement. |
| Dashboard | Partial, in progress | `app/admin/page.tsx` | Uses real CMS/media records for counts, recent content, recent media, and pending review lists where available. |
| Toasts and feedback | Partial, in progress | `components/admin/admin-shell.tsx`, `components/admin/content-editor-form.tsx` | Accessible feedback regions exist; more server-action redirects can adopt URL toasts later. |
| Confirmation dialogs | Partial, in progress | `components/admin/confirm-submit-button.tsx`, CMS/media list screens | Archive and remove-link flows have confirmation UI without changing archive semantics. |
| Documentation | Partial, in progress | `docs/PRODUCT_DECISIONS.md`, `docs/ADMIN_UX_GUIDE.md` | Brand and admin UX rules documented for future modules. |

## Public Navigation Route Mapping

| Menu label | Route used | Notes |
| --- | --- | --- |
| Documentary | `/documentaries` | Existing documentary landing route. |
| Photo Archive | `/gallery` | Existing gallery landing route. |
| Audio | `/archive` | Interim mapping until a dedicated audio archive route is approved. |
| Historical Documents | `/documents` | Existing document archive route. |
| About the Legacy Project | `/about` | Existing alias for the curator/about page until a dedicated project page is approved. |
| About LegacyHub | `/legacyhub` | Minimal noindex future platform route shell. |

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
| Media | Partial but materially implemented | `app/admin/media/*`, `components/admin/media-uploader.tsx`, `lib/media/*`, `supabase/migrations/0011_media_library_foundation.sql` | Upload actions, metadata editing, album creation, public gallery/archive reads and archival version schema exist; remote upload acceptance still required. |
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
- Supabase upload actions, progress messaging, privacy metadata, signed public delivery helpers, and album management are implemented for Milestone 3.
- Upload rate limiting, malware scanning, image optimisation workers, and destructive file deletion workflows remain incomplete.

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

## Milestone 2 Deferred Scope

These items are intentionally not considered complete for Milestone 2 remediation:

| Item | Status | Proposed ownership | Notes |
| --- | --- | --- | --- |
| CMS mutation rate limiting | Deferred | Milestone 3 Security Hardening | Server actions and RLS protect access, but abuse throttling is not implemented. |
| Full revision-history browser | Deferred | Milestone 3 or Milestone 4 | Audit logs exist; a user-facing revision comparison/restoration interface is not complete. |
| Complete category management | Deferred | Milestone 4 Content Organisation | Category text can be saved on core content, but full CRUD/taxonomy workflows are not complete. |
| Complete tag management | Deferred | Milestone 4 Content Organisation | Source-note/tag text can be saved; full reusable tags, filtering and governance remain future work. |
