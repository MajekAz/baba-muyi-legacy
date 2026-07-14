create extension if not exists "pgcrypto";

create type public.user_role as enum ('owner', 'editor', 'contributor');
create type public.publish_state as enum ('draft', 'scheduled', 'published', 'archived');
create type public.moderation_state as enum ('pending', 'approved', 'rejected', 'needs_review');
create type public.privacy_state as enum ('public', 'private', 'family_only');
create type public.media_kind as enum ('image', 'document', 'audio', 'video_clip', 'external_video');
create type public.verification_status as enum ('unverified', 'family_memory', 'partially_verified', 'verified');

create table public.legacy_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  known_as text,
  birth_date date,
  death_date date,
  summary text,
  hero_media_id uuid,
  seo_title text,
  seo_description text,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'contributor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.biography_chapters (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  body jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  publish_state public.publish_state not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  event_date date,
  date_label text,
  location text,
  category text,
  description text,
  stable_id text unique,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  publish_state public.publish_state not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_albums (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  privacy_state public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  album_id uuid references public.media_albums(id) on delete set null,
  kind public.media_kind not null,
  title text not null,
  caption text,
  alt_text text,
  stable_id text unique,
  approximate_date text,
  location text,
  people_shown text[] not null default array[]::text[],
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_owner text,
  copyright_status text,
  bucket text,
  storage_path text,
  external_provider text,
  external_id text,
  mime_type text,
  file_size_bytes bigint,
  uploaded_by uuid references public.user_profiles(id) on delete set null,
  owner_user_id uuid references public.user_profiles(id) on delete set null,
  moderation_state public.moderation_state not null default 'pending',
  privacy_state public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_has_storage_or_external check (
    (storage_path is not null and bucket is not null) or external_id is not null
  )
);

alter table public.legacy_profiles
  add constraint legacy_profiles_hero_media_fk
  foreign key (hero_media_id) references public.media_items(id) on delete set null;

create table public.documentaries (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  synopsis text,
  full_description text,
  author text,
  narrator text,
  language text,
  thumbnail_media_id uuid references public.media_items(id) on delete set null,
  subtitle_path text,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  provider text,
  playback_id text,
  poster_media_id uuid references public.media_items(id) on delete set null,
  publish_state public.publish_state not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table public.documentary_episodes (
  id uuid primary key default gen_random_uuid(),
  documentary_id uuid not null references public.documentaries(id) on delete cascade,
  title text not null,
  episode_number integer not null,
  provider text,
  playback_id text,
  transcript text,
  chapters jsonb not null default '[]'::jsonb,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (documentary_id, episode_number)
);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  full_name text not null,
  known_as text,
  life_dates text,
  stable_id text unique,
  is_living boolean not null default true,
  public_visibility boolean not null default false,
  notes text,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  profile_media_id uuid references public.media_items(id) on delete set null,
  privacy_state public.privacy_state not null default 'family_only',
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.family_relationships (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  from_member_id uuid not null references public.family_members(id) on delete cascade,
  to_member_id uuid not null references public.family_members(id) on delete cascade,
  relationship text not null,
  stable_id text unique,
  is_private boolean not null default true,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  created_at timestamptz not null default now(),
  unique (from_member_id, to_member_id, relationship)
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  body text not null,
  stable_id text unique,
  contributor_name text,
  contributor_email text,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  moderation_state public.moderation_state not null default 'pending',
  privacy_state public.privacy_state not null default 'private',
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  body text not null,
  stable_id text unique,
  introduction text,
  quotation text,
  yoruba_proverb text,
  english_interpretation text,
  author text,
  category_id uuid references public.categories(id) on delete set null,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  source_story_id uuid references public.stories(id) on delete set null,
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tributes (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  author_name text not null,
  author_email text,
  relationship text,
  message text not null,
  consent_to_publish boolean not null default false,
  moderation_state public.moderation_state not null default 'pending',
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  body jsonb not null default '{}'::jsonb,
  category_id uuid references public.categories(id) on delete set null,
  featured_media_id uuid references public.media_items(id) on delete set null,
  author text,
  source_reference text,
  verification_status public.verification_status not null default 'unverified',
  copyright_status text,
  social_preview jsonb not null default '{}'::jsonb,
  publish_state public.publish_state not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug)
);

create table public.blog_post_tags (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (blog_post_id, tag_id)
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, key)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.user_profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.waiting_list (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  interest text not null,
  note text,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
as $$
  select role from public.user_profiles where id = auth.uid()
$$;

create or replace function public.is_owner_or_editor()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('owner', 'editor'), false)
$$;

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'owner', false)
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_legacy_profiles before update on public.legacy_profiles for each row execute function public.touch_updated_at();
create trigger touch_user_profiles before update on public.user_profiles for each row execute function public.touch_updated_at();
create trigger touch_biography_chapters before update on public.biography_chapters for each row execute function public.touch_updated_at();
create trigger touch_timeline_events before update on public.timeline_events for each row execute function public.touch_updated_at();
create trigger touch_media_albums before update on public.media_albums for each row execute function public.touch_updated_at();
create trigger touch_media_items before update on public.media_items for each row execute function public.touch_updated_at();
create trigger touch_documentaries before update on public.documentaries for each row execute function public.touch_updated_at();
create trigger touch_documentary_episodes before update on public.documentary_episodes for each row execute function public.touch_updated_at();
create trigger touch_family_members before update on public.family_members for each row execute function public.touch_updated_at();
create trigger touch_stories before update on public.stories for each row execute function public.touch_updated_at();
create trigger touch_lessons before update on public.lessons for each row execute function public.touch_updated_at();
create trigger touch_tributes before update on public.tributes for each row execute function public.touch_updated_at();
create trigger touch_blog_posts before update on public.blog_posts for each row execute function public.touch_updated_at();

alter table public.legacy_profiles enable row level security;
alter table public.user_profiles enable row level security;
alter table public.biography_chapters enable row level security;
alter table public.timeline_events enable row level security;
alter table public.media_albums enable row level security;
alter table public.media_items enable row level security;
alter table public.documentaries enable row level security;
alter table public.documentary_episodes enable row level security;
alter table public.family_members enable row level security;
alter table public.family_relationships enable row level security;
alter table public.stories enable row level security;
alter table public.lessons enable row level security;
alter table public.tributes enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.waiting_list enable row level security;

create policy "published profiles are public" on public.legacy_profiles for select using (publish_state = 'published' or public.is_owner_or_editor());
create policy "owners and editors manage profiles" on public.legacy_profiles for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "users read own profile" on public.user_profiles for select using (id = auth.uid() or public.is_owner());
create policy "owners manage users" on public.user_profiles for all using (public.is_owner()) with check (public.is_owner());

create policy "published chapters are public" on public.biography_chapters for select using (publish_state = 'published' or public.is_owner_or_editor());
create policy "editors manage chapters" on public.biography_chapters for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published timeline is public" on public.timeline_events for select using (publish_state = 'published' or public.is_owner_or_editor());
create policy "editors manage timeline" on public.timeline_events for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "public published albums are public" on public.media_albums for select using ((privacy_state = 'public' and publish_state = 'published') or public.is_owner_or_editor());
create policy "editors manage albums" on public.media_albums for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "public published media is public" on public.media_items for select using ((privacy_state = 'public' and publish_state = 'published' and moderation_state = 'approved') or public.is_owner_or_editor() or owner_user_id = auth.uid());
create policy "contributors insert own media" on public.media_items for insert with check (auth.uid() is not null and uploaded_by = auth.uid());
create policy "editors manage media" on public.media_items for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published documentaries are public" on public.documentaries for select using (publish_state = 'published' or public.is_owner_or_editor());
create policy "editors manage documentaries" on public.documentaries for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published episodes are public" on public.documentary_episodes for select using (publish_state = 'published' or public.is_owner_or_editor());
create policy "editors manage episodes" on public.documentary_episodes for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published family members are public" on public.family_members for select using ((privacy_state = 'public' and publish_state = 'published') or public.is_owner_or_editor());
create policy "editors manage family members" on public.family_members for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published family relationships are public" on public.family_relationships for select using (public.is_owner_or_editor());
create policy "editors manage family relationships" on public.family_relationships for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published stories are public" on public.stories for select using ((privacy_state = 'public' and publish_state = 'published' and moderation_state = 'approved') or public.is_owner_or_editor());
create policy "public can submit stories" on public.stories for insert with check (moderation_state = 'pending' and publish_state = 'draft');
create policy "editors manage stories" on public.stories for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published lessons are public" on public.lessons for select using (publish_state = 'published' or public.is_owner_or_editor());
create policy "editors manage lessons" on public.lessons for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "approved tributes are public" on public.tributes for select using ((publish_state = 'published' and moderation_state = 'approved') or public.is_owner_or_editor());
create policy "public can submit tributes" on public.tributes for insert with check (moderation_state = 'pending' and publish_state = 'draft');
create policy "editors manage tributes" on public.tributes for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "categories public read" on public.categories for select using (true);
create policy "editors manage categories" on public.categories for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "tags public read" on public.tags for select using (true);
create policy "editors manage tags" on public.tags for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "published posts are public" on public.blog_posts for select using (publish_state = 'published' or public.is_owner_or_editor());
create policy "editors manage posts" on public.blog_posts for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());
create policy "blog tags public read" on public.blog_post_tags for select using (true);
create policy "editors manage blog tags" on public.blog_post_tags for all using (public.is_owner_or_editor()) with check (public.is_owner_or_editor());

create policy "settings public read" on public.site_settings for select using (true);
create policy "owners manage settings" on public.site_settings for all using (public.is_owner()) with check (public.is_owner());

create policy "owners read audit logs" on public.audit_logs for select using (public.is_owner());
create policy "system inserts audit logs" on public.audit_logs for insert with check (auth.uid() is not null);

create policy "public can join waiting list" on public.waiting_list for insert with check (true);
create policy "owners read waiting list" on public.waiting_list for select using (public.is_owner());

insert into public.legacy_profiles (
  slug,
  full_name,
  known_as,
  summary,
  seo_title,
  seo_description,
  publish_state
) values (
  'baba-muyi',
  'Alhaji Tioluwalase Majekodunmi',
  'Baba Muyi',
  'A living archive preserving family history, enterprise, transport heritage, public memories, documentary material, and the values of Alhaji Tioluwalase "Baba Muyi" Majekodunmi.',
  'Baba Muyi Legacy | Alhaji Tioluwalase Majekodunmi',
  'Preserving the life, work, transport history, family story, and lessons of Alhaji Tioluwalase "Baba Muyi" Majekodunmi.',
  'published'
) on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('legacy-images', 'legacy-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('legacy-documents', 'legacy-documents', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png']),
  ('legacy-audio', 'legacy-audio', false, 104857600, array['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm']),
  ('legacy-video-clips', 'legacy-video-clips', false, 262144000, array['video/mp4', 'video/webm', 'video/quicktime']),
  ('tribute-uploads', 'tribute-uploads', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'video/mp4']),
  ('profile-images', 'profile-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "public can read public image buckets"
on storage.objects for select
using (bucket_id in ('legacy-images', 'profile-images'));

create policy "authenticated users upload tribute files"
on storage.objects for insert
with check (bucket_id = 'tribute-uploads' and auth.uid() is not null);

create policy "owners and editors manage storage"
on storage.objects for all
using (public.is_owner_or_editor())
with check (public.is_owner_or_editor());
