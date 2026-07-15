# LegacyHub Data Model Review

This review is based on `supabase/migrations/0001_initial_foundation.sql`, `0002_cms_access_media_documentary_menu.sql`, `0003_workspace_saas_foundation.sql`, and `supabase/schema.sql`.

## Model Summary

The intended hierarchy is:

```text
LegacyHub Platform
-> Workspace
-> Legacy Profile
-> Legacy Content
```

The schema started as legacy-profile scoped and was extended with workspace tenancy in migration `0003`. Some legacy-profile tables were backfilled with `workspace_id`; some older concepts still overlap.

## Table Review

| Table | Purpose | Workspace ownership | Legacy-profile ownership | Relationships | Visibility/publishing | RLS expectation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `workspaces` | Customer/family/institution account. | Primary owner. | None. | Parent for members and profiles. | Status active/suspended/archived. | Members read; owners/admins manage. | Partial, remote untested. |
| `workspace_roles` | Workspace-level role catalogue. | Workspace/global. | None. | Role metadata. | Not public content. | Owners/admins manage. | Partial. |
| `workspace_members` | Users in a workspace. | Required. | None. | User to workspace. | Not public content. | Isolate by workspace. | Partial. |
| `workspace_invitations` | Invites into workspace. | Required. | Optional profile linkage in later workflow. | Inviter, invitee email, token. | Private. | Managers only; expiry/revocation. | Partial. |
| `legacy_profiles` | Preserved person/family/org/community. | Added by `0003`. | Self. | Parent for content. | Publish state and visibility. | Public reads published; members manage. | Partial. |
| `legacy_members` | Original profile membership model. | Missing direct workspace in original table. | Required. | User to profile. | Private. | Should be superseded by `legacy_profile_members`. | Duplicate concept. |
| `legacy_profile_members` | Workspace-aware profile membership. | Required. | Required. | User to profile within workspace. | Private. | Profile isolation. | Partial. |
| `user_roles` | Global role keys. | None. | None. | Referenced by profiles/members. | Public readable role list. | Readable; admin-managed later. | Partial. |
| `user_profiles` | User metadata. | Missing default active workspace. | None. | Auth user profile. | Private except own/admin. | Own profile plus owner/admin. | Partial. |
| `role_permissions` | Permission map by role. | Missing workspace override. | None. | Role to permission. | Private/admin. | Owners manage. | Partial. |
| `user_permissions` | Profile-specific permission overrides. | Missing workspace_id. | Required. | User/profile permissions. | Private. | Security managers only. | Partial; needs workspace_id. |
| `biography_chapters` | Biography content. | Added by `0003`. | Required. | Profile content. | Publish/visibility state. | Public published; editors manage. | Partial. |
| `timeline_events` | Chronology events. | Added by `0003`. | Required. | Profile content. | Publish/visibility state. | Public published; editors manage. | Partial. |
| `stories` | Memories and submitted stories. | Added by `0003`. | Required. | Profile, contributor. | Publish, visibility, moderation. | Public approved/published; reviewers/editors manage. | Partial. |
| `lessons` | Values/advice/teaching records. | Added by `0003`. | Required. | Profile content. | Publish/visibility state. | Public published; editors manage. | Partial. |
| `blog_posts` | Articles and updates. | Added by `0003`. | Required. | Categories/tags. | Publish/visibility state. | Public published; editors manage. | Partial. |
| `tributes` | Public/family tribute submissions. | Added by `0003`. | Required. | Contributor/profile. | Publish/moderation state. | Public can submit; approved public read. | Partial. |
| `categories` | Content classification. | Added by `0003` where relevant. | Optional. | Blog/content categories. | Usually public read. | Editors manage. | Partial. |
| `tags` | Content tags. | Added by `0003` where relevant. | Optional. | Content tags. | Usually public read. | Editors manage. | Partial. |
| `content_tags` | Generic tag joins. | Added by `0003`. | Required. | Polymorphic content relation. | Follows content. | Editors manage. | Partial; weak polymorphic constraints. |
| `content_revisions` | Revision snapshots. | Required in `0002`? currently legacy-profile scoped. | Required. | Record snapshots. | Private/admin. | Editors/reviewers. | Partial; no UI. |
| `media_albums` | Media collections. | Added by `0003`. | Required. | Contains media items. | Publish/visibility state. | Public published; editors manage. | Partial. |
| `media_items` | Images, audio, video, documents. | Added by `0003`. | Required. | Album, uploader, owner. | Privacy, publish, moderation. | Public approved; private signed access. | Partial; upload not complete. |
| `media_album_items` | Many-to-many album membership. | Missing direct workspace_id. | Indirect through album/media. | Album to media. | Follows album/media. | Should inherit from parent tables. | Partial. |
| `documentaries` | Documentary records. | Added by `0003`. | Required. | Episodes, media. | Publish/visibility state. | Public published; editors manage. | Partial. |
| `documentary_episodes` | Episode records. | Indirect through documentary; may need workspace_id. | Indirect through documentary. | Belongs to documentary. | Publish/visibility state. | Inherit documentary profile. | Partial. |
| `documentary_chapters` | Timestamp chapters. | Indirect through episode. | Indirect. | Belongs to episode. | Follows episode. | Inherit parent. | Partial. |
| `documentary_subtitles` | Subtitle files/tracks. | Indirect through episode. | Indirect. | Belongs to episode. | Follows episode. | Inherit parent. | Partial. |
| `documentary_transcripts` | Transcript text/files. | Indirect through episode. | Indirect. | Belongs to episode. | Follows episode. | Inherit parent. | Partial. |
| `family_members` | Family tree people. | Added by `0003`. | Required. | Relationships/media. | Private by default, public if approved. | Careful living-person protection. | Partial. |
| `family_relationships` | Graph edges between family members. | Added by `0003`. | Required. | From/to family members. | Follows member privacy. | Editors manage; public only if safe. | Partial. |
| `menus` | Navigation containers. | Added by `0003` or indirect. | Optional/required depending menu. | Menu items. | Status and location. | Public reads published; managers edit. | Partial. |
| `menu_items` | Navigation entries. | Added by `0003` or indirect. | Indirect through menu. | Parent/child menu tree. | Hidden/status/role restrictions. | Public reads visible; managers edit. | Partial. |
| `site_settings` | Profile/workspace settings. | Added by `0003`; legacy profile optional. | Optional. | Key/value settings. | Public or private depending key. | Owners manage. | Partial. |
| `audit_logs` | Security and content operation logs. | Added by `0003`; legacy profile optional. | Optional. | Actor, action, entity. | Private. | Owners/admins read. | Partial; writes incomplete. |
| `waiting_list` | Public SaaS interest list. | No workspace. | None. | Public form. | Private admin read. | Public insert, owner read. | Partial. |
| `invitations` | Original legacy-profile invitation model. | Missing workspace_id. | Required. | Invite to profile. | Private. | Superseded by workspace invitations. | Duplicate concept. |
| `access_grants` | Private content access grants. | Missing workspace_id. | Required. | Grantee user/email. | Private. | Privacy managers. | Partial; needs workspace_id. |

## Duplicate Concepts

- `legacy_members` and `legacy_profile_members` overlap.
- `invitations` and `workspace_invitations` overlap.
- `user_roles`, `workspace_roles`, and `role_permissions` need a clear final authority.
- `content_tags` and `blog_post_tags` overlap as generic versus blog-specific tagging.

## Missing Or Weak Ownership Fields

- `user_permissions` should include `workspace_id`.
- `invitations` should be replaced or migrated into `workspace_invitations`.
- `access_grants` should include `workspace_id`.
- Child documentary tables should consider direct `workspace_id` and `legacy_profile_id` for simpler RLS and indexes.
- Join tables such as `media_album_items` rely on parent inheritance and need carefully tested policies.

## Weak Constraints And Indexes To Review

- Polymorphic `content_revisions.record_type` / `record_id` cannot enforce database-level FK integrity.
- `content_tags.content_type` / `content_id` has similar polymorphic weakness.
- More composite indexes are needed for workspace/profile/status/visibility queries at scale.
- Invitation token hash uniqueness and expiry indexes should be verified.

## Tables To Postpone Or Keep Behind MVP Gates

- Billing/customer fields until monetisation phase.
- Advanced workspace roles beyond the six MVP roles.
- Marketplace/provider tables until services phase.
- AI credit/usage tables until AI phase.

## Future Migration Needs

1. Reconcile duplicate membership and invitation tables.
2. Add missing `workspace_id` fields or replacement tables.
3. Add `in_review` publication state if required by product workflow.
4. Add export job tables.
5. Add rate-limit and submission abuse tracking.
6. Add storage scan/malware status metadata.
