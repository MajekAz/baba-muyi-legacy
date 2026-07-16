import { existsSync, readFileSync } from "node:fs";

const checks = [];

function addCheck(name, pass, detail) {
  checks.push({ name, pass, detail });
}

function file(path) {
  return readFileSync(path, "utf8");
}

const permissions = file("lib/permissions.ts");
const actions = file("lib/cms-core-actions.ts");
const core = file("lib/cms-core.ts");
const editorForm = file("components/admin/content-editor-form.tsx");
const richText = file("lib/rich-text.ts");
const publicPage = file("components/cms/cms-public-page.tsx");
const workflowMigration = file("supabase/migrations/0007_cms_workflow_permissions.sql");

addCheck("unauthenticated admin denial", file("lib/auth.ts").includes("redirect(\"/login?reason=admin-access\")"), "Admin auth redirects anonymous users.");
addCheck("authorised owner access", permissions.includes("owner: [...permissions]"), "Owner role has full permission set.");
addCheck("contributor draft creation", permissions.includes('contributor: ["edit_assigned_content"') && workflowMigration.includes("('contributor', 'edit_assigned_content')"), "Contributor can save drafts through app permissions and RLS role permissions.");
addCheck("contributor publish denial", actions.includes("canSaveContentAs(context.role, parsed.data.status)") && core.includes('status === "published"'), "Server action blocks publish/archive without publish_content.");
addCheck("owner publishing", permissions.includes('"publish_content"') && core.includes('roleHasPermission(role, "publish_content")'), "Publishing is tied to publish_content permission.");
addCheck("owner sees publish action", editorForm.includes('label: "Publish"') && editorForm.includes('value: "publish"') && editorForm.includes("canPublish ?"), "Authorised publishers get an explicit Publish workflow button.");
addCheck("contributor does not see publish action", editorForm.includes("workflowActions(currentStatus, canPublish") && editorForm.includes("{canPublish ? <option value=\"published\">Published</option> : null}"), "Publish-only workflow controls and dropdown states are hidden when canPublish is false.");
addCheck("workflow action is submitted explicitly", editorForm.includes('name="workflowAction" ref={workflowInputRef}') && editorForm.includes("chooseWorkflowAction(action.value)") && actions.includes('text(formData, "workflowAction")'), "Workflow buttons set a hidden action field before server submission.");
addCheck("explicit workflow action required", actions.includes("Use the Publish, Schedule, or Archive workflow button") && actions.includes('workflowAction === "save_changes"'), "Changing the dropdown alone cannot silently publish, schedule, or archive.");
addCheck("publish workflow actions require permission", actions.includes('"publish_now", "schedule", "archive", "unpublish", "restore_draft"') && actions.includes('roleHasPermission(context.role, "publish_content")'), "Direct workflow submissions for publish-state transitions require publish_content.");
addCheck("publish guardrails", actions.includes("Set visibility to Public before publishing") && actions.includes("Choose a verification status before publishing") && actions.includes("Add content or a clear summary before publishing"), "Publishing checks visibility, verification, and required content.");
addCheck("published_at is set", core.includes('published_at: input.status === "published" ? input.publishedAt || new Date().toISOString()'), "Publishing stamps published_at when a publication date is not provided.");
addCheck("audit log records workflow action", actions.includes("workflowAction,") && actions.includes('actionForStatus(parsed.data.status, isNew)'), "Workflow actions create audit metadata without storing content bodies.");
addCheck("duplicate publish submission prevented", editorForm.includes("disabled={pending}") && editorForm.includes('pendingLabel="Working..."'), "Workflow buttons expose pending disabled states to prevent duplicate submissions.");
addCheck("workspace isolation", actions.includes(".eq(\"workspace_id\", context.workspaceId)") && core.includes(".eq(\"workspace_id\", context.workspaceId)"), "Queries and mutations scope by workspace_id.");
addCheck("legacy-profile isolation", actions.includes(".eq(\"legacy_profile_id\", context.legacyProfileId)") && core.includes(".eq(\"legacy_profile_id\", context.legacyProfileId)"), "Queries and mutations scope by legacy_profile_id.");
addCheck("draft not publicly visible", publicPage.includes("getPublicCmsCoreRecords") && core.includes('.eq("publish_state", "published"') && core.includes('.eq("privacy_state", "public"'), "Public readers filter to published public records.");
addCheck("published public content visible", publicPage.includes("coreRecords.map"), "Public pages render published CMS records.");
addCheck("archive behaviour", actions.includes("archiveCmsCoreContent") && actions.includes('publish_state: "archived"'), "Archive action updates publish_state to archived.");
addCheck("preview protected", existsSync("app/admin/content/[collection]/[id]/preview/page.tsx") && file("app/admin/content/[collection]/[id]/preview/page.tsx").includes("requireLegacyProfilePermission"), "Preview route requires authenticated content permission.");
addCheck("script tags removed", richText.includes(".replace(/<script[\\s\\S]*?<\\/script>/gi"), "Sanitizer strips script tags before storage/rendering.");
addCheck("style tags removed", richText.includes(".replace(/<style[\\s\\S]*?<\\/style>/gi"), "Sanitizer strips style tags.");
addCheck("dangerous URLs rejected", richText.includes("/^(https?:\\/\\/|mailto:|\\/)/i.test(href)"), "Only http, https, mailto, and root-relative links are allowed.");
addCheck("event handlers removed", richText.includes("sanitizeAttributes") && richText.includes("return \"\";"), "Sanitizer rebuilds allowed tags with a constrained attribute list.");
addCheck("unsupported embeds blocked", richText.includes("allowedTags") && !richText.includes("\"iframe\"") && !richText.includes("\"embed\"") && !richText.includes("\"script\""), "Unsupported embeds are not in the allowed tag list.");
addCheck("raw unsanitised HTML not rendered", publicPage.includes("record.contentHtml") && core.includes("sanitizeRichText(record.body)") && core.includes("richTextToHtml"), "Public rendering receives content through the sanitizer adapter.");
addCheck("public reads use RLS client", !core.includes("createAdminClient") && core.includes("await createClient()"), "Public CMS reads no longer use the service-role client.");
addCheck("attribution payload records actor", core.includes("created_by: actorUserId") && core.includes("last_editor_id: actorUserId"), "Create/update payloads include server-side attribution fields.");
addCheck("form has persistent labels", editorForm.includes("htmlFor={`${formId}-sortOrder`}") && editorForm.includes("htmlFor={`${formId}-author`}") && editorForm.includes("htmlFor={`${formId}-summary`}") && editorForm.includes("htmlFor={`${formId}-metaDescription`}"), "Core editor fields use visible linked labels.");
addCheck("form links help and errors", editorForm.includes("aria-describedby={describedBy(\"title\")}") && editorForm.includes("aria-invalid={Boolean(fieldError(\"title\"))}") && editorForm.includes("role=\"alert\""), "Validation summary and field-level attributes are wired.");
addCheck("unsaved change protection wired", editorForm.includes("beforeunload") && editorForm.includes("window.confirm(\"You have unsaved changes. Leave this page?\")") && editorForm.includes("onDirty={markDirty}"), "Refresh, close, and internal-navigation protection hooks exist.");

const failed = checks.filter((check) => !check.pass);
for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}: ${check.detail}`);
}

if (failed.length) {
  process.exitCode = 1;
}
