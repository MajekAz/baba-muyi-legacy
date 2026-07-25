# LegacyHub Milestone 4 Public Experience

## Phase 1 Scope

Milestone 4 Phase 1 focuses only on the public Baba Muyi Legacy archive experience. It does not redesign the LegacyHub platform website, administration shell, authentication, CMS, Media Library, database schema, storage policies, or deployment configuration.

## Branch and Release Status

Milestone 4 Phase 1 work is preserved on:

`feature/legacyhub-milestone-4-phase-1-public-home`

Final validation has passed on this branch. Nothing has been merged, deployed, or made indexable as part of this phase.

## Existing Implementation Audit

Production-capable foundations already present:

- Supabase-backed authentication, CMS, publishing workflow, Media Library, public gallery/archive routes, admin shell, audit tests, and LegacyHub platform pages.
- Public archive route group at `app/(public)`.
- Public archive shell at `app/(public)/layout.tsx`.
- Database-driven public menus via `components/public-navigation.tsx` and `lib/cms-store.ts`.
- Public CMS rendering through `components/cms/cms-public-page.tsx`.
- Public media access through `lib/media/queries.ts`.

Incomplete or deferred:

- Full interactive biography.
- Advanced historical timeline.
- Documentary centre with playback/transcripts.
- Family tree experience.
- Moderated public memory submission workflow.
- Digital museum collections.
- Archive-wide search and filtering.

## Phase 1 Implementation

The homepage now introduces Baba Muyi Legacy as a cinematic digital archive with:

- documentary-style hero
- approved public image integration with fallback
- archive introduction and curator context
- life journey preview
- transport heritage feature
- documentary preview
- archive collection preview
- lessons preview
- family and community memory preview
- closing legacy statement

## Data Sources

The homepage uses:

- `getActiveCmsWorkspaceContext`
- `getCmsCoreRecords(..., { publicOnly: true })`
- `getPublicMediaRecords({ type: "image" })`
- `getPublishedCmsContent("documentary", "/documentaries")`
- `getCmsMenus("header")`

Static copy that is not yet CMS-backed is centralised in `lib/baba-muyi-public-archive.ts`.

## Homepage Preview Fallback

The homepage preview layer catches failures from scoped published preview reads and renders an empty public-facing state instead of crashing the public archive. This fallback is intentionally limited to the homepage preview composition layer.

Safety rules:

- successful CMS and Media Library responses are rendered normally
- private, draft, review-stage and archived records are not substituted into public sections
- failed preview reads do not expose stack traces, credentials or internal database details to visitors
- the fallback does not change admin, CMS editing, Media Library management, RLS, storage policy or database behaviour

Operational note: preview failures should still be diagnosed from server logs during QA because the user-facing page intentionally remains discreet.

## Publication Rules

Public homepage sections must never render:

- draft content
- review-stage content
- archived content
- rejected content
- private content
- private media URLs
- unapproved stories

## Accessibility Decisions

- The homepage has one `h1`.
- Navigation remains keyboard accessible through the existing public shell.
- CTAs use descriptive link text.
- Hero fallback is text-based and does not rely on fake imagery.
- Motion uses `motion-reduce` safeguards.
- Headings remain semantic.

## Performance Decisions

- No new animation library was added.
- The homepage remains server-rendered.
- Approved hero media uses `next/image`.
- Below-the-fold sections use CSS only.
- Layouts use stable grids, aspect ratios, and responsive constraints.

## Noindex

The public archive shell now explicitly keeps public pages `noindex` until launch approval.

## Remote Media Acceptance

`pnpm test:media-remote` passes when inherited Supabase shell variables are cleared and the script loads the current `.env.local` configuration. The remote acceptance script is aligned with server-side Supabase Auth client options.

Confirmed:

- Supabase Storage buckets are present.
- JPEG, PNG, WebP, PDF, audio and MP4 upload flows pass.
- Media records, original versions, checksums and uploader attribution are created.
- Contributor, reviewer, viewer, anonymous and owner permission checks pass.
- Signed private URL access and expiry checks pass.
- Cross-tenant storage-path forgery is denied.
- Album and CMS media-linking checks pass.
- Unsupported and mismatched file uploads are rejected.
- Temporary media records, storage objects and Auth users are cleaned by the test.

The test clients use `persistSession: false`, `autoRefreshToken: false` and `detectSessionInUrl: false` for server-side acceptance execution. Secret values and credential fragments must not be documented or committed.

## Final Validation

Final acceptance validation covered:

- `pnpm test:milestone4-public-home`
- `pnpm test:phase2-landing`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:cms-core`
- `pnpm test:media-library`
- `pnpm test:media-remote`
- `pnpm test:admin-polish`
- `pnpm build`
- `git diff --check`

## Rollback

Rollback can be done by reverting:

- `app/(public)/page.tsx`
- `components/public-archive/homepage.tsx`
- `lib/baba-muyi-public-archive.ts`
- the Milestone 4 navigation and metadata changes
- `scripts/test-milestone4-public-home.mjs`

No database or storage rollback is required.

## Future Milestone 4 Phases

1. Phase 1: Cinematic homepage and archive shell.
2. Phase 2: Interactive biography.
3. Phase 3: Historical timeline and transport heritage.
4. Phase 4: Documentary centre and oral histories.
5. Phase 5: Advanced gallery and digital museum collections.
6. Phase 6: Family relationships and family tree.
7. Phase 7: Moderated community memories.
8. Phase 8: Archive-wide search, filtering and discovery.
