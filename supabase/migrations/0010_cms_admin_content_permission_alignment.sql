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
      and (
        public.user_has_permission(profile_id, 'manage_all_content')
        or public.user_has_permission(profile_id, 'edit_assigned_content')
      )
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
      and (
        public.user_has_permission(profile_id, 'manage_all_content')
        or public.user_has_permission(profile_id, 'edit_assigned_content')
        or public.user_has_permission(profile_id, 'review_submissions')
      )
    ),
    false
  )
$$;
