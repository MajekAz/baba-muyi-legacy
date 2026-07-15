# LegacyHub Glossary

This glossary is the terminology standard for the reusable platform now called LegacyHub. The public Baba Muyi archive may continue to use the Baba Muyi Legacy name.

| Term | Definition | Current repository references |
| --- | --- | --- |
| Platform | LegacyHub, the reusable commercial software product for preserving and publishing digital legacies. | `README.md`, `docs/LEGACYHUB_PRD.md` |
| Platform owner | The operator of the whole LegacyHub service, responsible for infrastructure, billing, support, security, and global administration. | Planned; not yet represented by a dedicated table. |
| Workspace | A family, organisation, cultural institution, school, or customer account. | `supabase/migrations/0003_workspace_saas_foundation.sql`, `lib/tenant-context.ts` |
| Workspace member | A user invited to a workspace with a role such as owner, administrator, editor, contributor, reviewer, or viewer. | `workspace_members`, `workspace_invitations` |
| Legacy profile | The person, family, founder, organisation, community, or institution whose legacy is being preserved. | `legacy_profiles`, `legacy_profile_members` |
| Legacy owner | The workspace member responsible for a legacy profile. This may be the family owner, archive steward, institutional archivist, or appointed administrator. | `legacy_profile_members.role = owner`; enforcement remains partial. |
| Legacy content | The complete body of content associated with a legacy profile, including pages, biography, timeline, stories, lessons, media, documentary records, and family tree data. | `data/cms.json`, content tables in `supabase/migrations/0001_initial_foundation.sql` |
| Content item | A biography chapter, timeline event, story, lesson, article, tribute, page, or other written record. | `biography_chapters`, `timeline_events`, `stories`, `lessons`, `blog_posts`, `tributes` |
| Media item | An image, document, audio file, video clip, or external media reference. | `media_items`, `components/admin/media-uploader.tsx`, `lib/media/storage.ts` |
| Contribution | Material submitted for review by a family member, invited contributor, public visitor, or institution. | `stories`, `tributes`, `media_items`; moderation workflow is partial. |
| Publication status | The lifecycle state of a record: draft, in review, scheduled, published, or archived. | Current code supports `draft`, `scheduled`, `published`, and `archived` in `lib/cms-types.ts`; `in review` is a product requirement. |
| Visibility | Who may see a record: public, registered, invited, family, specific users, password protected, or private. | Current code supports similar values in `lib/cms-actions.ts`; RLS needs remote verification. |
| Moderation state | Review state for user-submitted material such as pending, approved, rejected, or hidden. | Present in migrations for stories, tributes, and media. |
| Public archive | A public website generated from a legacy profile. Baba Muyi Legacy is the first example. | `app/`, `components/cms/cms-public-page.tsx` |
| Admin dashboard | The protected management area for content, media, menus, documentaries, users, and settings. | `app/admin/*`, `components/admin-navigation.tsx` |
| Local fallback | Development-only JSON persistence used when Supabase credentials are missing. | `data/cms.json`, `lib/cms-store.ts`, `lib/auth.ts` |
| Remote production store | Supabase Auth, Postgres, Storage, and RLS used for production data. | `lib/supabase/*`, `supabase/migrations/*` |

## Naming Rules

- Use **Baba Muyi Legacy** for the public flagship archive, public page titles, the public visual identity, and public-facing family archive copy.
- Use **LegacyHub** for the reusable product, admin platform, SaaS documentation, platform roadmap, future customer onboarding, commercial messaging, and internal architecture.
- Treat the Baba Muyi Family Archive as the first workspace, not as a permanent global singleton.
- Treat Alhaji Tioluwalase "Baba Muyi" Majekodunmi as the first legacy profile, not as hard-coded platform architecture.
