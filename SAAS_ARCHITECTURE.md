# SaaS Architecture

## Tenancy Model

The commercial platform uses this hierarchy:

```text
User
-> Workspace
-> Workspace Membership
-> Legacy Profile
-> Legacy Content
```

A user can belong to multiple workspaces. A workspace can contain one or more legacy profiles. Baba Muyi is the first seeded legacy profile inside the first seeded workspace, not a permanent global singleton.

## Initial Seed

The development and migration seed creates:

- Workspace: `Baba Muyi Family Archive`
- Workspace slug: `baba-muyi-family-archive`
- Workspace status: `active`
- Legacy profile: `Alhaji Tioluwalase "Baba Muyi" Majekodunmi`
- Legacy profile slug: `baba-muyi`
- Legacy profile type: `individual`
- Legacy profile status: `draft`
- Legacy profile visibility: `preview`
- Year of death: `2008`

No exact birth date or additional unverified biography facts are seeded.

## Database Ownership

Every SaaS-owned content table has or receives `workspace_id`. Legacy-specific content also has `legacy_profile_id`.

Workspace-scoped tables include `workspaces`, `workspace_members`, `workspace_invitations`, `workspace_roles`, `site_settings`, `audit_logs`, and all legacy content tables.

Legacy-profile-scoped content includes biography chapters, timeline events, stories, lessons, blog posts, tributes, media albums, media items, documentaries, documentary episodes, documentary child records, family members, family relationships, menus, menu items, and content revisions.

## Local Fallback

When Supabase credentials are missing, the app uses `data/cms.json` through `lib/cms-store.ts`. This is a development fallback only. It is workspace-aware and legacy-profile-aware, but it is not production database content and does not provide remote RLS guarantees.

## Production Authority

In production, Supabase should be the source of truth:

- Apply migrations in order.
- Create the first owner in Supabase Auth manually.
- Insert that owner into `user_profiles`, `workspace_members`, and optionally `legacy_profile_members`.
- Replace local fallback CMS mutations with Supabase repository mutations once credentials are available.

## Query Rule

Every admin query and mutation must include the active `workspace_id`. Legacy content queries and mutations must also include the active `legacy_profile_id`.

Client-side hiding is not security. RLS and server-side permission helpers are the security boundary.
