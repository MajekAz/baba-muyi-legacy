# LegacyHub Multi-Page Regression Fix

## Summary

After the Milestone 4 Phase 1 and security maintenance merges, the LegacyHub platform homepage at `/legacyhub` was reported as feeling like a long single-page website instead of a concise overview that links to dedicated platform pages.

The approved platform information architecture remains:

- `/legacyhub`
- `/legacyhub/mission`
- `/legacyhub/who-it-is-for`
- `/legacyhub/capabilities`
- `/legacyhub/flagship-archive`
- `/legacyhub/roadmap`
- `/legacyhub/about`
- `/legacyhub/early-access`
- `/legacyhub/privacy`
- `/legacyhub/contact`
- `/login`

## Root Cause

The dedicated routes still existed and the platform header still used route paths, but `/legacyhub/page.tsx` imported the shared platform datasets and rendered multiple page-like sections directly on the homepage:

- audience-group previews from `audienceGroups`
- process steps from `processSteps`
- capability lists from `currentCapabilities` and `plannedCapabilities`
- roadmap previews from `milestoneFourAreas`

This made the homepage visually behave like a compressed single-page site. Existing Phase 2 tests confirmed route links existed, but did not assert that the homepage avoided rendering full dedicated-page content.

## Affected Files

- `app/(platform)/legacyhub/page.tsx`
- `scripts/test-phase-2-landing.mjs`
- `scripts/test-legacyhub-multipage.mjs`
- `package.json`

## Restored Route Structure

The dedicated platform route structure is preserved. The homepage now acts as a concise overview hub with route cards linking to:

- Mission
- Who It Is For
- Capabilities
- Flagship Archive
- Roadmap
- Early Access

The complete approved copy remains on the dedicated routes.

## Navigation Correction

Primary platform navigation remains route-based through `platformNavItems`:

- Mission: `/legacyhub/mission`
- Who It Is For: `/legacyhub/who-it-is-for`
- Capabilities: `/legacyhub/capabilities`
- Flagship Archive: `/legacyhub/flagship-archive`
- Roadmap: `/legacyhub/roadmap`
- About: `/legacyhub/about`
- Early Access: `/legacyhub/early-access`

Primary navigation must not use homepage hash anchors such as `#mission`, `#capabilities`, or `#early-access`.

## Content Preservation

Full content remains on the dedicated pages:

- mission statement and values on `/legacyhub/mission`
- audience groups on `/legacyhub/who-it-is-for`
- current and planned capabilities on `/legacyhub/capabilities`
- Baba Muyi flagship archive information on `/legacyhub/flagship-archive`
- roadmap and future phases on `/legacyhub/roadmap`
- platform/founder-context content on `/legacyhub/about`
- full early-access form on `/legacyhub/early-access`
- privacy and contact content on `/legacyhub/privacy` and `/legacyhub/contact`

The homepage does not duplicate the full early-access form and does not introduce public registration.

## Shell Separation

The fix preserves shell boundaries:

- `/` uses the Baba Muyi public archive shell.
- `/legacyhub` and `/legacyhub/*` use the LegacyHub platform shell.
- `/login` remains LegacyHub-branded auth UI.
- `/admin` uses the LegacyHub admin shell.

## Test Coverage

Added:

- `pnpm test:legacyhub-multipage`

The test verifies:

- all dedicated platform route files exist
- noindex remains enabled
- primary navigation uses route paths, not hash anchors
- `/legacyhub` does not render full audience, capability, process, roadmap, or form content
- dedicated pages retain their full content
- platform, public, admin and auth shells remain separate
- public registration remains disabled

## Rollback

If this fix needs to be reverted before merge:

1. Revert changes to `app/(platform)/legacyhub/page.tsx`, `package.json`, and test/docs files from this branch.
2. Run `pnpm test:phase2-landing`, `pnpm test:legacyhub-multipage`, `pnpm build`, and `git diff --check`.
3. Do not use destructive Git commands unless explicitly approved.
