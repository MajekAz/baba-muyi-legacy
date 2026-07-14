import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import type { CmsCollectionSummary, CmsContentKind, CmsContentRecord, CmsMenuItem, CmsPage, CmsStore } from "@/lib/cms-types";
import { defaultLegacyProfileId, defaultWorkspaceId, initialCmsStore } from "@/lib/cms-seed";

const storePath = path.join(process.cwd(), "data", "cms.json");

async function writeStore(store: CmsStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify({ ...store, updatedAt: new Date().toISOString() }, null, 2)}\n`, "utf8");
}

function withTenancyFallback(store: CmsStore): CmsStore {
  return {
    ...store,
    version: 1,
    activeWorkspaceId: store.activeWorkspaceId ?? defaultWorkspaceId,
    activeLegacyProfileId: store.activeLegacyProfileId ?? defaultLegacyProfileId,
    workspaces: store.workspaces?.length ? store.workspaces : initialCmsStore.workspaces,
    legacyProfiles: store.legacyProfiles?.length ? store.legacyProfiles : initialCmsStore.legacyProfiles,
    pages: store.pages.map((page) => ({
      ...page,
      workspaceId: page.workspaceId ?? defaultWorkspaceId,
      legacyProfileId: page.legacyProfileId ?? defaultLegacyProfileId
    })),
    content: store.content.map((record) => ({
      ...record,
      workspaceId: record.workspaceId ?? defaultWorkspaceId,
      legacyProfileId: record.legacyProfileId ?? defaultLegacyProfileId,
      createdAt: record.createdAt ?? record.updatedAt
    })),
    menuItems: store.menuItems.map((item) => ({
      ...item,
      workspaceId: item.workspaceId ?? defaultWorkspaceId,
      legacyProfileId: item.legacyProfileId ?? defaultLegacyProfileId
    }))
  };
}

export async function getCmsStore() {
  noStore();
  try {
    const raw = await readFile(storePath, "utf8");
    const store = withTenancyFallback(JSON.parse(raw) as CmsStore);
    return store;
  } catch {
    await writeStore(initialCmsStore);
    return initialCmsStore;
  }
}

export async function saveCmsStore(mutator: (store: CmsStore) => CmsStore | Promise<CmsStore>) {
  const current = await getCmsStore();
  const next = await mutator(current);
  await writeStore(next);
  return next;
}

export async function getCmsPageByPath(pathname: string) {
  const store = await getCmsStore();
  return store.pages.find((page) => page.workspaceId === store.activeWorkspaceId && page.legacyProfileId === store.activeLegacyProfileId && page.path === pathname && page.status === "published" && page.visibility === "public") ?? null;
}

export async function getAllCmsPages() {
  const store = await getCmsStore();
  return store.pages
    .filter((page) => page.workspaceId === store.activeWorkspaceId && page.legacyProfileId === store.activeLegacyProfileId)
    .sort((a, b) => a.path.localeCompare(b.path));
}

export async function getCmsContent(kind?: CmsContentKind, relatedPath?: string) {
  const store = await getCmsStore();
  return store.content
    .filter((item) => item.workspaceId === store.activeWorkspaceId && item.legacyProfileId === store.activeLegacyProfileId)
    .filter((item) => (kind ? item.kind === kind : true))
    .filter((item) => (relatedPath ? item.relatedPath === relatedPath : true))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export async function getPublishedCmsContent(kind?: CmsContentKind, relatedPath?: string) {
  const content = await getCmsContent(kind, relatedPath);
  return content.filter((item) => item.status === "published" && item.visibility === "public");
}

export async function getCmsMenus(location: CmsMenuItem["location"]) {
  const store = await getCmsStore();
  const items = store.menuItems
    .filter((item) => item.workspaceId === store.activeWorkspaceId && item.legacyProfileId === store.activeLegacyProfileId)
    .filter((item) => item.location === location && item.status === "published" && !item.hidden)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));

  const parents = items.filter((item) => !item.parentId);
  return parents.map((parent) => ({
    ...parent,
    children: items.filter((item) => item.parentId === parent.id)
  }));
}

export async function getAllMenuItems(location?: CmsMenuItem["location"]) {
  const store = await getCmsStore();
  return store.menuItems
    .filter((item) => item.workspaceId === store.activeWorkspaceId && item.legacyProfileId === store.activeLegacyProfileId)
    .filter((item) => (location ? item.location === location : true))
    .sort((a, b) => a.location.localeCompare(b.location) || a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
}

export async function getCmsCollectionSummaries(): Promise<CmsCollectionSummary[]> {
  const store = await getCmsStore();
  const pages = store.pages.filter((page) => page.workspaceId === store.activeWorkspaceId && page.legacyProfileId === store.activeLegacyProfileId);
  const content = store.content.filter((item) => item.workspaceId === store.activeWorkspaceId && item.legacyProfileId === store.activeLegacyProfileId);
  const collections: Array<{ kind: CmsContentKind; label: string; description: string }> = [
    { kind: "page", label: "CMS Pages", description: "Every public website page, hero copy, body text, cards, SEO, status, and visibility." },
    { kind: "biography_chapter", label: "Biography Chapters", description: "Life-story chapters with source notes, verification, media, and publication controls." },
    { kind: "timeline_event", label: "Timeline Events", description: "Chronology records with date labels, categories, locations, and related media." },
    { kind: "documentary", label: "Documentaries", description: "Documentary records, playback IDs, credits, thumbnails, chapters, and transcripts." },
    { kind: "gallery_album", label: "Gallery Albums", description: "Portrait, family, transport, community, and restored-image album records." },
    { kind: "media_item", label: "Media Items", description: "Images, videos, audio, documents, captions, alt text, copyright, and storage details." },
    { kind: "lesson", label: "Lessons", description: "Values, advice, memories, and generational teaching records." },
    { kind: "blog_post", label: "Blog Posts", description: "Curator notes, archive updates, essays, and documentary announcements." },
    { kind: "family_member", label: "Family Records", description: "Family tree people, relationships, life dates, notes, and visibility controls." },
    { kind: "testimonial", label: "Testimonials", description: "Shared memories, public tributes, moderation state, and consent metadata." }
  ];

  return collections.map((collection) => {
    const records = collection.kind === "page" ? pages : content.filter((item) => item.kind === collection.kind);
    return {
      ...collection,
      count: records.length,
      published: records.filter((item) => item.status === "published").length,
      drafts: records.filter((item) => item.status === "draft").length
    };
  });
}

export async function getActiveCmsWorkspaceContext() {
  const store = await getCmsStore();
  return {
    workspace: store.workspaces.find((workspace) => workspace.id === store.activeWorkspaceId) ?? store.workspaces[0],
    legacyProfile: store.legacyProfiles.find((profile) => profile.id === store.activeLegacyProfileId) ?? store.legacyProfiles[0]
  };
}

export function upsertPageInStore(store: CmsStore, page: CmsPage) {
  const exists = store.pages.some((item) => item.id === page.id);
  return {
    ...store,
    pages: exists ? store.pages.map((item) => (item.id === page.id ? page : item)) : [...store.pages, page]
  };
}

export function upsertContentInStore(store: CmsStore, record: CmsContentRecord) {
  const exists = store.content.some((item) => item.id === record.id);
  return {
    ...store,
    content: exists ? store.content.map((item) => (item.id === record.id ? record : item)) : [...store.content, record]
  };
}

export function upsertMenuItemInStore(store: CmsStore, item: CmsMenuItem) {
  const exists = store.menuItems.some((current) => current.id === item.id);
  return {
    ...store,
    menuItems: exists ? store.menuItems.map((current) => (current.id === item.id ? item : current)) : [...store.menuItems, item]
  };
}
