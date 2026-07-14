# Changelog

## Unreleased

- Added workspace SaaS migration with `workspaces`, `workspace_members`, `workspace_invitations`, `workspace_roles`, `legacy_profile_members`, workspace ownership columns, indexes, permission helpers, RLS policies, and idempotent Baba Muyi workspace/profile/menu seed data.
- Added workspace-aware local CMS fallback metadata for the Baba Muyi Family Archive.
- Added workspace/legacy-profile context bar to the protected admin shell.
- Added workspace-aware tenant permission helpers.
- Added initial hand-maintained Supabase database types.
- Added `SAAS_ARCHITECTURE.md` and `PERMISSIONS.md`.

## 2026-07-14

- Added concrete public landing routes for all requested initial menu child destinations.
- Added admin menu-management form controls for menu location, nesting, label, slug, URL, link type, visibility, required role, status, sort order, icon, badge, description, and new-tab behavior.
- Added dedicated admin menu routes for header, mobile, footer, secondary, and admin menus.
- Added `/forgot-password` route alias for the password-reset flow.
- Added reusable Supabase Storage helper functions for safe filenames, unique paths, signed private URLs, and safe deletion.
- Changed admin route behavior to fail closed with a setup-required protected state when Supabase credentials are missing.
- Added CMS/access/media/documentary/menu foundation migration.
- Added Owner, Administrator, Editor, Contributor, Reviewer, and Viewer role definitions with reusable permission mappings.
- Added public navigation data, desktop dropdowns, and accessible mobile navigation.
- Added role-aware admin navigation plus admin route shells for content, media, documentaries, users/access, and menus.
- Added TipTap rich-text editor foundation for structured CMS content.
- Added media-library uploader UI with local file validation and previews.
- Added local foundation verification script for permissions, upload validation, and menu data.
- Paused real-content integration and completed a foundation audit pass.
- Added centralized environment validation and requested Supabase client file names.
- Added authentication route foundations for login, logout, reset, update, callback, and unauthorised states.
- Added a versioned Supabase foundation migration with reusable profile schema, RLS policies, storage buckets, and a draft/private Baba Muyi seed using only approved basic details.
- Added setup, Supabase, Hostinger deployment, and TODO documentation.
- Added a repeatable local route smoke-test script.
- Verified dependency install, linting, TypeScript checking, production build, dev-server route smoke tests, and safe missing-Supabase-environment behaviour.
- Added content governance inventory and gap documents.
- Confirmed `content-source/` contains guide/example files only, so no approved family content was imported.
- Added a safe content import script scaffold for future Supabase imports.
- Extended the database schema to preserve source, verification, privacy, and copyright metadata for imported legacy content.
- Migrated linting from deprecated `next lint` to the ESLint CLI.
