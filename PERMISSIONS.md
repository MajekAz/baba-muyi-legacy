# Permissions

## Roles

- `owner`: Full workspace, legacy-profile, security, content, media, menu, settings, and audit-log control.
- `administrator`: Broad content, media, documentary, menu, invitation, and publishing control without owner-only platform control.
- `editor`: Creates and edits assigned content, uploads media, and works with documentaries/media library.
- `contributor`: Submits draft content and media for review.
- `reviewer`: Reviews submissions without default publishing rights.
- `viewer`: Can access explicitly granted private content only.

## Permission Keys

Permission keys are defined in `lib/permissions.ts` and mirrored in the Supabase enum `permission_key`:

- `manage_all_content`
- `manage_users`
- `manage_legacy_profiles`
- `upload_media`
- `delete_media`
- `publish_content`
- `manage_menus`
- `change_site_settings`
- `assign_roles`
- `view_audit_logs`
- `manage_privacy`
- `manage_supabase_settings`
- `review_submissions`
- `edit_assigned_content`
- `grant_private_viewing`
- `access_media_library`
- `access_documentaries`

## Enforcement Layers

1. Supabase RLS policies restrict database access by workspace, legacy profile, publishing state, visibility state, and role/permission.
2. Server actions use workspace-aware helpers from `lib/tenant-context.ts`.
3. Admin navigation uses role checks for usability, but hidden UI is not security.
4. Client code must never use service-role credentials.

## Workspace Isolation

Workspace membership is stored in `workspace_members`. Users can only read/manage workspaces they belong to, except public visitors who can read published public content.

## Legacy Profile Isolation

Legacy-profile membership is stored in `legacy_profile_members`. Workspace owners and administrators can manage profiles in their workspace. Legacy content must include `legacy_profile_id` where appropriate.

## Public Access

Public visitors can read only content that is both published and public. Draft, private, preview, family-only, invited, registered, specific-user, and password-protected content must remain behind server-side checks and RLS.

## Required Remote Tests

Before launch, test:

- Owner can manage workspace and first legacy profile.
- Editor cannot manage workspace membership.
- Contributor can submit drafts but cannot publish.
- Reviewer can review but cannot publish by default.
- Viewer can only read explicitly granted private content.
- User from Workspace A cannot read Workspace B records by changing IDs.
- Public users can read published public content only.
