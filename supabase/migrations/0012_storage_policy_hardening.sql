create or replace function public.storage_path_legacy_profile_id(object_name text)
returns uuid
language plpgsql
immutable
as $$
declare
  first_segment text;
begin
  first_segment := (storage.foldername(object_name))[1];
  if first_segment is null then
    return null;
  end if;

  return first_segment::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

drop policy if exists "members manage storage objects" on storage.objects;
drop policy if exists "legacy media members read storage objects" on storage.objects;
drop policy if exists "legacy media uploaders insert storage objects" on storage.objects;
drop policy if exists "legacy media managers update storage objects" on storage.objects;
drop policy if exists "legacy media managers delete storage objects" on storage.objects;

create policy "legacy media members read storage objects" on storage.objects
  for select using (
    bucket_id in ('legacy-images', 'legacy-documents', 'legacy-audio', 'legacy-video', 'profile-images', 'tribute-uploads')
    and public.user_has_permission(public.storage_path_legacy_profile_id(name), 'access_media_library')
  );

create policy "legacy media uploaders insert storage objects" on storage.objects
  for insert with check (
    bucket_id in ('legacy-images', 'legacy-documents', 'legacy-audio', 'legacy-video', 'profile-images', 'tribute-uploads')
    and public.user_has_permission(public.storage_path_legacy_profile_id(name), 'upload_media')
  );

create policy "legacy media managers update storage objects" on storage.objects
  for update using (
    bucket_id in ('legacy-images', 'legacy-documents', 'legacy-audio', 'legacy-video', 'profile-images', 'tribute-uploads')
    and public.user_has_permission(public.storage_path_legacy_profile_id(name), 'delete_media')
  ) with check (
    bucket_id in ('legacy-images', 'legacy-documents', 'legacy-audio', 'legacy-video', 'profile-images', 'tribute-uploads')
    and public.user_has_permission(public.storage_path_legacy_profile_id(name), 'delete_media')
  );

create policy "legacy media managers delete storage objects" on storage.objects
  for delete using (
    bucket_id in ('legacy-images', 'legacy-documents', 'legacy-audio', 'legacy-video', 'profile-images', 'tribute-uploads')
    and public.user_has_permission(public.storage_path_legacy_profile_id(name), 'delete_media')
  );
