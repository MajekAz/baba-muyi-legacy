insert into public.role_permissions (role, permission)
values
  ('contributor', 'edit_assigned_content'),
  ('reviewer', 'edit_assigned_content')
on conflict (role, permission) do nothing;

create or replace function public.can_manage_profile_content(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    public.current_user_role_for_profile(profile_id) in ('owner', 'administrator', 'editor')
    or public.user_has_permission(profile_id, 'edit_assigned_content')
    or public.user_has_permission(profile_id, 'review_submissions')
    or public.user_has_permission(profile_id, 'publish_content'),
    false
  )
$$;
