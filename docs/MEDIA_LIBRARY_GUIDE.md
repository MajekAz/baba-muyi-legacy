# Media Library Guide

LegacyHub media is workspace-aware and legacy-profile-aware. The Baba Muyi Family Archive is the first workspace, and Baba Muyi is the first legacy profile.

## Admin Routes

- `/admin/media`: library, search, filters, selection and archive controls.
- `/admin/media/upload`: drag-and-drop and file-picker upload.
- `/admin/media/images`: image library entry point.
- `/admin/media/video`: short-video library entry point.
- `/admin/media/audio`: audio library entry point.
- `/admin/media/documents`: document library entry point.
- `/admin/media/albums`: album creation and review.
- `/admin/media/[id]`: metadata, visibility and publication editing.

## Supported Initial File Types

- Images: JPEG, PNG, WebP, AVIF.
- Documents: PDF.
- Audio: MP3, WAV, M4A.
- Short video clips: MP4, WebM.

Recommended initial limits:

- Images: 20 MB.
- Documents: 50 MB.
- Audio: 100 MB.
- Short video clips: 250 MB.

Large documentaries should use a future external streaming-provider workflow rather than Supabase Storage uploads.

## Workflow

Uploads are private and under review by default. Contributors can upload but cannot publish. Editors can edit permitted media. Reviewers can review submissions. Owners and administrators can publish, archive and manage albums.

## Public Delivery

Public pages only show media that is published, public and approved. Private documents, audio and video use signed URLs after server-side permission checks or after public publication checks.
