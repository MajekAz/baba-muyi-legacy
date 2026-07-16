drop policy if exists "members manage media versions" on public.media_versions;
drop policy if exists "media managers manage versions" on public.media_versions;
drop policy if exists "media uploaders create original versions" on public.media_versions;

create policy "media managers manage versions" on public.media_versions
  for all using (
    public.user_has_permission(legacy_profile_id, 'access_media_library')
    and exists (
      select 1
      from public.media_items m
      where m.id = media_item_id
        and m.workspace_id = media_versions.workspace_id
        and m.legacy_profile_id = media_versions.legacy_profile_id
    )
  ) with check (
    public.user_has_permission(legacy_profile_id, 'access_media_library')
    and exists (
      select 1
      from public.media_items m
      where m.id = media_item_id
        and m.workspace_id = media_versions.workspace_id
        and m.legacy_profile_id = media_versions.legacy_profile_id
    )
  );

create policy "media uploaders create original versions" on public.media_versions
  for insert with check (
    public.user_has_permission(legacy_profile_id, 'upload_media')
    and version_type = 'original'
    and created_by = auth.uid()
    and exists (
      select 1
      from public.media_items m
      where m.id = media_item_id
        and m.workspace_id = media_versions.workspace_id
        and m.legacy_profile_id = media_versions.legacy_profile_id
        and m.uploaded_by = auth.uid()
        and m.publish_state in ('draft', 'in_review')
        and m.publication_status in ('draft', 'in_review')
    )
  );
