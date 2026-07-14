# Project Audit Report: Baba Muyi Legacy

Audit date: 2026-07-14  
Repository path: `/Users/optiscale/Documents/web/baba-muyi-legacy`

## 1. Executive Summary

Baba Muyi Legacy is a Next.js App Router project being developed into a commercial multi-user SaaS legacy archive platform. The current application has a broad public route surface, protected admin shells, Supabase client helpers, versioned SQL migrations, local JSON-backed CMS fallback data, role/permission definitions, menu management UI, and documentation for SaaS architecture and deployment.

The project is not yet production-complete. The Supabase schema and RLS policies are defined in migrations, but there is no evidence that they have been applied to a remote Supabase project. The CMS, menus, workspace context, and public content currently work locally through `data/cms.json` fallback data. Media upload, documentary management, invitation workflows, and full CRUD modules are still partial or placeholder-level.

Latest local checks pass:

- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm build`: passed with a known Supabase Edge-runtime warning

## 2. Project Folder Structure

Top-level structure:

```text
.
├── app/
├── components/
├── content-source/
├── data/
├── docs/
├── lib/
├── scripts/
├── supabase/
├── CHANGELOG.md
├── CONTENT_GAPS.md
├── CONTENT_INVENTORY.md
├── DEPLOYMENT_HOSTINGER.md
├── PERMISSIONS.md
├── README.md
├── SAAS_ARCHITECTURE.md
├── SETUP.md
├── SUPABASE_SETUP.md
├── TODO.md
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
└── tsconfig.json
```

Key app folders:

```text
app/
├── admin/
├── api/health/
├── auth/callback/
├── login/
├── reset-password/
├── update-password/
├── unauthorised/
└── public content routes
```

Key implementation folders:

```text
components/admin/
components/cms/
lib/supabase/
lib/validation/
lib/media/
supabase/migrations/
```

Generated/cache folders observed:

```text
.next/
.next-build-cache-*/
.next-corrupt-*/
node_modules/
```

## 3. Implemented Features

- Next.js App Router public route structure.
- Responsive public layout with header, footer, desktop navigation, and accepted mobile navigation.
- Local CMS fallback store in `data/cms.json`.
- CMS page rendering through `components/cms/cms-public-page.tsx`.
- Workspace-aware local CMS types and filtering in `lib/cms-types.ts`, `lib/cms-store.ts`, and `lib/cms-seed.ts`.
- Admin layout with local fallback owner context when Supabase credentials are missing.
- Admin workspace/legacy-profile context bar in `components/admin/workspace-context-bar.tsx`.
- Supabase browser/server/admin helper files.
- Auth route foundations for login, logout, forgotten password, password update, callback, and unauthorised state.
- Versioned Supabase migrations:
  - `0001_initial_foundation.sql`
  - `0002_cms_access_media_documentary_menu.sql`
  - `0003_workspace_saas_foundation.sql`
- Role and permission definitions in `lib/permissions.ts`.
- Local validation for forms and media file types.
- Documentation for setup, Supabase, Hostinger, permissions, and SaaS architecture.

## 4. Partially Implemented Features

- CMS CRUD: create/update/archive exists for local JSON CMS records, but not full Supabase-backed CRUD.
- Menu management: local CMS-backed menu records exist; Supabase menu schema exists; remote database loading is not implemented/tested.
- Workspace tenancy: schema/migration and local context exist; active workspace switching is not interactive yet.
- Authentication: server actions and pages exist; remote Supabase auth has not been tested.
- User invitations: server action and form exist, but email delivery and remote verification are not complete.
- Rich-text editing: TipTap editor component exists, but current CMS content form still uses textareas.
- Documentary management: generic records exist, but full transcript/subtitle/chapter workflows are not complete.
- Media library: client-side validation and preview exist, but real upload is not implemented.

## 5. Missing Features

- Remote Supabase migration application evidence.
- Generated Supabase TypeScript types from the remote schema.
- Real Supabase-backed CMS repository layer.
- Full workspace selector and legacy-profile selector mutation/switching.
- Public signup is intentionally disabled; owner bootstrap remains manual.
- Media upload to Supabase Storage.
- Upload progress.
- Signed URL display/use in media UI.
- Search and filtering for CMS/media.
- Full CRUD screens for all content types.
- Revision history UI.
- Remote RLS tests.
- Automated auth/permission/upload tests.
- Email provider integration for invitations.

## 6. Public Routes

Observed public routes:

```text
/
/archive
/biography
/blog
/bolekaja
/bolekaja-gallery
/children
/community-gallery
/community-leadership
/contact
/curator
/documentaries
/documentary-episodes
/documents
/early-life
/english-documentary
/family
/family-memories
/family-tree
/forgot-password
/gallery
/grandchildren
/journey-map
/journey-to-bariga
/lessons
/login
/molue-gallery
/portraits
/privacy
/reset-password
/restored-images
/routes-and-locations
/terms
/timeline
/tioluwa-lase-molue
/trailer-clips
/transcripts
/transport-gallery
/tributes
/unauthorised
/update-password
/waiting-list
```

System routes:

```text
/api/health
/auth/callback
/robots.txt
/sitemap.xml
```

## 7. Admin Routes

Observed admin routes:

```text
/admin
/admin/[...section]
/admin/access
/admin/content
/admin/content/biography
/admin/documentaries
/admin/media
/admin/media/albums
/admin/menus
/admin/menus/admin
/admin/menus/footer
/admin/menus/header
/admin/menus/mobile
/admin/menus/secondary
```

The admin routes render locally through a local fallback owner when Supabase is not configured.

## 8. Supabase Integration Status

Implemented files:

```text
lib/supabase/admin.ts
lib/supabase/browser.ts
lib/supabase/client.ts
lib/supabase/config.ts
lib/supabase/middleware.ts
lib/supabase/server.ts
lib/env.ts
middleware.ts
```

Status:

- Browser client: implemented scaffold.
- Server client: implemented scaffold.
- Admin/service-role client: implemented scaffold.
- SSR middleware session refresh: implemented scaffold.
- Environment validation: implemented.
- Remote Supabase usage: not verified.
- Hand-maintained database types: `lib/database.types.ts`.
- Generated remote database types: missing.

## 9. Authentication Status

Implemented:

```text
app/login/page.tsx
app/reset-password/page.tsx
app/update-password/page.tsx
app/forgot-password/page.tsx
app/auth/callback/route.ts
app/unauthorised/page.tsx
lib/auth.ts
lib/auth-actions.ts
```

Status:

- Login form exists.
- Logout server action exists.
- Forgotten password route exists.
- Password update route exists.
- Email callback route exists.
- Admin layout protection exists.
- Public signup is not enabled.
- Local fallback owner is active when Supabase env vars are missing.
- Remote owner login has not been tested.
- Owner account setup is documented but still manual.

## 10. Database Migration Status

Migration files:

```text
supabase/migrations/0001_initial_foundation.sql
supabase/migrations/0002_cms_access_media_documentary_menu.sql
supabase/migrations/0003_workspace_saas_foundation.sql
```

Summary:

- `0001_initial_foundation.sql`: base roles, legacy profiles, media, biography, timeline, documentary, family, stories, lessons, tributes, blog posts, settings, audit logs, waiting list, RLS, storage buckets.
- `0002_cms_access_media_documentary_menu.sql`: permissions, invitations, access grants, media album items, documentary chapters/subtitles/transcripts, menus, menu items, content revisions, additional RLS.
- `0003_workspace_saas_foundation.sql`: workspaces, workspace roles, workspace members, workspace invitations, legacy profile members, workspace ownership columns, workspace-aware indexes/functions/RLS, idempotent Baba Muyi workspace/profile/menu seed data.

Remote application status:

- Not confirmed. No evidence in the repository that migrations have been applied to a remote Supabase project.

## 11. Row Level Security Status

RLS is defined in migrations for many tables.

RLS-enabled areas include:

- Users and roles
- Legacy profiles and memberships
- Workspaces and workspace memberships
- Content tables
- Media tables
- Documentary tables
- Menu tables
- Settings and audit logs
- Storage objects

Policy coverage includes:

- Public read of published public content.
- Workspace member workspace access.
- Owner/administrator workspace management.
- Editor content management.
- Contributor submission boundaries.
- Reviewer role definition.
- Viewer/private access grants.
- Menu public reads and manager edits.
- Storage public image reads and authenticated tribute upload policy.

Status:

- Implemented in SQL.
- Not remotely tested against Supabase.
- Some policies were superseded/refined by `0003_workspace_saas_foundation.sql`.

## 12. Media Upload Status

Implemented:

```text
components/admin/media-uploader.tsx
lib/media/storage.ts
lib/validation/admin.ts
```

Status:

- File selection UI exists.
- Drag/drop UI exists.
- Local validation exists for image, video, audio, and PDF types.
- Preview exists for selected image/video/audio files.
- Supabase Storage helper functions exist for bucket choice, safe filenames, signed URLs, and deletion.
- Actual upload to Supabase Storage is not implemented.
- Upload progress is not implemented.
- Search/filtering is not implemented.

## 13. Documentary Module Status

Implemented:

```text
app/admin/documentaries/page.tsx
supabase/migrations/0001_initial_foundation.sql
supabase/migrations/0002_cms_access_media_documentary_menu.sql
supabase/migrations/0003_workspace_saas_foundation.sql
```

Status:

- Documentary and episode tables exist.
- Documentary chapters, subtitles, and transcripts tables exist.
- Admin documentary page exists.
- Generic CMS content form can create local documentary records.
- External provider fields exist in schema.
- Full thumbnail/transcript/subtitle/chapter admin workflows are not complete.
- Remote database-backed documentary CRUD is not tested.

## 14. User Roles & Permissions Status

Implemented:

```text
lib/permissions.ts
PERMISSIONS.md
supabase/migrations/0002_cms_access_media_documentary_menu.sql
supabase/migrations/0003_workspace_saas_foundation.sql
```

Roles:

```text
owner
administrator
editor
contributor
reviewer
viewer
```

Permission keys include:

```text
manage_all_content
manage_users
manage_legacy_profiles
upload_media
delete_media
publish_content
manage_menus
change_site_settings
assign_roles
view_audit_logs
manage_privacy
manage_supabase_settings
review_submissions
edit_assigned_content
grant_private_viewing
access_media_library
access_documentaries
```

Status:

- Role mapping exists in code.
- Permission tables exist in migrations.
- Workspace-aware helpers exist in `lib/tenant-context.ts`.
- Server-side enforcement exists for local CMS actions.
- Remote enforcement has not been tested.

## 15. Menu Management Status

Implemented:

```text
components/public-navigation.tsx
components/mobile-navigation.tsx
components/admin/menu-management-form.tsx
app/admin/menus/
lib/cms-store.ts
lib/cms-actions.ts
supabase/migrations/0002_cms_access_media_documentary_menu.sql
supabase/migrations/0003_workspace_saas_foundation.sql
```

Status:

- Public navigation reads local CMS menu records.
- Mobile navigation reads local CMS menu records.
- Footer menu reads local CMS menu records.
- Nested menu data is supported.
- Visibility/status fields exist.
- Role restriction fields exist.
- Menu admin routes exist.
- Menu item creation saves to local JSON fallback.
- Drag-and-drop reorder is not implemented.
- Supabase-backed menu loading and mutations are not implemented/tested.
- Current menu is local seed/fallback data, not remote database data.

## 16. Workspace & Legacy Profile Status

Implemented:

```text
supabase/migrations/0003_workspace_saas_foundation.sql
lib/tenant-context.ts
lib/cms-types.ts
lib/cms-seed.ts
lib/cms-store.ts
components/admin/workspace-context-bar.tsx
SAAS_ARCHITECTURE.md
```

Status:

- Workspace schema exists.
- Workspace member schema exists.
- Workspace invitation schema exists.
- Legacy profile membership schema exists.
- Baba Muyi Family Archive seed exists.
- Baba Muyi legacy profile seed exists.
- Local CMS fallback is workspace/profile-aware.
- Admin context bar displays active workspace/profile.
- Interactive workspace/profile switching is not implemented.
- Remote workspace isolation is not tested.

## 17. Current Database Tables

Tables defined in migrations:

```text
access_grants
audit_logs
biography_chapters
blog_posts
categories
content_revisions
content_tags
documentaries
documentary_chapters
documentary_episodes
documentary_subtitles
documentary_transcripts
family_members
family_relationships
invitations
legacy_members
legacy_profile_members
legacy_profiles
lessons
media_album_items
media_albums
media_items
menu_items
menus
role_permissions
site_settings
stories
tags
timeline_events
tributes
user_permissions
user_profiles
user_roles
waiting_list
workspace_invitations
workspace_members
workspace_roles
workspaces
```

## 18. Storage Buckets

Defined in `0001_initial_foundation.sql` and `supabase/schema.sql`:

```text
legacy-images       public   10 MB    JPEG, PNG, WebP
profile-images      public   10 MB    JPEG, PNG, WebP
legacy-documents    private  50 MB    PDF, JPEG, PNG
legacy-audio        private  100 MB   MP3, MP4 audio, WAV, WebM audio
legacy-video-clips  private  250 MB   MP4, WebM, QuickTime
tribute-uploads     private  50 MB    JPEG, PNG, WebP, PDF, MP3, MP4
```

## 19. Environment Variables Required

Required/expected variables, without values:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_AUTH_REDIRECT_URL
```

Status:

- `.env.example` exists.
- Local app can run without Supabase credentials using fallback data.
- Production Supabase features require real values.

## 20. Documentation Files

Observed documentation:

```text
CHANGELOG.md
CONTENT_GAPS.md
CONTENT_INVENTORY.md
DEPLOYMENT_HOSTINGER.md
PERMISSIONS.md
README.md
SAAS_ARCHITECTURE.md
SETUP.md
SUPABASE_SETUP.md
TODO.md
content-source/README.md
docs/implementation-plan.md
```

## 21. Commands Executed

Commands executed for this audit:

```bash
find . -maxdepth 3 -type f | sort
find app -maxdepth 4 -type f | sort
find supabase -maxdepth 3 -type f | sort
find . -maxdepth 2 -name '*.md' -type f | sort
rg "^create table if not exists public\\." supabase/migrations -n
rg "insert into storage\\.buckets|legacy-images|legacy-documents|legacy-audio|legacy-video-clips|tribute-uploads|profile-images" supabase/migrations supabase/schema.sql -n
rg "enable row level security|create policy" supabase/migrations -n
PATH=/Users/optiscale/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH CI=true /Users/optiscale/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm lint
PATH=/Users/optiscale/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH CI=true /Users/optiscale/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm typecheck
PATH=/Users/optiscale/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH CI=true /Users/optiscale/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm build
```

## 22. Latest Test Results

### `pnpm lint`

Actual output:

```text
$ eslint .
```

Exit code: `0`

### `pnpm typecheck`

Actual output:

```text
$ tsc --noEmit
```

Exit code: `0`

### `pnpm build`

Actual output:

```text
$ next build
   ▲ Next.js 15.5.20

   Creating an optimized production build ...
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (128kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (106kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (253kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
 ⚠ Compiled with warnings in 618ms

./node_modules/.pnpm/@supabase+supabase-js@2.110.2/node_modules/@supabase/supabase-js/dist/index.mjs
A Node.js API is used (process.version at line: 27) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime

Import trace for requested module:
./node_modules/.pnpm/@supabase+supabase-js@2.110.2/node_modules/@supabase/supabase-js/dist/index.mjs
./node_modules/.pnpm/@supabase+ssr@0.5.2_@supabase+supabase-js@2.110.2/node_modules/@supabase/ssr/dist/module/createBrowserClient.js
./node_modules/.pnpm/@supabase+ssr@0.5.2_@supabase+supabase-js@2.110.2/node_modules/@supabase/ssr/dist/module/index.js
./lib/supabase/middleware.ts

 ✓ Compiled successfully in 3.8s
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/59) ...
   Generating static pages (14/59)
   Generating static pages (29/59)
   Generating static pages (44/59)
 ✓ Generating static pages (59/59)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ƒ /                                      267 B         105 kB
├ ƒ /_not-found                            174 B         102 kB
├ ƒ /admin                                 174 B         102 kB
├ ƒ /admin/[...section]                    174 B         102 kB
├ ƒ /admin/access                          174 B         102 kB
├ ƒ /admin/content                         174 B         102 kB
├ ƒ /admin/documentaries                   174 B         102 kB
├ ƒ /admin/media                         16.8 kB         119 kB
├ ƒ /admin/menus                           174 B         102 kB
├ ƒ /admin/menus/admin                     174 B         102 kB
├ ƒ /admin/menus/footer                    174 B         102 kB
├ ƒ /admin/menus/header                    174 B         102 kB
├ ƒ /admin/menus/mobile                    174 B         102 kB
├ ƒ /admin/menus/secondary                 174 B         102 kB
├ ƒ /api/health                            174 B         102 kB
├ ƒ /archive                               267 B         105 kB
├ ƒ /auth/callback                         174 B         102 kB
├ ƒ /biography                             267 B         105 kB
├ ƒ /blog                                  267 B         105 kB
├ ƒ /bolekaja                              267 B         105 kB
├ ƒ /bolekaja-gallery                      267 B         105 kB
├ ƒ /children                              267 B         105 kB
├ ƒ /community-gallery                     267 B         105 kB
├ ƒ /community-leadership                  267 B         105 kB
├ ƒ /contact                               267 B         105 kB
├ ƒ /curator                               267 B         105 kB
├ ƒ /documentaries                         267 B         105 kB
├ ƒ /documentary-episodes                  267 B         105 kB
├ ƒ /documents                             267 B         105 kB
├ ƒ /early-life                            267 B         105 kB
├ ƒ /english-documentary                   267 B         105 kB
├ ƒ /family                                267 B         105 kB
├ ƒ /family-memories                       267 B         105 kB
├ ƒ /family-tree                           267 B         105 kB
├ ƒ /forgot-password                     1.01 kB         103 kB
├ ƒ /gallery                               267 B         105 kB
├ ƒ /grandchildren                         267 B         105 kB
├ ƒ /journey-map                           267 B         105 kB
├ ƒ /journey-to-bariga                     267 B         105 kB
├ ƒ /lessons                               267 B         105 kB
├ ƒ /login                               1.01 kB         106 kB
├ ƒ /molue-gallery                         267 B         105 kB
├ ƒ /portraits                             267 B         105 kB
├ ƒ /privacy                               267 B         105 kB
├ ƒ /reset-password                      1.01 kB         103 kB
├ ƒ /restored-images                       267 B         105 kB
├ ○ /robots.txt                            174 B         102 kB
├ ƒ /routes-and-locations                  267 B         105 kB
├ ○ /sitemap.xml                           174 B         102 kB
├ ƒ /terms                                 267 B         105 kB
├ ƒ /timeline                              267 B         105 kB
├ ƒ /tioluwa-lase-molue                    267 B         105 kB
├ ƒ /trailer-clips                         267 B         105 kB
├ ƒ /transcripts                           267 B         105 kB
├ ƒ /transport-gallery                     267 B         105 kB
├ ƒ /tributes                            1.04 kB         106 kB
├ ƒ /unauthorised                          267 B         105 kB
├ ƒ /update-password                     1.01 kB         103 kB
└ ƒ /waiting-list                          986 B         106 kB
+ First Load JS shared by all             102 kB
  ├ chunks/560-80582d608f7c20d7.js       45.6 kB
  ├ chunks/a039cd8b-3d46ee26b96abc97.js  54.2 kB
  └ other shared chunks (total)          1.92 kB

ƒ Middleware                              103 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Exit code: `0`

## 23. Known Issues

- Supabase Edge-runtime warning during build:
  - `@supabase/supabase-js` uses `process.version`, which Next reports as unsupported in Edge Runtime through middleware import trace.
- Supabase credentials are not configured in this local audit environment.
- Remote migrations have not been confirmed as applied.
- RLS policies have not been remotely tested.
- Admin uses local fallback owner when Supabase is missing.
- CMS persists to `data/cms.json` locally, not to Supabase.
- Media uploader validates and previews files but does not upload.
- Documentary module is still a generic record-management shell.
- Invitations are not connected to email delivery.
- Active workspace/profile selectors are displayed but disabled in local fallback.
- `.next-build-cache-*` and `.next-corrupt-*` folders exist from previous build/dev-cache recovery work.
- `npm` binary was unavailable in this runtime; checks used the project pnpm runtime.

## 24. Recommended Next Development Phase

Recommended next phase: connect the SaaS foundation to a real Supabase project and replace local fallback persistence with workspace-scoped Supabase repositories.

Priority sequence:

1. Create Supabase project.
2. Apply migrations `0001`, `0002`, and `0003` in order.
3. Create first owner in Supabase Auth.
4. Insert owner into `user_profiles`, `workspace_members`, and `legacy_profile_members`.
5. Generate official Supabase TypeScript database types.
6. Implement Supabase-backed repository functions for CMS pages, biography chapters, timeline events, lessons, blog posts, menus, media, and documentaries.
7. Add remote RLS tests for workspace isolation and legacy-profile isolation.
8. Connect media uploads to Supabase Storage with signed URL support.
9. Complete invitation email delivery.
10. Add automated tests for auth, permissions, CMS mutations, uploads, and menus.
