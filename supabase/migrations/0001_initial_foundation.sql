create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role_key as enum ('owner', 'editor', 'contributor');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.legacy_type as enum ('individual', 'family', 'organisation');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.publish_state as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.privacy_state as enum ('public', 'preview', 'private', 'family_only');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.moderation_state as enum ('pending', 'approved', 'rejected', 'needs_review');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.verification_state as enum ('unverified', 'family_memory', 'partially_verified', 'verified');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_kind as enum ('image', 'document', 'audio', 'video_clip', 'external_video');
exception when duplicate_object then null;
end $$;

create table if not exists public.user_roles (
  key public.user_role_key primary key,
  label text not null,
  description text not null,
  can_manage_security boolean not null default false,
  can_publish boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.user_roles (key, label, description, can_manage_security, can_publish)
values
  ('owner', 'Owner', 'Complete control over the legacy profile, users, publishing, settings, and security.', true, true),
  ('editor', 'Editor', 'Can create, edit, review, and publish content, but cannot change platform security.', false, true),
  ('contributor', 'Contributor', 'Can submit memories and media for review, but cannot publish content.', false, false)
on conflict (key) do update
set label = excluded.label,
    description = excluded.description,
    can_manage_security = excluded.can_manage_security,
    can_publish = excluded.can_publish;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role_key not null default 'contributor' references public.user_roles(key),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legacy_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  legacy_type public.legacy_type not null default 'individual',
  full_name text not null,
  display_name text not null,
  known_as text,
  birth_date date,
  death_year integer,
  summary text,
  visibility public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  verification_state public.verification_state not null default 'unverified',
  seo_title text,
  seo_description text,
  source_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint legacy_profiles_slug_not_empty check (length(trim(slug)) > 0)
);

create table if not exists public.legacy_members (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role public.user_role_key not null references public.user_roles(key),
  created_at timestamptz not null default now(),
  unique (legacy_profile_id, user_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table if not exists public.media_albums (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  privacy_state public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  copyright_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  stable_id text unique,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  album_id uuid references public.media_albums(id) on delete set null,
  kind public.media_kind not null,
  title text not null,
  caption text,
  alt_text text,
  bucket text,
  storage_path text,
  archival_storage_path text,
  web_storage_path text,
  external_provider text,
  external_id text,
  mime_type text,
  file_size_bytes bigint,
  approximate_date text,
  location text,
  people_shown text[] not null default array[]::text[],
  uploaded_by uuid references public.user_profiles(id) on delete set null,
  owner_user_id uuid references public.user_profiles(id) on delete set null,
  moderation_state public.moderation_state not null default 'pending',
  privacy_state public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  copyright_owner text,
  copyright_status text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_has_storage_or_external check (
    (storage_path is not null and bucket is not null) or external_id is not null
  )
);

create table if not exists public.biography_chapters (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  body jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  publish_state public.publish_state not null default 'draft',
  privacy_state public.privacy_state not null default 'private',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  stable_id text unique,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  event_date date,
  date_label text,
  location text,
  category text,
  description text,
  sort_order integer not null default 0,
  publish_state public.publish_state not null default 'draft',
  privacy_state public.privacy_state not null default 'private',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documentaries (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  short_description text,
  full_description text,
  author text,
  narrator text,
  language text,
  provider text,
  playback_id text,
  embed_url text,
  thumbnail_media_id uuid references public.media_items(id) on delete set null,
  publish_state public.publish_state not null default 'draft',
  privacy_state public.privacy_state not null default 'private',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table if not exists public.documentary_episodes (
  id uuid primary key default gen_random_uuid(),
  documentary_id uuid not null references public.documentaries(id) on delete cascade,
  title text not null,
  episode_number integer not null,
  provider text,
  playback_id text,
  embed_url text,
  transcript text,
  subtitle_path text,
  chapters jsonb not null default '[]'::jsonb,
  publish_state public.publish_state not null default 'draft',
  privacy_state public.privacy_state not null default 'private',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (documentary_id, episode_number)
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  stable_id text unique,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  full_name text not null,
  known_as text,
  life_dates text,
  is_living boolean not null default true,
  public_visibility boolean not null default false,
  notes text,
  profile_media_id uuid references public.media_items(id) on delete set null,
  privacy_state public.privacy_state not null default 'family_only',
  publish_state public.publish_state not null default 'draft',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_relationships (
  id uuid primary key default gen_random_uuid(),
  stable_id text unique,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  from_member_id uuid not null references public.family_members(id) on delete cascade,
  to_member_id uuid not null references public.family_members(id) on delete cascade,
  relationship text not null,
  is_private boolean not null default true,
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  created_at timestamptz not null default now(),
  unique (from_member_id, to_member_id, relationship)
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  stable_id text unique,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  body text not null,
  contributor_name text,
  contributor_email text,
  moderation_state public.moderation_state not null default 'pending',
  privacy_state public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  stable_id text unique,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  introduction text,
  body text not null,
  quotation text,
  yoruba_proverb text,
  english_interpretation text,
  author text,
  category_id uuid references public.categories(id) on delete set null,
  source_story_id uuid references public.stories(id) on delete set null,
  publish_state public.publish_state not null default 'draft',
  privacy_state public.privacy_state not null default 'private',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tributes (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  author_name text not null,
  author_email text,
  relationship text,
  message text not null,
  consent_to_publish boolean not null default false,
  moderation_state public.moderation_state not null default 'pending',
  privacy_state public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  verification_state public.verification_state not null default 'family_memory',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  body jsonb not null default '{}'::jsonb,
  category_id uuid references public.categories(id) on delete set null,
  featured_media_id uuid references public.media_items(id) on delete set null,
  author text,
  publish_state public.publish_state not null default 'draft',
  privacy_state public.privacy_state not null default 'private',
  verification_state public.verification_state not null default 'unverified',
  source_reference text,
  seo_title text,
  seo_description text,
  social_preview jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table if not exists public.content_tags (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  content_table text not null,
  content_id uuid not null,
  created_at timestamptz not null default now(),
  unique (tag_id, content_table, content_id)
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, key)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete set null,
  actor_user_id uuid references public.user_profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.waiting_list (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  interest text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_legacy_members_user on public.legacy_members(user_id);
create index if not exists idx_legacy_members_profile on public.legacy_members(legacy_profile_id);
create index if not exists idx_biography_profile_order on public.biography_chapters(legacy_profile_id, sort_order);
create index if not exists idx_timeline_profile_order on public.timeline_events(legacy_profile_id, sort_order);
create index if not exists idx_media_profile_album on public.media_items(legacy_profile_id, album_id);
create index if not exists idx_documentaries_profile on public.documentaries(legacy_profile_id);
create index if not exists idx_family_members_profile on public.family_members(legacy_profile_id);
create index if not exists idx_blog_profile_published on public.blog_posts(legacy_profile_id, publish_state, published_at);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role_for_profile(profile_id uuid)
returns public.user_role_key
language sql
security definer
set search_path = public
as $$
  select lm.role
  from public.legacy_members lm
  where lm.legacy_profile_id = profile_id
    and lm.user_id = auth.uid()
  limit 1
$$;

create or replace function public.can_read_private_profile(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_profile(profile_id) in ('owner', 'editor', 'contributor'), false)
$$;

create or replace function public.can_manage_profile_content(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_profile(profile_id) in ('owner', 'editor'), false)
$$;

create or replace function public.can_manage_profile_security(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_profile(profile_id) = 'owner', false)
$$;

do $$ declare
  table_name text;
begin
  foreach table_name in array array[
    'user_profiles', 'legacy_profiles', 'media_albums', 'media_items', 'biography_chapters',
    'timeline_events', 'documentaries', 'documentary_episodes', 'family_members',
    'stories', 'lessons', 'tributes', 'blog_posts'
  ]
  loop
    execute format('drop trigger if exists touch_%I on public.%I', table_name, table_name);
    execute format('create trigger touch_%I before update on public.%I for each row execute function public.touch_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.user_roles enable row level security;
alter table public.user_profiles enable row level security;
alter table public.legacy_profiles enable row level security;
alter table public.legacy_members enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.media_albums enable row level security;
alter table public.media_items enable row level security;
alter table public.biography_chapters enable row level security;
alter table public.timeline_events enable row level security;
alter table public.documentaries enable row level security;
alter table public.documentary_episodes enable row level security;
alter table public.family_members enable row level security;
alter table public.family_relationships enable row level security;
alter table public.stories enable row level security;
alter table public.lessons enable row level security;
alter table public.tributes enable row level security;
alter table public.blog_posts enable row level security;
alter table public.content_tags enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.waiting_list enable row level security;

create policy "roles are readable" on public.user_roles for select using (true);

create policy "users read own profile" on public.user_profiles for select using (id = auth.uid());
create policy "users update own display name" on public.user_profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "public reads published visible profiles" on public.legacy_profiles
  for select using (publish_state = 'published' and visibility = 'public');
create policy "members read their legacy profiles" on public.legacy_profiles
  for select using (public.can_read_private_profile(id));
create policy "owners manage legacy profiles" on public.legacy_profiles
  for all using (public.can_manage_profile_security(id)) with check (public.can_manage_profile_security(id));

create policy "members read memberships" on public.legacy_members
  for select using (user_id = auth.uid() or public.can_manage_profile_security(legacy_profile_id));
create policy "owners manage memberships" on public.legacy_members
  for all using (public.can_manage_profile_security(legacy_profile_id)) with check (public.can_manage_profile_security(legacy_profile_id));

create policy "public reads published public albums" on public.media_albums
  for select using (publish_state = 'published' and privacy_state = 'public');
create policy "members manage albums by role" on public.media_albums
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads published public media" on public.media_items
  for select using (publish_state = 'published' and privacy_state = 'public' and moderation_state = 'approved' and deleted_at is null);
create policy "members read private media" on public.media_items
  for select using (public.can_read_private_profile(legacy_profile_id));
create policy "contributors submit own media" on public.media_items
  for insert with check (auth.uid() is not null and uploaded_by = auth.uid() and publish_state = 'draft' and moderation_state = 'pending');
create policy "editors manage media" on public.media_items
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads published public chapters" on public.biography_chapters
  for select using (publish_state = 'published' and privacy_state = 'public');
create policy "editors manage chapters" on public.biography_chapters
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads published public timeline" on public.timeline_events
  for select using (publish_state = 'published' and privacy_state = 'public');
create policy "editors manage timeline" on public.timeline_events
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads published public documentaries" on public.documentaries
  for select using (publish_state = 'published' and privacy_state = 'public');
create policy "editors manage documentaries" on public.documentaries
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads published public episodes" on public.documentary_episodes
  for select using (
    publish_state = 'published'
    and privacy_state = 'public'
    and exists (
      select 1 from public.documentaries d
      where d.id = documentary_id and d.publish_state = 'published' and d.privacy_state = 'public'
    )
  );
create policy "editors manage episodes" on public.documentary_episodes
  for all using (
    exists (select 1 from public.documentaries d where d.id = documentary_id and public.can_manage_profile_content(d.legacy_profile_id))
  ) with check (
    exists (select 1 from public.documentaries d where d.id = documentary_id and public.can_manage_profile_content(d.legacy_profile_id))
  );

create policy "public reads visible family members" on public.family_members
  for select using (publish_state = 'published' and privacy_state = 'public' and (is_living = false or public_visibility = true));
create policy "editors manage family members" on public.family_members
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads non-private family relationships" on public.family_relationships
  for select using (is_private = false);
create policy "editors manage family relationships" on public.family_relationships
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public submits stories" on public.stories
  for insert with check (publish_state = 'draft' and moderation_state = 'pending');
create policy "public reads approved public stories" on public.stories
  for select using (publish_state = 'published' and privacy_state = 'public' and moderation_state = 'approved');
create policy "editors manage stories" on public.stories
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads published public lessons" on public.lessons
  for select using (publish_state = 'published' and privacy_state = 'public');
create policy "editors manage lessons" on public.lessons
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public submits tributes" on public.tributes
  for insert with check (publish_state = 'draft' and moderation_state = 'pending' and consent_to_publish = true);
create policy "public reads approved public tributes" on public.tributes
  for select using (publish_state = 'published' and privacy_state = 'public' and moderation_state = 'approved');
create policy "editors manage tributes" on public.tributes
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads categories" on public.categories for select using (true);
create policy "editors manage categories" on public.categories
  for all using (legacy_profile_id is not null and public.can_manage_profile_content(legacy_profile_id))
  with check (legacy_profile_id is not null and public.can_manage_profile_content(legacy_profile_id));

create policy "public reads tags" on public.tags for select using (true);
create policy "editors manage tags" on public.tags
  for all using (legacy_profile_id is not null and public.can_manage_profile_content(legacy_profile_id))
  with check (legacy_profile_id is not null and public.can_manage_profile_content(legacy_profile_id));

create policy "public reads published public posts" on public.blog_posts
  for select using (publish_state = 'published' and privacy_state = 'public');
create policy "editors manage posts" on public.blog_posts
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads content tags" on public.content_tags for select using (true);
create policy "editors manage content tags" on public.content_tags
  for all using (public.can_manage_profile_content(legacy_profile_id)) with check (public.can_manage_profile_content(legacy_profile_id));

create policy "public reads public settings" on public.site_settings for select using (true);
create policy "owners manage settings" on public.site_settings
  for all using (legacy_profile_id is not null and public.can_manage_profile_security(legacy_profile_id))
  with check (legacy_profile_id is not null and public.can_manage_profile_security(legacy_profile_id));

create policy "owners read audit logs" on public.audit_logs
  for select using (legacy_profile_id is not null and public.can_manage_profile_security(legacy_profile_id));
create policy "authenticated users insert audit logs" on public.audit_logs
  for insert with check (auth.uid() is not null);

create policy "public joins waiting list" on public.waiting_list for insert with check (true);

insert into public.legacy_profiles (
  slug,
  legacy_type,
  full_name,
  display_name,
  known_as,
  death_year,
  visibility,
  publish_state,
  verification_state,
  source_reference
) values (
  'baba-muyi',
  'individual',
  'Alhaji Tioluwalase “Baba Muyi” Majekodunmi',
  'Baba Muyi',
  'Baba Muyi',
  2008,
  'private',
  'draft',
  'family_memory',
  'Approved foundation seed details supplied by project owner'
) on conflict (slug) do update
set full_name = excluded.full_name,
    display_name = excluded.display_name,
    known_as = excluded.known_as,
    death_year = excluded.death_year,
    visibility = excluded.visibility,
    publish_state = excluded.publish_state,
    verification_state = excluded.verification_state,
    source_reference = excluded.source_reference;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('legacy-images', 'legacy-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('legacy-documents', 'legacy-documents', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png']),
  ('legacy-audio', 'legacy-audio', false, 104857600, array['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm']),
  ('legacy-video-clips', 'legacy-video-clips', false, 262144000, array['video/mp4', 'video/webm', 'video/quicktime']),
  ('tribute-uploads', 'tribute-uploads', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'video/mp4']),
  ('profile-images', 'profile-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads public image buckets" on storage.objects
  for select using (bucket_id in ('legacy-images', 'profile-images'));
create policy "authenticated users upload tribute files" on storage.objects
  for insert with check (bucket_id = 'tribute-uploads' and auth.uid() is not null);
create policy "members manage storage objects" on storage.objects
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
