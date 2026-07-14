"use server";

import { revalidatePath } from "next/cache";
import type { CmsContentKind, CmsContentRecord, CmsMenuItem, CmsPage, CmsStatus, CmsVisibility, CmsVerification } from "@/lib/cms-types";
import { saveCmsStore, upsertContentInStore, upsertMenuItemInStore, upsertPageInStore } from "@/lib/cms-store";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

const statusValues = new Set<CmsStatus>(["draft", "scheduled", "published", "archived"]);
const visibilityValues = new Set<CmsVisibility>(["public", "preview", "private", "family_only", "registered", "invited", "specific_users", "password_protected"]);
const verificationValues = new Set<CmsVerification>(["unverified", "family_memory", "partially_verified", "verified"]);

function text(formData: FormData, key: string, fallback = "") {
  return String(formData.get(key) ?? fallback).trim();
}

function asStatus(value: string): CmsStatus {
  return statusValues.has(value as CmsStatus) ? (value as CmsStatus) : "draft";
}

function asVisibility(value: string): CmsVisibility {
  return visibilityValues.has(value as CmsVisibility) ? (value as CmsVisibility) : "private";
}

function asVerification(value: string): CmsVerification {
  return verificationValues.has(value as CmsVerification) ? (value as CmsVerification) : "unverified";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || crypto.randomUUID();
}

function pathToId(pathname: string) {
  return pathname === "/" ? "page-home" : `page-${slugify(pathname.replace(/^\//, ""))}`;
}

export async function saveCmsPage(formData: FormData) {
  const context = await requireLegacyProfilePermission("manage_all_content");
  const path = text(formData, "path", "/");
  const id = text(formData, "id", pathToId(path));
  const now = new Date().toISOString();

  const cards = text(formData, "cards")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title = "", description = "", href = ""] = line.split("|").map((part) => part.trim());
      return {
        id: `${id}-card-${index + 1}`,
        title,
        description,
        href: href || undefined
      };
    })
    .filter((card) => card.title);

  const page: CmsPage = {
    id,
    workspaceId: context.workspaceId,
    legacyProfileId: context.legacyProfileId,
    path,
    slug: slugify(path === "/" ? "home" : path.replace(/^\//, "")),
    title: text(formData, "title", "Untitled page"),
    eyebrow: text(formData, "eyebrow", "CMS"),
    description: text(formData, "description"),
    body: text(formData, "body"),
    cards,
    status: asStatus(text(formData, "status", "draft")),
    visibility: asVisibility(text(formData, "visibility", "private")),
    verificationStatus: asVerification(text(formData, "verificationStatus", "unverified")),
    seoTitle: text(formData, "seoTitle") || undefined,
    metaDescription: text(formData, "metaDescription") || undefined,
    updatedAt: now
  };

  await saveCmsStore((store) => upsertPageInStore(store, page));
  revalidatePath(path);
  revalidatePath("/admin/content");
}

export async function saveCmsContent(formData: FormData) {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const kind = text(formData, "kind", "page") as CmsContentKind;
  const title = text(formData, "title", "Untitled content");
  const slug = text(formData, "slug", slugify(title));
  const id = text(formData, "id", `${kind}-${slug}`);
  const relatedPath = text(formData, "relatedPath");

  const record: CmsContentRecord = {
    id,
    workspaceId: context.workspaceId,
    legacyProfileId: context.legacyProfileId,
    kind,
    title,
    slug,
    summary: text(formData, "summary"),
    body: text(formData, "body"),
    status: asStatus(text(formData, "status", "draft")),
    visibility: asVisibility(text(formData, "visibility", "private")),
    verificationStatus: asVerification(text(formData, "verificationStatus", "unverified")),
    sortOrder: Number(text(formData, "sortOrder", "0")) || 0,
    relatedPath: relatedPath || undefined,
    mediaUrl: text(formData, "mediaUrl") || undefined,
    externalUrl: text(formData, "externalUrl") || undefined,
    dateLabel: text(formData, "dateLabel") || undefined,
    category: text(formData, "category") || undefined,
    author: text(formData, "author") || undefined,
    featuredImageId: text(formData, "featuredImageId") || undefined,
    seoTitle: text(formData, "seoTitle") || undefined,
    metaDescription: text(formData, "metaDescription") || undefined,
    createdAt: text(formData, "createdAt") || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await saveCmsStore((store) => upsertContentInStore(store, record));
  if (relatedPath) revalidatePath(relatedPath);
  revalidatePath("/admin/content");
  revalidatePath("/admin/documentaries");
  revalidatePath("/admin/media");
}

export async function archiveCmsContent(formData: FormData) {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const id = text(formData, "id");
  const relatedPath = text(formData, "relatedPath");

  if (!id) {
    return;
  }

  await saveCmsStore((store) => ({
    ...store,
    content: store.content.map((record) => record.id === id && record.workspaceId === context.workspaceId && record.legacyProfileId === context.legacyProfileId
      ? { ...record, status: "archived", updatedAt: new Date().toISOString(), lastEditorId: "local-owner" }
      : record)
  }));

  if (relatedPath) revalidatePath(relatedPath);
  revalidatePath("/admin/content");
}

export async function saveCmsMenuItem(formData: FormData) {
  const context = await requireLegacyProfilePermission("manage_menus");
  const label = text(formData, "label", "Untitled item");
  const location = text(formData, "menuLocation", "header") as CmsMenuItem["location"];
  const slug = text(formData, "slug", slugify(label));
  const id = text(formData, "id", `${location}-${slug}`);
  const parentId = text(formData, "parentItem");

  const item: CmsMenuItem = {
    id,
    workspaceId: context.workspaceId,
    legacyProfileId: context.legacyProfileId,
    label,
    slug,
    href: text(formData, "url", "/"),
    location,
    parentId: parentId || undefined,
    sortOrder: Number(text(formData, "sortOrder", "0")) || 0,
    status: asStatus(text(formData, "status", "draft")),
    visibility: asVisibility(text(formData, "visibility", "public")),
    requiredRole: text(formData, "requiredRole") || undefined,
    linkType: text(formData, "linkType", "internal") as CmsMenuItem["linkType"],
    openInNewTab: formData.get("openInNewTab") === "on",
    hidden: formData.get("hidden") === "on",
    icon: text(formData, "icon") || undefined,
    badge: text(formData, "badge") || undefined,
    description: text(formData, "description") || undefined
  };

  await saveCmsStore((store) => upsertMenuItemInStore(store, item));
  revalidatePath("/");
  revalidatePath("/admin/menus");
}
