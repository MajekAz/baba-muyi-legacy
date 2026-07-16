import type { Permission } from "@/lib/permissions";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  requiredPermission?: Permission;
};

export const publicNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "His Story",
    href: "/biography",
    children: [
      { label: "Biography", href: "/biography" },
      { label: "Timeline", href: "/timeline" },
      { label: "Early Life", href: "/early-life" },
      { label: "Journey to Bariga", href: "/journey-to-bariga" },
      { label: "Community Leadership", href: "/community-leadership" }
    ]
  },
  {
    label: "Transport Legacy",
    href: "/bolekaja",
    children: [
      { label: "Bolekaja Era", href: "/bolekaja" },
      { label: "TIOLUWA LASE Molue Era", href: "/tioluwa-lase-molue" },
      { label: "Routes and Locations", href: "/routes-and-locations" },
      { label: "Transport Gallery", href: "/transport-gallery" }
    ]
  },
  {
    label: "Media",
    href: "/documentaries",
    children: [
      { label: "Documentary", href: "/documentaries" },
      { label: "Photo Archive", href: "/gallery" },
      { label: "Audio", href: "/archive" },
      { label: "Historical Documents", href: "/documents" }
    ]
  },
  {
    label: "Legacy",
    href: "/family-tree",
    children: [
      { label: "Family Legacy", href: "/family-tree" },
      { label: "Lessons", href: "/lessons" },
      { label: "Community Memories", href: "/family-memories" },
      { label: "Digital Archive", href: "/archive" }
    ]
  },
  {
    label: "About",
    href: "/curator",
    children: [
      { label: "About Baba Muyi", href: "/biography" },
      { label: "About the Curator", href: "/curator" },
      { label: "About the Legacy Project", href: "/about" },
      { label: "About LegacyHub", href: "/legacyhub" }
    ]
  }
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Legacy Profiles", href: "/admin/legacy-profiles", requiredPermission: "manage_legacy_profiles" },
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
      { label: "Upload", href: "/admin/media/upload" },
      { label: "Images", href: "/admin/media?type=image" },
      { label: "Videos", href: "/admin/media?type=video_clip" },
      { label: "Audio", href: "/admin/media?type=audio" },
      { label: "Documents", href: "/admin/media?type=document" },
      { label: "Albums", href: "/admin/media/albums" }
    ]
  },
  {
    label: "Documentaries",
    href: "/admin/documentaries",
    requiredPermission: "access_documentaries"
  },
  { label: "Family", href: "/admin/family", requiredPermission: "edit_assigned_content" },
  { label: "Contributions", href: "/admin/contributions", requiredPermission: "review_submissions" },
  { label: "Users and Access", href: "/admin/access", requiredPermission: "manage_users" },
  { label: "Menus", href: "/admin/menus", requiredPermission: "manage_menus" },
  { label: "SEO", href: "/admin/seo", requiredPermission: "manage_all_content" },
  { label: "Site Settings", href: "/admin/settings", requiredPermission: "change_site_settings" },
  { label: "Audit Logs", href: "/admin/audit-logs", requiredPermission: "view_audit_logs" }
];
