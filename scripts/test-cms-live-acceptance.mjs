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
  if (!process.env[key]) {
    throw new Error(`${key} is required for live acceptance tests.`);
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const owner = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

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

async function assertProtectedRoute(label, url) {
  const response = await fetch(url, { redirect: "manual", headers: { cookie: "" } });
  const text = await response.text();
  const isRedirect =
    [302, 303, 307, 308].includes(response.status) ||
    response.headers.get("location")?.includes("/login") ||
    text.includes("NEXT_REDIRECT") ||
    text.includes("/login?reason=admin-access");
  assert(label, isRedirect, `status ${response.status}`);
}

const signIn = await owner.auth.signInWithPassword({
  email: process.env.LEGACYHUB_OWNER_EMAIL,
  password: process.env.LEGACYHUB_OWNER_PASSWORD
});

if (signIn.error || !signIn.data.user) {
  throw new Error("Owner sign-in failed.");
}

const ownerId = signIn.data.user.id;
const membership = await owner
  .from("workspace_members")
  .select("workspace_id, role")
  .eq("user_id", ownerId)
  .eq("status", "active")
  .limit(1)
  .single();

if (membership.error || !membership.data?.workspace_id) {
  throw new Error("Owner workspace membership could not be loaded.");
}

const workspaceId = membership.data.workspace_id;
const profile = await owner
  .from("legacy_profiles")
  .select("id, slug, display_name")
  .eq("workspace_id", workspaceId)
  .eq("slug", process.env.LEGACYHUB_LEGACY_PROFILE_SLUG || "baba-muyi")
  .single();

if (profile.error || !profile.data?.id) {
  throw new Error("Baba Muyi legacy profile could not be loaded.");
}

const legacyProfileId = profile.data.id;
assert("owner workspace role", membership.data.role === "owner", "existing owner has workspace owner role");
assert("Baba Muyi workspace/profile scope", Boolean(workspaceId && legacyProfileId), "workspace and legacy profile resolved");

const marker = `milestone-2-acceptance-${Date.now()}`;
const collections = [
  {
    name: "biography",
    table: "biography_chapters",
    publicPath: "/biography",
    slugColumn: "slug",
    makeInsert(slug) {
      return {
        workspace_id: workspaceId,
        legacy_profile_id: legacyProfileId,
        title: `TEMP ${marker} biography`,
        slug,
        excerpt: "Temporary draft biography acceptance record.",
        body: { html: "<p>Temporary <strong>biography</strong> body.</p><script>alert(1)</script>" },
        publish_state: "draft",
        privacy_state: "private",
        verification_state: "family_memory",
        sort_order: 99999,
        created_by: ownerId,
        author_id: ownerId,
        last_editor_id: ownerId
      };
    },
    edit: {
      excerpt: "Temporary edited biography acceptance record.",
      body: { html: '<p>Edited biography body with <a href="javascript:alert(1)" onclick="bad()">unsafe link</a>.</p>' },
      last_editor_id: ownerId
    },
    publish: { publish_state: "published", privacy_state: "public", published_at: new Date().toISOString(), last_editor_id: ownerId }
  },
  {
    name: "timeline",
    table: "timeline_events",
    publicPath: "/timeline",
    slugColumn: "stable_id",
    makeInsert(slug) {
      return {
        workspace_id: workspaceId,
        legacy_profile_id: legacyProfileId,
        title: `TEMP ${marker} timeline`,
        stable_id: slug,
        description: "Temporary draft timeline acceptance record.",
        date_label: "date to be confirmed",
        category: "acceptance-test",
        location: "Temporary location",
        publish_state: "draft",
        privacy_state: "private",
        verification_state: "family_memory",
        sort_order: 99999,
        created_by: ownerId,
        author_id: ownerId,
        last_editor_id: ownerId
      };
    },
    edit: { description: "Temporary edited timeline acceptance record.", date_label: "approximate", last_editor_id: ownerId },
    publish: { publish_state: "published", privacy_state: "public", last_editor_id: ownerId }
  },
  {
    name: "stories",
    table: "stories",
    publicPath: "/stories",
    slugColumn: "stable_id",
    makeInsert(slug) {
      return {
        workspace_id: workspaceId,
        legacy_profile_id: legacyProfileId,
        title: `TEMP ${marker} story`,
        stable_id: slug,
        body: "<p>Temporary story body.</p>",
        contributor_name: "Milestone 2 owner acceptance",
        moderation_state: "pending",
        publish_state: "draft",
        privacy_state: "private",
        verification_state: "family_memory",
        created_by: ownerId,
        author_id: ownerId,
        last_editor_id: ownerId
      };
    },
    edit: { body: "<p>Temporary edited story body.</p>", last_editor_id: ownerId },
    publish: { publish_state: "published", privacy_state: "public", moderation_state: "approved", last_editor_id: ownerId }
  },
  {
    name: "lessons",
    table: "lessons",
    publicPath: "/lessons",
    slugColumn: "stable_id",
    makeInsert(slug) {
      return {
        workspace_id: workspaceId,
        legacy_profile_id: legacyProfileId,
        title: `TEMP ${marker} lesson`,
        stable_id: slug,
        introduction: "Temporary draft lesson acceptance record.",
        body: "<p>Temporary lesson body.</p>",
        author: "Milestone 2 owner acceptance",
        publish_state: "draft",
        privacy_state: "private",
        verification_state: "family_memory",
        created_by: ownerId,
        author_id: ownerId,
        last_editor_id: ownerId
      };
    },
    edit: { introduction: "Temporary edited lesson acceptance record.", body: "<p>Temporary edited lesson body.</p>", last_editor_id: ownerId },
    publish: { publish_state: "published", privacy_state: "public", last_editor_id: ownerId }
  },
  {
    name: "blog",
    table: "blog_posts",
    publicPath: "/blog",
    slugColumn: "slug",
    makeInsert(slug) {
      return {
        workspace_id: workspaceId,
        legacy_profile_id: legacyProfileId,
        title: `TEMP ${marker} blog`,
        slug,
        excerpt: "Temporary draft blog acceptance record.",
        body: { html: "<p>Temporary blog body.</p>" },
        author: "Milestone 2 owner acceptance",
        publish_state: "draft",
        privacy_state: "private",
        verification_state: "family_memory",
        created_by: ownerId,
        author_id: ownerId,
        last_editor_id: ownerId
      };
    },
    edit: { excerpt: "Temporary edited blog acceptance record.", body: { html: "<p>Temporary edited blog body.</p>" }, last_editor_id: ownerId },
    publish: { publish_state: "published", privacy_state: "public", published_at: new Date().toISOString(), last_editor_id: ownerId }
  }
];

const tempRecords = [];

for (const item of collections) {
  const slug = `${marker}-${item.name}`;
  const inserted = await owner.from(item.table).insert(item.makeInsert(slug)).select("id,title,workspace_id,legacy_profile_id,publish_state,privacy_state,created_by,last_editor_id").single();
  assert(`${item.name} create draft`, !inserted.error && inserted.data?.publish_state === "draft", inserted.error?.message);
  if (inserted.error || !inserted.data) continue;

  const id = inserted.data.id;
  tempRecords.push({ table: item.table, id, name: item.name, title: inserted.data.title });
  assert(`${item.name} workspace ownership`, inserted.data.workspace_id === workspaceId, "workspace_id matches Baba Muyi workspace");
  assert(`${item.name} legacy profile ownership`, inserted.data.legacy_profile_id === legacyProfileId, "legacy_profile_id matches Baba Muyi profile");
  assert(`${item.name} create attribution`, inserted.data.created_by === ownerId && inserted.data.last_editor_id === ownerId, "owner recorded as creator/editor");

  const edited = await owner.from(item.table).update(item.edit).eq("id", id).select("id,updated_at,last_editor_id").single();
  assert(`${item.name} edit`, !edited.error && Boolean(edited.data?.id) && edited.data?.last_editor_id === ownerId, edited.error?.message);

  const preview = await owner.from(item.table).select("id,title,publish_state,privacy_state").eq("id", id).single();
  assert(`${item.name} private preview via owner session`, !preview.error && preview.data?.privacy_state === "private", preview.error?.message);

  const publicDraft = await anon.from(item.table).select("id").eq("id", id);
  assert(`${item.name} draft hidden from public`, !publicDraft.error && (publicDraft.data?.length ?? 0) === 0, publicDraft.error?.message);

  const published = await owner.from(item.table).update(item.publish).eq("id", id).select("id,publish_state,privacy_state").single();
  assert(`${item.name} publish`, !published.error && published.data?.publish_state === "published" && published.data?.privacy_state === "public", published.error?.message);

  const publicPublished = await anon.from(item.table).select("id,title").eq("id", id);
  assert(`${item.name} public Supabase visibility`, !publicPublished.error && (publicPublished.data?.length ?? 0) === 1, publicPublished.error?.message);

  const publicRoute = await fetch(`${appUrl}${item.publicPath}`, { redirect: "manual" });
  const publicHtml = await publicRoute.text();
  assert(`${item.name} public app route contains published temporary title`, publicRoute.status === 200 && publicHtml.includes(inserted.data.title), `status ${publicRoute.status}`);
  assert(`${item.name} public app route sanitises script`, !publicHtml.includes("<script>alert(1)</script>") && !publicHtml.includes("javascript:alert"), "unsafe HTML not present");

  const archived = await owner.from(item.table).update({ publish_state: "archived", last_editor_id: ownerId }).eq("id", id).select("id,publish_state,last_editor_id").single();
  assert(`${item.name} archive`, !archived.error && archived.data?.publish_state === "archived" && archived.data?.last_editor_id === ownerId, archived.error?.message);

  const publicArchived = await anon.from(item.table).select("id").eq("id", id);
  assert(`${item.name} archived hidden from public Supabase`, !publicArchived.error && (publicArchived.data?.length ?? 0) === 0, publicArchived.error?.message);

  const archivedRoute = await fetch(`${appUrl}${item.publicPath}`, { redirect: "manual" });
  const archivedHtml = await archivedRoute.text();
  assert(`${item.name} archived hidden from public app route`, archivedRoute.status === 200 && !archivedHtml.includes(inserted.data.title), `status ${archivedRoute.status}`);
}

const testEmail = `legacyhub-nonmember-${Date.now()}@example.test`;
const testPassword = `M2-test-${Date.now()}-password`;
const createdUser = await admin.auth.admin.createUser({
  email: testEmail,
  password: testPassword,
  email_confirm: true
});

if (!createdUser.error && createdUser.data.user) {
  const outsider = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  await outsider.auth.signInWithPassword({ email: testEmail, password: testPassword });
  const target = tempRecords[0];
  if (target) {
    const outsiderRead = await outsider.from(target.table).select("id").eq("id", target.id);
    assert("non-member cannot read archived workspace content", !outsiderRead.error && (outsiderRead.data?.length ?? 0) === 0, outsiderRead.error?.message);
    const outsiderUpdate = await outsider.from(target.table).update({ title: "SHOULD NOT UPDATE" }).eq("id", target.id).select("id");
    assert("non-member cannot modify workspace content", Boolean(outsiderUpdate.error) || (outsiderUpdate.data?.length ?? 0) === 0, outsiderUpdate.error?.message || "no row updated");
  }
  await admin.auth.admin.deleteUser(createdUser.data.user.id);
} else {
  fail("non-member test user setup", createdUser.error?.message);
}

await assertProtectedRoute("unauthenticated admin route denied", `${appUrl}/admin`);
if (tempRecords[0]) {
  await assertProtectedRoute("unauthenticated preview route denied", `${appUrl}/admin/content/biography/${tempRecords[0].id}/preview`);
} else {
  fail("unauthenticated preview route denied", "no temp record");
}

const audit = await admin
  .from("audit_logs")
  .select("action,entity_table,entity_id,metadata")
  .in("entity_id", tempRecords.map((record) => record.id));

if (!audit.error) {
  const serialized = JSON.stringify(audit.data ?? []);
  assert("audit logs contain no obvious secrets", !serialized.includes(process.env.SUPABASE_SERVICE_ROLE_KEY) && !serialized.includes(process.env.LEGACYHUB_OWNER_PASSWORD), "secret values absent");
  assert("audit logs do not contain temp full rich-text bodies", !serialized.includes("Temporary edited biography body") && !serialized.includes("Temporary edited blog body"), "full bodies absent");
  console.log(`INFO audit rows found for temp records: ${audit.data?.length ?? 0}`);
} else {
  fail("audit log query", audit.error.message);
}

console.log(`INFO temporary records archived: ${tempRecords.map((record) => `${record.name}:${record.id}`).join(", ")}`);
