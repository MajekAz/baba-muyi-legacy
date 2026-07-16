import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1).replace(/^["']|["']$/g, "");
    process.env[key] ||= value;
  }
}

loadEnvFile(".env.local");

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LEGACYHUB_OWNER_EMAIL",
  "LEGACYHUB_OWNER_PASSWORD"
];

for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is required for remote media acceptance tests.`);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const owner = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const marker = `m3-media-${Date.now()}`;

const temp = {
  users: [],
  storage: [],
  media: [],
  versions: [],
  albums: [],
  albumItems: [],
  content: [],
  relations: [],
  workspaces: []
};

function pass(label, detail = "") {
  console.log(`PASS ${label}${detail ? `: ${detail}` : ""}`);
}

function fail(label, detail = "") {
  console.log(`FAIL ${label}${detail ? `: ${detail}` : ""}`);
  process.exitCode = 1;
}

function assert(label, condition, detail = "") {
  condition ? pass(label, detail) : fail(label, detail);
}

function bytes(array) {
  return new Uint8Array(array);
}

const fixtures = [
  { label: "JPEG", kind: "image", bucket: "legacy-images", ext: "jpg", mime: "image/jpeg", data: bytes([0xff, 0xd8, 0xff, 0xe0, 0, 16, 74, 70, 73, 70, 0, 1, 0xff, 0xd9]) },
  { label: "PNG", kind: "image", bucket: "legacy-images", ext: "png", mime: "image/png", data: bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]) },
  { label: "WebP", kind: "image", bucket: "legacy-images", ext: "webp", mime: "image/webp", data: bytes([0x52, 0x49, 0x46, 0x46, 8, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]) },
  { label: "PDF", kind: "document", bucket: "legacy-documents", ext: "pdf", mime: "application/pdf", data: new TextEncoder().encode("%PDF-1.4\n% LegacyHub test\n%%EOF") },
  { label: "Audio", kind: "audio", bucket: "legacy-audio", ext: "m4a", mime: "audio/mp4", data: bytes([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x4d, 0x34, 0x41, 0x20]) },
  { label: "MP4", kind: "video_clip", bucket: "legacy-video", ext: "mp4", mime: "video/mp4", data: bytes([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]) }
];

function checksum(data) {
  return createHash("sha256").update(data).digest("hex");
}

function blob(data, mime) {
  return new Blob([data], { type: mime });
}

async function safeDelete(table, column, values) {
  if (!values.length) return;
  const { error } = await admin.from(table).delete().in(column, values);
  if (error) console.log(`WARN cleanup ${table}: ${error.message}`);
}

async function createRoleUser(role, workspaceId, legacyProfileId) {
  const email = `legacyhub-${marker}-${role}@example.test`;
  const password = `M3-${role}-${Date.now()}-password`;
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error || !created.data.user) throw new Error(`Unable to create ${role} user: ${created.error?.message}`);
  const userId = created.data.user.id;
  temp.users.push(userId);
  await admin.from("user_profiles").upsert({ id: userId, display_name: `TEMP ${role} media acceptance`, role }, { onConflict: "id" });
  await admin.from("workspace_members").insert({ workspace_id: workspaceId, user_id: userId, role, status: "active" });
  await admin.from("legacy_profile_members").insert({ workspace_id: workspaceId, legacy_profile_id: legacyProfileId, user_id: userId, role });
  const client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const signedIn = await client.auth.signInWithPassword({ email, password });
  if (signedIn.error) throw new Error(`Unable to sign in ${role}: ${signedIn.error.message}`);
  return { client, userId, role };
}

async function uploadFixtureAs(user, workspaceId, legacyProfileId, fixture) {
  const filename = `${marker}-${fixture.label.toLowerCase()}.${fixture.ext}`;
  const storagePath = `${legacyProfileId}/${fixture.kind}/${marker}/${crypto.randomUUID()}-${filename}`;
  const upload = await user.client.storage.from(fixture.bucket).upload(storagePath, blob(fixture.data, fixture.mime), {
    contentType: fixture.mime,
    upsert: false
  });
  assert(`${fixture.label} storage upload`, !upload.error, upload.error?.message);
  if (upload.error) return null;
  temp.storage.push({ bucket: fixture.bucket, path: storagePath });

  const hash = checksum(fixture.data);
  const inserted = await user.client.from("media_items").insert({
    workspace_id: workspaceId,
    legacy_profile_id: legacyProfileId,
    kind: fixture.kind,
    media_type: fixture.kind,
    title: `TEMP ${marker} ${fixture.label}`,
    stable_id: `${marker}-${fixture.label.toLowerCase()}`,
    original_filename: filename,
    generated_filename: filename,
    bucket: fixture.bucket,
    storage_bucket: fixture.bucket,
    storage_path: storagePath,
    archival_storage_path: storagePath,
    mime_type: fixture.mime,
    file_size_bytes: fixture.data.byteLength,
    file_size: fixture.data.byteLength,
    uploaded_by: user.userId,
    owner_user_id: user.userId,
    last_editor_id: user.userId,
    moderation_state: "pending",
    privacy_state: "private",
    visibility: "private",
    publish_state: "in_review",
    publication_status: "in_review",
    original_checksum: hash,
    scan_status: "not_scanned"
  }).select("id, uploaded_by, publish_state, publication_status, moderation_state, visibility, original_checksum, storage_bucket, storage_path").single();
  assert(`${fixture.label} media_items record`, !inserted.error && inserted.data?.publish_state === "in_review", inserted.error?.message);
  if (inserted.error || !inserted.data) return null;
  temp.media.push(inserted.data.id);
  assert(`${fixture.label} checksum`, inserted.data.original_checksum === hash, "checksum matches fixture");
  assert(`${fixture.label} uploaded_by`, inserted.data.uploaded_by === user.userId, "uploader recorded");

  const versionInsert = await user.client.from("media_versions").insert({
    workspace_id: workspaceId,
    legacy_profile_id: legacyProfileId,
    media_item_id: inserted.data.id,
    version_type: "original",
    storage_bucket: fixture.bucket,
    storage_path: storagePath,
    mime_type: fixture.mime,
    file_size: fixture.data.byteLength,
    checksum: hash,
    created_by: user.userId
  });
  assert(`${fixture.label} original version insert`, !versionInsert.error, versionInsert.error?.message);
  const version = await admin
    .from("media_versions")
    .select("id, version_type, checksum")
    .eq("media_item_id", inserted.data.id)
    .eq("version_type", "original")
    .maybeSingle();
  assert(`${fixture.label} original version record`, !version.error && version.data?.checksum === hash, version.error?.message);
  if (version.data?.id) temp.versions.push(version.data.id);

  return { ...inserted.data, fixture, hash };
}

async function main() {
  const signIn = await owner.auth.signInWithPassword({
    email: process.env.LEGACYHUB_OWNER_EMAIL,
    password: process.env.LEGACYHUB_OWNER_PASSWORD
  });
  if (signIn.error || !signIn.data.user) throw new Error("Owner sign-in failed.");
  const ownerId = signIn.data.user.id;
  const membership = await owner.from("workspace_members").select("workspace_id, role").eq("user_id", ownerId).eq("status", "active").limit(1).single();
  if (membership.error || !membership.data?.workspace_id) throw new Error("Owner workspace membership not found.");
  const workspaceId = membership.data.workspace_id;
  const profile = await owner.from("legacy_profiles").select("id, slug").eq("workspace_id", workspaceId).eq("slug", process.env.LEGACYHUB_LEGACY_PROFILE_SLUG || "baba-muyi").single();
  if (profile.error || !profile.data?.id) throw new Error("Baba Muyi legacy profile not found.");
  const legacyProfileId = profile.data.id;

  const buckets = await admin.storage.listBuckets();
  const bucketIds = new Set((buckets.data ?? []).map((bucket) => bucket.id));
  for (const bucket of ["legacy-images", "legacy-documents", "legacy-audio", "legacy-video", "profile-images", "tribute-uploads"]) {
    assert(`bucket ${bucket}`, bucketIds.has(bucket), "present");
  }

  const contributor = await createRoleUser("contributor", workspaceId, legacyProfileId);
  const reviewer = await createRoleUser("reviewer", workspaceId, legacyProfileId);
  const viewer = await createRoleUser("viewer", workspaceId, legacyProfileId);

  const uploaded = [];
  for (const fixture of fixtures) {
    const record = await uploadFixtureAs(contributor, workspaceId, legacyProfileId, fixture);
    if (record) uploaded.push(record);
  }

  const first = uploaded[0];
  if (!first) throw new Error("No media records were uploaded.");

  const contributorPublish = await contributor.client.from("media_items").update({
    publish_state: "published",
    publication_status: "published",
    privacy_state: "public",
    visibility: "public",
    moderation_state: "approved"
  }).eq("id", first.id).select("id");
  assert("contributor cannot publish media", Boolean(contributorPublish.error) || (contributorPublish.data?.length ?? 0) === 0, contributorPublish.error?.message || "publish denied");

  const reviewerApprove = await reviewer.client.from("media_items").update({
    moderation_state: "approved"
  }).eq("id", first.id).select("id, moderation_state").single();
  assert("reviewer can approve review media without publishing", !reviewerApprove.error && reviewerApprove.data?.moderation_state === "approved", reviewerApprove.error?.message);

  const reviewerPublish = await reviewer.client.from("media_items").update({
    publish_state: "published",
    publication_status: "published",
    privacy_state: "public",
    visibility: "public"
  }).eq("id", first.id).select("id");
  assert("reviewer cannot publish media", Boolean(reviewerPublish.error) || (reviewerPublish.data?.length ?? 0) === 0, reviewerPublish.error?.message || "publish denied");

  const viewerUpdate = await viewer.client.from("media_items").update({ title: "viewer should not update" }).eq("id", first.id).select("id");
  assert("viewer cannot modify media", Boolean(viewerUpdate.error) || (viewerUpdate.data?.length ?? 0) === 0, viewerUpdate.error?.message || "update denied");

  const anonPrivateRecord = await anon.from("media_items").select("id").eq("id", first.id);
  assert("anonymous cannot read private media item", !anonPrivateRecord.error && (anonPrivateRecord.data?.length ?? 0) === 0, anonPrivateRecord.error?.message);
  const anonPrivateObject = await anon.storage.from(first.storage_bucket).download(first.storage_path);
  assert("anonymous cannot download private object", Boolean(anonPrivateObject.error), anonPrivateObject.error?.message || "download denied");

  const ownerPublish = await owner.from("media_items").update({
    publish_state: "published",
    publication_status: "published",
    privacy_state: "public",
    visibility: "public",
    moderation_state: "approved",
    published_at: new Date().toISOString(),
    last_editor_id: ownerId
  }).eq("id", first.id).select("id, publication_status, visibility, moderation_state").single();
  assert("owner publishes approved media", !ownerPublish.error && ownerPublish.data?.publication_status === "published", ownerPublish.error?.message);
  const anonPublished = await anon.from("media_items").select("id").eq("id", first.id);
  assert("anonymous can read published public media item", !anonPublished.error && (anonPublished.data?.length ?? 0) === 1, anonPublished.error?.message);

  const signedViewRecords = [
    uploaded.find((item) => item.fixture.label === "PNG"),
    uploaded.find((item) => item.fixture.kind === "document"),
    uploaded.find((item) => item.fixture.kind === "audio")
  ].filter(Boolean);

  for (const record of signedViewRecords) {
    const signed = await admin.storage.from(record.storage_bucket).createSignedUrl(record.storage_path, 1);
    assert(`signed private ${record.fixture.label} URL issued`, !signed.error && Boolean(signed.data?.signedUrl), signed.error?.message);
    if (signed.data?.signedUrl) {
      const immediate = await fetch(signed.data.signedUrl);
      assert(`signed private ${record.fixture.label} URL works`, immediate.status === 200, `status ${immediate.status}`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const expired = await fetch(signed.data.signedUrl);
      assert(`signed private ${record.fixture.label} URL expires`, expired.status >= 400, `status ${expired.status}`);
    }
  }

  const otherWorkspace = await admin.from("workspaces").insert({ name: `TEMP ${marker} other workspace`, slug: `${marker}-other-workspace`, created_by: ownerId }).select("id").single();
  if (otherWorkspace.data?.id) temp.workspaces.push(otherWorkspace.data.id);
  const otherProfile = otherWorkspace.data ? await admin.from("legacy_profiles").insert({
    workspace_id: otherWorkspace.data.id,
    full_name: "TEMP Media Cross Tenant",
    display_name: "TEMP Media Cross Tenant",
    slug: `${marker}-other-profile`,
    summary: "Temporary profile for media RLS testing.",
    status: "draft",
    publish_state: "draft",
    visibility: "private",
    verification_state: "unverified"
  }).select("id").single() : { error: new Error("No other workspace."), data: null };
  assert("cross-tenant fixture created", !otherProfile.error && Boolean(otherProfile.data?.id), otherProfile.error?.message);
  if (otherProfile.data?.id) {
    const forgedPath = `${otherProfile.data.id}/image/${marker}/forged.jpg`;
    const forgedUpload = await contributor.client.storage.from("legacy-images").upload(forgedPath, blob(fixtures[0].data, fixtures[0].mime), { contentType: fixtures[0].mime });
    assert("cross-tenant storage path forgery denied", Boolean(forgedUpload.error), forgedUpload.error?.message || "upload denied");
    const forgedMedia = await contributor.client.from("media_items").insert({
      workspace_id: otherWorkspace.data.id,
      legacy_profile_id: otherProfile.data.id,
      kind: "image",
      media_type: "image",
      title: `TEMP ${marker} forged media`,
      stable_id: `${marker}-forged-media`,
      bucket: "legacy-images",
      storage_bucket: "legacy-images",
      storage_path: forgedPath,
      archival_storage_path: forgedPath,
      uploaded_by: contributor.userId,
      owner_user_id: contributor.userId,
      moderation_state: "pending",
      privacy_state: "private",
      visibility: "private",
      publish_state: "in_review",
      publication_status: "in_review"
    }).select("id");
    assert("cross-tenant media insert denied", Boolean(forgedMedia.error) || (forgedMedia.data?.length ?? 0) === 0, forgedMedia.error?.message || "insert denied");
  }

  const album = await owner.from("media_albums").insert({
    workspace_id: workspaceId,
    legacy_profile_id: legacyProfileId,
    title: `TEMP ${marker} album`,
    slug: `${marker}-album`,
    description: "Temporary media acceptance album.",
    privacy_state: "private",
    publish_state: "draft",
    cover_media_id: first.id,
    sort_order: 99999
  }).select("id").single();
  assert("album create", !album.error && Boolean(album.data?.id), album.error?.message);
  if (album.data?.id) {
    temp.albums.push(album.data.id);
    const albumItem = await owner.from("media_album_items").insert({
      workspace_id: workspaceId,
      legacy_profile_id: legacyProfileId,
      album_id: album.data.id,
      media_item_id: first.id,
      sort_order: 1
    }).select("id, sort_order").single();
    assert("album ordered media add", !albumItem.error && albumItem.data?.sort_order === 1, albumItem.error?.message);
    if (albumItem.data?.id) temp.albumItems.push(albumItem.data.id);
    const albumEdit = await owner.from("media_albums").update({ description: "Edited temporary album.", publish_state: "published", privacy_state: "public" }).eq("id", album.data.id).select("id, publish_state, privacy_state").single();
    assert("album edit and publish", !albumEdit.error && albumEdit.data?.publish_state === "published" && albumEdit.data?.privacy_state === "public", albumEdit.error?.message);
    const albumArchive = await owner.from("media_albums").update({ publish_state: "archived", archived_at: new Date().toISOString() }).eq("id", album.data.id).select("id, publish_state").single();
    assert("album archive", !albumArchive.error && albumArchive.data?.publish_state === "archived", albumArchive.error?.message);
  }

  const content = await owner.from("biography_chapters").insert({
    workspace_id: workspaceId,
    legacy_profile_id: legacyProfileId,
    title: `TEMP ${marker} linked biography`,
    slug: `${marker}-linked-biography`,
    excerpt: "Temporary linked content.",
    body: { html: "<p>Temporary linked content.</p>" },
    publish_state: "draft",
    privacy_state: "private",
    verification_state: "family_memory",
    sort_order: 99999,
    created_by: ownerId,
    author_id: ownerId,
    last_editor_id: ownerId
  }).select("id").single();
  assert("CMS content fixture create", !content.error && Boolean(content.data?.id), content.error?.message);
  if (content.data?.id) {
    temp.content.push(content.data.id);
    const relation = await owner.from("media_relations").insert({
      workspace_id: workspaceId,
      legacy_profile_id: legacyProfileId,
      media_item_id: first.id,
      related_table: "biography_chapters",
      related_id: content.data.id,
      relation_type: "featured",
      sort_order: 0,
      created_by: ownerId
    }).select("id").single();
    assert("CMS featured media link", !relation.error && Boolean(relation.data?.id), relation.error?.message);
    if (relation.data?.id) temp.relations.push(relation.data.id);
    const unlink = relation.data?.id ? await owner.from("media_relations").delete().eq("id", relation.data.id) : { error: new Error("no relation") };
    assert("CMS media unlink without deleting file", !unlink.error, unlink.error?.message);
  }

  const unsupported = await contributor.client.storage.from("legacy-images").upload(`${legacyProfileId}/image/${marker}/unsafe.exe`, blob(new Uint8Array([1, 2, 3]), "application/x-msdownload"), { contentType: "application/x-msdownload" });
  assert("unsupported file rejected by storage bucket", Boolean(unsupported.error), unsupported.error?.message || "rejected");
  const mismatched = await contributor.client.storage.from("legacy-documents").upload(`${legacyProfileId}/document/${marker}/mismatch.pdf`, blob(fixtures[0].data, "image/jpeg"), { contentType: "image/jpeg" });
  assert("mismatched MIME rejected by storage bucket", Boolean(mismatched.error), mismatched.error?.message || "rejected");

  console.log(`INFO temporary media records: ${temp.media.join(", ")}`);
  console.log(`INFO temporary storage objects: ${temp.storage.length}`);
}

try {
  await main();
} finally {
  await safeDelete("media_relations", "id", temp.relations);
  await safeDelete("media_album_items", "id", temp.albumItems);
  await safeDelete("media_versions", "id", temp.versions);
  await safeDelete("media_items", "id", temp.media);
  await safeDelete("media_albums", "id", temp.albums);
  await safeDelete("biography_chapters", "id", temp.content);
  for (const item of temp.storage.reverse()) {
    const { error } = await admin.storage.from(item.bucket).remove([item.path]);
    if (error) console.log(`WARN cleanup storage ${item.bucket}/${item.path}: ${error.message}`);
  }
  await safeDelete("workspaces", "id", temp.workspaces);
  for (const userId of temp.users) {
    const deleted = await admin.auth.admin.deleteUser(userId);
    if (deleted.error) console.log(`WARN cleanup auth user ${userId}: ${deleted.error.message}`);
  }
  console.log(`INFO temporary users cleaned: ${temp.users.length}`);
  console.log(`INFO temporary media cleaned: ${temp.media.length}`);
}
