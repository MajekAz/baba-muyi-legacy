create extension if not exists "pgcrypto";

do $$ begin
  create type public.workspace_status as enum ('active', 'suspended', 'archived');
exception when duplicate_object then null;
end $$;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.workspace_status not null default 'active',
  billing_customer_id text,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspaces_slug_not_empty check (length(trim(slug)) > 0)
);

create table if not exists public.workspace_roles (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  role public.user_role_key not null references public.user_roles(key) on delete cascade,
  label text not null,
  description text not null,
  created_at timestamptz not null default now(),
  primary key (workspace_id, role)
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role public.user_role_key not null references public.user_roles(key),
  status text not null default 'active',
  invited_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  invitee_email text not null,
  role public.user_role_key not null references public.user_roles(key),
  token_hash text not null unique,
  invited_by uuid references public.user_profiles(id) on delete set null,
  personal_message text,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  status public.invitation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, invitee_email, status)
);

alter table public.legacy_profiles add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.legacy_profiles add column if not exists status public.publish_state not null default 'draft';
alter table public.legacy_profiles add column if not exists display_order integer not null default 0;

create table if not exists public.legacy_profile_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role public.user_role_key not null references public.user_roles(key),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legacy_profile_id, user_id)
);

insert into public.workspaces (name, slug, status)
values ('Baba Muyi Family Archive', 'baba-muyi-family-archive', 'active')
on conflict (slug) do update
set name = excluded.name,
    status = excluded.status,
    updated_at = now();

update public.legacy_profiles lp
set workspace_id = w.id,
    full_name = 'Alhaji Tioluwalase “Baba Muyi” Majekodunmi',
    display_name = 'Baba Muyi',
    known_as = 'Baba Muyi',
    death_year = 2008,
    visibility = case when lp.visibility = 'public' then 'preview'::public.privacy_state else lp.visibility end,
    publish_state = 'draft',
    status = 'draft',
    verification_state = 'family_memory',
    source_reference = 'Approved foundation seed details supplied by project owner'
from public.workspaces w
where lp.slug = 'baba-muyi'
  and w.slug = 'baba-muyi-family-archive';

update public.legacy_profiles lp
set workspace_id = w.id
from public.workspaces w
where lp.workspace_id is null
  and w.slug = 'baba-muyi-family-archive';

insert into public.legacy_profiles (
  workspace_id,
  slug,
  legacy_type,
  full_name,
  display_name,
  known_as,
  death_year,
  visibility,
  publish_state,
  status,
  verification_state,
  source_reference
)
select
  w.id,
  'baba-muyi',
  'individual',
  'Alhaji Tioluwalase “Baba Muyi” Majekodunmi',
  'Baba Muyi',
  'Baba Muyi',
  2008,
  'preview',
  'draft',
  'draft',
  'family_memory',
  'Approved foundation seed details supplied by project owner'
from public.workspaces w
where w.slug = 'baba-muyi-family-archive'
  and not exists (select 1 from public.legacy_profiles lp where lp.slug = 'baba-muyi');

alter table public.legacy_profiles alter column workspace_id set not null;
alter table public.legacy_profiles drop constraint if exists legacy_profiles_slug_key;
create unique index if not exists idx_legacy_profiles_workspace_slug on public.legacy_profiles(workspace_id, slug);

insert into public.workspace_roles (workspace_id, role, label, description)
select w.id, ur.key, ur.label, ur.description
from public.workspaces w
cross join public.user_roles ur
where w.slug = 'baba-muyi-family-archive'
on conflict (workspace_id, role) do update
set label = excluded.label,
    description = excluded.description;

insert into public.legacy_profile_members (workspace_id, legacy_profile_id, user_id, role)
select lp.workspace_id, lm.legacy_profile_id, lm.user_id, lm.role
from public.legacy_members lm
join public.legacy_profiles lp on lp.id = lm.legacy_profile_id
on conflict (legacy_profile_id, user_id) do update
set role = excluded.role,
    workspace_id = excluded.workspace_id;

do $$ declare
  table_name text;
begin
  foreach table_name in array array[
    'categories', 'tags', 'media_albums', 'media_items', 'biography_chapters',
    'timeline_events', 'documentaries', 'family_members', 'family_relationships',
    'stories', 'lessons', 'tributes', 'blog_posts', 'content_tags', 'site_settings',
    'audit_logs', 'invitations', 'access_grants', 'menus', 'content_revisions'
  ]
  loop
    execute format('alter table public.%I add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade', table_name);
  end loop;
end $$;

update public.categories c set workspace_id = lp.workspace_id from public.legacy_profiles lp where c.legacy_profile_id = lp.id and c.workspace_id is null;
update public.tags t set workspace_id = lp.workspace_id from public.legacy_profiles lp where t.legacy_profile_id = lp.id and t.workspace_id is null;
update public.media_albums a set workspace_id = lp.workspace_id from public.legacy_profiles lp where a.legacy_profile_id = lp.id and a.workspace_id is null;
update public.media_items m set workspace_id = lp.workspace_id from public.legacy_profiles lp where m.legacy_profile_id = lp.id and m.workspace_id is null;
update public.biography_chapters b set workspace_id = lp.workspace_id from public.legacy_profiles lp where b.legacy_profile_id = lp.id and b.workspace_id is null;
update public.timeline_events t set workspace_id = lp.workspace_id from public.legacy_profiles lp where t.legacy_profile_id = lp.id and t.workspace_id is null;
update public.documentaries d set workspace_id = lp.workspace_id from public.legacy_profiles lp where d.legacy_profile_id = lp.id and d.workspace_id is null;
update public.family_members f set workspace_id = lp.workspace_id from public.legacy_profiles lp where f.legacy_profile_id = lp.id and f.workspace_id is null;
update public.family_relationships r set workspace_id = lp.workspace_id from public.legacy_profiles lp where r.legacy_profile_id = lp.id and r.workspace_id is null;
update public.stories s set workspace_id = lp.workspace_id from public.legacy_profiles lp where s.legacy_profile_id = lp.id and s.workspace_id is null;
update public.lessons l set workspace_id = lp.workspace_id from public.legacy_profiles lp where l.legacy_profile_id = lp.id and l.workspace_id is null;
update public.tributes t set workspace_id = lp.workspace_id from public.legacy_profiles lp where t.legacy_profile_id = lp.id and t.workspace_id is null;
update public.blog_posts b set workspace_id = lp.workspace_id from public.legacy_profiles lp where b.legacy_profile_id = lp.id and b.workspace_id is null;
update public.content_tags ct set workspace_id = lp.workspace_id from public.legacy_profiles lp where ct.legacy_profile_id = lp.id and ct.workspace_id is null;
update public.site_settings s set workspace_id = lp.workspace_id from public.legacy_profiles lp where s.legacy_profile_id = lp.id and s.workspace_id is null;
update public.audit_logs a set workspace_id = lp.workspace_id from public.legacy_profiles lp where a.legacy_profile_id = lp.id and a.workspace_id is null;
update public.invitations i set workspace_id = lp.workspace_id from public.legacy_profiles lp where i.legacy_profile_id = lp.id and i.workspace_id is null;
update public.access_grants g set workspace_id = lp.workspace_id from public.legacy_profiles lp where g.legacy_profile_id = lp.id and g.workspace_id is null;
update public.menus m set workspace_id = lp.workspace_id from public.legacy_profiles lp where m.legacy_profile_id = lp.id and m.workspace_id is null;
update public.content_revisions r set workspace_id = lp.workspace_id from public.legacy_profiles lp where r.legacy_profile_id = lp.id and r.workspace_id is null;

alter table public.documentary_episodes add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.documentary_episodes add column if not exists legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade;
update public.documentary_episodes e
set workspace_id = d.workspace_id,
    legacy_profile_id = d.legacy_profile_id
from public.documentaries d
where e.documentary_id = d.id
  and (e.workspace_id is null or e.legacy_profile_id is null);

alter table public.documentary_chapters add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.documentary_chapters add column if not exists legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade;
update public.documentary_chapters c
set workspace_id = d.workspace_id,
    legacy_profile_id = d.legacy_profile_id
from public.documentaries d
where c.documentary_id = d.id
  and (c.workspace_id is null or c.legacy_profile_id is null);
update public.documentary_chapters c
set workspace_id = e.workspace_id,
    legacy_profile_id = e.legacy_profile_id
from public.documentary_episodes e
where c.episode_id = e.id
  and (c.workspace_id is null or c.legacy_profile_id is null);

alter table public.documentary_subtitles add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.documentary_subtitles add column if not exists legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade;
update public.documentary_subtitles s
set workspace_id = d.workspace_id,
    legacy_profile_id = d.legacy_profile_id
from public.documentaries d
where s.documentary_id = d.id
  and (s.workspace_id is null or s.legacy_profile_id is null);
update public.documentary_subtitles s
set workspace_id = e.workspace_id,
    legacy_profile_id = e.legacy_profile_id
from public.documentary_episodes e
where s.episode_id = e.id
  and (s.workspace_id is null or s.legacy_profile_id is null);

alter table public.documentary_transcripts add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.documentary_transcripts add column if not exists legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade;
update public.documentary_transcripts t
set workspace_id = d.workspace_id,
    legacy_profile_id = d.legacy_profile_id
from public.documentaries d
where t.documentary_id = d.id
  and (t.workspace_id is null or t.legacy_profile_id is null);
update public.documentary_transcripts t
set workspace_id = e.workspace_id,
    legacy_profile_id = e.legacy_profile_id
from public.documentary_episodes e
where t.episode_id = e.id
  and (t.workspace_id is null or t.legacy_profile_id is null);

alter table public.media_album_items add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.media_album_items add column if not exists legacy_profile_id uuid references public.legacy_profiles(id) on delete cascade;
update public.media_album_items mai
set workspace_id = a.workspace_id,
    legacy_profile_id = a.legacy_profile_id
from public.media_albums a
where mai.album_id = a.id
  and (mai.workspace_id is null or mai.legacy_profile_id is null);

alter table public.user_permissions add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
update public.user_permissions up set workspace_id = lp.workspace_id from public.legacy_profiles lp where up.legacy_profile_id = lp.id and up.workspace_id is null;

create index if not exists idx_workspace_members_user on public.workspace_members(user_id, workspace_id);
create index if not exists idx_workspace_invitations_status on public.workspace_invitations(workspace_id, status);
create index if not exists idx_legacy_profiles_workspace on public.legacy_profiles(workspace_id, display_order);
create index if not exists idx_legacy_profile_members_user on public.legacy_profile_members(user_id, legacy_profile_id);
create index if not exists idx_biography_workspace_profile_order on public.biography_chapters(workspace_id, legacy_profile_id, sort_order);
create index if not exists idx_timeline_workspace_profile_order on public.timeline_events(workspace_id, legacy_profile_id, sort_order);
create index if not exists idx_media_workspace_profile_album on public.media_items(workspace_id, legacy_profile_id, album_id);
create index if not exists idx_documentaries_workspace_profile on public.documentaries(workspace_id, legacy_profile_id);
create index if not exists idx_blog_workspace_profile_published on public.blog_posts(workspace_id, legacy_profile_id, publish_state, published_at);
create index if not exists idx_menus_workspace_profile_location on public.menus(workspace_id, legacy_profile_id, location, publish_state);

create or replace function public.current_user_role_for_workspace(workspace_uuid uuid)
returns public.user_role_key
language sql
security definer
set search_path = public
as $$
  select wm.role
  from public.workspace_members wm
  where wm.workspace_id = workspace_uuid
    and wm.user_id = auth.uid()
    and wm.status = 'active'
  limit 1
$$;

create or replace function public.is_workspace_member(workspace_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_workspace(workspace_uuid) is not null, false)
$$;

create or replace function public.can_manage_workspace(workspace_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_workspace(workspace_uuid) in ('owner', 'administrator'), false)
$$;

create or replace function public.current_user_role_for_profile(profile_id uuid)
returns public.user_role_key
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      select lpm.role
      from public.legacy_profile_members lpm
      where lpm.legacy_profile_id = profile_id
        and lpm.user_id = auth.uid()
      limit 1
    ),
    (
      select wm.role
      from public.legacy_profiles lp
      join public.workspace_members wm on wm.workspace_id = lp.workspace_id
      where lp.id = profile_id
        and wm.user_id = auth.uid()
        and wm.status = 'active'
      limit 1
    )
  )
$$;

create or replace function public.can_read_private_profile(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_profile(profile_id) in ('owner', 'administrator', 'editor', 'contributor', 'reviewer', 'viewer'), false)
$$;

create or replace function public.can_manage_profile_content(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_profile(profile_id) in ('owner', 'administrator', 'editor'), false)
$$;

create or replace function public.can_manage_profile_security(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role_for_profile(profile_id) in ('owner', 'administrator'), false)
$$;

create or replace function public.user_has_workspace_permission(workspace_uuid uuid, permission_key public.permission_key)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.workspace_members wm
      join public.role_permissions rp on rp.role = wm.role
      where wm.workspace_id = workspace_uuid
        and wm.user_id = auth.uid()
        and wm.status = 'active'
        and rp.permission = permission_key
    )
    or exists (
      select 1
      from public.user_permissions up
      where up.workspace_id = workspace_uuid
        and up.user_id = auth.uid()
        and up.permission = permission_key
        and up.revoked_at is null
        and (up.expires_at is null or up.expires_at > now())
    ),
    false
  )
$$;

create or replace function public.user_has_permission(profile_id uuid, permission_key public.permission_key)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.legacy_profile_members lpm
      join public.role_permissions rp on rp.role = lpm.role
      where lpm.legacy_profile_id = profile_id
        and lpm.user_id = auth.uid()
        and rp.permission = permission_key
    )
    or exists (
      select 1
      from public.legacy_profiles lp
      join public.workspace_members wm on wm.workspace_id = lp.workspace_id
      join public.role_permissions rp on rp.role = wm.role
      where lp.id = profile_id
        and wm.user_id = auth.uid()
        and wm.status = 'active'
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

alter table public.workspaces enable row level security;
alter table public.workspace_roles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.legacy_profile_members enable row level security;

drop policy if exists "workspace members read workspaces" on public.workspaces;
create policy "workspace members read workspaces" on public.workspaces
  for select using (public.is_workspace_member(id));
drop policy if exists "workspace owners manage workspaces" on public.workspaces;
create policy "workspace owners manage workspaces" on public.workspaces
  for all using (public.can_manage_workspace(id)) with check (public.can_manage_workspace(id));

drop policy if exists "workspace members read roles" on public.workspace_roles;
create policy "workspace members read roles" on public.workspace_roles
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "workspace owners manage roles" on public.workspace_roles;
create policy "workspace owners manage roles" on public.workspace_roles
  for all using (public.can_manage_workspace(workspace_id)) with check (public.can_manage_workspace(workspace_id));

drop policy if exists "members read workspace memberships" on public.workspace_members;
create policy "members read workspace memberships" on public.workspace_members
  for select using (user_id = auth.uid() or public.can_manage_workspace(workspace_id));
drop policy if exists "owners manage workspace memberships" on public.workspace_members;
create policy "owners manage workspace memberships" on public.workspace_members
  for all using (public.can_manage_workspace(workspace_id)) with check (public.can_manage_workspace(workspace_id));

drop policy if exists "owners manage workspace invitations" on public.workspace_invitations;
create policy "owners manage workspace invitations" on public.workspace_invitations
  for all using (public.user_has_workspace_permission(workspace_id, 'manage_users'))
  with check (public.user_has_workspace_permission(workspace_id, 'manage_users'));

drop policy if exists "members read legacy profile memberships" on public.legacy_profile_members;
create policy "members read legacy profile memberships" on public.legacy_profile_members
  for select using (user_id = auth.uid() or public.can_manage_profile_security(legacy_profile_id));
drop policy if exists "owners manage legacy profile memberships" on public.legacy_profile_members;
create policy "owners manage legacy profile memberships" on public.legacy_profile_members
  for all using (public.can_manage_profile_security(legacy_profile_id))
  with check (public.can_manage_profile_security(legacy_profile_id));

drop policy if exists "public reads published visible profiles" on public.legacy_profiles;
create policy "public reads published visible profiles" on public.legacy_profiles
  for select using (publish_state = 'published' and visibility = 'public');
drop policy if exists "members read their legacy profiles" on public.legacy_profiles;
create policy "members read their legacy profiles" on public.legacy_profiles
  for select using (public.is_workspace_member(workspace_id) or public.can_read_private_profile(id));
drop policy if exists "owners manage legacy profiles" on public.legacy_profiles;
create policy "owners manage legacy profiles" on public.legacy_profiles
  for all using (public.user_has_workspace_permission(workspace_id, 'manage_legacy_profiles') or public.can_manage_profile_security(id))
  with check (public.user_has_workspace_permission(workspace_id, 'manage_legacy_profiles') or public.can_manage_profile_security(id));

drop policy if exists "public reads non-private family relationships" on public.family_relationships;
create policy "public reads non-private family relationships" on public.family_relationships
  for select using (
    is_private = false
    and exists (
      select 1 from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.publish_state = 'published'
        and lp.visibility = 'public'
    )
  );

drop policy if exists "public reads documentary chapters" on public.documentary_chapters;
create policy "public reads documentary chapters" on public.documentary_chapters
  for select using (
    exists (
      select 1 from public.documentaries d
      where d.id = documentary_id
        and d.publish_state = 'published'
        and d.privacy_state = 'public'
    )
    or exists (
      select 1 from public.documentary_episodes e
      where e.id = episode_id
        and e.publish_state = 'published'
        and e.privacy_state = 'public'
    )
  );
drop policy if exists "documentary managers manage chapters" on public.documentary_chapters;
create policy "documentary managers manage chapters" on public.documentary_chapters
  for all using (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'access_documentaries'))
  with check (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'access_documentaries'));

drop policy if exists "documentary managers manage subtitles" on public.documentary_subtitles;
create policy "documentary managers manage subtitles" on public.documentary_subtitles
  for all using (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'access_documentaries'))
  with check (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'access_documentaries'));

drop policy if exists "documentary managers manage transcripts" on public.documentary_transcripts;
create policy "documentary managers manage transcripts" on public.documentary_transcripts
  for all using (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'access_documentaries'))
  with check (legacy_profile_id is not null and public.user_has_permission(legacy_profile_id, 'access_documentaries'));

do $$ declare
  table_name text;
begin
  foreach table_name in array array[
    'workspaces', 'workspace_members', 'workspace_invitations', 'legacy_profile_members',
    'legacy_profiles', 'media_albums', 'media_items', 'biography_chapters',
    'timeline_events', 'documentaries', 'documentary_episodes', 'family_members',
    'stories', 'lessons', 'tributes', 'blog_posts', 'menus', 'menu_items',
    'site_settings', 'content_revisions'
  ]
  loop
    execute format('drop trigger if exists touch_%I on public.%I', table_name, table_name);
    execute format('create trigger touch_%I before update on public.%I for each row execute function public.touch_updated_at()', table_name, table_name);
  end loop;
end $$;

with profile as (
  select lp.id as legacy_profile_id, lp.workspace_id
  from public.legacy_profiles lp
  where lp.slug = 'baba-muyi'
), header_menu as (
  insert into public.menus (workspace_id, legacy_profile_id, name, slug, location, publish_state)
  select workspace_id, legacy_profile_id, 'Main Header Navigation', 'main-header', 'header', 'draft' from profile
  on conflict (legacy_profile_id, slug, location) do update
  set name = excluded.name,
      workspace_id = excluded.workspace_id
  returning id
), mobile_menu as (
  insert into public.menus (workspace_id, legacy_profile_id, name, slug, location, publish_state)
  select workspace_id, legacy_profile_id, 'Mobile Navigation', 'mobile', 'mobile', 'draft' from profile
  on conflict (legacy_profile_id, slug, location) do update
  set name = excluded.name,
      workspace_id = excluded.workspace_id
  returning id
), footer_menu as (
  insert into public.menus (workspace_id, legacy_profile_id, name, slug, location, publish_state)
  select workspace_id, legacy_profile_id, 'Footer Navigation', 'footer', 'footer', 'draft' from profile
  on conflict (legacy_profile_id, slug, location) do update
  set name = excluded.name,
      workspace_id = excluded.workspace_id
  returning id
), all_menus as (
  select id from header_menu
  union all select id from mobile_menu
  union all select id from footer_menu
)
insert into public.menu_items (menu_id, label, slug, url, link_type, sort_order, publish_state)
select all_menus.id, item.label, item.slug, item.url, 'internal', item.sort_order, 'draft'
from all_menus,
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
