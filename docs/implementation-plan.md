# Baba Muyi Legacy Implementation Plan

## Phase 1: Foundation and Architecture

- Create the Next.js App Router project with strict TypeScript and Tailwind CSS.
- Define the reusable legacy-profile data model in Supabase.
- Add seed data for Baba Muyi as the first profile.
- Add protected admin route foundations and role model.
- Add health checks, sitemap, robots, error pages, and deployment documentation.

## Phase 2: Supabase Integration

- Connect public pages to Supabase read queries.
- Create authenticated admin forms for profile, biography chapters, timeline events, and media albums.
- Add Supabase Auth sign-in flow.
- Insert audit-log records for admin changes.
- Add rate limiting and spam controls for public forms.

## Phase 3: Media and Archive Workflows

- Implement upload flows for images, documents, audio, video clips, and tribute uploads.
- Add file-type and file-size validation before upload.
- Generate unique storage paths with ownership metadata.
- Use signed URLs for private documents and unreviewed submissions.
- Add safe deletion and moderation workflow.

## Phase 4: Public Experience

- Replace placeholders with approved biography, transport history, documentary, gallery, family-tree, lessons, and tribute content.
- Add structured data for Person, Article, Video, and Breadcrumb records.
- Improve visual assets with real photography and archival images.
- Complete accessibility and mobile QA.

## Phase 5: Deployment and Launch

- Configure Hostinger Node.js Web App settings.
- Add production environment variables.
- Run production build and smoke-test `/api/health`.
- Connect `babamuyilegacy.com`.
- Review privacy, terms, contributor consent, and family publishing approval process.
