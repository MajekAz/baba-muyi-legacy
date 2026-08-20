alter table public.media_items
  add column if not exists gallery_category text,
  add column if not exists image_type text,
  add column if not exists gallery_approval_status text not null default 'unreviewed',
  add column if not exists tags text[] not null default array[]::text[],
  add column if not exists contributor_credit text,
  add column if not exists verification_note text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists featured boolean not null default false;

alter table public.media_items
  drop constraint if exists media_items_gallery_category_check,
  add constraint media_items_gallery_category_check check (
    gallery_category is null or gallery_category in (
      'Family',
      'Early Life',
      'Bariga & Community',
      'Bolekaja / Transport',
      'TIOLUWA LASE',
      'Leadership & Community Service',
      'Later Years',
      'Memorial / Legacy'
    )
  );

alter table public.media_items
  drop constraint if exists media_items_image_type_check,
  add constraint media_items_image_type_check check (
    image_type is null or image_type in (
      'original_family_photograph',
      'restored_family_photograph',
      'documentary_still',
      'ai_assisted_heritage_reconstruction'
    )
  );

alter table public.media_items
  drop constraint if exists media_items_gallery_approval_status_check,
  add constraint media_items_gallery_approval_status_check check (
    gallery_approval_status in (
      'unreviewed',
      'family_approved',
      'editorial_review',
      'verified_family_memory',
      'verified_document_source',
      'ai_assisted_interpretive'
    )
  );

create index if not exists idx_media_items_gallery_category
  on public.media_items(workspace_id, legacy_profile_id, gallery_category)
  where deleted_at is null;

create index if not exists idx_media_items_image_type
  on public.media_items(workspace_id, legacy_profile_id, image_type)
  where deleted_at is null;

create index if not exists idx_media_items_gallery_public_order
  on public.media_items(workspace_id, legacy_profile_id, featured desc, sort_order asc, published_at desc)
  where publication_status = 'published'
    and visibility = 'public'
    and moderation_state = 'approved'
    and deleted_at is null;
