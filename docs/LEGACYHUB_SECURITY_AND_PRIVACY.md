# LegacyHub Security And Privacy Model

This document separates existing controls from controls still required before production launch.

## Existing Controls

| Area | Existing implementation | Files |
| --- | --- | --- |
| Environment validation | Central environment parsing with safe missing-Supabase behavior. | `lib/env.ts` |
| Supabase clients | Browser, server, admin, and middleware helper files exist. | `lib/supabase/*`, `middleware.ts` |
| Admin protection | Admin routes call `requireAdminRole`; unauthorised users redirect when Supabase is configured. | `lib/auth.ts`, `app/admin/layout.tsx` |
| Local fallback label | Admin context bar labels local fallback context. | `components/admin/workspace-context-bar.tsx` |
| Role map | Owner, administrator, editor, contributor, reviewer, viewer roles exist in code. | `lib/permissions.ts` |
| Tenant context | Server helper resolves workspace/profile context from local fallback or Supabase membership. | `lib/tenant-context.ts` |
| RLS definitions | SQL migrations define RLS policies across core tables. | `supabase/migrations/*` |
| Private storage helpers | Signed read URL and object removal helpers exist. | `lib/media/storage.ts` |
| Upload validation | Client/form validation schemas cover mime types and metadata. | `lib/validation/admin.ts`, `components/admin/media-uploader.tsx` |

## Controls Still Required

| Area | Required work |
| --- | --- |
| Remote RLS verification | Test workspace isolation, profile isolation, private content, and role permissions against real Supabase. |
| Server-side upload endpoint | Validate file type, size, ownership, and storage path on the server before upload. |
| Malware-risk handling | Add scan status metadata and quarantine process for uploaded files. |
| Rate limiting | Protect public forms, login, invitations, and uploads. |
| Invitation security | Use signed or hashed tokens, expiry, revocation, email delivery, and audit logs. |
| Access expiry | Enforce expiry for private viewers and access grants. |
| Audit logging | Write audit records for auth, invitations, publishing, privacy changes, uploads, deletes, exports, and role changes. |
| Service-role key protection | Confirm service-role key is never available in client bundles or Hostinger logs. |
| Data export | Implement owner-controlled exports with audit logs. |
| Backups | Define backup frequency, restore test, and retention. |
| Incident response | Document breach response and notification process. |

## Workspace Isolation

Every workspace-scoped query and mutation must include `workspace_id`. RLS policies must deny access to users outside the workspace. Current SQL in `0003_workspace_saas_foundation.sql` introduces workspace membership and helper functions, but remote proof is pending.

## Legacy-Profile Isolation

Legacy-profile content must include `legacy_profile_id`, and profile-specific membership must control access to private content. Current local fallback filters by `activeWorkspaceId` and `activeLegacyProfileId` in `lib/cms-store.ts`, but this is not a production security control.

## Server-Side Permission Checks

All mutations must call server-side permission helpers such as `requireLegacyProfilePermission`. Client-side role checks are convenience only. Current actions in `lib/cms-actions.ts` use permission helpers; more actions need the same pattern.

## Supabase Row Level Security

RLS is the database backstop. Policies should enforce:

- Public read only for published public content.
- Workspace member access only inside their workspace.
- Legacy-profile member access only inside assigned profile.
- Owner/admin content and security powers.
- Contributor insert without direct publish.
- Reviewer moderation without unrelated admin powers.
- Viewer read-only access.

## Living-Person Privacy

Living people must default to private visibility. Public family-tree entries require consent and editorial approval. Children, grandchildren, minors, health information, addresses, phone numbers, and sensitive family disputes require additional approval.

## Children's Information

Children's names, photographs, school details, birth dates, addresses, and family relationships must be private by default. Public publication requires guardian approval, legacy owner approval, and an explicit reason for publication. The product should support removal or redaction requests where a guardian or the child later objects.

## Family Disputes And Takedown

LegacyHub needs a policy workflow for disputed facts, takedown requests, copyright complaints, contributor revocation, and account deletion. The data model has source and verification fields, but operational workflow is not yet implemented.

## Copyright Complaints

Media and written submissions should record source, contributor, rights holder, licence or permission notes, and takedown status. A copyright complaint should be able to hide affected public content quickly while the owner or platform operator reviews the claim.

## Private Storage And Signed URLs

Private media should be stored in private buckets and delivered through signed URLs after permission checks. Public records must be published, public and approved before public display. Milestone 3 adds server-side upload validation, workspace/profile scoped mutations, signed public delivery helpers and archival version records. Malware scanning and upload rate limiting remain future security work.

## Account Deletion, Export, And Backups

Workspace owners must be able to export data. Account deletion must distinguish user deletion from archival retention obligations. Backups must be encrypted, access-controlled, and restore-tested.

## Data Deletion

LegacyHub must support deletion or archival workflows for user accounts, private media, contributions, invitations, access grants, and workspace data. Deleting a user account must not accidentally orphan public historical records without an ownership decision. Destructive deletes should be audit logged, reversible where practical, and reflected in backup-retention policy.
