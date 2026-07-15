alter table public.biography_chapters
  add column if not exists created_by uuid references public.user_profiles(id) on delete set null,
  add column if not exists author_id uuid references public.user_profiles(id) on delete set null,
  add column if not exists last_editor_id uuid references public.user_profiles(id) on delete set null;

alter table public.timeline_events
  add column if not exists created_by uuid references public.user_profiles(id) on delete set null,
  add column if not exists author_id uuid references public.user_profiles(id) on delete set null,
  add column if not exists last_editor_id uuid references public.user_profiles(id) on delete set null;

alter table public.stories
  add column if not exists created_by uuid references public.user_profiles(id) on delete set null,
  add column if not exists author_id uuid references public.user_profiles(id) on delete set null,
  add column if not exists last_editor_id uuid references public.user_profiles(id) on delete set null;

alter table public.lessons
  add column if not exists created_by uuid references public.user_profiles(id) on delete set null,
  add column if not exists author_id uuid references public.user_profiles(id) on delete set null,
  add column if not exists last_editor_id uuid references public.user_profiles(id) on delete set null;

alter table public.blog_posts
  add column if not exists created_by uuid references public.user_profiles(id) on delete set null,
  add column if not exists author_id uuid references public.user_profiles(id) on delete set null,
  add column if not exists last_editor_id uuid references public.user_profiles(id) on delete set null;

create index if not exists idx_biography_authoring on public.biography_chapters(legacy_profile_id, created_by, last_editor_id);
create index if not exists idx_timeline_authoring on public.timeline_events(legacy_profile_id, created_by, last_editor_id);
create index if not exists idx_stories_authoring on public.stories(legacy_profile_id, created_by, last_editor_id);
create index if not exists idx_lessons_authoring on public.lessons(legacy_profile_id, created_by, last_editor_id);
create index if not exists idx_blog_authoring on public.blog_posts(legacy_profile_id, created_by, last_editor_id);

create or replace function public.can_create_cms_content(profile_id uuid, new_state public.publish_state, creator_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      new_state in ('published', 'archived') and public.user_has_permission(profile_id, 'publish_content')
    )
    or (
      new_state not in ('published', 'archived')
      and public.user_has_permission(profile_id, 'edit_assigned_content')
      and (
        public.current_user_role_for_profile(profile_id) in ('owner', 'administrator', 'editor')
        or creator_id = auth.uid()
      )
    ),
    false
  )
$$;

create or replace function public.can_update_cms_content(profile_id uuid, new_state public.publish_state, creator_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      new_state in ('published', 'archived') and public.user_has_permission(profile_id, 'publish_content')
    )
    or (
      new_state not in ('published', 'archived')
      and (
        public.current_user_role_for_profile(profile_id) in ('owner', 'administrator', 'editor')
        or (
          public.current_user_role_for_profile(profile_id) = 'contributor'
          and creator_id = auth.uid()
        )
        or public.user_has_permission(profile_id, 'review_submissions')
      )
    ),
    false
  )
$$;

create or replace function public.can_read_cms_content(
  profile_id uuid,
  content_table_name text,
  content_uuid uuid,
  current_state public.publish_state,
  current_privacy public.privacy_state
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      current_state = 'published'
      and current_privacy = 'public'
    )
    or public.current_user_role_for_profile(profile_id) in ('owner', 'administrator', 'editor', 'contributor', 'reviewer')
    or exists (
      select 1
      from public.access_grants ag
      where ag.legacy_profile_id = profile_id
        and ag.grantee_user_id = auth.uid()
        and ag.can_view = true
        and ag.revoked_at is null
        and (ag.expires_at is null or ag.expires_at > now())
        and (
          (ag.content_table = content_table_name and ag.content_id = content_uuid)
          or ag.private_collection = content_table_name
        )
    ),
    false
  )
$$;

drop policy if exists "editors manage chapters" on public.biography_chapters;
drop policy if exists "editors manage timeline" on public.timeline_events;
drop policy if exists "editors manage stories" on public.stories;
drop policy if exists "editors manage lessons" on public.lessons;
drop policy if exists "editors manage posts" on public.blog_posts;

drop policy if exists "members read chapters" on public.biography_chapters;
create policy "members read chapters" on public.biography_chapters
  for select using (public.can_read_cms_content(legacy_profile_id, 'biography_chapters', id, publish_state, privacy_state));
drop policy if exists "permitted insert chapters" on public.biography_chapters;
create policy "permitted insert chapters" on public.biography_chapters
  for insert with check (public.can_create_cms_content(legacy_profile_id, publish_state, created_by));
drop policy if exists "permitted update chapters" on public.biography_chapters;
create policy "permitted update chapters" on public.biography_chapters
  for update using (public.can_update_cms_content(legacy_profile_id, publish_state, created_by))
  with check (public.can_update_cms_content(legacy_profile_id, publish_state, created_by));

drop policy if exists "members read timeline" on public.timeline_events;
create policy "members read timeline" on public.timeline_events
  for select using (public.can_read_cms_content(legacy_profile_id, 'timeline_events', id, publish_state, privacy_state));
drop policy if exists "permitted insert timeline" on public.timeline_events;
create policy "permitted insert timeline" on public.timeline_events
  for insert with check (public.can_create_cms_content(legacy_profile_id, publish_state, created_by));
drop policy if exists "permitted update timeline" on public.timeline_events;
create policy "permitted update timeline" on public.timeline_events
  for update using (public.can_update_cms_content(legacy_profile_id, publish_state, created_by))
  with check (public.can_update_cms_content(legacy_profile_id, publish_state, created_by));

drop policy if exists "members read stories" on public.stories;
create policy "members read stories" on public.stories
  for select using (public.can_read_cms_content(legacy_profile_id, 'stories', id, publish_state, privacy_state));
drop policy if exists "permitted insert stories" on public.stories;
create policy "permitted insert stories" on public.stories
  for insert with check (public.can_create_cms_content(legacy_profile_id, publish_state, created_by));
drop policy if exists "permitted update stories" on public.stories;
create policy "permitted update stories" on public.stories
  for update using (public.can_update_cms_content(legacy_profile_id, publish_state, created_by))
  with check (public.can_update_cms_content(legacy_profile_id, publish_state, created_by));

drop policy if exists "members read lessons" on public.lessons;
create policy "members read lessons" on public.lessons
  for select using (public.can_read_cms_content(legacy_profile_id, 'lessons', id, publish_state, privacy_state));
drop policy if exists "permitted insert lessons" on public.lessons;
create policy "permitted insert lessons" on public.lessons
  for insert with check (public.can_create_cms_content(legacy_profile_id, publish_state, created_by));
drop policy if exists "permitted update lessons" on public.lessons;
create policy "permitted update lessons" on public.lessons
  for update using (public.can_update_cms_content(legacy_profile_id, publish_state, created_by))
  with check (public.can_update_cms_content(legacy_profile_id, publish_state, created_by));

drop policy if exists "members read posts" on public.blog_posts;
create policy "members read posts" on public.blog_posts
  for select using (public.can_read_cms_content(legacy_profile_id, 'blog_posts', id, publish_state, privacy_state));
drop policy if exists "permitted insert posts" on public.blog_posts;
create policy "permitted insert posts" on public.blog_posts
  for insert with check (public.can_create_cms_content(legacy_profile_id, publish_state, created_by));
drop policy if exists "permitted update posts" on public.blog_posts;
create policy "permitted update posts" on public.blog_posts
  for update using (public.can_update_cms_content(legacy_profile_id, publish_state, created_by))
  with check (public.can_update_cms_content(legacy_profile_id, publish_state, created_by));
