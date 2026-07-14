# Supabase Setup

## Manual Project Steps

1. Create a Supabase project.
2. Copy the Project URL and anon public key from Project Settings > API.
3. Copy the service role key for local/server-only administrative scripts.
4. Add the values to `.env.local`.
5. Add the production values to Hostinger environment variables.
6. Run all SQL migrations in order.
7. Confirm the storage buckets exist.
8. Create the first owner user in Supabase Auth.
9. Add that user to `user_profiles`, `workspace_members`, and optionally `legacy_profile_members` for the `baba-muyi-family-archive` workspace and `baba-muyi` profile with role `owner`.

## First Owner Bootstrap

After creating the owner in Supabase Auth, run SQL like this with the real auth user id:

```sql
insert into public.user_profiles (id, display_name, role)
values ('00000000-0000-0000-0000-000000000000', 'Platform Owner', 'owner')
on conflict (id) do update set role = 'owner';

insert into public.workspace_members (workspace_id, user_id, role)
select id, '00000000-0000-0000-0000-000000000000', 'owner'
from public.workspaces
where slug = 'baba-muyi-family-archive'
on conflict (workspace_id, user_id) do update set role = 'owner';

insert into public.legacy_profile_members (workspace_id, legacy_profile_id, user_id, role)
select workspace_id, id, '00000000-0000-0000-0000-000000000000', 'owner'
from public.legacy_profiles
where slug = 'baba-muyi'
on conflict (legacy_profile_id, user_id) do update set role = 'owner';
```

## Authentication URLs

Configure Supabase Auth redirect URLs:

- Local: `http://localhost:3000/auth/callback`
- Production: `https://babamuyilegacy.com/auth/callback`
- Password update local: `http://localhost:3000/update-password`
- Password update production: `https://babamuyilegacy.com/update-password`

Public self-registration is intentionally not implemented for the first release.

## RLS Policy Summary

- `role_permissions` and `user_permissions`: define global role defaults and per-user overrides.
- `invitations`: manageable only by users with user-management permission for the relevant profile.
- `access_grants`: scoped view/upload/edit/review/publish/media/documentary grants with expiry and revocation.
- `menus` and `menu_items`: public reads only published public items; menu managers can edit.
- `content_revisions`: stores historical snapshots for auditable edits.
- `user_roles`: readable by everyone so role labels can be displayed.
- `user_profiles`: users can read/update their own profile only.
- `legacy_profiles`: public users can read only published public profiles; members can read their assigned profile; owners can manage profile security.
- `legacy_members`: members can see their own membership; owners can manage profile membership.
- Public content tables: public reads require `publish_state = published` and `privacy_state = public`.
- Private content: readable only by members of the relevant legacy profile.
- Editors: can manage content for profiles where they are an editor or owner.
- Contributors: can submit draft/pending media, stories, and tributes but cannot publish.
- Family data: living family members require `public_visibility = true` before public read.
- Settings and audit logs: owner-controlled.
- Storage: public reads are limited to public image buckets; authenticated users may upload tribute files; browser code never uses service-role credentials.

## Storage Buckets

| Bucket | Public | Limit | Types |
| --- | --- | --- | --- |
| `legacy-images` | Yes | 10 MB | JPEG, PNG, WebP |
| `profile-images` | Yes | 10 MB | JPEG, PNG, WebP |
| `legacy-documents` | No | 50 MB | PDF, JPEG, PNG |
| `legacy-audio` | No | 100 MB | MP3, MP4 audio, WAV, WebM audio |
| `legacy-video-clips` | No | 250 MB | MP4, WebM, QuickTime |
| `tribute-uploads` | No | 50 MB | JPEG, PNG, WebP, PDF, MP3, MP4 |

Large documentary video should use YouTube, Cloudflare Stream, or Mux. Store only provider and playback identifiers in the database.

## Storage Rules

- Use unique paths: `{legacy_profile_id}/{media_kind}/{uuid}-{safe-file-name}`.
- The helper in `lib/media/storage.ts` creates safe filenames, bucket choices, unique storage paths, signed read URLs, and safe delete calls.
- Keep archival originals separate from web-optimised variants.
- Store original paths in `archival_storage_path`.
- Store optimised paths in `web_storage_path`.
- Use signed URLs for private buckets.
- Prefer soft deletion by setting `deleted_at` before removing storage objects.
- Store ownership, moderation, privacy, copyright, source, and verification metadata in `media_items`.

## Migrations

Run in order:

1. `supabase/migrations/0001_initial_foundation.sql`
2. `supabase/migrations/0002_cms_access_media_documentary_menu.sql`
3. `supabase/migrations/0003_workspace_saas_foundation.sql`

The second migration adds reusable CMS access, invitation, menu, media-library, documentary chapter/subtitle/transcript, revision, and permission tables.
The third migration adds workspace tenancy, workspace memberships, workspace invitations, workspace roles, legacy-profile memberships, workspace ownership columns, workspace-aware RLS helpers, and idempotent Baba Muyi workspace/profile/menu seed data.

## What Has Not Been Tested

Remote Supabase Auth, database queries, storage uploads, and RLS enforcement have not been tested because real Supabase credentials have not been supplied.

Until credentials are configured, admin routes intentionally show a protected setup-required state instead of exposing admin module content.
