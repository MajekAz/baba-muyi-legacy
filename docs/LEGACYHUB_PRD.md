# LegacyHub Product Requirements Document

## Product Name

LegacyHub

## Vision

LegacyHub becomes the trusted digital home where families, communities, organisations, and institutions preserve living history, cultural memory, personal stories, values, media, and documentary records across generations.

## Mission

Help families, communities, organisations, and institutions preserve, organise, and share the stories, achievements, values, voices, and memories of the people who shaped their lives.

## Product Promise

Every life has a story worth preserving.

## Primary Tagline

Preserving Legacies. Connecting Generations.

## Problem Being Solved

Important family, cultural, community, and organisational memory is scattered across phones, WhatsApp groups, hard drives, paper documents, unlabelled photos, oral stories, and unfinished documentaries. Most families and institutions do not have technical skills, archival processes, privacy controls, or publishing tools to preserve this material in a durable and respectful way.

## Product Boundaries

LegacyHub is not only a memorial product. It must support people who have passed away, living parents and grandparents, family histories, veterans, entrepreneurs, founders, community leaders, traditional rulers, artists, educators, schools, organisations, cultural institutions, and historical archives.

## Product Distinctions

### A. Baba Muyi Flagship Archive

- Public name: Baba Muyi Legacy.
- First workspace: Baba Muyi Family Archive.
- First legacy profile: Alhaji Tioluwalase "Baba Muyi" Majekodunmi.
- Purpose: flagship implementation, case study, and proof of the CMS-first archive model.
- Existing references: `app/`, `data/cms.json`, `lib/cms-seed.ts`, `lib/site.ts`.

### B. LegacyHub Reusable Platform

- Product/admin/software name: LegacyHub.
- Purpose: reusable multi-workspace SaaS architecture.
- Existing foundations: `supabase/migrations/0003_workspace_saas_foundation.sql`, `lib/tenant-context.ts`, `lib/permissions.ts`.

### C. Future Public Commercial SaaS

- Purpose: self-service customer acquisition, plans, trials, onboarding, billing, storage upgrades, custom domains, services, and support.
- Status: deferred. No billing or public self-registration should be implemented in the MVP.

## Target Markets

- Families preserving parents, grandparents, founders, and ancestors.
- Diaspora families preserving cross-border memories.
- Community groups and associations.
- Cultural institutions and historical societies.
- Schools, churches, mosques, and alumni groups.
- Entrepreneurs, founders, and business families.
- Traditional leadership families and local history projects.
- Professional archivists, documentary producers, and digitisation services.
- Enterprises preserving founder, brand, or institutional history.

## Target Users And Personas

| Persona | Goals | Needs | Permissions | Main workflows | Frustrations | Privacy expectations | Willingness to pay |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Platform owner | Operate LegacyHub commercially. | Security, uptime, support, tenant control, billing later. | Global service administration, future super-admin. | Manage platform, monitor usage, support customers. | Fragmented customer data, manual deployment. | Strong service-role protection and auditability. | High, as business operator. |
| Family legacy owner | Preserve one or more family legacies. | Simple CMS, privacy, media upload, invitations. | Workspace owner and legacy owner. | Create profile, invite family, approve content, publish. | Technical complexity, privacy fear. | High control over private and living-person data. | Medium to high. |
| Family administrator | Help manage archive operations. | Work queues, edit tools, moderation. | Administrator or editor. | Edit pages, organise media, manage menus. | Unclear source verification. | Respect for family-only material. | Usually included in family plan. |
| Editor | Prepare publishable content. | Rich text, revision history, validation, preview. | Content edit and media access. | Draft, verify, preview, request approval. | Weak editorial workflow. | Must not expose drafts accidentally. | Indirect. |
| Contributor | Submit memories and media. | Simple upload and consent forms. | Limited contribution permissions. | Submit story, image, video, document. | Fear of losing material or public exposure. | Clear consent and review before publication. | Low direct; valuable to paid workspace. |
| Reviewer | Approve or reject submissions. | Moderation queue and source notes. | Review submissions. | Review contribution, request edits, approve. | No context around contributors. | Must protect sensitive submissions. | Indirect. |
| Private viewer | See invited/private archive content. | Secure access, easy viewing. | Viewer/private access. | Login, browse private profile/media. | Login friction. | Strong family access controls. | Low direct. |
| Public visitor | Learn from public archive. | Fast mobile pages, search, SEO, accessible media. | Public read. | Browse biography, timeline, gallery, documentary. | Poor navigation or missing captions. | No access to private content. | None. |
| Professional archivist | Manage client archives. | Multi-client workflow, metadata, export. | Workspace admin/editor across clients. | Import, tag, verify, structure records. | Weak metadata and bulk tools. | Professional confidentiality. | High. |
| Cultural institution administrator | Publish institutional collections. | Multi-profile, permissions, public/private access. | Workspace owner/admin. | Manage collections, contributors, exhibits. | Compliance, copyright, access control. | Strong governance and takedown workflow. | High. |
| Enterprise customer | Preserve founder/company legacy. | Brand control, approvals, custom domain later. | Workspace owner/admin. | Publish founder archive, timeline, documentary centre. | Security review and procurement. | High contractual/privacy expectations. | High. |

## Main User Journeys

1. Owner creates a workspace and first legacy profile.
2. Owner invites administrators, editors, contributors, reviewers, and viewers.
3. Editor drafts biography chapters, timeline events, stories, lessons, and articles.
4. Contributor submits memories and media for review.
5. Reviewer approves, rejects, or requests changes.
6. Editor uploads media, adds captions, alt text, privacy, and copyright metadata.
7. Owner publishes public pages and keeps sensitive material private.
8. Public visitor browses biography, timeline, gallery, documentary records, and lessons.
9. Workspace exports data for backup or family ownership.

## Core Value Proposition

Create, organise, and publish a secure multimedia legacy archive without needing technical skills.

## Competitive Differentiation

- Multi-tenant workspace and legacy-profile model.
- Public archive plus private family/institutional access.
- Documentary, gallery, family tree, biography, and timeline in one structure.
- Privacy-first handling for living people, children, family disputes, and copyright.
- Services-friendly model for archivists, digitisation, restoration, and documentary producers.

## MVP Scope

- Secure owner login.
- Workspace architecture.
- One or more legacy profiles.
- Biography chapters.
- Timeline.
- Stories.
- Lessons.
- Blog or articles.
- Media library.
- Albums.
- Documentary centre.
- Family tree.
- Contributions and moderation.
- User invitations.
- Roles and permissions.
- Configurable navigation.
- Public and private visibility.
- SEO.
- Mobile responsiveness.
- Data export.
- Audit history.
- Baba Muyi flagship implementation.

## Excluded From MVP

- Public self-registration.
- Stripe billing.
- Subscription enforcement.
- AI generation.
- Marketplace.
- Native mobile applications.
- DNA integration.
- Printed-product fulfilment.
- Advanced enterprise features.

## Functional Requirements

- Users can authenticate as authorised workspace members.
- Owners can manage workspace members and legacy profiles.
- Editors can manage content records with source and verification metadata.
- Public visitors can read published public content only.
- Private viewers can read invited/private content only after authentication or access grant.
- Media records include caption, alt text, copyright owner, source, privacy, and storage reference.
- Documentary records include episodes, transcripts, subtitles, chapters, thumbnails, and external provider IDs.
- Menus are configurable by location and support nesting, order, visibility, roles, internal links, external links, and new-tab behavior.

## Non-Functional Requirements

- Mobile-first and responsive.
- Accessible keyboard navigation and semantic HTML.
- Server-side permission checks for all mutations.
- Supabase RLS as a second enforcement layer.
- Production builds must pass before deployment.
- Data model must be migration-driven and recoverable.

## Accessibility Requirements

- Public and admin navigation must be keyboard accessible.
- Forms must have labels, validation messages, and focus states.
- Media must support captions, transcripts, and alt text.
- Color contrast must meet WCAG AA for main surfaces.

## Privacy Requirements

- Living-person information is private by default.
- Children and minors require explicit guardian-approved visibility.
- Family-only records must not leak through public queries, metadata, search, or signed URLs.
- Contributors must confirm consent and rights where relevant.

## Living-Person Privacy Requirements

- Living parents, grandparents, children, grandchildren, and relatives must default to private or family-only visibility.
- Names, dates, addresses, health information, school information, phone numbers, and location-sensitive details require explicit approval before publication.
- Family-tree data for living people must be opt-in for public display.
- Takedown and correction requests must be supported before commercial launch.

## Security Requirements

- Service-role key must remain server-only.
- Storage uploads require validation and malware-risk handling.
- Invitations must use secure tokens, expiry, and revocation.
- Audit logs must capture sensitive operations.
- RLS must be remotely tested before launch.

## Content Moderation Requirements

- Contributions enter pending/in-review state.
- Reviewers can approve, reject, archive, or request edits.
- Public publication requires explicit approval.
- Copyright and takedown complaints require a documented workflow.

## Media And Storage Requirements

- Images, audio, video, PDFs, and documents must be supported.
- Private files use private buckets and signed URLs.
- Public images may use public buckets after approval.
- Upload progress and server-side validation remain required.

## Documentary Requirements

- Store documentary records, episodes, trailers, chapters, transcripts, subtitles, thumbnails, credits, and external playback IDs.
- Support YouTube, Vimeo, Cloudflare Stream, Mux, or similar providers.
- Do not store large production video directly in the database.

## Multi-Language Requirements

- The MVP should be designed so future profiles can support multiple languages without duplicating unrelated workspace data.
- Documentary transcripts and subtitles should support language codes.
- Public archive metadata should allow translated titles and descriptions in later phases.
- Full translation workflows are not required for the first Baba Muyi launch unless approved content is supplied.

## Search Requirements

- Search must cover public content and private authorised content separately.
- Public search must never expose private family-only records.
- Private search must enforce workspace, legacy-profile, and user access.

## SEO Requirements

- SEO metadata and structured data are required for public archives.
- Public metadata must use Baba Muyi Legacy for the flagship archive and LegacyHub for platform/product pages.
- Private draft, family-only, and invited-only records must not be indexed.

## Analytics Requirements

- Analytics must respect privacy and avoid exposing private usage.
- Analytics should avoid storing sensitive content text, private names, private media filenames, or private viewer behavior in a way that violates consent.

## Backup And Data-Export Requirements

- Workspaces must be exportable.
- Export must include content, metadata, media references, audit-relevant timestamps, and privacy states.
- Export access must be owner-controlled and audit logged.

## Data-Retention Requirements

- Backups and retention policies must be defined before commercial launch.
- Deleted private content should follow a documented retention and purge process.
- Account deletion must distinguish user-account deletion from legally retained archive records.

## Success Metrics

- Time to create first publishable legacy profile.
- Number of approved content items per workspace.
- Media records with complete captions and alt text.
- Contribution approval time.
- Successful private viewer access.
- Zero known cross-workspace data leaks.
- Successful production deployments.

## Risks And Assumptions

- Remote Supabase migrations and RLS are not yet proven.
- GitHub/Hostinger deployment is currently blocked until the complete app is pushed to `origin/main`.
- CMS is still local JSON-backed for development.
- Media upload and documentary workflows are partial.
- Family privacy and copyright rules require human governance.

## Future Product Phases

1. Baba Muyi flagship launch.
2. Manual paid pilots for families and archivists.
3. Managed SaaS onboarding.
4. Billing, plans, storage upgrades, and custom domains.
5. Enterprise and institutional workflows.
6. Optional AI-assisted transcription, tagging, restoration support, and content drafting.
