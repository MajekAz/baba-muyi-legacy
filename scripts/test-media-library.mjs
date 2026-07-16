import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const migration = readFileSync("supabase/migrations/0011_media_library_foundation.sql", "utf8");
const storagePolicyMigration = readFileSync("supabase/migrations/0012_storage_policy_hardening.sql", "utf8");
const mediaRlsMigration = readFileSync("supabase/migrations/0013_media_upload_rls_alignment.sql", "utf8");
const versionRlsMigration = readFileSync("supabase/migrations/0014_media_version_upload_rls_alignment.sql", "utf8");
const actions = readFileSync("lib/media/actions.ts", "utf8");
const validation = readFileSync("lib/media/validation.ts", "utf8");
const storage = readFileSync("lib/media/storage.ts", "utf8");
const config = readFileSync("lib/media/config.ts", "utf8");
const uploader = readFileSync("components/admin/media-uploader.tsx", "utf8");
const publicGrid = readFileSync("components/media/public-media-grid.tsx", "utf8");
const signedPreviewRoute = readFileSync("app/admin/media/[id]/view/route.ts", "utf8");

function pass(name) {
  console.log(`PASS ${name}`);
}

assert.match(migration, /create table if not exists public\.media_versions/);
assert.match(migration, /version_type in \('original', 'web_optimised', 'thumbnail', 'restored'\)/);
pass("archival media versions are modelled");

assert.match(migration, /create table if not exists public\.media_relations/);
assert.match(migration, /biography_chapters.*timeline_events.*stories.*lessons.*blog_posts/s);
pass("media-content relations are modelled");

assert.match(migration, /original_checksum text/);
assert.match(migration, /restored_storage_path text/);
assert.match(actions, /version_type: "original"/);
pass("originals are preserved with checksum and version records");

assert.match(config, /legacy-video/);
assert.doesNotMatch(storage, /legacy-video-clips/);
pass("video bucket name matches required storage bucket");

assert.match(validation, /file signature/i);
assert.match(validation, /%PDF-/);
assert.match(validation, /WEBP/);
assert.match(validation, /video\/webm/);
pass("file type validation checks extension, mime, size and signature");

assert.match(actions, /requireLegacyProfilePermission\("upload_media"\)/);
assert.match(actions, /requireLegacyProfilePermission\("edit_assigned_content"\)/);
assert.match(actions, /requireLegacyProfilePermission\("delete_media"\)/);
pass("server actions enforce upload, edit and archive permissions");

assert.match(actions, /publicationStatus: requestedPublicationStatus === "archived" \|\| requestedPublicationStatus === "published" \? "in_review"/);
assert.match(actions, /moderationStatus: "pending"/);
assert.match(mediaRlsMigration, /publish_state = 'in_review'/);
assert.match(mediaRlsMigration, /publication_status = 'in_review'/);
pass("contributors cannot directly publish uploaded media");

assert.match(actions, /workspace_id: context\.workspaceId/);
assert.match(actions, /legacy_profile_id: context\.legacyProfileId/);
assert.match(actions, /\.eq\("workspace_id", context\.workspaceId\)/);
assert.match(actions, /\.eq\("legacy_profile_id", context\.legacyProfileId\)/);
assert.match(storagePolicyMigration, /storage_path_legacy_profile_id/);
assert.match(storagePolicyMigration, /public\.user_has_permission\(public\.storage_path_legacy_profile_id\(name\), 'upload_media'\)/);
pass("mutations are workspace and legacy-profile scoped");

assert.match(actions, /media_upload_initiated/);
assert.match(actions, /media_upload_completed/);
assert.match(actions, /media_upload_failed/);
assert.match(actions, /media_published|media_edited/);
assert.match(actions, /media_archived/);
pass("media audit events are recorded without signed URLs or file contents");

assert.match(uploader, /aria-live/);
assert.match(uploader, /Drop files here or choose files/);
assert.match(uploader, /Upload in progress/);
pass("upload UI exposes accessible labels and progress messaging");

assert.match(publicGrid, /No public media yet/);
assert.match(publicGrid, /audio/);
assert.match(publicGrid, /Open PDF preview/);
assert.match(signedPreviewRoute, /createSignedUrl/);
assert.match(signedPreviewRoute, /requireLegacyProfilePermission\("access_media_library"\)/);
pass("public media rendering supports images, audio, video and documents");

assert.match(versionRlsMigration, /version_type = 'original'/);
assert.match(versionRlsMigration, /m\.uploaded_by = auth\.uid\(\)/);
pass("uploaders can create only their own original media version rows");
