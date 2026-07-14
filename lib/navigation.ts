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
    label: "His Life",
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
    label: "Documentaries",
    href: "/documentaries",
    children: [
      { label: "English Documentary", href: "/english-documentary" },
      { label: "Episodes", href: "/documentary-episodes" },
      { label: "Trailers and Clips", href: "/trailer-clips" },
      { label: "Transcripts", href: "/transcripts" }
    ]
  },
  {
    label: "Gallery",
    href: "/gallery",
    children: [
      { label: "Portraits", href: "/portraits" },
      { label: "Family", href: "/family" },
      { label: "Bolekaja", href: "/bolekaja-gallery" },
      { label: "Molue", href: "/molue-gallery" },
      { label: "Community", href: "/community-gallery" },
      { label: "Restored Images", href: "/restored-images" }
    ]
  },
  {
    label: "Family Legacy",
    href: "/family-tree",
    children: [
      { label: "Family Tree", href: "/family-tree" },
      { label: "Children", href: "/children" },
      { label: "Grandchildren", href: "/grandchildren" },
      { label: "Family Memories", href: "/family-memories" }
    ]
  },
  { label: "Lessons", href: "/lessons" },
  { label: "Archive", href: "/archive" },
  { label: "Blog", href: "/blog" },
  { label: "Share a Memory", href: "/tributes" },
  { label: "About", href: "/curator" },
  { label: "Contact", href: "/contact" }
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
      { label: "Images", href: "/admin/media?type=images" },
      { label: "Videos", href: "/admin/media?type=videos" },
      { label: "Audio", href: "/admin/media?type=audio" },
      { label: "Documents", href: "/admin/media?type=documents" },
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
