alter table public.media_albums
  add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade,
  add column if not exists cover_media_id uuid references public.media_items(id) on delete set null,
  add column if not exists sort_order integer not null default 0,
  add column if not exists archived_at timestamptz;

update public.media_albums a
set workspace_id = lp.workspace_id
from public.legacy_profiles lp
where a.legacy_profile_id = lp.id
  and a.workspace_id is null;

alter table public.media_items
  add column if not exists media_type public.media_kind,
  add column if not exists storage_bucket text,
  add column if not exists file_size bigint,
  add column if not exists duration numeric,
  add column if not exists date_precision text not null default 'unknown',
  add column if not exists source text,
  add column if not exists licence text,
  add column if not exists publication_status public.publish_state,
  add column if not exists visibility public.privacy_state,
  add column if not exists last_editor_id uuid references public.user_profiles(id) on delete set null,
  add column if not exists published_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists original_checksum text,
  add column if not exists restoration_notes text,
  add column if not exists restored_by uuid references public.user_profiles(id) on delete set null,
  add column if not exists restoration_date date,
  add column if not exists scan_status text not null default 'not_scanned',
  add column if not exists thumbnail_storage_path text,
  add column if not exists restored_storage_path text;

update public.media_items
set media_type = kind
where media_type is null;

update public.media_items
set storage_bucket = bucket
where storage_bucket is null and bucket is not null;

update public.media_items
set file_size = file_size_bytes
where file_size is null and file_size_bytes is not null;

update public.media_items
set duration = duration_seconds
where duration is null and duration_seconds is not null;

update public.media_items
set source = source_reference
where source is null and source_reference is not null;

update public.media_items
set publication_status = publish_state
where publication_status is null;

update public.media_items
set visibility = privacy_state
where visibility is null;

alter table public.media_items
  alter column media_type set not null,
  alter column publication_status set not null,
  alter column visibility set not null;

alter table public.media_items
  drop constraint if exists media_date_precision_check,
  add constraint media_date_precision_check check (date_precision in ('unknown', 'year', 'month', 'day', 'circa', 'range'));

alter table public.media_items
  drop constraint if exists media_scan_status_check,
  add constraint media_scan_status_check check (scan_status in ('not_scanned', 'pending', 'passed', 'failed', 'quarantined'));

create table if not exists public.media_versions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  media_item_id uuid not null references public.media_items(id) on delete cascade,
  version_type text not null,
  storage_bucket text not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  width integer,
  height integer,
  duration numeric,
  checksum text,
  restoration_notes text,
  restored_by uuid references public.user_profiles(id) on delete set null,
  restoration_date date,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint media_versions_type_check check (version_type in ('original', 'web_optimised', 'thumbnail', 'restored'))
);

create table if not exists public.media_relations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  media_item_id uuid not null references public.media_items(id) on delete cascade,
  related_table text not null,
  related_id uuid not null,
  relation_type text not null default 'related',
  sort_order integer not null default 0,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (media_item_id, related_table, related_id, relation_type),
  constraint media_relations_table_check check (related_table in ('biography_chapters', 'timeline_events', 'stories', 'lessons', 'blog_posts')),
  constraint media_relations_type_check check (relation_type in ('featured', 'related', 'inline', 'source'))
);

create index if not exists idx_media_albums_workspace_profile_status on public.media_albums(workspace_id, legacy_profile_id, publish_state, privacy_state);
create index if not exists idx_media_items_workspace_profile_status on public.media_items(workspace_id, legacy_profile_id, publication_status, visibility, moderation_state);
create index if not exists idx_media_items_type on public.media_items(media_type);
create index if not exists idx_media_versions_item_type on public.media_versions(media_item_id, version_type);
create index if not exists idx_media_relations_related on public.media_relations(related_table, related_id);

alter table public.media_versions enable row level security;
alter table public.media_relations enable row level security;

drop policy if exists "public reads published public media versions" on public.media_versions;
drop policy if exists "members manage media versions" on public.media_versions;
drop policy if exists "public reads published public media relations" on public.media_relations;
drop policy if exists "members manage media relations" on public.media_relations;

create policy "public reads published public media versions" on public.media_versions
  for select using (
    exists (
      select 1 from public.media_items m
      where m.id = media_item_id
        and m.publication_status = 'published'
        and m.visibility = 'public'
        and m.moderation_state = 'approved'
        and m.deleted_at is null
    )
  );

create policy "members manage media versions" on public.media_versions
  for all using (public.user_has_permission(legacy_profile_id, 'access_media_library'))
  with check (public.user_has_permission(legacy_profile_id, 'access_media_library'));

create policy "public reads published public media relations" on public.media_relations
  for select using (
    exists (
      select 1 from public.media_items m
      where m.id = media_item_id
        and m.publication_status = 'published'
        and m.visibility = 'public'
        and m.moderation_state = 'approved'
        and m.deleted_at is null
    )
  );

create policy "members manage media relations" on public.media_relations
  for all using (public.user_has_permission(legacy_profile_id, 'access_media_library'))
  with check (public.user_has_permission(legacy_profile_id, 'access_media_library'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('legacy-images', 'legacy-images', false, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('profile-images', 'profile-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('legacy-documents', 'legacy-documents', false, 52428800, array['application/pdf']),
  ('legacy-audio', 'legacy-audio', false, 104857600, array['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a']),
  ('legacy-video', 'legacy-video', false, 268435456, array['video/mp4', 'video/webm']),
  ('tribute-uploads', 'tribute-uploads', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'video/mp4'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
