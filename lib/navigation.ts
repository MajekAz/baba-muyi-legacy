import type { Permission } from "@/lib/permissions";
import { biographyChapterTargets } from "@/lib/public-route-targets";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  requiredPermission?: Permission;
  planned?: boolean;
};

export const publicNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "Biography",
    href: "/biography",
    children: [
      { label: "Biography", href: "/biography" },
      { label: "Early Life", href: biographyChapterTargets.earlyLife },
      { label: "Community Leadership", href: biographyChapterTargets.communityLeadership }
    ]
  },
  {
    label: "Timeline",
    href: "/timeline",
    children: [
      { label: "Timeline", href: "/timeline" },
      { label: "Bolekaja", href: biographyChapterTargets.transportLegacy },
      { label: "TIOLUWA LASE", href: biographyChapterTargets.transportLegacy }
    ]
  },
  {
    label: "Gallery",
    href: "/gallery",
    children: [
      { label: "Family", href: "/gallery" },
      { label: "Transport", href: "/gallery" },
      { label: "Documents", href: "/gallery" }
    ]
  },
  {
    label: "Documentary",
    href: "/documentaries"
  },
  {
    label: "Legacy",
    href: "/lessons",
    children: [
      { label: "Lessons", href: "/lessons" },
      { label: "Tributes", href: "/tributes" }
    ]
  },
  {
    label: "About",
    href: "/about"
  }
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Legacy Profiles", href: "/admin/legacy-profiles", requiredPermission: "manage_legacy_profiles", planned: true },
  {
    label: "Content",
    href: "/admin/content",
    requiredPermission: "edit_assigned_content",
    children: [
      { label: "Biography", href: "/admin/content/biography" },
      { label: "Timeline", href: "/admin/content/timeline" },
      { label: "Stories", href: "/admin/content/stories" },
      { label: "Lessons", href: "/admin/content/lessons" },
      { label: "Blog Posts", href: "/admin/content/blog-posts" }
    ]
  },
  {
    label: "Media Library",
    href: "/admin/media",
    requiredPermission: "access_media_library",
    children: [
      { label: "All Media", href: "/admin/media" },
      { label: "Upload", href: "/admin/media/upload" },
      { label: "Images", href: "/admin/media/images" },
      { label: "Video", href: "/admin/media/video" },
      { label: "Audio", href: "/admin/media/audio" },
      { label: "Documents", href: "/admin/media/documents" },
      { label: "Albums", href: "/admin/media/albums" }
    ]
  },
  {
    label: "Documentaries",
    href: "/admin/documentaries",
    requiredPermission: "access_documentaries",
    planned: true
  },
  { label: "Family", href: "/admin/family", requiredPermission: "edit_assigned_content", planned: true },
  { label: "Contributions", href: "/admin/contributions", requiredPermission: "review_submissions", planned: true },
  { label: "Users and Access", href: "/admin/access", requiredPermission: "manage_users" },
  { label: "Menus", href: "/admin/menus", requiredPermission: "manage_menus" },
  { label: "Settings", href: "/admin/settings", requiredPermission: "change_site_settings", planned: true },
  { label: "Audit Activity", href: "/admin/audit-logs", requiredPermission: "view_audit_logs", planned: true }
];
