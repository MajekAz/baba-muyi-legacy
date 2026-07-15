import { readFileSync } from "node:fs";
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
  if (!process.env[key]) throw new Error(`${key} is required for remote role tests.`);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const owner = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const marker = `milestone-2-role-${Date.now()}`;
const tempUserIds = [];
const tempRecordIds = [];
const tempWorkspaceIds = [];
const tempGrantIds = [];

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

async function safeDelete(table, column, values) {
  if (!values.length) return;
  const { error } = await admin.from(table).delete().in(column, values);
  if (error) console.log(`WARN cleanup ${table}: ${error.message}`);
}

function draftPayload({ workspaceId, legacyProfileId, actorId, slug, title, state = "draft", privacy = "private" }) {
  return {
    workspace_id: workspaceId,
    legacy_profile_id: legacyProfileId,
    title,
    slug,
    excerpt: "Temporary remote role-test record.",
    body: { html: "<p>Temporary remote role-test body.</p>" },
    publish_state: state,
    privacy_state: privacy,
    verification_state: "family_memory",
    sort_order: 99999,
    created_by: actorId,
    author_id: actorId,
    last_editor_id: actorId
  };
}

async function createRoleUser(role, workspaceId, legacyProfileId, label = role) {
  const email = `legacyhub-${marker}-${label}@example.test`;
  const password = `M2-${role}-${Date.now()}-password`;
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error || !created.data.user) throw new Error(`Unable to create ${role} user: ${created.error?.message}`);
  const userId = created.data.user.id;
  tempUserIds.push(userId);

  const profile = await admin
    .from("user_profiles")
    .upsert({ id: userId, display_name: `TEMP ${role} remote role test`, role }, { onConflict: "id" });
  if (profile.error) throw new Error(`Unable to upsert ${role} profile: ${profile.error.message}`);

  const workspaceMember = await admin
    .from("workspace_members")
    .insert({ workspace_id: workspaceId, user_id: userId, role, status: "active" });
  if (workspaceMember.error) throw new Error(`Unable to create ${role} workspace membership: ${workspaceMember.error.message}`);

  const profileMember = await admin
    .from("legacy_profile_members")
    .insert({ workspace_id: workspaceId, legacy_profile_id: legacyProfileId, user_id: userId, role });
  if (profileMember.error) throw new Error(`Unable to create ${role} profile membership: ${profileMember.error.message}`);

  const client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const signedIn = await client.auth.signInWithPassword({ email, password });
  if (signedIn.error) throw new Error(`Unable to sign in ${role} user: ${signedIn.error.message}`);
  return { client, userId, role };
}

async function insertDraftAs(testUser, workspaceId, legacyProfileId, suffix = testUser.role) {
  const payload = draftPayload({
    workspaceId,
    legacyProfileId,
    actorId: testUser.userId,
    slug: `${marker}-${suffix}`,
    title: `TEMP ${marker} ${suffix}`
  });
  const result = await testUser.client.from("biography_chapters").insert(payload).select("id,publish_state,created_by,last_editor_id").single();
  if (result.data?.id) tempRecordIds.push(result.data.id);
  return result;
}

try {
  const ownerSignIn = await owner.auth.signInWithPassword({
    email: process.env.LEGACYHUB_OWNER_EMAIL,
    password: process.env.LEGACYHUB_OWNER_PASSWORD
  });
  if (ownerSignIn.error || !ownerSignIn.data.user) throw new Error("Owner sign-in failed.");
  const ownerId = ownerSignIn.data.user.id;

  const membership = await owner
    .from("workspace_members")
    .select("id,workspace_id,role")
    .eq("user_id", ownerId)
    .eq("status", "active")
    .limit(1)
    .single();
  if (membership.error || !membership.data?.workspace_id) throw new Error("Owner workspace membership could not be loaded.");

  const workspaceId = membership.data.workspace_id;
  const legacyProfile = await owner
    .from("legacy_profiles")
    .select("id,slug")
    .eq("workspace_id", workspaceId)
    .eq("slug", process.env.LEGACYHUB_LEGACY_PROFILE_SLUG || "baba-muyi")
    .single();
  if (legacyProfile.error || !legacyProfile.data?.id) throw new Error("Baba Muyi legacy profile could not be loaded.");

  const legacyProfileId = legacyProfile.data.id;
  const roles = {
    administrator: await createRoleUser("administrator", workspaceId, legacyProfileId),
    editor: await createRoleUser("editor", workspaceId, legacyProfileId),
    contributor: await createRoleUser("contributor", workspaceId, legacyProfileId),
    reviewer: await createRoleUser("reviewer", workspaceId, legacyProfileId),
    viewer: await createRoleUser("viewer", workspaceId, legacyProfileId),
    otherContributor: await createRoleUser("contributor", workspaceId, legacyProfileId, "other-contributor")
  };

  const adminDraft = await insertDraftAs(roles.administrator, workspaceId, legacyProfileId, "administrator");
  assert("administrator creates assigned workspace content", !adminDraft.error && adminDraft.data?.created_by === roles.administrator.userId, adminDraft.error?.message);
  const adminPublish = adminDraft.data
    ? await roles.administrator.client.from("biography_chapters").update({ publish_state: "published", privacy_state: "public", last_editor_id: roles.administrator.userId }).eq("id", adminDraft.data.id).select("id,publish_state").single()
    : { error: new Error("no admin draft"), data: null };
  assert("administrator publishes assigned content", !adminPublish.error && adminPublish.data?.publish_state === "published", adminPublish.error?.message);
  const adminOwnerOverride = await roles.administrator.client
    .from("workspace_members")
    .update({ role: "viewer" })
    .eq("id", membership.data.id)
    .select("id,role");
  assert("administrator cannot override workspace owner", Boolean(adminOwnerOverride.error) || (adminOwnerOverride.data?.length ?? 0) === 0, adminOwnerOverride.error?.message || "no owner row updated");

  const editorDraft = await insertDraftAs(roles.editor, workspaceId, legacyProfileId, "editor");
  assert("editor creates permitted content", !editorDraft.error && editorDraft.data?.created_by === roles.editor.userId, editorDraft.error?.message);
  const editorEdit = editorDraft.data
    ? await roles.editor.client.from("biography_chapters").update({ excerpt: "Edited by editor", last_editor_id: roles.editor.userId }).eq("id", editorDraft.data.id).select("id,last_editor_id").single()
    : { error: new Error("no editor draft"), data: null };
  assert("editor edits permitted content", !editorEdit.error && editorEdit.data?.last_editor_id === roles.editor.userId, editorEdit.error?.message);
  const editorPublish = editorDraft.data
    ? await roles.editor.client.from("biography_chapters").update({ publish_state: "published", last_editor_id: roles.editor.userId }).eq("id", editorDraft.data.id).select("id")
    : { error: new Error("no editor draft"), data: [] };
  assert("editor cannot publish without grant", Boolean(editorPublish.error) || (editorPublish.data?.length ?? 0) === 0, editorPublish.error?.message || "publish denied");
  const editorSecurity = await roles.editor.client.from("workspace_members").update({ role: "viewer" }).eq("id", membership.data.id).select("id");
  assert("editor cannot alter workspace security", Boolean(editorSecurity.error) || (editorSecurity.data?.length ?? 0) === 0, editorSecurity.error?.message || "security update denied");

  const contributorDraft = await insertDraftAs(roles.contributor, workspaceId, legacyProfileId, "contributor");
  assert("contributor creates draft", !contributorDraft.error && contributorDraft.data?.publish_state === "draft", contributorDraft.error?.message);
  const contributorPublish = contributorDraft.data
    ? await roles.contributor.client.from("biography_chapters").update({ publish_state: "published", last_editor_id: roles.contributor.userId }).eq("id", contributorDraft.data.id).select("id")
    : { error: new Error("no contributor draft"), data: [] };
  assert("contributor cannot publish", Boolean(contributorPublish.error) || (contributorPublish.data?.length ?? 0) === 0, contributorPublish.error?.message || "publish denied");

  const otherDraft = await insertDraftAs(roles.otherContributor, workspaceId, legacyProfileId, "other-contributor");
  const contributorEditsOther = otherDraft.data
    ? await roles.contributor.client.from("biography_chapters").update({ excerpt: "Should not edit", last_editor_id: roles.contributor.userId }).eq("id", otherDraft.data.id).select("id")
    : { error: new Error("no other contributor draft"), data: [] };
  assert("contributor cannot edit another contributor content", Boolean(contributorEditsOther.error) || (contributorEditsOther.data?.length ?? 0) === 0, contributorEditsOther.error?.message || "other contributor update denied");

  const reviewerDraft = await insertDraftAs(roles.reviewer, workspaceId, legacyProfileId, "reviewer");
  assert("reviewer can save review-stage content", !reviewerDraft.error && reviewerDraft.data?.created_by === roles.reviewer.userId, reviewerDraft.error?.message);
  const reviewerReturn = contributorDraft.data
    ? await roles.reviewer.client.from("biography_chapters").update({ publish_state: "draft", excerpt: "Returned by reviewer", last_editor_id: roles.reviewer.userId }).eq("id", contributorDraft.data.id).select("id,last_editor_id").single()
    : { error: new Error("no contributor draft"), data: null };
  assert("reviewer reviews and returns submissions", !reviewerReturn.error && reviewerReturn.data?.last_editor_id === roles.reviewer.userId, reviewerReturn.error?.message);
  const reviewerPublish = contributorDraft.data
    ? await roles.reviewer.client.from("biography_chapters").update({ publish_state: "published", last_editor_id: roles.reviewer.userId }).eq("id", contributorDraft.data.id).select("id")
    : { error: new Error("no contributor draft"), data: [] };
  assert("reviewer cannot publish without separate permission", Boolean(reviewerPublish.error) || (reviewerPublish.data?.length ?? 0) === 0, reviewerPublish.error?.message || "publish denied");

  const viewerCreate = await insertDraftAs(roles.viewer, workspaceId, legacyProfileId, "viewer");
  assert("viewer cannot create content", Boolean(viewerCreate.error) || !viewerCreate.data?.id, viewerCreate.error?.message || "insert denied");
  if (viewerCreate.data?.id) tempRecordIds.push(viewerCreate.data.id);

  const restricted = await admin
    .from("biography_chapters")
    .insert(draftPayload({
      workspaceId,
      legacyProfileId,
      actorId: ownerId,
      slug: `${marker}-restricted`,
      title: `TEMP ${marker} restricted`,
      state: "draft",
      privacy: "specific_users"
    }))
    .select("id")
    .single();
  if (restricted.data?.id) tempRecordIds.push(restricted.data.id);
  assert("restricted fixture created", !restricted.error && Boolean(restricted.data?.id), restricted.error?.message);

  const viewerNoGrant = restricted.data
    ? await roles.viewer.client.from("biography_chapters").select("id").eq("id", restricted.data.id)
    : { error: new Error("no restricted record"), data: [] };
  assert("viewer cannot read restricted content without grant", !viewerNoGrant.error && (viewerNoGrant.data?.length ?? 0) === 0, viewerNoGrant.error?.message);

  if (restricted.data?.id) {
    const grant = await admin
      .from("access_grants")
      .insert({
        workspace_id: workspaceId,
        legacy_profile_id: legacyProfileId,
        grantee_user_id: roles.viewer.userId,
        content_table: "biography_chapters",
        content_id: restricted.data.id,
        can_view: true,
        granted_by: ownerId
      })
      .select("id")
      .single();
    if (grant.data?.id) tempGrantIds.push(grant.data.id);
    assert("viewer access grant fixture created", !grant.error && Boolean(grant.data?.id), grant.error?.message);
  }

  const viewerWithGrant = restricted.data
    ? await roles.viewer.client.from("biography_chapters").select("id").eq("id", restricted.data.id)
    : { error: new Error("no restricted record"), data: [] };
  assert("viewer reads specifically granted restricted content", !viewerWithGrant.error && (viewerWithGrant.data?.length ?? 0) === 1, viewerWithGrant.error?.message);
  const viewerUpdate = restricted.data
    ? await roles.viewer.client.from("biography_chapters").update({ excerpt: "Viewer should not edit" }).eq("id", restricted.data.id).select("id")
    : { error: new Error("no restricted record"), data: [] };
  assert("viewer cannot modify content", Boolean(viewerUpdate.error) || (viewerUpdate.data?.length ?? 0) === 0, viewerUpdate.error?.message || "update denied");

  const otherWorkspace = await admin
    .from("workspaces")
    .insert({ name: `TEMP ${marker} other workspace`, slug: `${marker}-other-workspace`, created_by: ownerId })
    .select("id")
    .single();
  if (otherWorkspace.data?.id) tempWorkspaceIds.push(otherWorkspace.data.id);
  const otherProfile = otherWorkspace.data
    ? await admin
        .from("legacy_profiles")
        .insert({
          workspace_id: otherWorkspace.data.id,
          full_name: "Temporary Cross Workspace Profile",
          display_name: "Temporary Cross Workspace Profile",
          slug: `${marker}-other-profile`,
          summary: "Temporary profile for remote RLS testing.",
          status: "draft",
          publish_state: "draft",
          visibility: "private",
          verification_state: "unverified"
        })
        .select("id")
        .single()
    : { error: new Error("no other workspace"), data: null };
  assert("cross-workspace fixture created", !otherProfile.error && Boolean(otherProfile.data?.id), otherProfile.error?.message);
  const crossWorkspaceInsert = otherWorkspace.data && otherProfile.data
    ? await roles.editor.client.from("biography_chapters").insert(draftPayload({
        workspaceId: otherWorkspace.data.id,
        legacyProfileId: otherProfile.data.id,
        actorId: roles.editor.userId,
        slug: `${marker}-cross-workspace`,
        title: `TEMP ${marker} cross workspace`
      })).select("id")
    : { error: new Error("no cross-workspace fixture"), data: [] };
  assert("cross-workspace insert denied", Boolean(crossWorkspaceInsert.error) || (crossWorkspaceInsert.data?.length ?? 0) === 0, crossWorkspaceInsert.error?.message || "insert denied");
} finally {
  await safeDelete("access_grants", "id", tempGrantIds);
  await safeDelete("biography_chapters", "id", tempRecordIds);
  await safeDelete("workspaces", "id", tempWorkspaceIds);
  for (const userId of tempUserIds) {
    const deleted = await admin.auth.admin.deleteUser(userId);
    if (deleted.error) console.log(`WARN cleanup auth user ${userId}: ${deleted.error.message}`);
  }
  console.log(`INFO temporary remote-role users cleaned: ${tempUserIds.length}`);
  console.log(`INFO temporary remote-role records cleaned: ${tempRecordIds.length}`);
}
