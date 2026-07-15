import type { CmsContentKind } from "@/lib/cms-types";

export type CmsCoreCollection = "biography" | "timeline" | "stories" | "lessons" | "blog";
export type CmsWorkflowStatus = "draft" | "in_review" | "scheduled" | "published" | "archived";
export type CmsPrivacyState = "public" | "preview" | "private" | "family_only" | "registered" | "invited" | "specific_users" | "password_protected";
export type CmsVerificationState = "unverified" | "family_memory" | "partially_verified" | "verified";

export type CmsCoreTable = "biography_chapters" | "timeline_events" | "stories" | "lessons" | "blog_posts";

export type CmsCoreRecord = {
  id: string;
  collection: CmsCoreCollection;
  table: CmsCoreTable;
  title: string;
  slug: string;
  summary: string;
  contentHtml: string;
  status: CmsWorkflowStatus;
  visibility: CmsPrivacyState;
  verificationStatus: CmsVerificationState;
  sortOrder: number;
  author: string;
  authorId: string;
  createdBy: string;
  lastEditorId: string;
  category: string;
  tags: string;
  location: string;
  dateLabel: string;
  eventDate: string;
  seoTitle: string;
  metaDescription: string;
  scheduledPublicationDate: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export const cmsCoreCollections: Record<CmsCoreCollection, {
  label: string;
  pluralLabel: string;
  table: CmsCoreTable;
  publicPath: string;
  fallbackKind: CmsContentKind;
  description: string;
}> = {
  biography: {
    label: "Biography chapter",
    pluralLabel: "Biography chapters",
    table: "biography_chapters",
    publicPath: "/biography",
    fallbackKind: "biography_chapter",
    description: "Life-story chapters with ordering, verification, SEO, preview, and publishing controls."
  },
  timeline: {
    label: "Timeline event",
    pluralLabel: "Timeline events",
    table: "timeline_events",
    publicPath: "/timeline",
    fallbackKind: "timeline_event",
    description: "Chronology records with exact, approximate, decade, or to-be-confirmed date labels."
  },
  stories: {
    label: "Story",
    pluralLabel: "Stories",
    table: "stories",
    publicPath: "/stories",
    fallbackKind: "testimonial",
    description: "Reviewed legacy stories connected to the workspace and legacy profile."
  },
  lessons: {
    label: "Lesson",
    pluralLabel: "Lessons",
    table: "lessons",
    publicPath: "/lessons",
    fallbackKind: "lesson",
    description: "Values, teachings, advice, and memory-based lessons."
  },
  blog: {
    label: "Blog post",
    pluralLabel: "Blog posts",
    table: "blog_posts",
    publicPath: "/blog",
    fallbackKind: "blog_post",
    description: "Curator notes, archive updates, essays, and release posts."
  }
};
