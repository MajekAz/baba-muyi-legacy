export const roles = [
  "owner",
  "administrator",
  "editor",
  "contributor",
  "reviewer",
  "viewer"
] as const;

export type UserRole = (typeof roles)[number];

export const permissions = [
  "manage_all_content",
  "manage_users",
  "manage_legacy_profiles",
  "upload_media",
  "delete_media",
  "publish_content",
  "manage_menus",
  "change_site_settings",
  "assign_roles",
  "view_audit_logs",
  "manage_privacy",
  "manage_supabase_settings",
  "review_submissions",
  "edit_assigned_content",
  "grant_private_viewing",
  "access_media_library",
  "access_documentaries"
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<UserRole, Permission[]> = {
  owner: [...permissions],
  administrator: [
    "manage_all_content",
    "manage_users",
    "upload_media",
    "delete_media",
    "publish_content",
    "manage_menus",
    "review_submissions",
    "access_media_library",
    "access_documentaries"
  ],
  editor: ["edit_assigned_content", "upload_media", "access_media_library", "access_documentaries"],
  contributor: ["upload_media"],
  reviewer: ["review_submissions"],
  viewer: ["grant_private_viewing"]
};

export function roleHasPermission(role: UserRole, permission: Permission) {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function canSeeAdminItem(role: UserRole | null, required?: Permission) {
  if (!role) {
    return false;
  }

  return required ? roleHasPermission(role, required) : true;
}
