do $$ begin
  alter type public.user_role_key add value if not exists 'administrator';
  alter type public.user_role_key add value if not exists 'reviewer';
  alter type public.user_role_key add value if not exists 'viewer';
end $$;

do $$ begin
  alter type public.privacy_state add value if not exists 'registered';
  alter type public.privacy_state add value if not exists 'invited';
  alter type public.privacy_state add value if not exists 'specific_users';
  alter type public.privacy_state add value if not exists 'password_protected';
end $$;

do $$ begin
  create type public.invitation_status as enum ('pending', 'accepted', 'expired', 'revoked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.permission_key as enum (
    'manage_all_content',
    'manage_users',
    'manage_legacy_profiles',
    'upload_media',
    'delete_media',
    'publish_content',
    'manage_menus',
    'change_site_settings',
    'assign_roles',
    'view_audit_logs',
    'manage_privacy',
    'manage_supabase_settings',
    'review_submissions',
    'edit_assigned_content',
    'grant_private_viewing',
    'access_media_library',
    'access_documentaries'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.menu_location as enum ('header', 'mobile', 'footer', 'secondary', 'documentary', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.link_type as enum ('internal', 'external', 'documentary', 'biography_section', 'timeline_section', 'album', 'document_download');
exception when duplicate_object then null;
end $$;

insert into public.user_roles (key, label, description, can_manage_security, can_publish)
values
  ('administrator', 'Administrator', 'Manages most content, media, documentaries, menus, review queues, and invitations without removing owner control.', false, true),
  ('reviewer', 'Reviewer', 'Reviews submissions, adds notes, and approves or rejects items without publishing unless separately granted.', false, false),
  ('viewer', 'Viewer', 'Can view explicitly granted private or restricted content without edit/upload rights.', false, false)
on conflict (key) do update
set label = excluded.label,
    description = excluded.description,
    can_manage_security = excluded.can_manage_security,
    can_publish = excluded.can_publish;

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role public.user_role_key not null references public.user_roles(key) on delete cascade,
  permission public.permission_key not null,
  created_at timestamptz not null default now(),
  unique (role, permission)
);

create table if not exists public.user_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  permission public.permission_key not null,
  granted_by uuid references public.user_profiles(id) on delete set null,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, legacy_profile_id, permission)
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  invitee_email text not null,
  role public.user_role_key not null references public.user_roles(key),
  permissions public.permission_key[] not null default array[]::public.permission_key[],
  personal_message text,
  token_hash text not null unique,
  invited_by uuid references public.user_profiles(id) on delete set null,
  sent_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  status public.invitation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, invitee_email, status)
);

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  grantee_user_id uuid references public.user_profiles(id) on delete cascade,
  grantee_role public.user_role_key references public.user_roles(key),
  content_table text,
  content_id uuid,
  album_id uuid references public.media_albums(id) on delete cascade,
  documentary_id uuid references public.documentaries(id) on delete cascade,
  private_collection text,
  can_view boolean not null default true,
  can_upload boolean not null default false,
  can_edit boolean not null default false,
  can_review boolean not null default false,
  can_publish boolean not null default false,
  can_access_media_library boolean not null default false,
  can_access_documentaries boolean not null default false,
  granted_by uuid references public.user_profiles(id) on delete set null,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint access_grants_has_subject check (grantee_user_id is not null or grantee_role is not null)
);

create table if not exists public.media_album_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.media_albums(id) on delete cascade,
  media_item_id uuid not null references public.media_items(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (album_id, media_item_id)
);

alter table public.media_items
  add column if not exists original_filename text,
  add column if not exists generated_filename text,
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists duration_seconds numeric,
  add column if not exists description text,
  add column if not exists related_content_table text,
  add column if not exists related_content_id uuid,
  add column if not exists replaced_by_media_id uuid references public.media_items(id) on delete set null;

alter table public.documentaries
  add column if not exists duration_seconds numeric,
  add column if not exists release_date date,
  add column if not exists director text,
  add column if not exists writer text,
  add column if not exists producer text,
  add column if not exists trailer_media_id uuid references public.media_items(id) on delete set null,
  add column if not exists social_image_media_id uuid references public.media_items(id) on delete set null;

create table if not exists public.documentary_chapters (
  id uuid primary key default gen_random_uuid(),
  documentary_id uuid references public.documentaries(id) on delete cascade,
  episode_id uuid references public.documentary_episodes(id) on delete cascade,
  title text not null,
  start_seconds numeric not null,
  end_seconds numeric,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint documentary_chapters_parent check (documentary_id is not null or episode_id is not null)
);

create table if not exists public.documentary_subtitles (
  id uuid primary key default gen_random_uuid(),
  documentary_id uuid references public.documentaries(id) on delete cascade,
  episode_id uuid references public.documentary_episodes(id) on delete cascade,
  language text not null,
  label text not null,
  media_item_id uuid references public.media_items(id) on delete set null,
  storage_path text,
  created_at timestamptz not null default now(),
  constraint documentary_subtitles_parent check (documentary_id is not null or episode_id is not null)
);

create table if not exists public.documentary_transcripts (
  id uuid primary key default gen_random_uuid(),
  documentary_id uuid references public.documentaries(id) on delete cascade,
  episode_id uuid references public.documentary_episodes(id) on delete cascade,
  language text not null,
  transcript text not null,
  media_item_id uuid references public.media_items(id) on delete set null,
  verification_state public.verification_state not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documentary_transcripts_parent check (documentary_id is not null or episode_id is not null)
);

create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  location public.menu_location not null,
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, slug, location)
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  parent_item_id uuid references public.menu_items(id) on delete cascade,
  label text not null,
  slug text not null,
  url text,
  link_type public.link_type not null default 'internal',
  sort_order integer not null default 0,
  visibility public.privacy_state not null default 'public',
  required_role public.user_role_key references public.user_roles(key),
  publish_state public.publish_state not null default 'draft',
  scheduled_at timestamptz,
  open_in_new_tab boolean not null default false,
  icon text,
  badge text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (menu_id, parent_item_id, slug)
);

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  content_table text not null,
  content_id uuid not null,
  revision_number integer not null,
  snapshot jsonb not null,
  edited_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (content_table, content_id, revision_number)
);

create index if not exists idx_invitations_profile_status on public.invitations(legacy_profile_id, status);
create index if not exists idx_access_grants_user on public.access_grants(grantee_user_id, legacy_profile_id);
create index if not exists idx_media_album_items_album on public.media_album_items(album_id, sort_order);
create index if not exists idx_menu_items_menu_order on public.menu_items(menu_id, parent_item_id, sort_order);
create index if not exists idx_content_revisions_content on public.content_revisions(content_table, content_id, revision_number desc);

alter table public.role_permissions enable row level security;
alter table public.user_permissions enable row level security;
alter table public.invitations enable row level security;
alter table public.access_grants enable row level security;
alter table public.media_album_items enable row level security;
alter table public.documentary_chapters enable row level security;
alter table public.documentary_subtitles enable row level security;
alter table public.documentary_transcripts enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.content_revisions enable row level security;

create or replace function public.user_has_permission(profile_id uuid, permission_key public.permission_key)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.legacy_members lm
      join public.role_permissions rp on rp.role = lm.role
      where lm.legacy_profile_id = profile_id
        and lm.user_id = auth.uid()
        and rp.permission = permission_key
    )
    or exists (
      select 1
      from public.user_permissions up
      where up.legacy_profile_id = profile_id
        and up.user_id = auth.uid()
        and up.permission = permission_key
        and up.revoked_at is null
        and (up.expires_at is null or up.expires_at > now())
    ),
    false
  )
$$;

insert into public.role_permissions (role, permission)
values
  ('owner', 'manage_all_content'), ('owner', 'manage_users'), ('owner', 'manage_legacy_profiles'),
  ('owner', 'upload_media'), ('owner', 'delete_media'), ('owner', 'publish_content'),
  ('owner', 'manage_menus'), ('owner', 'change_site_settings'), ('owner', 'assign_roles'),
  ('owner', 'view_audit_logs'), ('owner', 'manage_privacy'), ('owner', 'manage_supabase_settings'),
  ('owner', 'review_submissions'), ('owner', 'access_media_library'), ('owner', 'access_documentaries'),
  ('administrator', 'manage_all_content'), ('administrator', 'manage_users'), ('administrator', 'upload_media'),
  ('administrator', 'delete_media'), ('administrator', 'publish_content'), ('administrator', 'manage_menus'),
  ('administrator', 'review_submissions'), ('administrator', 'access_media_library'), ('administrator', 'access_documentaries'),
  ('editor', 'edit_assigned_content'), ('editor', 'upload_media'), ('editor', 'access_media_library'), ('editor', 'access_documentaries'),
  ('contributor', 'upload_media'),
  ('reviewer', 'review_submissions'),
  ('viewer', 'grant_private_viewing')
on conflict (role, permission) do nothing;

create policy "owners read role permissions" on public.role_permissions
  for select using (true);
create policy "owners manage role permissions" on public.role_permissions
  for all using (exists (select 1 from public.legacy_members lm where lm.user_id = auth.uid() and lm.role = 'owner'))
  with check (exists (select 1 from public.legacy_members lm where lm.user_id = auth.uid() and lm.role = 'owner'));

create policy "owners manage user permissions" on public.user_permissions
  for all using (public.can_manage_profile_security(legacy_profile_id))
  with check (public.can_manage_profile_security(legacy_profile_id));
create policy "users read own permissions" on public.user_permissions
  for select using (user_id = auth.uid());

create policy "managers manage invitations" on public.invitations
  for all using (public.user_has_permission(legacy_profile_id, 'manage_users'))
  with check (public.user_has_permission(legacy_profile_id, 'manage_users'));

create policy "managers manage access grants" on public.access_grants
  for all using (public.user_has_permission(legacy_profile_id, 'manage_privacy'))
  with check (public.user_has_permission(legacy_profile_id, 'manage_privacy'));
create policy "users read own access grants" on public.access_grants
  for select using (grantee_user_id = auth.uid() and revoked_at is null and (expires_at is null or expires_at > now()));

create policy "public reads published menus" on public.menus
  for select using (publish_state = 'published');
create policy "editors manage menus" on public.menus
  for all using (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'manage_menus'))
  with check (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'manage_menus'));

create policy "public reads published menu items" on public.menu_items
  for select using (
    publish_state = 'published'
    and visibility = 'public'
    and exists (select 1 from public.menus m where m.id = menu_id and m.publish_state = 'published')
  );
create policy "editors manage menu items" on public.menu_items
  for all using (
    exists (select 1 from public.menus m where m.id = menu_id and m.legacy_profile_id is not null and public.user_has_permission(m.legacy_profile_id, 'manage_menus'))
  ) with check (
    exists (select 1 from public.menus m where m.id = menu_id and m.legacy_profile_id is not null and public.user_has_permission(m.legacy_profile_id, 'manage_menus'))
  );

create policy "editors manage album items" on public.media_album_items
  for all using (
    exists (select 1 from public.media_albums a where a.id = album_id and public.user_has_permission(a.legacy_profile_id, 'access_media_library'))
  ) with check (
    exists (select 1 from public.media_albums a where a.id = album_id and public.user_has_permission(a.legacy_profile_id, 'access_media_library'))
  );

create policy "public reads documentary chapters" on public.documentary_chapters
  for select using (true);
create policy "documentary managers manage chapters" on public.documentary_chapters
  for all using (true) with check (true);

create policy "documentary managers manage subtitles" on public.documentary_subtitles
  for all using (true) with check (true);
create policy "documentary managers manage transcripts" on public.documentary_transcripts
  for all using (true) with check (true);

create policy "editors manage content revisions" on public.content_revisions
  for all using (public.can_manage_profile_content(legacy_profile_id))
  with check (public.can_manage_profile_content(legacy_profile_id));
create policy "owners read content revisions" on public.content_revisions
  for select using (public.can_read_private_profile(legacy_profile_id));

-- Initial reusable menu seeds for the Baba Muyi draft profile.
with profile as (
  select id from public.legacy_profiles where slug = 'baba-muyi'
), header_menu as (
  insert into public.menus (legacy_profile_id, name, slug, location, publish_state)
  select id, 'Main Header Navigation', 'main-header', 'header', 'draft' from profile
  on conflict (legacy_profile_id, slug, location) do update set name = excluded.name
  returning id
)
insert into public.menu_items (menu_id, label, slug, url, link_type, sort_order, publish_state)
select header_menu.id, item.label, item.slug, item.url, 'internal', item.sort_order, 'draft'
from header_menu,
(values
  ('Home', 'home', '/', 10),
  ('His Life', 'his-life', '/biography', 20),
  ('Transport Legacy', 'transport-legacy', '/bolekaja', 30),
  ('Documentaries', 'documentaries', '/documentaries', 40),
  ('Gallery', 'gallery', '/gallery', 50),
  ('Family Legacy', 'family-legacy', '/family-tree', 60),
  ('Lessons', 'lessons', '/lessons', 70),
  ('Archive', 'archive', '/archive', 80),
  ('Blog', 'blog', '/blog', 90),
  ('Share a Memory', 'share-a-memory', '/tributes', 100),
  ('About', 'about', '/curator', 110),
  ('Contact', 'contact', '/contact', 120)
) as item(label, slug, url, sort_order)
on conflict (menu_id, parent_item_id, slug) do update
set label = excluded.label,
    url = excluded.url,
    sort_order = excluded.sort_order;
