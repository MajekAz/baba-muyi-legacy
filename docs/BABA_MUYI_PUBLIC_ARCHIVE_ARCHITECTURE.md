# Baba Muyi Public Archive Architecture

## Brand Separation

LegacyHub is the reusable platform. Baba Muyi Legacy is the first flagship archive powered by LegacyHub.

The public archive must display `Baba Muyi Legacy` as the primary wordmark with a subtle LegacyHub relationship line. It must not inherit the LegacyHub platform shell or the admin shell.

## Shells

| Experience | Route area | Shell |
| --- | --- | --- |
| Baba Muyi public archive | `/`, `/biography`, `/timeline`, `/gallery`, etc. | `app/(public)/layout.tsx` |
| LegacyHub platform website | `/legacyhub/*` | `app/(platform)/layout.tsx` |
| LegacyHub admin | `/admin/*` | `app/admin/layout.tsx` |

## Homepage Component Map

| Component | Purpose |
| --- | --- |
| `BabaMuyiCinematicHome` | Composes the public archive homepage. |
| `CinematicHero` | Archive title, legacy statement, CTAs, approved portrait or fallback. |
| `ArchiveIntroduction` | Public archive purpose and curator context. |
| `LifeJourneyPreview` | Timeline-backed or fallback journey sequence. |
| `TransportHeritageFeature` | Bolekaja, Molue and TIOLUWA LASE route links. |
| `FeaturedDocumentary` | Published documentary preview or empty-state explanation. |
| `CollectionPreview` | Public collections and valid archive routes. |
| `LessonsPreview` | Published lessons only. |
| `MemoriesPreview` | Approved published stories only. |
| `ClosingLegacyStatement` | Final archive message and valid CTAs. |

## Data Flow

The homepage reads active workspace and legacy-profile context, then loads scoped published public content. The public Media Library query supplies approved public images only.

Homepage preview queries are allowed to fail closed into respectful empty states. This prevents the public archive homepage from crashing when an optional preview collection is unavailable, while still preventing draft, private, in-review, archived or cross-tenant records from appearing publicly.

## Boundaries

Milestone 4 Phase 1 does not create a new CMS, alter schema, change storage policies, or expose private media.

The implementation branch is `feature/legacyhub-milestone-4-phase-1-public-home`. The branch is intentionally uncommitted until manual acceptance is complete and the remote media test credential issue is resolved or formally accepted as an owner-environment blocker.
