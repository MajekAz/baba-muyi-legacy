create unique index if not exists idx_legacy_profiles_workspace_id_id
  on public.legacy_profiles(workspace_id, id);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  legacy_profile_id uuid not null references public.legacy_profiles(id) on delete cascade,
  submission_type text not null,
  status text not null default 'new',
  sender_name text not null,
  sender_email text not null,
  relationship text,
  message text not null,
  consent_to_contact boolean not null default false,
  attachment_bucket text,
  attachment_path text,
  attachment_filename text,
  attachment_mime_type text,
  attachment_size_bytes bigint,
  admin_notes text,
  reviewed_by uuid references public.user_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_submissions_type_check check (
    submission_type in (
      'memory',
      'family_information',
      'correction',
      'media_contribution',
      'documentary_contact',
      'general'
    )
  ),
  constraint contact_submissions_status_check check (
    status in ('new', 'in_review', 'resolved', 'archived')
  ),
  constraint contact_submissions_attachment_bucket_check check (
    attachment_bucket is null or attachment_bucket = 'tribute-uploads'
  ),
  constraint contact_submissions_attachment_size_check check (
    attachment_size_bytes is null or attachment_size_bytes <= 26214400
  ),
  constraint contact_submissions_profile_workspace_fkey foreign key (workspace_id, legacy_profile_id)
    references public.legacy_profiles(workspace_id, id) on delete cascade
);

create index if not exists idx_contact_submissions_profile_status
  on public.contact_submissions(workspace_id, legacy_profile_id, status, created_at desc);

create index if not exists idx_contact_submissions_created_at
  on public.contact_submissions(created_at desc);

create index if not exists idx_contact_submissions_sender_email
  on public.contact_submissions(lower(sender_email));

drop trigger if exists touch_contact_submissions on public.contact_submissions;
create trigger touch_contact_submissions
  before update on public.contact_submissions
  for each row execute function public.touch_updated_at();

alter table public.contact_submissions enable row level security;

drop policy if exists "reviewers read contact submissions" on public.contact_submissions;
create policy "reviewers read contact submissions" on public.contact_submissions
  for select to authenticated
  using (public.user_has_permission(legacy_profile_id, 'review_submissions'));

drop policy if exists "reviewers update contact submissions" on public.contact_submissions;
create policy "reviewers update contact submissions" on public.contact_submissions
  for update to authenticated
  using (public.user_has_permission(legacy_profile_id, 'review_submissions'))
  with check (public.user_has_permission(legacy_profile_id, 'review_submissions'));

grant select on public.contact_submissions to authenticated;

grant update (
  status,
  admin_notes,
  reviewed_at,
  reviewed_by,
  updated_at
) on public.contact_submissions to authenticated;

