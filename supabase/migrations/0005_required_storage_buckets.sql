insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('legacy-images', 'legacy-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('legacy-documents', 'legacy-documents', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png']),
  ('legacy-audio', 'legacy-audio', false, 104857600, array['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm']),
  ('legacy-video', 'legacy-video', false, 1073741824, array['video/mp4', 'video/webm', 'video/quicktime']),
  ('profile-images', 'profile-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('tribute-uploads', 'tribute-uploads', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'video/mp4'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
