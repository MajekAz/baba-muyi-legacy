import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";

const envFiles = [".env.local", ".env"];

for (const file of envFiles) {
  if (!existsSync(file)) continue;

  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function requireSecret(name) {
  const value = process.env[name]?.trim();
  const isPlaceholder =
    !value ||
    value.startsWith("your-") ||
    value.startsWith("server-only-") ||
    value.includes("placeholder") ||
    value.includes("temporary-password") ||
    value === "owner@example.com";

  if (isPlaceholder) {
    throw new Error(`${name} is required and must not be a placeholder.`);
  }

  return value;
}

function optionalValue(name) {
  const value = process.env[name]?.trim();
  return value && !value.startsWith("your-") ? value : null;
}

function failWithSchemaHint(table, error) {
  if (error?.code === "PGRST205" || error?.code === "42P01") {
    throw new Error(`Required table "${table}" is missing or not visible through Supabase REST. Apply migrations before running owner bootstrap.`);
  }

  throw error;
}

const supabaseUrl = requireSecret("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = requireSecret("SUPABASE_SERVICE_ROLE_KEY");
const ownerEmail = requireSecret("LEGACYHUB_OWNER_EMAIL").toLowerCase();
const ownerPassword = optionalValue("LEGACYHUB_OWNER_PASSWORD");
const ownerName = optionalValue("LEGACYHUB_OWNER_NAME") ?? "LegacyHub Owner";

const workspaceSlug = optionalValue("LEGACYHUB_WORKSPACE_SLUG") ?? "baba-muyi-family-archive";
const workspaceName = optionalValue("LEGACYHUB_WORKSPACE_NAME") ?? "Baba Muyi Family Archive";
const profileSlug = optionalValue("LEGACYHUB_LEGACY_PROFILE_SLUG") ?? "baba-muyi";
const profileDisplayName = optionalValue("LEGACYHUB_LEGACY_PROFILE_DISPLAY_NAME") ?? "Baba Muyi";
const profileFullName = optionalValue("LEGACYHUB_LEGACY_PROFILE_FULL_NAME") ?? 'Alhaji Tioluwalase "Baba Muyi" Majekodunmi';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function assertTableVisible(table) {
  const { error } = await supabase.from(table).select("*", { head: true, count: "exact" }).limit(0);
  if (error) failWithSchemaHint(table, error);
}

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) return { user, created: false };
    if (data.users.length < perPage) return { user: null, created: false };

    page += 1;
  }
}

async function getOrCreateOwnerUser() {
  const existing = await findUserByEmail(ownerEmail);
  if (existing.user) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword ?? undefined,
    email_confirm: true,
    user_metadata: {
      display_name: ownerName
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error("Supabase did not return a created owner user.");

  return { user: data.user, created: true };
}

async function ensureOwnerRoleExists() {
  const { data, error } = await supabase.from("user_roles").select("key").eq("key", "owner").maybeSingle();
  if (error) failWithSchemaHint("user_roles", error);
  if (!data) throw new Error('Required role "owner" is missing from user_roles. Confirm 0001 migration was applied.');
}

async function ensureUserProfile(userId) {
  const { error } = await supabase.from("user_profiles").upsert({
    id: userId,
    display_name: ownerName,
    role: "owner"
  });
  if (error) failWithSchemaHint("user_profiles", error);
}

async function ensureWorkspace(userId) {
  const { data: existing, error: readError } = await supabase
    .from("workspaces")
    .select("id, name, slug, status")
    .eq("slug", workspaceSlug)
    .maybeSingle();

  if (readError) failWithSchemaHint("workspaces", readError);
  if (existing) {
    const { error: updateError } = await supabase
      .from("workspaces")
      .update({ name: workspaceName, status: "active", created_by: userId })
      .eq("id", existing.id);
    if (updateError) failWithSchemaHint("workspaces", updateError);

    return { workspace: { ...existing, name: workspaceName, status: "active" }, created: false };
  }

  const { data: created, error: createError } = await supabase
    .from("workspaces")
    .insert({
      name: workspaceName,
      slug: workspaceSlug,
      status: "active",
      created_by: userId
    })
    .select("id, name, slug, status")
    .single();

  if (createError) failWithSchemaHint("workspaces", createError);
  return { workspace: created, created: true };
}

async function ensureWorkspaceRole(workspaceId) {
  const { error } = await supabase.from("workspace_roles").upsert({
    workspace_id: workspaceId,
    role: "owner",
    label: "Owner",
    description: "Complete control over this workspace."
  }, { onConflict: "workspace_id,role" });
  if (error) failWithSchemaHint("workspace_roles", error);
}

async function ensureLegacyProfile(workspaceId) {
  const { data: existing, error: readError } = await supabase
    .from("legacy_profiles")
    .select("id, workspace_id, slug, display_name")
    .eq("workspace_id", workspaceId)
    .eq("slug", profileSlug)
    .maybeSingle();

  if (readError) failWithSchemaHint("legacy_profiles", readError);
  if (existing) {
    const { error: updateError } = await supabase
      .from("legacy_profiles")
      .update({
        full_name: profileFullName,
        display_name: profileDisplayName,
        known_as: profileDisplayName,
        status: "draft",
        publish_state: "draft",
        visibility: "preview",
        verification_state: "family_memory",
        source_reference: "Approved foundation seed details supplied by project owner"
      })
      .eq("id", existing.id);
    if (updateError) failWithSchemaHint("legacy_profiles", updateError);

    return { legacyProfile: { ...existing, display_name: profileDisplayName }, created: false };
  }

  const { data: created, error: createError } = await supabase
    .from("legacy_profiles")
    .insert({
      workspace_id: workspaceId,
      slug: profileSlug,
      legacy_type: "individual",
      full_name: profileFullName,
      display_name: profileDisplayName,
      known_as: profileDisplayName,
      visibility: "preview",
      publish_state: "draft",
      status: "draft",
      verification_state: "family_memory",
      source_reference: "Approved foundation seed details supplied by project owner"
    })
    .select("id, workspace_id, slug, display_name")
    .single();

  if (createError) failWithSchemaHint("legacy_profiles", createError);
  return { legacyProfile: created, created: true };
}

async function ensureWorkspaceMembership(workspaceId, userId) {
  const { error } = await supabase.from("workspace_members").upsert({
    workspace_id: workspaceId,
    user_id: userId,
    role: "owner",
    status: "active"
  }, { onConflict: "workspace_id,user_id" });
  if (error) failWithSchemaHint("workspace_members", error);
}

async function ensureLegacyProfileMembership(workspaceId, legacyProfileId, userId) {
  const { error } = await supabase.from("legacy_profile_members").upsert({
    workspace_id: workspaceId,
    legacy_profile_id: legacyProfileId,
    user_id: userId,
    role: "owner"
  }, { onConflict: "legacy_profile_id,user_id" });
  if (error) failWithSchemaHint("legacy_profile_members", error);
}

async function ensureLegacyMemberCompatibility(legacyProfileId, userId) {
  const { error } = await supabase.from("legacy_members").upsert({
    legacy_profile_id: legacyProfileId,
    user_id: userId,
    role: "owner"
  }, { onConflict: "legacy_profile_id,user_id" });
  if (error) failWithSchemaHint("legacy_members", error);
}

async function countRows(table, filters) {
  let query = supabase.from(table).select("*", { head: true, count: "exact" });
  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { count, error } = await query;
  if (error) failWithSchemaHint(table, error);
  return count ?? 0;
}

for (const table of [
  "user_roles",
  "user_profiles",
  "workspaces",
  "workspace_roles",
  "workspace_members",
  "legacy_profiles",
  "legacy_members",
  "legacy_profile_members"
]) {
  await assertTableVisible(table);
}

await ensureOwnerRoleExists();

const { user: owner, created: ownerCreated } = await getOrCreateOwnerUser();
await ensureUserProfile(owner.id);

const { workspace, created: workspaceCreated } = await ensureWorkspace(owner.id);
await ensureWorkspaceRole(workspace.id);

const { legacyProfile, created: legacyProfileCreated } = await ensureLegacyProfile(workspace.id);
await ensureWorkspaceMembership(workspace.id, owner.id);
await ensureLegacyProfileMembership(workspace.id, legacyProfile.id, owner.id);
await ensureLegacyMemberCompatibility(legacyProfile.id, owner.id);

const summary = {
  ownerAuthUser: ownerCreated ? "created" : "verified",
  userProfileCount: await countRows("user_profiles", { id: owner.id }),
  platformOwnerCount: await countRows("user_profiles", { id: owner.id, role: "owner" }),
  workspace: workspaceCreated ? "created" : "verified",
  workspaceCount: await countRows("workspaces", { slug: workspaceSlug }),
  workspaceMembershipCount: await countRows("workspace_members", { workspace_id: workspace.id, user_id: owner.id }),
  legacyProfile: legacyProfileCreated ? "created" : "verified",
  legacyProfileCount: await countRows("legacy_profiles", { workspace_id: workspace.id, slug: profileSlug }),
  legacyProfileMembershipCount: await countRows("legacy_profile_members", { legacy_profile_id: legacyProfile.id, user_id: owner.id }),
  compatibilityLegacyMembershipCount: await countRows("legacy_members", { legacy_profile_id: legacyProfile.id, user_id: owner.id })
};

console.log("Owner bootstrap completed.");
for (const [key, value] of Object.entries(summary)) {
  console.log(`${key}: ${value}`);
}
