import type { NavItem } from "@/lib/navigation";

export type CmsStatus = "draft" | "scheduled" | "published" | "archived";
export type CmsVisibility = "public" | "preview" | "private" | "family_only" | "registered" | "invited" | "specific_users" | "password_protected";
export type CmsVerification = "unverified" | "family_memory" | "partially_verified" | "verified";
export type CmsContentKind =
  | "page"
  | "biography_chapter"
  | "timeline_event"
  | "lesson"
  | "gallery_album"
  | "media_item"
  | "documentary"
  | "documentary_episode"
  | "blog_post"
  | "family_member"
  | "testimonial";

export type CmsWorkspace = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type CmsLegacyProfile = {
  id: string;
  workspaceId: string;
  slug: string;
  type: "individual" | "family" | "organisation";
  fullName: string;
  displayName: string;
  knownAs?: string;
  deathYear?: number;
  status: CmsStatus;
  visibility: CmsVisibility;
  verificationStatus: CmsVerification;
  createdAt: string;
  updatedAt: string;
};

export type CmsPage = {
  id: string;
  workspaceId: string;
  legacyProfileId?: string;
  path: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  body: string;
  cards: Array<{
    id: string;
    title: string;
    description: string;
    href?: string;
  }>;
  status: CmsStatus;
  visibility: CmsVisibility;
  verificationStatus: CmsVerification;
  seoTitle?: string;
  metaDescription?: string;
  updatedAt: string;
};

export type CmsContentRecord = {
  id: string;
  workspaceId: string;
  legacyProfileId?: string;
  kind: CmsContentKind;
  title: string;
  slug: string;
  summary: string;
  body: string;
  status: CmsStatus;
  visibility: CmsVisibility;
  verificationStatus: CmsVerification;
  sortOrder: number;
  relatedPath?: string;
  mediaUrl?: string;
  externalUrl?: string;
  dateLabel?: string;
  category?: string;
  author?: string;
  featuredImageId?: string;
  seoTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  lastEditorId?: string;
};

export type CmsMenuItem = NavItem & {
  id: string;
  workspaceId: string;
  legacyProfileId?: string;
  slug: string;
  location: "header" | "mobile" | "footer" | "secondary" | "admin";
  parentId?: string;
  sortOrder: number;
  status: CmsStatus;
  visibility: CmsVisibility;
  requiredRole?: string;
  linkType: "internal" | "external" | "documentary" | "biography_section" | "timeline_section" | "album" | "document_download";
  openInNewTab: boolean;
  hidden: boolean;
  icon?: string;
  badge?: string;
  description?: string;
};

export type CmsStore = {
  version: 1;
  activeWorkspaceId: string;
  activeLegacyProfileId: string;
  updatedAt: string;
  workspaces: CmsWorkspace[];
  legacyProfiles: CmsLegacyProfile[];
  pages: CmsPage[];
  content: CmsContentRecord[];
  menuItems: CmsMenuItem[];
};

export type CmsCollectionSummary = {
  kind: CmsContentKind;
  label: string;
  description: string;
  count: number;
  published: number;
  drafts: number;
};
