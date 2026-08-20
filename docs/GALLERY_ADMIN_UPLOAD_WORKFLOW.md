# Gallery Admin Upload Workflow

This workflow defines how Baba Muyi Legacy gallery images are uploaded, reviewed, classified, and published from the LegacyHub administration panel.

## Purpose

The gallery must distinguish authentic family archive material from restored images, documentary stills, and AI-assisted heritage reconstructions. No image should appear publicly as Baba Muyi archive media until it has been reviewed, identified, and cleared for public use.

## Admin Routes

- `/admin/media/upload` uploads files into private storage and creates review records.
- `/admin/media/images` manages image-only gallery records, filters, review state, category, image type, and publication.
- `/admin/media/albums` groups related media for public gallery presentation.
- `/gallery` displays only published, public, approved gallery images.

## Required Gallery Categories

Every public image should be assigned one of these categories:

- Family
- Early Life
- Bariga & Community
- Bolekaja / Transport
- TIOLUWA LASE
- Leadership & Community Service
- Later Years
- Memorial / Legacy

## Required Image Types

Every image must identify what kind of archive image it is:

- Original family photograph
- Restored family photograph
- Documentary still
- AI-assisted heritage reconstruction

AI-assisted heritage reconstructions must remain clearly labelled and must not be presented as original family photographs.

## Approval Statuses

Gallery records support these review labels:

- Unreviewed
- Family approved
- Editorial review
- Verified from family memory
- Verified from document/source
- AI-assisted / interpretive

These labels describe editorial confidence and source status. They do not replace the publication workflow.

## Upload Rules

1. Uploads are private by default.
2. Uploaded images enter review before publication.
3. JPEG, PNG, and WebP images are accepted.
4. PDF, audio, and video uploads continue to use the existing Media Library workflow.
5. Image uploads require a gallery category and image type.
6. Source notes, contributor credits, captions, dates, locations, people shown, tags, and verification notes should be completed before public publication where available.

## Publication Rules

Public gallery rendering requires all existing Media Library safeguards:

- publication status is `published`;
- visibility is `public`;
- moderation status is `approved`;
- storage object exists;
- workspace and legacy profile scope match;
- the record is not archived or deleted.

For images, publishing also requires:

- title;
- alt text;
- gallery category;
- image type.

## Public Gallery Behaviour

The public gallery groups images by category and displays image type labels. If no approved images are available, the page shows:

> Approved family photographs and historical images will appear here as they are reviewed, identified, and cleared for public archive use.

No stock image, generated portrait, empty image frame, or placeholder photograph should be used.

## Remote Setup

Apply the forward-only migration before using the new gallery metadata fields in Supabase:

```bash
supabase db push
```

Then regenerate live database types:

```bash
pnpm supabase:types
```

Do not edit previously applied migrations.
