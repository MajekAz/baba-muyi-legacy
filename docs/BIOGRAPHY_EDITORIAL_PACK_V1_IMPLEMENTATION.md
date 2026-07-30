# Biography Editorial Pack v1.0 Implementation

## Overview

`BIOGRAPHY_EDITORIAL_PACK_v1.0` has been integrated as approved public biography content for `/biography`.

This implementation does not create a new CMS, schema, migration, layout, gallery, citation model, or editor workflow. It uses the existing CMS public renderer, rich-text sanitisation, public route shell, metadata support, and workspace/legacy-profile scoping.

## Content Storage

The approved biography content is stored in:

- `lib/biography-editorial-pack-v1.ts`

This file contains:

- the `/biography` CMS page metadata override
- the approved biography chapter fallback record
- the editorial/source-note metadata

The full biography is not hard-coded in the `/biography` route component.

## Loading Behaviour

The `/biography` route uses:

- `app/(public)/biography/page.tsx`
- `components/public-archive/biography-public-page.tsx`
- `components/cms/cms-public-page.tsx`
- `lib/cms-core.ts`
- `lib/cms-store.ts`

Public biography records are loaded from the active workspace and active Baba Muyi legacy profile.

If Supabase contains published public biography records for the active workspace/profile, those records are used.

If no published public biography records exist remotely, the approved local fallback record from `BIOGRAPHY_EDITORIAL_PACK_v1.0` is used. This keeps the page functional while allowing a future live CMS record to replace the fallback.

## Final Publication Architecture

The final v1.0 publication uses the existing public archive route, CMS public renderer, rich-text sanitiser, metadata API, and Media Library relationship support.

No schema, migration, new content API, new CMS table, new workflow, or layout redesign was introduced.

The publication architecture is:

1. `/biography` resolves through the public route group and Baba Muyi archive shell.
2. Route metadata is generated from the active CMS page record where available, with approved fallback values.
3. `BiographyPublicPage` emits minimal JSON-LD and delegates visible content rendering to the existing `CmsPublicPage`.
4. `CmsPublicPage` loads public biography chapters for the active workspace and legacy profile.
5. If the live CMS has no published public biography chapter, the typed `BIOGRAPHY_EDITORIAL_PACK_v1.0` fallback is used.

## CMS-Seeding Outcome

No repository-controlled, established Supabase content-seeding mechanism exists for safely inserting public CMS page and biography records outside migrations or the owner bootstrap process.

Because the approved instructions prohibit creating a new seeding workflow, database migration, schema change, table, content API, or editorial workflow for this milestone, v1.0 keeps the typed fallback as the publication source.

This does not reduce the readiness score because the fallback is intentionally routed through the existing CMS public renderer and can be replaced by a future live Supabase CMS record.

## Fallback Precedence Rules

The Biography page follows these precedence rules:

1. If Supabase public environment variables are unavailable, use the local CMS fallback store.
2. If Supabase is available and returns published public biography records scoped to the active workspace and legacy profile, render those live CMS records.
3. If Supabase is available but no published public biography record exists for the active workspace and legacy profile, render the approved typed `BIOGRAPHY_EDITORIAL_PACK_v1.0` fallback.
4. If the public biography query errors, only the Biography collection falls back to the typed approved pack so the published biography remains available without weakening other content behaviours.

## CMS Record Identifiers

Local fallback biography record:

- ID: `biography-editorial-pack-v1`
- Slug: `official-biography`
- Kind: `biography_chapter`
- Workspace: `workspace-baba-muyi-family-archive`
- Legacy profile: `legacy-profile-baba-muyi`
- Status: `published`
- Visibility: `public`
- Verification status: `partially_verified`

CMS page:

- ID: `page-biography`
- Path: `/biography`

## Metadata

The Biography page now supports route-specific metadata:

- page title
- meta description
- canonical URL
- Open Graph metadata
- Twitter/X metadata

Metadata values come from the existing CMS page fields where available:

- `seoTitle`
- `metaDescription`
- `title`
- `description`

Fallback values are used only when CMS fields are unavailable.

## Structured Data

The page emits minimal JSON-LD using verified-safe fields only:

- name
- page URL
- optional approved/scoped image
- archive page relationship

The JSON-LD deliberately does not include:

- birth date
- death date
- birthplace
- occupations
- awards
- family relationships
- family size
- property information
- disputed claims

## Featured Media Behaviour

For v1.0, the page supports one approved featured image per biography chapter through the existing media relationship system.

If no approved, published, public, workspace-scoped image is linked, the biography remains functional without an image.

No external placeholder image is used.

## Portrait Decision

Final publication-readiness review did not identify a clearly approved portrait that satisfies all v1.0 requirements:

- clearly depicts Baba Muyi
- belongs to the Baba Muyi legacy profile or project
- has no uncertainty regarding the person shown
- is appropriately licensed or family-owned
- is suitable for public display

Therefore v1.0 does not attach a featured portrait and does not display an empty image frame or placeholder.

## Open Graph Image Decision

Open Graph and Twitter/X image metadata are supported when an approved, public, workspace-scoped featured image is linked through the existing Media Library relationship model.

Because no clearly approved portrait was selected for v1.0, the Open Graph image and Twitter/X image values remain unset.

## Source Note Behaviour

The public editorial note is included at the end of the biography body using the existing rich-text renderer.

Internal editorial metadata is preserved in the local fallback source fields and documented here:

- Editorial version: `BIOGRAPHY_EDITORIAL_PACK_v1.0`
- Publication status: Approved
- Collection: Baba Muyi Family and Community History Collection
- Content type: Museum Biography
- Language: English
- Editorial attribution: Written and documented by Azeez Adeyemi Majekodunmi, the sixteenth child of Baba Muyi.
- Last editorial review date: 2026-07-30
- Verification status: Partially verified / oral-history based
- Verification basis: Family oral history and available archival materials

## Related Content Behaviour

The Biography page uses existing CMS page cards for related links.

Current related links:

- Timeline: `/timeline`
- Gallery: `/gallery`
- Documentary: `/documentaries`
- Legacy Lessons: `/lessons`
- Memorial Wall: `/tributes`

No new route was created solely to satisfy related-content requirements.

## Manual CMS Management Instructions

When the family is ready to manage the biography directly in Supabase CMS, an authorised editor should:

1. Sign in to the LegacyHub admin area.
2. Open `/admin/content/biography`.
3. Create or edit a Biography chapter scoped to the Baba Muyi Family Archive workspace and Baba Muyi legacy profile.
4. Use the approved title, summary, rich-text body, SEO title, SEO description, author attribution, source note, publication status, visibility, and verification status from `BIOGRAPHY_EDITORIAL_PACK_v1.0`.
5. Attach only approved public media through the existing featured or related media controls.
6. Publish through the existing CMS workflow buttons.
7. Confirm `/biography` renders the live CMS record before removing or superseding the fallback in a later approved change.

Editors should not manually copy unreviewed historical claims, private family notes, legal conclusions, or unapproved media into the public biography.

## Verification Limitations

The biography intentionally distinguishes approved family narrative from independently verified historical records.

Statements about disputed property, family conduct, business loss, document custody, betrayal, wrongdoing, or responsibility remain attributed to oral history and family recollection unless future documentary evidence is reviewed and approved.

## Rollback Procedure

If the v1.0 biography must be rolled back before merge, revert the Biography Editorial Pack commit.

If the v1.0 biography has already been merged but not deployed, revert the merge commit or open a follow-up PR removing:

- `lib/biography-editorial-pack-v1.ts`
- `components/public-archive/biography-public-page.tsx`
- Biography-specific metadata and fallback changes
- this implementation documentation and release checklist

If a live Supabase CMS record has been created later, archive or unpublish only that CMS record through the admin workflow. Do not delete remote data unless explicitly approved by the Founder and Editorial Team.

## Final Publication-Readiness Review

Final publication-readiness review date: 2026-07-30.

Review outcome:

- Approved v1.0 biography content is present in the typed fallback source.
- Public route renders the approved biography when no live CMS record exists.
- Metadata and JSON-LD are limited to verified-safe fields.
- No schema, migration, new CMS workflow, or homepage redesign was introduced.
- No featured portrait was attached because no clearly approved portrait was identified.

## Editor Update Process

An editor can update the biography later by:

1. Creating or editing a Biography chapter in `/admin/content/biography`.
2. Keeping the record scoped to the Baba Muyi workspace and legacy profile.
3. Using the existing rich-text editor for approved text.
4. Using the existing media relationship controls for featured media.
5. Setting visibility to `Public`.
6. Setting verification to `Family memory`, `Partially verified`, or `Verified`.
7. Publishing through the existing workflow button.

Once a live published public CMS biography record exists, it can replace the local fallback.

## Deferred Until v2.0

The following are deliberately deferred:

- structured citations
- footnotes
- advanced source records
- quick-facts schema
- pull-quote schema
- multiple inline media records
- time-coded documentary references
- evidence attachment system
- disputed-claim workflow
- multilingual biography schema changes
- advanced oral-history relationships

## Editorial Safeguards

The v1.0 biography includes approved cautionary language for disputed property, family conduct, business loss, document custody, betrayal, or wrongdoing. These statements remain presented as oral-history/editorial matters and are not converted into verified legal conclusions.
