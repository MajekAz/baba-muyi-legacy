drop policy if exists "contributors submit own media" on public.media_items;
drop policy if exists "editors manage media" on public.media_items;
drop policy if exists "media uploaders create review media" on public.media_items;
drop policy if exists "media managers update media" on public.media_items;
drop policy if exists "media reviewers moderate media" on public.media_items;
drop policy if exists "media contributors update own review media" on public.media_items;
drop policy if exists "media managers delete media" on public.media_items;

create policy "media uploaders create review media" on public.media_items
  for insert with check (
    auth.uid() is not null
    and uploaded_by = auth.uid()
    and owner_user_id = auth.uid()
    and public.user_has_permission(legacy_profile_id, 'upload_media')
    and publish_state = 'in_review'
    and publication_status = 'in_review'
    and moderation_state = 'pending'
    and privacy_state = 'private'
    and visibility = 'private'
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  );

create policy "media managers update media" on public.media_items
  for update using (
    public.current_user_role_for_profile(legacy_profile_id) in ('owner', 'administrator', 'editor')
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  ) with check (
    public.current_user_role_for_profile(legacy_profile_id) in ('owner', 'administrator', 'editor')
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  );

create policy "media reviewers moderate media" on public.media_items
  for update using (
    public.user_has_permission(legacy_profile_id, 'review_submissions')
    and publish_state in ('draft', 'in_review')
    and publication_status in ('draft', 'in_review')
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  ) with check (
    public.user_has_permission(legacy_profile_id, 'review_submissions')
    and publish_state in ('draft', 'in_review')
    and publication_status in ('draft', 'in_review')
    and privacy_state <> 'public'
    and visibility <> 'public'
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  );

create policy "media contributors update own review media" on public.media_items
  for update using (
    auth.uid() is not null
    and uploaded_by = auth.uid()
    and public.user_has_permission(legacy_profile_id, 'upload_media')
    and publish_state in ('draft', 'in_review')
    and publication_status in ('draft', 'in_review')
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  ) with check (
    auth.uid() is not null
    and uploaded_by = auth.uid()
    and owner_user_id = auth.uid()
    and public.user_has_permission(legacy_profile_id, 'upload_media')
    and publish_state in ('draft', 'in_review')
    and publication_status in ('draft', 'in_review')
    and moderation_state = 'pending'
    and privacy_state <> 'public'
    and visibility <> 'public'
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  );

create policy "media managers delete media" on public.media_items
  for delete using (
    public.user_has_permission(legacy_profile_id, 'delete_media')
    and exists (
      select 1
      from public.legacy_profiles lp
      where lp.id = legacy_profile_id
        and lp.workspace_id = media_items.workspace_id
    )
  );
