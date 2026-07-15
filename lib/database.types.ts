export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_grants: {
        Row: {
          album_id: string | null
          can_access_documentaries: boolean
          can_access_media_library: boolean
          can_edit: boolean
          can_publish: boolean
          can_review: boolean
          can_upload: boolean
          can_view: boolean
          content_id: string | null
          content_table: string | null
          created_at: string
          documentary_id: string | null
          expires_at: string | null
          granted_by: string | null
          grantee_role: Database["public"]["Enums"]["user_role_key"] | null
          grantee_user_id: string | null
          id: string
          legacy_profile_id: string
          private_collection: string | null
          revoked_at: string | null
          workspace_id: string | null
        }
        Insert: {
          album_id?: string | null
          can_access_documentaries?: boolean
          can_access_media_library?: boolean
          can_edit?: boolean
          can_publish?: boolean
          can_review?: boolean
          can_upload?: boolean
          can_view?: boolean
          content_id?: string | null
          content_table?: string | null
          created_at?: string
          documentary_id?: string | null
          expires_at?: string | null
          granted_by?: string | null
          grantee_role?: Database["public"]["Enums"]["user_role_key"] | null
          grantee_user_id?: string | null
          id?: string
          legacy_profile_id: string
          private_collection?: string | null
          revoked_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          album_id?: string | null
          can_access_documentaries?: boolean
          can_access_media_library?: boolean
          can_edit?: boolean
          can_publish?: boolean
          can_review?: boolean
          can_upload?: boolean
          can_view?: boolean
          content_id?: string | null
          content_table?: string | null
          created_at?: string
          documentary_id?: string | null
          expires_at?: string | null
          granted_by?: string | null
          grantee_role?: Database["public"]["Enums"]["user_role_key"] | null
          grantee_user_id?: string | null
          id?: string
          legacy_profile_id?: string
          private_collection?: string | null
          revoked_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_grants_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "media_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_grants_documentary_id_fkey"
            columns: ["documentary_id"]
            isOneToOne: false
            referencedRelation: "documentaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_grants_grantee_role_fkey"
            columns: ["grantee_role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "access_grants_grantee_user_id_fkey"
            columns: ["grantee_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_grants_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_grants_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_table: string
          id: string
          legacy_profile_id: string | null
          metadata: Json
          workspace_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table: string
          id?: string
          legacy_profile_id?: string | null
          metadata?: Json
          workspace_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table?: string
          id?: string
          legacy_profile_id?: string | null
          metadata?: Json
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      biography_chapters: {
        Row: {
          body: Json
          created_at: string
          excerpt: string | null
          id: string
          legacy_profile_id: string
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          source_reference: string | null
          title: string
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          body?: Json
          created_at?: string
          excerpt?: string | null
          id?: string
          legacy_profile_id: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          source_reference?: string | null
          title: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          body?: Json
          created_at?: string
          excerpt?: string | null
          id?: string
          legacy_profile_id?: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          source_reference?: string | null
          title?: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biography_chapters_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biography_chapters_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          body: Json
          category_id: string | null
          created_at: string
          excerpt: string | null
          featured_media_id: string | null
          id: string
          legacy_profile_id: string
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          social_preview: Json
          source_reference: string | null
          title: string
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          author?: string | null
          body?: Json
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured_media_id?: string | null
          id?: string
          legacy_profile_id: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          social_preview?: Json
          source_reference?: string | null
          title: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          author?: string | null
          body?: Json
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured_media_id?: string | null
          id?: string
          legacy_profile_id?: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          social_preview?: Json
          source_reference?: string | null
          title?: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          legacy_profile_id: string | null
          name: string
          slug: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          name: string
          slug: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          name?: string
          slug?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          content_id: string
          content_table: string
          created_at: string
          edited_by: string | null
          id: string
          legacy_profile_id: string
          revision_number: number
          snapshot: Json
          workspace_id: string | null
        }
        Insert: {
          content_id: string
          content_table: string
          created_at?: string
          edited_by?: string | null
          id?: string
          legacy_profile_id: string
          revision_number: number
          snapshot: Json
          workspace_id?: string | null
        }
        Update: {
          content_id?: string
          content_table?: string
          created_at?: string
          edited_by?: string | null
          id?: string
          legacy_profile_id?: string
          revision_number?: number
          snapshot?: Json
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_edited_by_fkey"
            columns: ["edited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_revisions_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_revisions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tags: {
        Row: {
          content_id: string
          content_table: string
          created_at: string
          id: string
          legacy_profile_id: string
          tag_id: string
          workspace_id: string | null
        }
        Insert: {
          content_id: string
          content_table: string
          created_at?: string
          id?: string
          legacy_profile_id: string
          tag_id: string
          workspace_id?: string | null
        }
        Update: {
          content_id?: string
          content_table?: string
          created_at?: string
          id?: string
          legacy_profile_id?: string
          tag_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      documentaries: {
        Row: {
          author: string | null
          created_at: string
          director: string | null
          duration_seconds: number | null
          embed_url: string | null
          full_description: string | null
          id: string
          language: string | null
          legacy_profile_id: string
          narrator: string | null
          playback_id: string | null
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          producer: string | null
          provider: string | null
          publish_state: Database["public"]["Enums"]["publish_state"]
          release_date: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          social_image_media_id: string | null
          source_reference: string | null
          thumbnail_media_id: string | null
          title: string
          trailer_media_id: string | null
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
          writer: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          director?: string | null
          duration_seconds?: number | null
          embed_url?: string | null
          full_description?: string | null
          id?: string
          language?: string | null
          legacy_profile_id: string
          narrator?: string | null
          playback_id?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          producer?: string | null
          provider?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"]
          release_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          social_image_media_id?: string | null
          source_reference?: string | null
          thumbnail_media_id?: string | null
          title: string
          trailer_media_id?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
          writer?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          director?: string | null
          duration_seconds?: number | null
          embed_url?: string | null
          full_description?: string | null
          id?: string
          language?: string | null
          legacy_profile_id?: string
          narrator?: string | null
          playback_id?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          producer?: string | null
          provider?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"]
          release_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          social_image_media_id?: string | null
          source_reference?: string | null
          thumbnail_media_id?: string | null
          title?: string
          trailer_media_id?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
          writer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentaries_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentaries_social_image_media_id_fkey"
            columns: ["social_image_media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentaries_thumbnail_media_id_fkey"
            columns: ["thumbnail_media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentaries_trailer_media_id_fkey"
            columns: ["trailer_media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentaries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      documentary_chapters: {
        Row: {
          created_at: string
          documentary_id: string | null
          end_seconds: number | null
          episode_id: string | null
          id: string
          legacy_profile_id: string | null
          sort_order: number
          start_seconds: number
          title: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          documentary_id?: string | null
          end_seconds?: number | null
          episode_id?: string | null
          id?: string
          legacy_profile_id?: string | null
          sort_order?: number
          start_seconds: number
          title: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          documentary_id?: string | null
          end_seconds?: number | null
          episode_id?: string | null
          id?: string
          legacy_profile_id?: string | null
          sort_order?: number
          start_seconds?: number
          title?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentary_chapters_documentary_id_fkey"
            columns: ["documentary_id"]
            isOneToOne: false
            referencedRelation: "documentaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_chapters_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "documentary_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_chapters_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_chapters_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      documentary_episodes: {
        Row: {
          chapters: Json
          created_at: string
          documentary_id: string
          embed_url: string | null
          episode_number: number
          id: string
          legacy_profile_id: string | null
          playback_id: string | null
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          provider: string | null
          publish_state: Database["public"]["Enums"]["publish_state"]
          source_reference: string | null
          subtitle_path: string | null
          title: string
          transcript: string | null
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          chapters?: Json
          created_at?: string
          documentary_id: string
          embed_url?: string | null
          episode_number: number
          id?: string
          legacy_profile_id?: string | null
          playback_id?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          provider?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"]
          source_reference?: string | null
          subtitle_path?: string | null
          title: string
          transcript?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          chapters?: Json
          created_at?: string
          documentary_id?: string
          embed_url?: string | null
          episode_number?: number
          id?: string
          legacy_profile_id?: string | null
          playback_id?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          provider?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"]
          source_reference?: string | null
          subtitle_path?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentary_episodes_documentary_id_fkey"
            columns: ["documentary_id"]
            isOneToOne: false
            referencedRelation: "documentaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_episodes_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_episodes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      documentary_subtitles: {
        Row: {
          created_at: string
          documentary_id: string | null
          episode_id: string | null
          id: string
          label: string
          language: string
          legacy_profile_id: string | null
          media_item_id: string | null
          storage_path: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          documentary_id?: string | null
          episode_id?: string | null
          id?: string
          label: string
          language: string
          legacy_profile_id?: string | null
          media_item_id?: string | null
          storage_path?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          documentary_id?: string | null
          episode_id?: string | null
          id?: string
          label?: string
          language?: string
          legacy_profile_id?: string | null
          media_item_id?: string | null
          storage_path?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentary_subtitles_documentary_id_fkey"
            columns: ["documentary_id"]
            isOneToOne: false
            referencedRelation: "documentaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_subtitles_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "documentary_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_subtitles_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_subtitles_media_item_id_fkey"
            columns: ["media_item_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_subtitles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      documentary_transcripts: {
        Row: {
          created_at: string
          documentary_id: string | null
          episode_id: string | null
          id: string
          language: string
          legacy_profile_id: string | null
          media_item_id: string | null
          transcript: string
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          documentary_id?: string | null
          episode_id?: string | null
          id?: string
          language: string
          legacy_profile_id?: string | null
          media_item_id?: string | null
          transcript: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          documentary_id?: string | null
          episode_id?: string | null
          id?: string
          language?: string
          legacy_profile_id?: string | null
          media_item_id?: string | null
          transcript?: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentary_transcripts_documentary_id_fkey"
            columns: ["documentary_id"]
            isOneToOne: false
            referencedRelation: "documentaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_transcripts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "documentary_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_transcripts_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_transcripts_media_item_id_fkey"
            columns: ["media_item_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentary_transcripts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_living: boolean
          known_as: string | null
          legacy_profile_id: string
          life_dates: string | null
          notes: string | null
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          profile_media_id: string | null
          public_visibility: boolean
          publish_state: Database["public"]["Enums"]["publish_state"]
          source_reference: string | null
          stable_id: string | null
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          is_living?: boolean
          known_as?: string | null
          legacy_profile_id: string
          life_dates?: string | null
          notes?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          profile_media_id?: string | null
          public_visibility?: boolean
          publish_state?: Database["public"]["Enums"]["publish_state"]
          source_reference?: string | null
          stable_id?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_living?: boolean
          known_as?: string | null
          legacy_profile_id?: string
          life_dates?: string | null
          notes?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          profile_media_id?: string | null
          public_visibility?: boolean
          publish_state?: Database["public"]["Enums"]["publish_state"]
          source_reference?: string | null
          stable_id?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_profile_media_id_fkey"
            columns: ["profile_media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      family_relationships: {
        Row: {
          created_at: string
          from_member_id: string
          id: string
          is_private: boolean
          legacy_profile_id: string
          relationship: string
          source_reference: string | null
          stable_id: string | null
          to_member_id: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          from_member_id: string
          id?: string
          is_private?: boolean
          legacy_profile_id: string
          relationship: string
          source_reference?: string | null
          stable_id?: string | null
          to_member_id: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          from_member_id?: string
          id?: string
          is_private?: boolean
          legacy_profile_id?: string
          relationship?: string
          source_reference?: string | null
          stable_id?: string | null
          to_member_id?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_relationships_from_member_id_fkey"
            columns: ["from_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_to_member_id_fkey"
            columns: ["to_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string
          id: string
          invited_by: string | null
          invitee_email: string
          legacy_profile_id: string
          permissions: Database["public"]["Enums"]["permission_key"][]
          personal_message: string | null
          revoked_at: string | null
          role: Database["public"]["Enums"]["user_role_key"]
          sent_at: string
          status: Database["public"]["Enums"]["invitation_status"]
          token_hash: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          invited_by?: string | null
          invitee_email: string
          legacy_profile_id: string
          permissions?: Database["public"]["Enums"]["permission_key"][]
          personal_message?: string | null
          revoked_at?: string | null
          role: Database["public"]["Enums"]["user_role_key"]
          sent_at?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token_hash: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invitee_email?: string
          legacy_profile_id?: string
          permissions?: Database["public"]["Enums"]["permission_key"][]
          personal_message?: string | null
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["user_role_key"]
          sent_at?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token_hash?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "invitations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_members: {
        Row: {
          created_at: string
          id: string
          legacy_profile_id: string
          role: Database["public"]["Enums"]["user_role_key"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_profile_id: string
          role: Database["public"]["Enums"]["user_role_key"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          legacy_profile_id?: string
          role?: Database["public"]["Enums"]["user_role_key"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_members_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legacy_members_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "legacy_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_profile_members: {
        Row: {
          created_at: string
          id: string
          legacy_profile_id: string
          role: Database["public"]["Enums"]["user_role_key"]
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_profile_id: string
          role: Database["public"]["Enums"]["user_role_key"]
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          legacy_profile_id?: string
          role?: Database["public"]["Enums"]["user_role_key"]
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_profile_members_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legacy_profile_members_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "legacy_profile_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legacy_profile_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          death_year: number | null
          display_name: string
          display_order: number
          full_name: string
          id: string
          known_as: string | null
          legacy_type: Database["public"]["Enums"]["legacy_type"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_reference: string | null
          status: Database["public"]["Enums"]["publish_state"]
          summary: string | null
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          visibility: Database["public"]["Enums"]["privacy_state"]
          workspace_id: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          death_year?: number | null
          display_name: string
          display_order?: number
          full_name: string
          id?: string
          known_as?: string | null
          legacy_type?: Database["public"]["Enums"]["legacy_type"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source_reference?: string | null
          status?: Database["public"]["Enums"]["publish_state"]
          summary?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          visibility?: Database["public"]["Enums"]["privacy_state"]
          workspace_id: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          death_year?: number | null
          display_name?: string
          display_order?: number
          full_name?: string
          id?: string
          known_as?: string | null
          legacy_type?: Database["public"]["Enums"]["legacy_type"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source_reference?: string | null
          status?: Database["public"]["Enums"]["publish_state"]
          summary?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          visibility?: Database["public"]["Enums"]["privacy_state"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          author: string | null
          body: string
          category_id: string | null
          created_at: string
          english_interpretation: string | null
          id: string
          introduction: string | null
          legacy_profile_id: string
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          quotation: string | null
          source_reference: string | null
          source_story_id: string | null
          stable_id: string | null
          title: string
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
          yoruba_proverb: string | null
        }
        Insert: {
          author?: string | null
          body: string
          category_id?: string | null
          created_at?: string
          english_interpretation?: string | null
          id?: string
          introduction?: string | null
          legacy_profile_id: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          quotation?: string | null
          source_reference?: string | null
          source_story_id?: string | null
          stable_id?: string | null
          title: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
          yoruba_proverb?: string | null
        }
        Update: {
          author?: string | null
          body?: string
          category_id?: string | null
          created_at?: string
          english_interpretation?: string | null
          id?: string
          introduction?: string | null
          legacy_profile_id?: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          quotation?: string | null
          source_reference?: string | null
          source_story_id?: string | null
          stable_id?: string | null
          title?: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
          yoruba_proverb?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_source_story_id_fkey"
            columns: ["source_story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      media_album_items: {
        Row: {
          album_id: string
          created_at: string
          id: string
          legacy_profile_id: string | null
          media_item_id: string
          sort_order: number
          workspace_id: string | null
        }
        Insert: {
          album_id: string
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          media_item_id: string
          sort_order?: number
          workspace_id?: string | null
        }
        Update: {
          album_id?: string
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          media_item_id?: string
          sort_order?: number
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_album_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "media_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_album_items_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_album_items_media_item_id_fkey"
            columns: ["media_item_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_album_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      media_albums: {
        Row: {
          copyright_status: string | null
          created_at: string
          description: string | null
          id: string
          legacy_profile_id: string
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          slug: string
          source_reference: string | null
          title: string
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          copyright_status?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_profile_id: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          slug: string
          source_reference?: string | null
          title: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          copyright_status?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_profile_id?: string
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          slug?: string
          source_reference?: string | null
          title?: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_albums_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_albums_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          album_id: string | null
          alt_text: string | null
          approximate_date: string | null
          archival_storage_path: string | null
          bucket: string | null
          caption: string | null
          copyright_owner: string | null
          copyright_status: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          duration_seconds: number | null
          external_id: string | null
          external_provider: string | null
          file_size_bytes: number | null
          generated_filename: string | null
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          legacy_profile_id: string
          location: string | null
          mime_type: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          original_filename: string | null
          owner_user_id: string | null
          people_shown: string[]
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          related_content_id: string | null
          related_content_table: string | null
          replaced_by_media_id: string | null
          source_reference: string | null
          stable_id: string | null
          storage_path: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
          verification_state: Database["public"]["Enums"]["verification_state"]
          web_storage_path: string | null
          width: number | null
          workspace_id: string | null
        }
        Insert: {
          album_id?: string | null
          alt_text?: string | null
          approximate_date?: string | null
          archival_storage_path?: string | null
          bucket?: string | null
          caption?: string | null
          copyright_owner?: string | null
          copyright_status?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          external_id?: string | null
          external_provider?: string | null
          file_size_bytes?: number | null
          generated_filename?: string | null
          height?: number | null
          id?: string
          kind: Database["public"]["Enums"]["media_kind"]
          legacy_profile_id: string
          location?: string | null
          mime_type?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          original_filename?: string | null
          owner_user_id?: string | null
          people_shown?: string[]
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          related_content_id?: string | null
          related_content_table?: string | null
          replaced_by_media_id?: string | null
          source_reference?: string | null
          stable_id?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          verification_state?: Database["public"]["Enums"]["verification_state"]
          web_storage_path?: string | null
          width?: number | null
          workspace_id?: string | null
        }
        Update: {
          album_id?: string | null
          alt_text?: string | null
          approximate_date?: string | null
          archival_storage_path?: string | null
          bucket?: string | null
          caption?: string | null
          copyright_owner?: string | null
          copyright_status?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          external_id?: string | null
          external_provider?: string | null
          file_size_bytes?: number | null
          generated_filename?: string | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          legacy_profile_id?: string
          location?: string | null
          mime_type?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          original_filename?: string | null
          owner_user_id?: string | null
          people_shown?: string[]
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          related_content_id?: string | null
          related_content_table?: string | null
          replaced_by_media_id?: string | null
          source_reference?: string | null
          stable_id?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          verification_state?: Database["public"]["Enums"]["verification_state"]
          web_storage_path?: string | null
          width?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "media_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_replaced_by_media_id_fkey"
            columns: ["replaced_by_media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          badge: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          label: string
          link_type: Database["public"]["Enums"]["link_type"]
          menu_id: string
          open_in_new_tab: boolean
          parent_item_id: string | null
          publish_state: Database["public"]["Enums"]["publish_state"]
          required_role: Database["public"]["Enums"]["user_role_key"] | null
          scheduled_at: string | null
          slug: string
          sort_order: number
          updated_at: string
          url: string | null
          visibility: Database["public"]["Enums"]["privacy_state"]
        }
        Insert: {
          badge?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          label: string
          link_type?: Database["public"]["Enums"]["link_type"]
          menu_id: string
          open_in_new_tab?: boolean
          parent_item_id?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"]
          required_role?: Database["public"]["Enums"]["user_role_key"] | null
          scheduled_at?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
          url?: string | null
          visibility?: Database["public"]["Enums"]["privacy_state"]
        }
        Update: {
          badge?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          label?: string
          link_type?: Database["public"]["Enums"]["link_type"]
          menu_id?: string
          open_in_new_tab?: boolean
          parent_item_id?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"]
          required_role?: Database["public"]["Enums"]["user_role_key"] | null
          scheduled_at?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
          url?: string | null
          visibility?: Database["public"]["Enums"]["privacy_state"]
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_parent_item_id_fkey"
            columns: ["parent_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_required_role_fkey"
            columns: ["required_role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string
          id: string
          legacy_profile_id: string | null
          location: Database["public"]["Enums"]["menu_location"]
          name: string
          publish_state: Database["public"]["Enums"]["publish_state"]
          slug: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          location: Database["public"]["Enums"]["menu_location"]
          name: string
          publish_state?: Database["public"]["Enums"]["publish_state"]
          slug: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          location?: Database["public"]["Enums"]["menu_location"]
          name?: string
          publish_state?: Database["public"]["Enums"]["publish_state"]
          slug?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menus_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission: Database["public"]["Enums"]["permission_key"]
          role: Database["public"]["Enums"]["user_role_key"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission: Database["public"]["Enums"]["permission_key"]
          role: Database["public"]["Enums"]["user_role_key"]
        }
        Update: {
          created_at?: string
          id?: string
          permission?: Database["public"]["Enums"]["permission_key"]
          role?: Database["public"]["Enums"]["user_role_key"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          legacy_profile_id: string | null
          updated_at: string
          value: Json
          workspace_id: string | null
        }
        Insert: {
          id?: string
          key: string
          legacy_profile_id?: string | null
          updated_at?: string
          value?: Json
          workspace_id?: string | null
        }
        Update: {
          id?: string
          key?: string
          legacy_profile_id?: string | null
          updated_at?: string
          value?: Json
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          body: string
          contributor_email: string | null
          contributor_name: string | null
          created_at: string
          id: string
          legacy_profile_id: string
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          source_reference: string | null
          stable_id: string | null
          title: string
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          body: string
          contributor_email?: string | null
          contributor_name?: string | null
          created_at?: string
          id?: string
          legacy_profile_id: string
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          source_reference?: string | null
          stable_id?: string | null
          title: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          body?: string
          contributor_email?: string | null
          contributor_name?: string | null
          created_at?: string
          id?: string
          legacy_profile_id?: string
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          source_reference?: string | null
          stable_id?: string | null
          title?: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          legacy_profile_id: string | null
          name: string
          slug: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          name: string
          slug: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legacy_profile_id?: string | null
          name?: string
          slug?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          category: string | null
          created_at: string
          date_label: string | null
          description: string | null
          event_date: string | null
          id: string
          legacy_profile_id: string
          location: string | null
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          sort_order: number
          source_reference: string | null
          stable_id: string | null
          title: string
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date_label?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          legacy_profile_id: string
          location?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          sort_order?: number
          source_reference?: string | null
          stable_id?: string | null
          title: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date_label?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          legacy_profile_id?: string
          location?: string | null
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          sort_order?: number
          source_reference?: string | null
          stable_id?: string | null
          title?: string
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tributes: {
        Row: {
          author_email: string | null
          author_name: string
          consent_to_publish: boolean
          created_at: string
          id: string
          legacy_profile_id: string
          message: string
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          privacy_state: Database["public"]["Enums"]["privacy_state"]
          publish_state: Database["public"]["Enums"]["publish_state"]
          relationship: string | null
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          workspace_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name: string
          consent_to_publish?: boolean
          created_at?: string
          id?: string
          legacy_profile_id: string
          message: string
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          relationship?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string
          consent_to_publish?: boolean
          created_at?: string
          id?: string
          legacy_profile_id?: string
          message?: string
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          privacy_state?: Database["public"]["Enums"]["privacy_state"]
          publish_state?: Database["public"]["Enums"]["publish_state"]
          relationship?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tributes_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tributes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_by: string | null
          id: string
          legacy_profile_id: string | null
          permission: Database["public"]["Enums"]["permission_key"]
          revoked_at: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          legacy_profile_id?: string | null
          permission: Database["public"]["Enums"]["permission_key"]
          revoked_at?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          legacy_profile_id?: string | null
          permission?: Database["public"]["Enums"]["permission_key"]
          revoked_at?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_legacy_profile_id_fkey"
            columns: ["legacy_profile_id"]
            isOneToOne: false
            referencedRelation: "legacy_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_key"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role_key"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_key"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
        ]
      }
      user_roles: {
        Row: {
          can_manage_security: boolean
          can_publish: boolean
          created_at: string
          description: string
          key: Database["public"]["Enums"]["user_role_key"]
          label: string
        }
        Insert: {
          can_manage_security?: boolean
          can_publish?: boolean
          created_at?: string
          description: string
          key: Database["public"]["Enums"]["user_role_key"]
          label: string
        }
        Update: {
          can_manage_security?: boolean
          can_publish?: boolean
          created_at?: string
          description?: string
          key?: Database["public"]["Enums"]["user_role_key"]
          label?: string
        }
        Relationships: []
      }
      waiting_list: {
        Row: {
          created_at: string
          email: string
          id: string
          interest: string
          name: string
          note: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interest: string
          name: string
          note?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interest?: string
          name?: string
          note?: string | null
        }
        Relationships: []
      }
      workspace_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string
          id: string
          invited_by: string | null
          invitee_email: string
          personal_message: string | null
          revoked_at: string | null
          role: Database["public"]["Enums"]["user_role_key"]
          status: Database["public"]["Enums"]["invitation_status"]
          token_hash: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          invited_by?: string | null
          invitee_email: string
          personal_message?: string | null
          revoked_at?: string | null
          role: Database["public"]["Enums"]["user_role_key"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token_hash: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invitee_email?: string
          personal_message?: string | null
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["user_role_key"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token_hash?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "workspace_invitations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["user_role_key"]
          status: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["user_role_key"]
          status?: string
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["user_role_key"]
          status?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_roles: {
        Row: {
          created_at: string
          description: string
          label: string
          role: Database["public"]["Enums"]["user_role_key"]
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description: string
          label: string
          role: Database["public"]["Enums"]["user_role_key"]
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string
          label?: string
          role?: Database["public"]["Enums"]["user_role_key"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_roles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "workspace_roles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          billing_customer_id: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["workspace_status"]
          updated_at: string
        }
        Insert: {
          billing_customer_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["workspace_status"]
          updated_at?: string
        }
        Update: {
          billing_customer_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["workspace_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_profile_content: {
        Args: { profile_id: string }
        Returns: boolean
      }
      can_manage_profile_security: {
        Args: { profile_id: string }
        Returns: boolean
      }
      can_manage_workspace: {
        Args: { workspace_uuid: string }
        Returns: boolean
      }
      can_read_private_profile: {
        Args: { profile_id: string }
        Returns: boolean
      }
      current_user_role_for_profile: {
        Args: { profile_id: string }
        Returns: Database["public"]["Enums"]["user_role_key"]
      }
      current_user_role_for_workspace: {
        Args: { workspace_uuid: string }
        Returns: Database["public"]["Enums"]["user_role_key"]
      }
      is_workspace_member: {
        Args: { workspace_uuid: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          permission_key: Database["public"]["Enums"]["permission_key"]
          profile_id: string
        }
        Returns: boolean
      }
      user_has_workspace_permission: {
        Args: {
          permission_key: Database["public"]["Enums"]["permission_key"]
          workspace_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      invitation_status: "pending" | "accepted" | "expired" | "revoked"
      legacy_type: "individual" | "family" | "organisation"
      link_type:
        | "internal"
        | "external"
        | "documentary"
        | "biography_section"
        | "timeline_section"
        | "album"
        | "document_download"
      media_kind:
        | "image"
        | "document"
        | "audio"
        | "video_clip"
        | "external_video"
      menu_location:
        | "header"
        | "mobile"
        | "footer"
        | "secondary"
        | "documentary"
        | "admin"
      moderation_state: "pending" | "approved" | "rejected" | "needs_review"
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
        | "access_documentaries"
      privacy_state:
        | "public"
        | "preview"
        | "private"
        | "family_only"
        | "registered"
        | "invited"
        | "specific_users"
        | "password_protected"
      publish_state: "draft" | "scheduled" | "published" | "archived"
      user_role_key:
        | "owner"
        | "editor"
        | "contributor"
        | "administrator"
        | "reviewer"
        | "viewer"
      verification_state:
        | "unverified"
        | "family_memory"
        | "partially_verified"
        | "verified"
      workspace_status: "active" | "suspended" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invitation_status: ["pending", "accepted", "expired", "revoked"],
      legacy_type: ["individual", "family", "organisation"],
      link_type: [
        "internal",
        "external",
        "documentary",
        "biography_section",
        "timeline_section",
        "album",
        "document_download",
      ],
      media_kind: [
        "image",
        "document",
        "audio",
        "video_clip",
        "external_video",
      ],
      menu_location: [
        "header",
        "mobile",
        "footer",
        "secondary",
        "documentary",
        "admin",
      ],
      moderation_state: ["pending", "approved", "rejected", "needs_review"],
      permission_key: [
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
        "access_documentaries",
      ],
      privacy_state: [
        "public",
        "preview",
        "private",
        "family_only",
        "registered",
        "invited",
        "specific_users",
        "password_protected",
      ],
      publish_state: ["draft", "scheduled", "published", "archived"],
      user_role_key: [
        "owner",
        "editor",
        "contributor",
        "administrator",
        "reviewer",
        "viewer",
      ],
      verification_state: [
        "unverified",
        "family_memory",
        "partially_verified",
        "verified",
      ],
      workspace_status: ["active", "suspended", "archived"],
    },
  },
} as const
