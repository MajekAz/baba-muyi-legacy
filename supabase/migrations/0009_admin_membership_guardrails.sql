drop policy if exists "owners manage workspace memberships" on public.workspace_members;
create policy "owners manage workspace memberships" on public.workspace_members
  for all using (public.current_user_role_for_workspace(workspace_id) = 'owner')
  with check (public.current_user_role_for_workspace(workspace_id) = 'owner');

create policy "administrators manage non-owner workspace memberships" on public.workspace_members
  for all using (
    public.current_user_role_for_workspace(workspace_id) = 'administrator'
    and role <> 'owner'
  )
  with check (
    public.current_user_role_for_workspace(workspace_id) = 'administrator'
    and role <> 'owner'
  );

drop policy if exists "owners manage legacy profile memberships" on public.legacy_profile_members;
create policy "owners manage legacy profile memberships" on public.legacy_profile_members
  for all using (public.current_user_role_for_profile(legacy_profile_id) = 'owner')
  with check (public.current_user_role_for_profile(legacy_profile_id) = 'owner');

create policy "administrators manage non-owner legacy profile memberships" on public.legacy_profile_members
  for all using (
    public.current_user_role_for_profile(legacy_profile_id) = 'administrator'
    and role <> 'owner'
  )
  with check (
    public.current_user_role_for_profile(legacy_profile_id) = 'administrator'
    and role <> 'owner'
  );
