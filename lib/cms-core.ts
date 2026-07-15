import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { cmsCoreCollections, type CmsCoreCollection, type CmsCoreRecord, type CmsCoreTable, type CmsPrivacyState, type CmsVerificationState, type CmsWorkflowStatus } from "@/lib/cms-core-config";
import { getCmsContent, getPublishedCmsContent } from "@/lib/cms-store";
import { hasSupabasePublicEnv } from "@/lib/env";
import { roleHasPermission, type UserRole } from "@/lib/permissions";
import { richTextToHtml, richTextToPlainText, sanitizeRichText } from "@/lib/rich-text";
import { createClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/lib/tenant-context";

export { cmsCoreCollections };
export type { CmsCoreCollection, CmsCoreRecord, CmsCoreTable, CmsPrivacyState, CmsVerificationState, CmsWorkflowStatus };

const statusSchema = z.enum(["draft", "in_review", "scheduled", "published", "archived"]);
const visibilitySchema = z.enum(["public", "preview", "private", "family_only", "registered", "invited", "specific_users", "password_protected"]);
const verificationSchema = z.enum(["unverified", "family_memory", "partially_verified", "verified"]);

export const cmsCoreFormSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  collection: z.enum(["biography", "timeline", "stories", "lessons", "blog"]),
  title: z.string().trim().min(2, "Title is required.").max(180),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."),
  summary: z.string().trim().max(500).optional(),
  contentHtml: z.string().trim().max(30000).optional(),
  status: statusSchema,
  visibility: visibilitySchema,
  verificationStatus: verificationSchema,
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
  author: z.string().trim().max(160).optional(),
  category: z.string().trim().max(160).optional(),
  tags: z.string().trim().max(500).optional(),
  location: z.string().trim().max(180).optional(),
  dateLabel: z.string().trim().max(160).optional(),
  eventDate: z.string().trim().optional(),
  seoTitle: z.string().trim().max(180).optional(),
  metaDescription: z.string().trim().max(240).optional(),
  scheduledPublicationDate: z.string().trim().optional(),
  publishedAt: z.string().trim().optional()
});

export type CmsCoreFormInput = z.infer<typeof cmsCoreFormSchema>;

export function slugifyCms(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function getSlug(row: Record<string, unknown>, collection: CmsCoreCollection) {
  if (collection === "biography" || collection === "blog") return String(row.slug ?? "");
  return String(row.stable_id ?? "");
}

function getSummary(row: Record<string, unknown>, collection: CmsCoreCollection) {
  if (collection === "biography" || collection === "blog") return String(row.excerpt ?? "");
  if (collection === "timeline") return String(row.description ?? "");
  if (collection === "lessons") return String(row.introduction ?? "");
  return richTextToPlainText(row.body).slice(0, 240);
}

function getContentHtml(row: Record<string, unknown>) {
  return richTextToHtml(row.body);
}

function normalizeRecord(collection: CmsCoreCollection, row: Record<string, unknown>): CmsCoreRecord {
  const table = cmsCoreCollections[collection].table;
  return {
    id: String(row.id),
    collection,
    table,
    title: String(row.title ?? ""),
    slug: getSlug(row, collection),
    summary: getSummary(row, collection),
    contentHtml: getContentHtml(row),
    status: String(row.publish_state ?? "draft") as CmsWorkflowStatus,
    visibility: String(row.privacy_state ?? "private") as CmsPrivacyState,
    verificationStatus: String(row.verification_state ?? "unverified") as CmsVerificationState,
    sortOrder: Number(row.sort_order ?? 0),
    author: String(row.author ?? row.contributor_name ?? ""),
    authorId: String(row.author_id ?? ""),
    createdBy: String(row.created_by ?? ""),
    lastEditorId: String(row.last_editor_id ?? ""),
    category: String(row.category ?? ""),
    tags: "",
    location: String(row.location ?? ""),
    dateLabel: String(row.date_label ?? ""),
    eventDate: String(row.event_date ?? ""),
    seoTitle: String(row.seo_title ?? ""),
    metaDescription: String(row.seo_description ?? ""),
    scheduledPublicationDate: "",
    publishedAt: String(row.published_at ?? ""),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? "")
  };
}

function selectColumns(collection: CmsCoreCollection) {
  if (collection === "timeline") {
    return "id,title,stable_id,description,event_date,date_label,location,category,sort_order,publish_state,privacy_state,verification_state,source_reference,created_at,updated_at,workspace_id,legacy_profile_id,created_by,author_id,last_editor_id";
  }
  if (collection === "stories") {
    return "id,title,stable_id,body,contributor_name,moderation_state,publish_state,privacy_state,verification_state,source_reference,created_at,updated_at,workspace_id,legacy_profile_id,created_by,author_id,last_editor_id";
  }
  if (collection === "lessons") {
    return "id,title,stable_id,introduction,body,author,quotation,yoruba_proverb,english_interpretation,publish_state,privacy_state,verification_state,source_reference,created_at,updated_at,workspace_id,legacy_profile_id,created_by,author_id,last_editor_id";
  }
  if (collection === "blog") {
    return "id,title,slug,excerpt,body,author,published_at,seo_title,seo_description,publish_state,privacy_state,verification_state,source_reference,created_at,updated_at,workspace_id,legacy_profile_id,created_by,author_id,last_editor_id";
  }
  return "id,title,slug,excerpt,body,published_at,seo_title,seo_description,sort_order,publish_state,privacy_state,verification_state,source_reference,created_at,updated_at,workspace_id,legacy_profile_id,created_by,author_id,last_editor_id";
}

function orderColumn(collection: CmsCoreCollection) {
  if (collection === "biography" || collection === "timeline") return "sort_order";
  if (collection === "blog") return "published_at";
  return "updated_at";
}

export async function getCmsCoreRecords(collection: CmsCoreCollection, context: Pick<TenantContext, "workspaceId" | "legacyProfileId">, options: { publicOnly?: boolean } = {}): Promise<CmsCoreRecord[]> {
  noStore();

  if (!hasSupabasePublicEnv()) {
    const config = cmsCoreCollections[collection];
    const fallback = options.publicOnly
      ? await getPublishedCmsContent(config.fallbackKind)
      : await getCmsContent(config.fallbackKind);

    return fallback.map((record) => ({
      id: record.id,
      collection,
      table: config.table,
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      contentHtml: sanitizeRichText(record.body),
      status: record.status as CmsWorkflowStatus,
      visibility: record.visibility as CmsPrivacyState,
      verificationStatus: record.verificationStatus as CmsVerificationState,
      sortOrder: record.sortOrder,
      author: record.author ?? "",
      authorId: "",
      createdBy: "",
      lastEditorId: "",
      category: record.category ?? "",
      tags: "",
      location: "",
      dateLabel: record.dateLabel ?? "",
      eventDate: "",
      seoTitle: record.seoTitle ?? "",
      metaDescription: record.metaDescription ?? "",
      scheduledPublicationDate: "",
      publishedAt: "",
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }));
  }

  const config = cmsCoreCollections[collection];
  const supabase = await createClient();
  const table = supabase.from(config.table as never) as any;
  let query = table
    .select(selectColumns(collection))
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  if (options.publicOnly) {
    query = query.eq("publish_state", "published" as never).eq("privacy_state", "public" as never);
  }

  const { data, error } = await query.order(orderColumn(collection), { ascending: collection !== "blog", nullsFirst: false });
  if (error) {
    throw new Error(`Unable to load ${config.pluralLabel.toLowerCase()}.`);
  }

  return (data ?? []).map((row: Record<string, unknown>) => normalizeRecord(collection, row));
}

export async function getPublicCmsCoreRecords(collection: CmsCoreCollection): Promise<CmsCoreRecord[]> {
  noStore();

  if (!hasSupabasePublicEnv()) {
    const config = cmsCoreCollections[collection];
    const fallback = await getPublishedCmsContent(config.fallbackKind);
    return fallback.map((record) => ({
      id: record.id,
      collection,
      table: config.table,
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      contentHtml: sanitizeRichText(record.body),
      status: record.status as CmsWorkflowStatus,
      visibility: record.visibility as CmsPrivacyState,
      verificationStatus: record.verificationStatus as CmsVerificationState,
      sortOrder: record.sortOrder,
      author: record.author ?? "",
      authorId: "",
      createdBy: "",
      lastEditorId: "",
      category: record.category ?? "",
      tags: "",
      location: "",
      dateLabel: record.dateLabel ?? "",
      eventDate: "",
      seoTitle: record.seoTitle ?? "",
      metaDescription: record.metaDescription ?? "",
      scheduledPublicationDate: "",
      publishedAt: "",
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }));
  }

  const config = cmsCoreCollections[collection];
  const supabase = await createClient();
  const table = supabase.from(config.table as never) as any;
  let query = table
    .select(selectColumns(collection))
    .eq("publish_state", "published")
    .eq("privacy_state", "public");

  if (collection === "stories") {
    query = query.eq("moderation_state", "approved");
  }

  const { data, error } = await query.order(orderColumn(collection), { ascending: collection !== "blog", nullsFirst: false });

  if (error) {
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => normalizeRecord(collection, row));
}

export async function getPublicCmsCoreRecordBySlug(collection: CmsCoreCollection, slug: string) {
  const records = await getPublicCmsCoreRecords(collection);
  return records.find((record: CmsCoreRecord) => record.slug === slug) ?? null;
}

export async function getCmsCoreRecord(collection: CmsCoreCollection, id: string, context: Pick<TenantContext, "workspaceId" | "legacyProfileId">): Promise<CmsCoreRecord | null> {
  const config = cmsCoreCollections[collection];
  const supabase = await createClient();
  const table = supabase.from(config.table as never) as any;
  const { data, error } = await table
    .select(selectColumns(collection))
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .maybeSingle();

  if (error) throw new Error(`Unable to load ${config.label.toLowerCase()}.`);
  return data ? normalizeRecord(collection, data as Record<string, unknown>) : null;
}

function contentBody(input: CmsCoreFormInput) {
  const html = sanitizeRichText(input.contentHtml ?? "");
  return input.collection === "biography" || input.collection === "blog" ? { html } : html;
}

export function toTablePayload(input: CmsCoreFormInput, context: Pick<TenantContext, "workspaceId" | "legacyProfileId">, actorUserId: string, isNew: boolean) {
  const base = {
    workspace_id: context.workspaceId,
    legacy_profile_id: context.legacyProfileId,
    title: input.title,
    publish_state: input.status,
    privacy_state: input.visibility,
    verification_state: input.verificationStatus,
    source_reference: input.tags || null,
    last_editor_id: actorUserId,
    ...(isNew ? { created_by: actorUserId, author_id: actorUserId } : {})
  };

  if (input.collection === "timeline") {
    return {
      ...base,
      stable_id: input.slug,
      description: input.summary || null,
      event_date: input.eventDate || null,
      date_label: input.dateLabel || null,
      location: input.location || null,
      category: input.category || null,
      sort_order: input.sortOrder
    };
  }

  if (input.collection === "stories") {
    return {
      ...base,
      stable_id: input.slug,
      body: String(contentBody(input) || input.summary || "Draft story"),
      contributor_name: input.author || null,
      moderation_state: input.status === "published" ? "approved" : "pending"
    };
  }

  if (input.collection === "lessons") {
    return {
      ...base,
      stable_id: input.slug,
      introduction: input.summary || null,
      body: String(contentBody(input) || input.summary || "Draft lesson"),
      author: input.author || null,
      quotation: null,
      yoruba_proverb: null,
      english_interpretation: null
    };
  }

  if (input.collection === "blog") {
    return {
      ...base,
      slug: input.slug,
      excerpt: input.summary || null,
      body: contentBody(input),
      author: input.author || null,
      seo_title: input.seoTitle || null,
      seo_description: input.metaDescription || null,
      published_at: input.status === "published" ? input.publishedAt || new Date().toISOString() : input.scheduledPublicationDate || null
    };
  }

  return {
    ...base,
    slug: input.slug,
    excerpt: input.summary || null,
    body: contentBody(input),
    seo_title: input.seoTitle || null,
    seo_description: input.metaDescription || null,
    published_at: input.status === "published" ? input.publishedAt || new Date().toISOString() : input.scheduledPublicationDate || null,
    sort_order: input.sortOrder
  };
}

export function canSaveContentAs(role: UserRole, status: CmsWorkflowStatus) {
  if (status === "published" || status === "archived") {
    return roleHasPermission(role, "publish_content");
  }

  if (status === "in_review") {
    return roleHasPermission(role, "edit_assigned_content") || roleHasPermission(role, "review_submissions") || roleHasPermission(role, "publish_content");
  }

  return roleHasPermission(role, "edit_assigned_content") || roleHasPermission(role, "manage_all_content") || roleHasPermission(role, "review_submissions");
}
