export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Enums: {
      user_role_key: "owner" | "administrator" | "editor" | "contributor" | "reviewer" | "viewer";
      legacy_type: "individual" | "family" | "organisation";
      publish_state: "draft" | "scheduled" | "published" | "archived";
      privacy_state: "public" | "preview" | "private" | "family_only" | "registered" | "invited" | "specific_users" | "password_protected";
      moderation_state: "pending" | "approved" | "rejected" | "needs_review";
      verification_state: "unverified" | "family_memory" | "partially_verified" | "verified";
      workspace_status: "active" | "suspended" | "archived";
      invitation_status: "pending" | "accepted" | "expired" | "revoked";
      permission_key:
        | "manage_all_content"
        | "manage_users"
        | "manage_legacy_profiles"
        | "upload_media"
        | "delete_media"
        | "publish_content"
        | "manage_menus"
        | "change_site_settings"
        | "assign_roles"
        | "view_audit_logs"
        | "manage_privacy"
        | "manage_supabase_settings"
        | "review_submissions"
        | "edit_assigned_content"
        | "grant_private_viewing"
        | "access_media_library"
        | "access_documentaries";
      menu_location: "header" | "mobile" | "footer" | "secondary" | "documentary" | "admin";
      link_type: "internal" | "external" | "documentary" | "biography_section" | "timeline_section" | "album" | "document_download";
    };
    Tables: {
      user_profiles: {
        Row: { id: string; display_name: string | null; role: Database["public"]["Enums"]["user_role_key"]; created_at: string; updated_at: string };
        Insert: { id: string; display_name?: string | null; role?: Database["public"]["Enums"]["user_role_key"]; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
      workspaces: {
        Row: { id: string; name: string; slug: string; status: Database["public"]["Enums"]["workspace_status"]; billing_customer_id: string | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; slug: string; status?: Database["public"]["Enums"]["workspace_status"]; billing_customer_id?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>;
      };
      workspace_members: {
        Row: { id: string; workspace_id: string; user_id: string; role: Database["public"]["Enums"]["user_role_key"]; status: string; invited_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; user_id: string; role: Database["public"]["Enums"]["user_role_key"]; status?: string; invited_by?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>;
      };
      workspace_invitations: {
        Row: { id: string; workspace_id: string; invitee_email: string; role: Database["public"]["Enums"]["user_role_key"]; token_hash: string; invited_by: string | null; personal_message: string | null; expires_at: string; accepted_at: string | null; revoked_at: string | null; status: Database["public"]["Enums"]["invitation_status"]; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; invitee_email: string; role: Database["public"]["Enums"]["user_role_key"]; token_hash: string; invited_by?: string | null; personal_message?: string | null; expires_at: string; accepted_at?: string | null; revoked_at?: string | null; status?: Database["public"]["Enums"]["invitation_status"]; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["workspace_invitations"]["Insert"]>;
      };
      legacy_profiles: {
        Row: { id: string; workspace_id: string; slug: string; legacy_type: Database["public"]["Enums"]["legacy_type"]; full_name: string; display_name: string; known_as: string | null; birth_date: string | null; death_year: number | null; summary: string | null; visibility: Database["public"]["Enums"]["privacy_state"]; publish_state: Database["public"]["Enums"]["publish_state"]; status: Database["public"]["Enums"]["publish_state"]; verification_state: Database["public"]["Enums"]["verification_state"]; seo_title: string | null; seo_description: string | null; source_reference: string | null; display_order: number; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; slug: string; legacy_type?: Database["public"]["Enums"]["legacy_type"]; full_name: string; display_name: string; known_as?: string | null; birth_date?: string | null; death_year?: number | null; summary?: string | null; visibility?: Database["public"]["Enums"]["privacy_state"]; publish_state?: Database["public"]["Enums"]["publish_state"]; status?: Database["public"]["Enums"]["publish_state"]; verification_state?: Database["public"]["Enums"]["verification_state"]; seo_title?: string | null; seo_description?: string | null; source_reference?: string | null; display_order?: number; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["legacy_profiles"]["Insert"]>;
      };
      legacy_profile_members: {
        Row: { id: string; workspace_id: string; legacy_profile_id: string; user_id: string; role: Database["public"]["Enums"]["user_role_key"]; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; legacy_profile_id: string; user_id: string; role: Database["public"]["Enums"]["user_role_key"]; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["legacy_profile_members"]["Insert"]>;
      };
      invitations: GenericContentRow;
      biography_chapters: GenericContentRow;
      timeline_events: GenericContentRow;
      lessons: GenericContentRow;
      blog_posts: GenericContentRow;
      stories: GenericContentRow;
      tributes: GenericContentRow;
      media_albums: GenericContentRow;
      media_items: GenericContentRow;
      documentaries: GenericContentRow;
      documentary_episodes: GenericContentRow;
      family_members: GenericContentRow;
      family_relationships: GenericContentRow;
      menus: GenericContentRow;
      menu_items: GenericContentRow;
      site_settings: GenericContentRow;
      content_revisions: GenericContentRow;
      audit_logs: GenericContentRow;
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role_for_workspace: { Args: { workspace_uuid: string }; Returns: Database["public"]["Enums"]["user_role_key"] | null };
      is_workspace_member: { Args: { workspace_uuid: string }; Returns: boolean };
      can_manage_workspace: { Args: { workspace_uuid: string }; Returns: boolean };
      current_user_role_for_profile: { Args: { profile_id: string }; Returns: Database["public"]["Enums"]["user_role_key"] | null };
      user_has_workspace_permission: { Args: { workspace_uuid: string; permission_key: Database["public"]["Enums"]["permission_key"] }; Returns: boolean };
      user_has_permission: { Args: { profile_id: string; permission_key: Database["public"]["Enums"]["permission_key"] }; Returns: boolean };
    };
  };
};

type GenericContentRow = {
  Row: {
    id: string;
    workspace_id: string;
    legacy_profile_id: string | null;
    [key: string]: Json | string | number | boolean | null;
  };
  Insert: {
    id?: string;
    workspace_id: string;
    legacy_profile_id?: string | null;
    [key: string]: Json | string | number | boolean | null | undefined;
  };
  Update: {
    id?: string;
    workspace_id?: string;
    legacy_profile_id?: string | null;
    [key: string]: Json | string | number | boolean | null | undefined;
  };
};
